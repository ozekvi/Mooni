# 🌙 Mooni Services

Premium Rise of Kingdoms services — Next.js 15 + Prisma + NextAuth + Stripe + Discord

## Setup

See full instructions below for: PostgreSQL, Discord App, Resend, Stripe, and Vercel deploy.

### Environment Variables (Vercel)

| Variable | Value |
|----------|-------|
| DATABASE_URL | Your PostgreSQL URL (Neon/Supabase) |
| NEXTAUTH_SECRET | openssl rand -base64 32 |
| NEXTAUTH_URL | https://your-domain.vercel.app |
| DISCORD_CLIENT_ID | Discord Developer Portal |
| DISCORD_CLIENT_SECRET | Discord Developer Portal |
| DISCORD_BOT_TOKEN | Discord Bot Token |
| DISCORD_GUILD_ID | 1487774939598688267 |
| DISCORD_ADMIN_ROLE_ID | 1487777401927766079 |
| RESEND_API_KEY | resend.com |
| EMAIL_FROM | noreply@yourdomain.com |
| STRIPE_SECRET_KEY | Stripe Dashboard |
| STRIPE_PUBLISHABLE_KEY | Stripe Dashboard |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook |
| NEXT_PUBLIC_APP_URL | https://your-domain.vercel.app |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Same as STRIPE_PUBLISHABLE_KEY |

## Deploy

```bash
git init && git add . && git commit -m "init"
# Push to GitHub, then import on vercel.com
# After deploy: npx prisma db push
```

## Local Dev

```bash
cp .env.example .env   # fill in values
npx prisma db push
npm run dev
```
