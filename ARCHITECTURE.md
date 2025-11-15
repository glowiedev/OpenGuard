# OpenGuard - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
├─────────────────┬───────────────────────┬───────────────────────┤
│  Telegram User  │   Admin (Telegram)    │   Web User (Join)    │
└────────┬────────┴───────────┬───────────┴──────────┬────────────┘
         │                    │                       │
         ▼                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP (Vercel)                        │
├──────────────────┬────────────────────┬──────────────────────────┤
│   Frontend       │   API Routes       │   Cron Jobs             │
│   (React)        │   (Serverless)     │   (Scheduled)           │
├──────────────────┼────────────────────┼──────────────────────────┤
│ • Landing Page   │ • /api/bot/[secret]│ • /api/cron/verify      │
│ • Join Flow      │ • /api/join/[nonce]│   (Every 15 min)        │
│ • Wallet Connect │                    │                         │
└──────────┬───────┴─────────┬──────────┴────────┬─────────────────┘
           │                 │                    │
           │                 │                    │
           ▼                 ▼                    ▼
    ┌──────────┐      ┌──────────┐        ┌──────────┐
    │ Solana   │      │ Telegram │        │ Upstash  │
    │   RPC    │      │   API    │        │  Redis   │
    │          │      │ (Grammy) │        │   KV     │
    └──────────┘      └──────────┘        └──────────┘
```

---

## 🔄 User Flows

### Flow 1: Admin Setup (Telegram Only)
```
1. Admin adds bot to Telegram group
2. Admin runs: /setup
   └─→ Bot creates config in Redis
   └─→ Bot shows setup UI with inline keyboard
3. Admin sets mint address
   └─→ Bot validates on Solana
4. Admin sets token amount
   └─→ Bot updates config
5. Admin runs: /link {nonce} in target channel
   └─→ Bot links portal to channel
   └─→ Bot creates join button with URL
```

**Redis Operations**:
```
CREATE: config:{chatId} = {
  nonce: "xyz",
  mint: null,
  amount: null,
  portalChatId: null
}

UPDATE: config:{chatId}.mint = "TokenAddress..."
UPDATE: config:{chatId}.amount = 1000
UPDATE: config:{chatId}.portalChatId = 12345
```

---

### Flow 2: User Join (Web + Telegram)
```
1. User clicks join button in Telegram
   └─→ Opens: yoursite.com/join/{nonce}
   
2. Frontend: app/join/[id]/page.tsx
   └─→ OpenKit403Client connects wallet
   └─→ User approves wallet connection (Phantom/Backpack/Solflare)
   
3. Frontend sends authenticated request
   └─→ POST /api/join/{nonce}
   └─→ Headers include wallet signature
   
4. Backend: app/api/join/[nonce]/route.ts
   ├─→ Verify wallet signature (OpenKit403)
   ├─→ Find portal config by nonce
   ├─→ Check token balance on Solana
   │   └─→ Get mint decimals
   │   └─→ Get user's token account
   │   └─→ Compare balance vs requirement
   └─→ If valid: Create single-use invite link
   
5. Backend stores temporary link
   └─→ SET: link:{linkName} = walletAddress
   
6. Frontend redirects to Telegram invite link

7. User requests to join in Telegram
   └─→ Bot webhook: chat_join_request event
   
8. Bot processes join request
   ├─→ Reads: link:{linkName}
   ├─→ Stores: user:{telegramId} = walletAddress
   ├─→ Deletes: link:{linkName}
   └─→ Approves join request
```

**Key Security Points**:
- Single-use invite links (deleted after first use)
- Wallet signature verification (replay protection)
- Token balance checked before invite creation

---

### Flow 3: Automated Verification (Cron)
```
Every 15 minutes:

1. Vercel triggers: GET /api/cron/verify
   └─→ Protected by CRON_SECRET header
   
2. Cron job scans Redis
   └─→ Get all: config:* keys
   └─→ Get all: user:* keys
   
3. For each user:
   ├─→ Read: user:{telegramId} → walletAddress
   ├─→ Check balance on Solana
   │   └─→ Using config's mint and amount
   └─→ If insufficient:
       ├─→ Ban user from Telegram group
       ├─→ Unban (kick, not permanent ban)
       ├─→ Send DM: "You were removed..."
       └─→ Continue to next user
       
