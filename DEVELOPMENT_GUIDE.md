# OpenGuard - Development Guide

## 🎯 Project Overview

**OpenGuard** is a Solana-based token-gating system for Telegram groups. It allows Telegram group admins to require users to hold specific SPL tokens before joining.

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Grammy (Telegram Bot), Upstash Redis
- **Blockchain**: Solana (@solana/web3.js, @solana/spl-token)
- **Authentication**: OpenKit 403 Protocol (wallet-based auth)

---

## 🚨 CRITICAL: What NOT to Touch

### ❌ DO NOT MODIFY - Backend/API Logic

These files contain complex business logic, authentication, and Telegram bot functionality. Modifying them can break the entire system.

#### 1. **`app/api/bot/[secret]/route.ts`** (249 lines)
**Purpose**: Main Telegram bot webhook handler
- ✅ Handles all Telegram bot commands (`/setup`, `/link`)
- ✅ Manages inline keyboard callbacks (set mint, set amount, reset)
- ✅ Processes join requests from Telegram
- ✅ Validates and stores portal configurations in Redis
- ✅ Creates invite links with token requirements

**Why not to touch**: 
- Complex state management with user interactions
- Redis data structure dependencies
- Telegram API integration with specific formatting (MarkdownV2)
- Critical security checks (secret validation)

**Key data flow**:
```
User → Telegram → Webhook → Bot Handler → Redis → Response
```

#### 2. **`app/api/join/[nonce]/route.ts`** (143 lines)
**Purpose**: Handles wallet authentication and token verification for joining
- ✅ OpenKit wallet authentication
- ✅ Token balance verification (checks SPL token holdings)
- ✅ Creates single-use Telegram invite links
- ✅ Replay attack protection

**Why not to touch**: 
- Complex Solana blockchain interactions
- OpenKit authentication protocol
- Redis nonce validation
- Critical security for token gating

**Key data flow**:
```
Frontend → [Wallet Signs] → API → Verify Token Balance → Create Invite Link → Redirect
```

#### 3. **`app/api/cron/verify/route.ts`** (65 lines)
**Purpose**: Scheduled job that verifies users still hold required tokens
- ✅ Runs every 15 minutes (configured in `vercel.json`)
- ✅ Scans all users and their token balances
- ✅ Kicks users who no longer meet requirements
- ✅ Protected by `CRON_SECRET` environment variable

**Why not to touch**: 
- Critical for ongoing token verification
- Handles mass user management
- Needs to stay efficient (scans all users)

---

### ❌ DO NOT MODIFY - Core Libraries

#### 4. **`lib/crypto.ts`** (78 lines)
**Purpose**: Solana blockchain utilities
- ✅ Generates cryptographic nonces
- ✅ Validates Solana token mint addresses
- ✅ Checks user token balances
- ✅ Handles SPL token decimals correctly

**Why not to touch**: 
- Critical for token verification accuracy
- Blockchain interaction logic
- Decimal calculations (errors here = wrong token amounts)

#### 5. **`lib/withOpenKitAuth.ts`** (65 lines)
**Purpose**: OpenKit 403 authentication wrapper
- ✅ Wallet signature verification
- ✅ Challenge-response authentication
- ✅ Replay protection

**Why not to touch**: 
- Security-critical authentication
- OpenKit protocol implementation

#### 6. **`lib/store.ts`** (15 lines)
**Purpose**: Redis replay store for preventing replay attacks
- ✅ Implements OpenKit's ReplayStore interface

**Why not to touch**: 
- Security-critical for preventing auth bypass

#### 7. **`lib/types.ts`** (9 lines)
**Purpose**: TypeScript type definitions
```typescript
type KVConfig = {
  portalChatId: number | null;
  nonce: string;
  mint: string | null;
  amount: number | null;
};
```

**Why not to touch**: 
- Changing these breaks Redis data structure
- Used across entire codebase

---

### ❌ DO NOT MODIFY - Configuration Files

