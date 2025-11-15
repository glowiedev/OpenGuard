<div align="center">

<img src="./public/logo-transparent.png" alt="OpenGuard Logo" width="200"/>

# OpenGuard

**Token-gated Telegram communities. Zero manual work.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by x403](https://img.shields.io/badge/Powered%20by-OpenKitx403-9042f8)](https://www.openkitx403.dev/)

[Website](https://openguard.cc) • [Telegram Bot](https://t.me/OpenGuardBot) • [GitHub](https://github.com/glowiedev/OpenGuard)

</div>

---

## 🎯 What is This?

OpenGuard is a **Telegram bot** that automatically verifies users own specific crypto tokens before letting them join your community.

**Think of it like a bouncer for your Telegram group** - but instead of checking IDs, it checks wallets.

### Why Use It?

- ✅ **No manual verification** - Bot handles everything automatically
- ✅ **Continuous monitoring** - Checks users every 15 minutes
- ✅ **Removes non-holders** - Kicks users who sell their tokens
- ✅ **Any Solana token** - Works with all SPL tokens
- ✅ **Secure** - No private keys ever accessed

---

## 🚀 How It Works

```
┌─────────────┐
│ Admin Setup │  Run /setup in Telegram → Configure token & amount
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Create Link │  Run /link in your channel → Bot posts join button
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ User Joins  │  User clicks → Connects wallet → Verified → Joins
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Auto Check  │  Every 15 min → Bot checks all users → Removes non-holders
└─────────────┘
```

**In Plain English:**
1. You tell the bot what token users need (e.g., "1000 BONK tokens")
2. Bot creates a join button for your channel
3. Users click button, connect their Solana wallet
4. Bot checks if they have the tokens
5. If yes → they join. If no → denied.
6. Bot keeps checking every 15 minutes forever

---

## 🛠️ Tech Stack

Built with modern web technologies:

### Frontend
- **Next.js 16** - The web framework (like a website builder kit)
- **React 19** - Makes the website interactive
- **Tailwind CSS** - Makes it look pretty
- **TypeScript** - Keeps code organized and error-free

### Backend
- **Grammy** - Powers the Telegram bot
- **Upstash Redis** - Stores data (who's in which group, etc.)
- **Solana Web3.js** - Talks to the Solana blockchain
- **OpenKitx403** - Handles secure wallet authentication

### Infrastructure
- **Vercel** - Hosts the website and bot (like website hosting)
- **Vercel Cron** - Runs the 15-minute checks automatically

### Security
- **HTTP 403 Protocol** - Industry-standard authentication
- **Ed25519 Signatures** - Cryptographic proof (wallet = you)
- **No private keys stored** - Your keys never leave your wallet

---

## 🔐 Security Features

| Feature | What It Means |
|---------|---------------|
| **Wallet Signatures** | Users sign a message to prove they own the wallet (like signing a document) |
| **Single-Use Links** | Each join link works once then self-destructs (prevents sharing) |
| **Replay Protection** | Old signatures can't be reused (prevents hackers from copying) |
| **No Key Access** | Bot never sees your private keys (your money stays safe) |
| **Zero Tracking** | We don't collect or store your data (privacy first) |

---

## 📁 Code Structure

```
OpenGuard/
├── app/
│   ├── api/
│   │   ├── bot/       → Telegram bot commands (/setup, /link, etc.)
│   │   ├── join/      → Wallet verification & token checking
│   │   └── cron/      → Automated 15-minute checks
│   ├── join/          → User-facing wallet connection page
│   └── page.tsx       → Main website
├── lib/
│   ├── crypto.ts      → Solana blockchain utilities
│   ├── store.ts       → Redis database connection
│   └── types.ts       → TypeScript type definitions
└── public/            → Images and assets
```

**For Developers:** All backend logic is in `app/api/`, frontend in `app/`, utilities in `lib/`.

---

## 🎮 For Users

### Joining a Token-Gated Group

1. **Click the join button** in the Telegram channel
2. **Connect your wallet** (Phantom, Backpack, or Solflare)
3. **Approve the signature** (proves you own the wallet)
4. **Done!** If you have the tokens, you're in

⚠️ **Important:** Always verify the URL is `openguard.cc` before connecting your wallet!

---

## 🔧 For Self-Hosting

<details>
<summary>Click to expand setup instructions</summary>

### Prerequisites
- Node.js 18+
- Telegram bot token (from @BotFather)
- Upstash Redis account
- Solana RPC endpoint
- Vercel account

### Environment Variables
```env
TELEGRAM_BOT_TOKEN=        # Get from @BotFather
TELEGRAM_SECRET=           # Any random string
UPSTASH_REDIS_REST_URL=    # From Upstash dashboard
UPSTASH_REDIS_REST_TOKEN=  # From Upstash dashboard
SOLANA_RPC_URL=            # Helius, QuickNode, or public RPC
NEXT_PUBLIC_DOMAIN=        # Your domain (e.g., https://openguard.cc)
CRON_SECRET=               # Any random string
```

### Deploy to Vercel
```bash
git clone https://github.com/glowiedev/OpenGuard
cd OpenGuard
npm install
vercel --prod
```

### Set Telegram Webhook
Visit: https://telegram.tools/webhook-manager  
URL format: `https://yourdomain.com/api/bot/YOUR_TELEGRAM_SECRET`

</details>

---

## 📊 Open Source

This project is fully open source under the MIT license. You can:
- ✅ Use it for free
- ✅ Modify the code
- ✅ Host it yourself
- ✅ Audit the security

**Why open source?** So you can verify the bot isn't doing anything shady. Check the code yourself!

---

## 🤝 Credits

**Built by:**
- [@glowiedev](https://x.com/glowiedev)
- [@onlyzhynx](https://x.com/onlyzhynx)

**Powered by:**
- [OpenKitx403](https://www.openkitx403.dev/) - HTTP-native wallet authentication protocol