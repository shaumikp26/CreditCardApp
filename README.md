# Card Cashback (Next.js + Supabase)

Mobile-first web app that recommends the best credit card for a selected transaction category, using a **public read-only** Supabase database.

## Tech
- Next.js (App Router) + Tailwind CSS
- Supabase (`@supabase/supabase-js`)
- No authentication

## Local setup
1) Install deps

```bash
npm install
```

2) Set env vars
- Copy `.env.example` → `.env.local`
- Fill in:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3) Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase schema
Tables:

1) `credit_cards`
- `id` (uuid)
- `card_name` (text)
- `issuer` (text)
- `notes` (text)

2) `cashback_categories`
- `id` (uuid)
- `card_id` (uuid) → references `credit_cards.id`
- `category` (text)
- `cashback_rate` (number)
- `cap` (text, optional)

## Supabase public read-only (RLS) policies
Enable RLS on both tables and allow SELECT for the `anon` role:

```sql
alter table credit_cards enable row level security;
alter table cashback_categories enable row level security;

create policy "public_read_credit_cards"
on credit_cards for select
to anon
using (true);

create policy "public_read_cashback_categories"
on cashback_categories for select
to anon
using (true);
```

Do **not** create INSERT/UPDATE/DELETE policies for `anon` (keeps the DB effectively read-only for public users).

## Deploy to Vercel
1) Push this repo to GitHub.
2) In Vercel: **Add New → Project** → import the repo.
3) Set environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4) Deploy.
## iOS home screen
- Open the deployed site in Safari → Share → **Add to Home Screen**.
- The app includes a web manifest + Apple web app metadata for a nicer standalone feel.
