# ZEE
Next.js 14 (App Router) + TypeScript + Tailwind + Prisma/MySQL + Auth.js + Paystack.
## Run locally
1. Start MySQL (XAMPP works) and create an empty database named `zee`.
2. `cp .env.example .env` then fill in the values (Paystack test key from dashboard.paystack.com).
3. `npm install && npx prisma db push && npm run seed && npm run dev`
4. Open http://localhost:3000. Admin login = SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD, then use /admin.
## Payments
Prices are stored in kobo. Totals are computed on the server. Orders are marked paid only after Paystack verification (callback page) or a signed webhook.
Set the Paystack webhook URL to `https://YOUR_DOMAIN/api/webhooks/paystack` (use ngrok locally).
## Deploy
Set the same env vars on your host, run `npm run build && npm start`, and use a hosted MySQL database.

## Extras
AI assistant needs ANTHROPIC_API_KEY. Reviews are open to verified buyers only. Rate limiting is in-memory; use Redis when scaling out.