4. Return: {verified: N, kicked: M, failed: K}
```

**Why every 15 minutes?**
- Balance between real-time verification and API costs
- Prevents users from selling tokens immediately after joining

---

## 🗄️ Data Models

### Redis Schema

#### 1. Portal Configuration
```typescript
Key: `config:{chatId}`
Value: {
  portalChatId: number | null,  // Linked Telegram chat ID
  nonce: string,                // Unique portal identifier
  mint: string | null,          // Solana token mint address
  amount: number | null         // Required token amount (human-readable)
}
Expiry: None (persists)
```

**Example**:
```
config:-1001234567890 = {
  portalChatId: -1001234567890,
  nonce: "a3f2b1c4",
  mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  amount: 1000
}
```

#### 2. User-Wallet Mapping
```typescript
Key: `user:{telegramUserId}`
Value: walletAddress (string)
Expiry: None (persists)
```

**Example**:
```
user:123456789 = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
```

#### 3. Temporary Join Links
```typescript
Key: `link:{linkName}`
Value: walletAddress (string)
Expiry: Short-lived (until join or timeout)
```

**Example**:
```
link:GATE_f8e3a1b2 = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
```
*Deleted immediately after user joins*

#### 4. Replay Protection
```typescript
Key: `replay:{signatureHash}`
Value: "1"
Expiry: 60 seconds (TTL from OpenKit config)
```

---

## 🔒 Security Layers

### 1. Wallet Authentication (OpenKit 403)
```
Client                          Server
  │                               │
  │────── GET /api/join/xyz ─────▶│
  │                               │
  │◀──── 403 + Challenge ─────────│
  │                               │
  │ [User signs challenge]        │
  │                               │
  │─── GET + Authorization ──────▶│
  │      (signed message)         │
  │                               │
  │      [Verify signature]       │
  │      [Check replay store]     │
  │      [Store signature]        │
  │                               │
  │◀────── 200 + Data ────────────│
```

**Prevents**:
- Unauthorized access
- Replay attacks (60s TTL)
- Impersonation

### 2. Telegram Webhook Security
- `TELEGRAM_SECRET` path parameter
- Only Telegram can call webhook

### 3. Cron Job Security
- `CRON_SECRET` bearer token
- Only Vercel cron can trigger

### 4. Single-Use Invite Links
- Link deleted after first join
- Prevents sharing links

---

## 🧩 Tech Stack Details

### Frontend
```typescript
Framework:  Next.js 16 (App Router)
UI:         React 19
Styling:    Tailwind CSS 4
Language:   TypeScript 5
Fonts:      Geist Sans, Geist Mono
```

### Backend (API Routes)
```typescript
Runtime:    Node.js (Serverless)
Framework:  Next.js API Routes
Bot:        Grammy 1.38.3
Database:   Upstash Redis
Blockchain: Solana Web3.js 1.98.4
            @solana/spl-token 0.4.14