#### 8. **`vercel.json`**
```json
{
  "crons": [{
    "path": "/api/cron/verify",
    "schedule": "*/15 * * * *"
  }]
}
```
**Why not to touch**: Critical for automated verification

#### 9. **`next.config.ts`**
Currently minimal, can be modified if needed for frontend optimization

#### 10. **`tsconfig.json`**
Standard TypeScript configuration

---

## ✅ SAFE TO MODIFY - Frontend Files

These are the files you **should focus on** for building the UI:

### 1. **`app/page.tsx`** (3 lines) ⭐ PRIMARY TARGET
**Current state**: 
```tsx
export default function Home() {
  return <h1>OpenGuard</h1>;
}
```

**What to build**:
- 🎨 Landing page explaining what OpenGuard is
- 📝 Features showcase
- 🚀 Call-to-action for admins
- 📚 Instructions for users
- 🎭 Beautiful, modern UI

**Safe operations**:
- Add any React components
- Add styling with Tailwind
- Add animations
- Add sections (hero, features, FAQ, etc.)
- Add images/icons
- NO backend calls needed here

---

### 2. **`app/join/[id]/page.tsx`** (40 lines) ⭐ SECONDARY TARGET
**Current state**: Basic "Joining" text with wallet connection logic

**Current logic** (DO NOT REMOVE):
```tsx
// This logic MUST stay:
- OpenKit403Client initialization
- Wallet connection (phantom/backpack/solflare)
- Authentication flow
- Redirect on success
```

**What you CAN modify**:
- 🎨 Loading UI/animations while connecting wallet
- ✅ Success/error messages
- 🔄 Loading states
- 💅 Styling of the join experience
- ℹ️ Instructions for users

**What to build**:
```tsx
return (
  <div className="modern-container">
    {/* Step indicators */}
    {/* Wallet connection status */}
    {/* Loading animation */}
    {/* Error handling UI */}
  </div>
);
```

**⚠️ DO NOT REMOVE** the core authentication logic inside `useEffect`

---

### 3. **`app/layout.tsx`** (35 lines) ⭐ CAN ENHANCE
**Current state**: Basic Next.js layout with fonts

**Safe modifications**:
- ✅ Update metadata (title, description, OG tags)
- ✅ Add navigation bar
- ✅ Add footer
- ✅ Add global providers (if needed for UI libraries)
- ✅ Modify fonts if desired
- ✅ Add global components

**Example enhancements**:
```tsx
export const metadata: Metadata = {
  title: "OpenGuard - Token-Gated Telegram Communities",
  description: "Secure your Telegram groups with Solana token verification",
  // Add OG images, etc.
};
```

---

### 4. **`app/globals.css`** (27 lines) ⭐ SAFE TO MODIFY
**Current state**: Basic Tailwind setup with dark mode

**Safe modifications**:
- ✅ Add custom CSS variables
- ✅ Modify color schemes
- ✅ Add custom animations
- ✅ Add global styles
- ✅ Extend Tailwind theme

---

## 📊 Redis Data Structure (Reference Only)

Understanding the data structure helps avoid breaking changes:

```
config:{chatId} → {
  portalChatId: number | null,
  nonce: string,           // e.g., "a3f2b1c4"
  mint: string | null,     // Solana token mint address
  amount: number | null    // Required token amount
}

user:{telegramUserId} → walletAddress (string)

link:{linkName} → walletAddress (string) // Temporary, deleted after join
```

---

## 🎯 Frontend Development Plan

### Phase 1: Landing Page (`app/page.tsx`)
**Goal**: Create beautiful landing page

**Suggested sections**:
1. **Hero Section**
   - Headline: "Token-Gate Your Telegram Communities"
   - Subheadline: "Require Solana tokens to join"
   - CTA: "Learn More" / "Get Started"

2. **How It Works**
   - Step 1: Admin sets up bot in Telegram
   - Step 2: Configure token requirements
   - Step 3: Users connect wallet and join

3. **Features**
   - ✅ Automated verification every 15 minutes
   - ✅ Support for any SPL token
   - ✅ Configurable minimum amounts
   - ✅ Secure wallet authentication

