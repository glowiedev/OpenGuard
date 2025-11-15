# OpenGuard

Token-gated Telegram communities powered by x403.

## What This Does

Telegram bot that verifies users hold specific SPL tokens before joining your group. Automatically checks balances every 15 minutes and removes users who no longer qualify.

## Code Overview

```
app/api/bot/       - Telegram bot (commands, setup, join handling)
app/api/join/      - Wallet verification (checks tokens, creates invites)
app/api/cron/      - Scheduled verification (removes non-holders)
lib/               - Utilities (Solana, Redis, wallet auth)
```

**Open source for transparency. Audit the code yourself.**

## How It Works

1. Admin: `/setup` → configure token requirements
2. Admin: `/link` → create join button
3. User: clicks button → connects wallet
4. System: verifies tokens on Solana → creates invite link
5. Cron: checks all users every 15 minutes

## Security

- Wallet signatures (OpenKit 403 protocol)
- Single-use invite links
- Replay attack prevention
- No private keys accessed
- No data tracking

## Setup (Self-Hosting)

### Environment Variables
```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SOLANA_RPC_URL=
NEXT_PUBLIC_DOMAIN=
CRON_SECRET=
```

### Telegram Webhook
Set webhook URL at: https://telegram.tools/webhook-manager  
Format: `https://yourdomain.com/api/bot/YOUR_SECRET`

### Deploy
Designed for Vercel. Push to deploy.

Cron job runs automatically (configured in `vercel.json`).