Auth:       @openkitx403/server
```

### Infrastructure
```
Hosting:    Vercel (Serverless)
Cron:       Vercel Cron Jobs
Webhooks:   HTTPS endpoints
Region:     Auto (Vercel edge network)
```

---

## 📡 API Endpoints

### Public Endpoints

#### `GET /api/join/[nonce]`
**Purpose**: Authenticate wallet and create Telegram invite link

**Auth**: OpenKit 403 (wallet signature)

**Request**:
```http
GET /api/join/a3f2b1c4
Authorization: Bearer <openkit-signature>
```

**Success Response** (200):
```json
{
  "link": "https://t.me/+abcdef123456"
}
```

**Error Responses**:
- `403`: Wallet auth required / failed
- `404`: Invalid portal (nonce not found)
- `403 insufficient_funds`: Not enough tokens
- `500 telegram_api_error`: Bot lacks permissions

---

### Protected Endpoints

#### `POST /api/bot/[secret]`
**Purpose**: Telegram webhook handler

**Auth**: Secret path parameter

**Called by**: Telegram servers only

**Handles**:
- Commands: `/setup`, `/link`
- Callbacks: `set_mint`, `set_amount`, `reset_*`
- Events: `chat_join_request`, `message:text`

---

#### `GET /api/cron/verify`
**Purpose**: Periodic token balance verification

**Auth**: Bearer token (`CRON_SECRET`)

**Schedule**: Every 15 minutes (vercel.json)

**Request**:
```http
GET /api/cron/verify
Authorization: Bearer <cron-secret>
```

**Response** (200):
```json
{
  "ok": true,
  "message": "Verification complete. Verified: 42, Kicked: 3, Failed to kick: 0."
}
```

---

## 🌐 External Dependencies

### Solana RPC
**Purpose**: Read token balances, validate mint addresses

**Operations**:
- `getMint()` - Get token metadata (decimals)
- `getAccount()` - Get user's token account
- `getAssociatedTokenAddress()` - Calculate ATA

**Rate limits**: Depends on RPC provider

---

### Telegram Bot API
**Purpose**: Bot interactions, group management

**Key operations**:
- `createChatInviteLink()` - Generate join links
- `approveChatJoinRequest()` - Allow user to join
- `revokeChatInviteLink()` - Delete used links
- `banChatMember()` / `unbanChatMember()` - Remove users
- `sendMessage()` - Send notifications

**Requirements**:
- Bot must be admin in group
- Bot needs permissions: invite users, ban users

---

### Upstash Redis
**Purpose**: State storage, caching

**Operations**:
- `set()`, `get()`, `del()` - Basic KV
- `setex()` - Set with expiry (replay protection)
- `scan()` - Find keys by pattern
- `exists()` - Check key existence

**Why Upstash?**:
- Serverless-friendly (HTTP-based)
- Global replication
- Vercel integration

---

## 🎯 Design Principles

### Backend
1. **Stateless**: Each request is independent
2. **Idempotent**: Same request = same result
3. **Fail-safe**: Errors don't corrupt state
4. **Secure by default**: All endpoints protected

### Frontend
1. **Progressive enhancement**: Works without JS (basic)
2. **Responsive**: Mobile-first design
3. **Accessible**: WCAG 2.1 AA compliance
4. **Fast**: Optimized bundle, code splitting

---

## 🔍 Monitoring & Debugging

### Logs to Check
```bash
# Vercel deployment logs
vercel logs <deployment-url>

# Filter by function
vercel logs --filter "/api/join"

# Real-time
vercel logs --follow
```

### Redis Inspection
```javascript
// In Upstash console or code
await redis.scan(0, { match: "config:*" });  // All portals
await redis.scan(0, { match: "user:*" });    // All users
await redis.scan(0, { match: "link:*" });    // Active links
```

### Common Issues
1. **User can't join**: Check token balance on Solscan
2. **Bot doesn't respond**: Check webhook URL in BotFather
3. **Cron not running**: Check Vercel dashboard → Cron
4. **Wallet won't connect**: Check NEXT_PUBLIC_DOMAIN is correct

---

## 📈 Scalability Considerations

### Current Limits
- **Redis**: 10,000+ operations/sec (Upstash)
- **Vercel Functions**: 10s timeout, 1024MB memory
- **Telegram API**: ~30 requests/sec per bot

### Bottlenecks
1. **Cron job**: Scans ALL users (O(n))
   - Solution: Shard by user ID, run parallel jobs
2. **Solana RPC**: Rate limits vary by provider
   - Solution: Use multiple RPCs, implement caching
3. **Telegram API**: Rate limits on ban operations
   - Solution: Batch operations, implement delays

### Optimization Opportunities
- Cache token mint info (decimals don't change)
- Batch Solana RPC requests
- Use Redis pub/sub for real-time updates
- Implement CDN for frontend assets

---

## 🚀 Future Enhancements

### Planned Features (Not Implemented Yet)
- [ ] Multi-token requirements (AND/OR logic)
- [ ] NFT-gating (check NFT ownership)
- [ ] Grace period before kicking (24h warning)
- [ ] Admin dashboard (web UI)
- [ ] Analytics (joins, kicks, active users)
- [ ] Custom welcome messages
- [ ] Role assignment based on holdings

### Frontend Improvements Needed
- [ ] Landing page (currently just "OpenGuard" text)
- [ ] Join page UX (loading states, errors)
- [ ] Admin instructions page
- [ ] FAQ page
- [ ] Documentation viewer

---

## 📚 Further Reading

- [Grammy Documentation](https://grammy.dev/)
- [Solana Cookbook](https://solanacookbook.com/)
- [OpenKit Protocol](https://github.com/openkitx403)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Upstash Redis](https://docs.upstash.com/redis)

---

**Note**: This architecture is production-ready but the frontend is minimal. The system is secure, tested, and deployed. Focus efforts on UI/UX improvements.