4. **For Admins**
   - Instructions on setting up bot
   - Commands: `/setup`, `/link`

5. **For Users**
   - How to join a token-gated group
   - Supported wallets: Phantom, Backpack, Solflare

6. **Footer**
   - Links, social, documentation

**Design inspiration**:
- Modern SaaS landing page
- Crypto-native aesthetic
- Dark mode friendly
- Responsive design

---

### Phase 2: Join Page Enhancement (`app/join/[id]/page.tsx`)
**Goal**: Better UX for joining process

**States to handle**:
1. **Initial**: "Connect your wallet"
2. **Connecting**: Loading animation
3. **Authenticating**: "Verifying token balance..."
4. **Success**: "Redirecting to Telegram..."
5. **Error**: Display error message
   - "Insufficient tokens"
   - "Invalid portal"
   - "Configuration error"

**UI Components**:
```tsx
<JoinFlow>
  <WalletSelector /> {/* Show available wallets */}
  <LoadingSpinner /> {/* During auth */}
  <ProgressSteps />  {/* 1. Connect 2. Verify 3. Join */}
  <ErrorDisplay />   {/* User-friendly errors */}
</JoinFlow>
```

---

### Phase 3: Shared Components
Create reusable components:

```
components/
  ├── Navigation.tsx      // Top nav
  ├── Footer.tsx          // Footer
  ├── Hero.tsx            // Landing hero
  ├── FeatureCard.tsx     // Feature display
  ├── StepIndicator.tsx   // Process steps
  ├── LoadingSpinner.tsx  // Loading states
  └── Button.tsx          // Styled buttons
```

---

## 🔐 Environment Variables (Reference)

**Required** (already set up):
```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_SECRET=webhook_secret

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Solana
SOLANA_RPC_URL=your_rpc_url

# App
NEXT_PUBLIC_DOMAIN=https://your-domain.vercel.app

# Cron (Vercel)
CRON_SECRET=your_cron_secret
```

**⚠️ DO NOT expose backend env vars to frontend!**
Only `NEXT_PUBLIC_*` variables are safe in client components.

---

## 🧪 Testing Your Changes

### Safe Testing Areas:
1. **UI/UX changes** in `app/page.tsx`
   - Test: `npm run dev` → Visit `http://localhost:3000`
   - No backend required

2. **Join page styling** in `app/join/[id]/page.tsx`
   - Test: Visit `/join/test123`
   - Will prompt for wallet connection
   - Can test UI without completing flow

### What NOT to test locally:
- Telegram bot (requires webhook setup)
- Cron jobs (Vercel-specific)
- Full join flow (requires real portal setup)

---

## 🚀 Deployment

Current setup: **Vercel**

```bash
# Deploys automatically on push to master
git push origin master
```

**What happens on deploy**:
1. Next.js app builds
2. API routes deploy as serverless functions
3. Cron job registers with Vercel
4. Telegram webhook updates (if configured)

---

## 📝 Summary

### ✅ TOUCH (Frontend)
- `app/page.tsx` - Build landing page
- `app/join/[id]/page.tsx` - Enhance join UX (keep auth logic)
- `app/layout.tsx` - Update metadata, add nav/footer
- `app/globals.css` - Style as needed
- Create new components in `/components`

### ❌ DON'T TOUCH (Backend)
- `app/api/**/*` - All API routes
- `lib/*.ts` - All library files
- `vercel.json` - Cron configuration
- Any Redis data structure changes

### 🎨 Design Guidelines
- **Modern**: Clean, professional SaaS aesthetic
- **Crypto-native**: Use blockchain/web3 design patterns
- **Responsive**: Mobile-first approach
- **Accessible**: Good contrast, semantic HTML
- **Dark mode**: Primary theme (light mode optional)

---

## 🤝 Questions?

If you need to understand how the backend works for context (but not to modify):
- Read the code comments
- Check console logs during development
- Refer to this documentation

**Remember**: The backend is production-ready. Focus on making the frontend shine! ✨


