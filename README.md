# OpenGuard

**Token-gated Telegram communities powered by Solana**

## 🚀 Quick Start

### For Frontend Developers
**Backend is complete. Your task: Build the frontend UI.**

1. **Read the docs** (5 minutes):
   - Start with: [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) - Quick overview
   - Then: [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md) - What to touch/not touch

2. **Set up** (5 minutes):
   ```bash
   npm install
   npm run dev
   ```

3. **Start building** (rest of your time):
   - Build landing page: `app/page.tsx`
   - Enhance join page: `app/join/[id]/page.tsx`
   - Create components in: `/components`

## 📚 Documentation

| File | Purpose | Read Time |
|------|---------|-----------|
| [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) | Quick lookup, TL;DR | 5 min |
| [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md) | Detailed guide on what to touch/not touch | 15 min |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture and data flows | 20 min |
| [`FRONTEND_ROADMAP.md`](./FRONTEND_ROADMAP.md) | Component designs and implementation plan | 30 min |
| [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) | Executive summary | 10 min |
| [`VISUAL_GUIDE.md`](./VISUAL_GUIDE.md) | Visual diagrams and flowcharts | 15 min |

## 🎯 What to Build

### Priority 1: Landing Page (`app/page.tsx`)
Currently just shows "OpenGuard" text. Build:
- Hero section
- How It Works
- Features grid
- Admin guide
- Footer

### Priority 2: Join Page (`app/join/[id]/page.tsx`)
Has basic auth logic. Add:
- Wallet selector UI
- Loading states
- Error messages
- Success screen

### Priority 3: Components (`/components`)
Create reusable components:
- Navigation, Footer, Container
- Button, Card, Badge
- WalletSelector, LoadingSpinner

## ⚠️ Critical Rules

### ✅ SAFE TO MODIFY
- `app/page.tsx` - Build landing page
- `app/join/[id]/page.tsx` - Enhance UI (keep auth logic!)
- `app/layout.tsx` - Add nav, footer
- `app/globals.css` - Custom styles
- Create: `/components` - All new components

### ❌ DON'T TOUCH
- `app/api/**/*` - Backend routes (complete)
- `lib/*.ts` - Core libraries (complete)
- `vercel.json` - Cron config (complete)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Backend**: Next.js API Routes, Grammy (Telegram), Upstash Redis
- **Blockchain**: Solana Web3.js, SPL Token
- **Auth**: OpenKit 403 (wallet signatures)
- **Deploy**: Vercel (serverless + cron)

## 🔧 Environment Setup

### ENV
Follow .env.example for environment setup

### Telegram
REMEMBER to setup the webhook!!!
https://telegram.tools/webhook-manager#/
Put the telegram token in and add the domain + /api/bot/ + your secret you defined in .env.

### Cronjob
Runs every 15 minutes to verify token balances. Configured in `vercel.json`.

### Deploy
Deploys to Vercel. Push to `master` branch for auto-deployment.

```bash
git push origin master
# Vercel auto-deploys
```

## 📖 Learn More

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Grammy Bot Framework](https://grammy.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Need Help?

1. Check the documentation files (especially `QUICK_REFERENCE.md`)
2. Read the code comments
3. Test in dev mode: `npm run dev`

---

**Backend Status**: ✅ Complete (624 lines)  
**Frontend Status**: ⚠️ Minimal (105 lines) - **Needs your work!**

**Now go build something beautiful!** 🚀✨
