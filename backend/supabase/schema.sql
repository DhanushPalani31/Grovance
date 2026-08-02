-- Grovance database schema — run this in the Supabase SQL editor once
-- (Dashboard → SQL Editor → New query → paste this whole file → Run)
--
-- Trimmed to match the current app exactly: just the marketing site,
-- AI chat, lead capture, and the Automation Audit tool. No portal/auth/
-- rules/tickets — those were removed along with the client dashboard.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  source text not null check (source in ('automation', 'ai', 'system', 'maintenance')),
  created_at timestamptz not null default now()
);
