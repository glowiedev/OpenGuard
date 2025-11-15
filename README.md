# Setup OpenGuard

### ENV
Follow .env.example for environment setup

### Telegram
REMEMBER to setup the webhook!!!
https://telegram.tools/webhook-manager#/
Put the telegram token in and add the domain + /api/bot/ + your secret you defined in .env.

### Cronjob
For regular checking of member tokens you want to add CRON_SECRET environment variable to the vercel project settings.

### Deploy
This is made to be deployed to Vercel. Combined Website, Telegram, Cronjob project.
