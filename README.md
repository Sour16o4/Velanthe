# Velanthe

A portfolio e-commerce site for Velanthe, an invented luxury skincare brand. Browse the catalog, add items to a bag and wishlist, search, sign in with a Supabase account (or stay a guest), place a mock order and see it in order history.

**Live URL:** add here after deploying to Vercel.

## Stack

- Next.js 15 (App Router), React 19, plain JavaScript
- Tailwind CSS v4 (animations are plain CSS)
- Zustand for the bag and wishlist, saved in the browser (localStorage)
- Supabase for accounts and orders — optional; the store works without it
- Vitest for unit tests

## Requirements

- Node 22.12+ and npm
- Windows, macOS or Linux
- Current Chrome, Edge, Firefox, or Safari 17+

## Run locally

Without Supabase the site is a complete guest store (catalog, bag, wishlist, search). Sign-in, checkout and order history need Supabase.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Enable accounts (Supabase, optional)

1. supabase.com → New project (free tier).
2. Project Settings → API: copy the **Project URL**, **anon public** key and **service_role** key.
3. Authentication → Providers → Email: turn **off** "Confirm email".
4. Authentication → URL Configuration: Site URL = your site's URL; add `http://localhost:3000/**` and your site's URL `/**` as redirect URLs.
5. Authentication → Users → Add user: `demo@example.com` with a password you choose.
6. SQL editor: run `supabase/schema.sql` once (creates the `orders` table and its security rules).
7. Copy `.env.example` to `.env.local` (macOS/Linux: `cp .env.example .env.local`, Windows: `copy .env.example .env.local`) and fill in the values.
8. Optional check that users can't write orders directly: `node --env-file=.env.local scripts/rls-check.mjs`

The demo account is shared by everyone who uses it. To reset its password: Supabase → Authentication → Users.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm test` | Unit tests |
| `node scripts/make-placeholders.mjs` | Regenerate the placeholder images |

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add the variables from `.env.example` in Vercel → Settings → Environment Variables (skip the Supabase ones for a guest-only store).
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL and redeploy.

Supabase free projects pause after about a week without use; open the site (or the Supabase dashboard) to wake it.

## Notes

- Checkout is a **mock**: no payment is taken. The server prices every order from the catalog; prices sent by the browser are ignored.
- The bag and wishlist are saved per browser, not per account.
- Images in `public/img` are placeholders; replace them keeping the same file names.
- Design inspired by mdebeauty.com's luxury-boutique feel; brand, copy and imagery are original.
