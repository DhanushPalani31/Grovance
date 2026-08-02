# Database setup

## First time setup
1. Create a project at supabase.com (free tier is fine)
2. Go to **SQL Editor** → New query
3. Paste the entire contents of `schema.sql` → **Run**
4. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `backend/.env` (found in
   your Supabase project's Settings → API)

That's it — `schema.sql` creates every table (`users`, `rules`, `tickets`,
`leads`, `activity_log`, plus two small helper tables/functions) and seeds
the same demo data the app has always shipped with.

## If something's in a broken/partial state
If you ran part of `schema.sql` before, hit an error partway through, or
just want a clean slate:

1. Run `reset.sql` first — **this deletes everything**, only use it if
   you're okay losing all current data (test accounts, tickets, etc.)
2. Then run `schema.sql` fresh, exactly as in first-time setup above

## Verifying it worked
In Supabase's Table Editor, you should see 7 tables: `users`, `rules`,
`tickets`, `leads`, `activity_log`, `ticket_counter`, `metrics` — with
`rules` and `tickets` already containing the 5 demo rules and 3 demo
tickets seeded in.
