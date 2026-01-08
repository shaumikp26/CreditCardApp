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
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only; needed for admin Add page)
  - `ADMIN_PASSCODE` (server-only; protects admin writes)

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
- `expiry_date` (date)

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

## DB migration (expiry_date)
Run this once in Supabase SQL editor:

```sql
alter table public.credit_cards
add column if not exists expiry_date date;
```

## Admin Add page (no user auth)
This app includes an admin-only page at `/add`.
- It posts to `/api/admin/add-card` and is protected by `ADMIN_PASSCODE`.
- The API uses `SUPABASE_SERVICE_ROLE_KEY` server-side to insert into:
  - `credit_cards`
  - `cashback_categories`

## Deploy to Vercel
1) Push this repo to GitHub.
2) In Vercel: **Add New → Project** → import the repo.
3) Set environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSCODE`
4) Deploy.
## iOS home screen
- Open the deployed site in Safari → Share → **Add to Home Screen**.
- The app includes a web manifest + Apple web app metadata for a nicer standalone feel.
