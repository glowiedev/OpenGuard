# OpenGuard - Quick Reference Guide

## 📋 TL;DR

**What is this?** Solana token-gated Telegram bot (backend complete, frontend minimal)

**Your task:** Build beautiful frontend UI

**What to touch:** `app/page.tsx`, `app/join/[id]/page.tsx`, `app/layout.tsx`, `app/globals.css`

**What NOT to touch:** Everything in `app/api/`, `lib/`, configuration files

---

## 🚦 Files Overview

| File | Status | Can Modify? | Priority | Purpose |
|------|--------|-------------|----------|---------|
| **Frontend (MODIFY THESE)** |
| `app/page.tsx` | ⚠️ Minimal | ✅ YES | 🔥 High | Landing page (currently just "OpenGuard" text) |
| `app/join/[id]/page.tsx` | ⚠️ Basic | ✅ PARTIAL | 🔥 High | Join flow UI (keep auth logic, improve UX) |
| `app/layout.tsx` | ✅ Basic | ✅ YES | 🔶 Medium | Add nav, footer, metadata |
| `app/globals.css` | ✅ Basic | ✅ YES | 🔶 Medium | Customize styles |
| `/components/*` | ❌ None | ✅ YES | 🔥 High | Create new components |
| **Backend (DON'T TOUCH)** |
| `app/api/bot/[secret]/route.ts` | ✅ Complete | ❌ NO | - | Telegram bot webhook |
| `app/api/join/[nonce]/route.ts` | ✅ Complete | ❌ NO | - | Wallet auth + token verification |
| `app/api/cron/verify/route.ts` | ✅ Complete | ❌ NO | - | Automated token verification |
| `lib/crypto.ts` | ✅ Complete | ❌ NO | - | Solana blockchain utilities |
| `lib/withOpenKitAuth.ts` | ✅ Complete | ❌ NO | - | Wallet authentication |
| `lib/store.ts` | ✅ Complete | ❌ NO | - | Redis replay protection |
| `lib/types.ts` | ✅ Complete | ❌ NO | - | TypeScript types |
| **Config (CAREFUL)** |
| `vercel.json` | ✅ Complete | ❌ NO | - | Cron job config |
| `next.config.ts` | ✅ Minimal | ⚠️ MAYBE | - | Next.js config |
| `tsconfig.json` | ✅ Complete | ❌ NO | - | TypeScript config |
| `package.json` | ✅ Complete | ⚠️ MAYBE | - | Dependencies |

---

## 🎯 What to Build

### Priority 1: Landing Page
Location: `app/page.tsx`

**Current state:**
```tsx
export default function Home() {
  return <h1>OpenGuard</h1>;
}
```

**Build:**
1. Hero section (headline, CTA)
2. How It Works (3 steps)
3. Features grid (6 features)
4. Admin setup guide
5. User instructions
6. Footer

**Estimated work:** 2-3 days

---

### Priority 2: Join Page Enhancement
Location: `app/join/[id]/page.tsx`

**Current state:** Basic "Joining" text, wallet connection works but ugly

**Keep this logic:**
```tsx
// ✅ DO NOT REMOVE
const [client, _] = useState(() => new OpenKit403Client());
useEffect(() => {
  // ... wallet connection logic ...
  // ... authentication flow ...
});
```

**Add:**
1. Wallet selector UI (Phantom, Backpack, Solflare)
2. Loading states ("Connecting...", "Verifying...")
3. Error messages (insufficient tokens, invalid portal)
4. Success animation
5. Progress indicator (3 steps)

**Estimated work:** 1-2 days

---

### Priority 3: Components & Polish
Location: Create `/components` folder

**Build:**
- `components/layout/Navigation.tsx`
- `components/layout/Footer.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/features/WalletSelector.tsx`
- `components/features/LoadingSpinner.tsx`

**Estimated work:** 1-2 days

---

## 🚨 Common Pitfalls

### ❌ DON'T DO THIS

```tsx
// ❌ BAD: Removing auth logic from join page
export default function Join() {
  return <h1>Join now!</h1>; // Missing wallet connection!
}

// ❌ BAD: Modifying API routes
export async function GET(req: NextRequest) {
  // Don't touch this file!
}

// ❌ BAD: Changing type definitions
type KVConfig = {
  // Don't modify these types!
}

// ❌ BAD: Installing random packages without checking
npm install some-ui-library // Ask first!
```

### ✅ DO THIS

```tsx
// ✅ GOOD: Enhancing join page (keeping logic)
export default function Join(props: PageProps<"/join/[id]">) {
  const [client, _] = useState(() => new OpenKit403Client());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Keep existing wallet connection logic
    // Add loading state management
  });
  
  return (
    <div className="beautiful-ui">
      {loading ? <LoadingSpinner /> : <SuccessView />}
    </div>
  );
}

// ✅ GOOD: Creating new components
export function Hero() {
  return (
    <section className="hero">
      <h1>Token-Gate Your Community</h1>
    </section>
  );
}
```

---

## 🛠️ Tech Stack Reference

| Category | Technology | Usage |
|----------|------------|-------|
| **Frontend** | Next.js 16 | App Router, React 19 |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Language** | TypeScript 5 | Type safety |
| **Fonts** | Geist Sans/Mono | Google Fonts |
| **Backend** | Next.js API Routes | Serverless functions |
| **Bot** | Grammy 1.38.3 | Telegram bot framework |
| **Database** | Upstash Redis | Key-value store |
| **Blockchain** | Solana Web3.js | Token verification |
| **Auth** | OpenKit 403 | Wallet signatures |
| **Deployment** | Vercel | Hosting + cron jobs |

---

## 📦 Project Structure

```
app/
├── api/                    ❌ DON'T TOUCH
│   ├── bot/[secret]/       Telegram bot webhook
│   ├── join/[nonce]/       Wallet auth + verification
│   └── cron/verify/        Automated checking
├── join/[id]/
│   └── page.tsx            ⚠️ ENHANCE (keep logic)
├── page.tsx                ✅ BUILD THIS
├── layout.tsx              ✅ ENHANCE THIS
└── globals.css             ✅ STYLE THIS

lib/                        ❌ DON'T TOUCH
├── crypto.ts               Solana utilities
├── store.ts                Redis replay protection
├── types.ts                Type definitions
└── withOpenKitAuth.ts      Authentication wrapper

components/                 ✅ CREATE THIS
├── layout/
│   ├── Navigation.tsx
│   └── Footer.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── features/
    ├── WalletSelector.tsx
    └── LoadingSpinner.tsx

public/                     ✅ ADD ASSETS
└── images/
    └── (your images)
```

---

## 🎨 Design Tokens

### Colors
```css
--primary: #9945FF         /* Solana purple */
--accent: #0088CC          /* Telegram blue */
--success: #14F195         /* Green */
--error: #FF4444           /* Red */
--bg-dark: #0a0a0a         /* Background */
--text-primary: #ededed    /* Main text */
```

### Spacing
```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 (px)
```

### Typography
```
Heading: Geist Sans
Body: Geist Sans
Code: Geist Mono
```

---

## 🔐 Environment Variables

**Frontend can use:**
- `NEXT_PUBLIC_DOMAIN` (for join URL)

**Backend only (don't expose):**
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SOLANA_RPC_URL`
- `CRON_SECRET`

---

## 🧪 Testing Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Build (to check for errors)
npm run build            # Compile everything

# Production
npm start                # Run production build locally
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `DEVELOPMENT_GUIDE.md` | Detailed guide on what to touch/not touch |
| `ARCHITECTURE.md` | System architecture, data flows, tech stack |
| `FRONTEND_ROADMAP.md` | Component designs, page layouts, implementation plan |
| `QUICK_REFERENCE.md` | This file - quick lookup |

---

## 🆘 Need Help?

### Understanding backend flow:
→ Read `ARCHITECTURE.md`

### What files to modify:
→ Read `DEVELOPMENT_GUIDE.md`

### Component ideas:
→ Read `FRONTEND_ROADMAP.md`

### Quick lookup:
→ Read this file

---

## ✅ Development Checklist

### Setup
- [ ] Read all documentation
- [ ] Understand backend (but don't touch it)
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000

### Phase 1: Foundation
- [ ] Create `/components` folder
- [ ] Build Button component
- [ ] Build Card component
- [ ] Build Navigation component
- [ ] Build Footer component

### Phase 2: Landing Page
- [ ] Hero section
- [ ] How It Works
- [ ] Features grid
- [ ] Admin guide
- [ ] User guide
- [ ] Footer

### Phase 3: Join Page
- [ ] Wallet selector UI
- [ ] Loading states
- [ ] Error handling
- [ ] Success screen
- [ ] Mobile responsive

### Phase 4: Polish
- [ ] Animations
- [ ] Responsive design
- [ ] Accessibility
- [ ] SEO metadata
- [ ] Performance optimization

---

## 🎯 Success Criteria

Your frontend is done when:

1. ✅ Landing page looks professional and explains the product
2. ✅ Join flow has clear steps and error messages
3. ✅ Mobile responsive (works on phones)
4. ✅ No linting errors (`npm run build` succeeds)
5. ✅ Navigation and footer on all pages
6. ✅ Loading states during wallet connection
7. ✅ Clear error messages for users
8. ✅ Dark mode looks good (primary theme)

---

## 🚀 Ship It!

Once frontend is built:

```bash
git add .
git commit -m "feat: add landing page and enhanced join flow"
git push origin master
```

Vercel will auto-deploy! 🎉

---

**Remember:** Backend is production-ready. Your job is to make it **look** as good as it **works**! ✨

