# Database setup

## First time setup
1. Create a project at supabase.com (free tier is fine)
2. Go to **SQL Editor** → New query
3. Paste the entire contents of `schema.sql` → **Run**
4. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `backend/.env` (found in
   your Supabase project's Settings → API)

`schema.sql` creates just two tables now: `leads` (from the Contact form
and Automation Audit) and `activity_log` (an internal log the AI/lead
routes write to). The portal-era tables (`users`, `rules`, `tickets`, etc.)
were removed along with the client dashboard feature.

## If you already ran the old (larger) schema
If your Supabase project has the older `users`/`rules`/`tickets`/`metrics`
tables from before the portal was removed, run
`cleanup-legacy-portal-tables.sql` once to clean those up — it only
touches the now-unused tables and leaves `leads`/`activity_log` alone.

## If something's in a broken/partial state
1. Run `reset.sql` — **this deletes all data in `leads`/`activity_log`**,
   only use it if you're okay losing that
2. Then run `schema.sql` fresh

## Verifying it worked
In Supabase's Table Editor, you should see 2 tables: `leads` and
`activity_log`.
