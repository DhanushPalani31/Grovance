-- Grovance database schema — run this in the Supabase SQL editor once
-- (Dashboard → SQL Editor → New query → paste this whole file → Run)

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text,        -- null for Google-only accounts
  google_id text unique,
  created_at timestamptz not null default now()
);

create table if not exists rules (
  id text primary key,       -- keeps the existing "1".."5" string ids from the demo
  trigger_text text not null,
  action_text text not null,
  enabled boolean not null default true,
  last_triggered_at timestamptz,
  run_count integer not null default 0
);

create table if not exists tickets (
  id text primary key,       -- e.g. "GRV-103"
  title text not null,
  status text not null check (status in ('Open', 'In Progress', 'Resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- A running counter for ticket IDs (GRV-100, GRV-101, ...) instead of an
-- in-memory variable, so it survives restarts too.
create table if not exists ticket_counter (
  id boolean primary key default true,
  next_number integer not null default 103,
  constraint single_row check (id)
);
insert into ticket_counter (id, next_number) values (true, 103)
  on conflict (id) do nothing;

-- Atomically claim the next ticket number (avoids a race condition between
-- reading the counter and writing it back under concurrent requests).
create or replace function next_ticket_number()
returns integer as $$
declare
  result integer;
begin
  update ticket_counter set next_number = next_number + 1
    where id = true
    returning next_number - 1 into result;
  return result;
end;
$$ language plpgsql;

-- Dashboard metrics that the demo simulates growing over time — persisted
-- so they survive restarts instead of resetting to the seed values.
create table if not exists metrics (
  id boolean primary key default true,
  orders_today integer not null default 41,
  revenue_today integer not null default 2180,
  low_stock_items integer not null default 3,
  constraint single_row check (id)
);
insert into metrics (id, orders_today, revenue_today, low_stock_items)
  values (true, 41, 2180, 3)
  on conflict (id) do nothing;

create or replace function simulate_order(order_value integer)
returns void as $$
begin
  update metrics
    set orders_today = orders_today + 1,
        revenue_today = revenue_today + order_value
    where id = true;
end;
$$ language plpgsql;

-- Seed the same demo rules the app has always shipped with, so a fresh
-- database looks identical to the in-memory version on first run.
insert into rules (id, trigger_text, action_text, enabled) values
  ('1', 'New order placed', 'Send confirmation email to customer', true),
  ('2', 'Stock falls below 5 units', 'Notify owner via WhatsApp/email', true),
  ('3', 'Every day at 9 PM', 'Generate daily sales summary', true),
  ('4', 'Customer inactive for 30 days', 'Send a personalized win-back offer', false),
  ('5', 'Every Sunday', 'Auto-backup brand data', true)
on conflict (id) do nothing;

insert into tickets (id, title, status, created_at, updated_at) values
  ('GRV-100', 'Fix product image upload', 'Resolved', now() - interval '72 hours', now() - interval '70 hours'),
  ('GRV-101', 'Add new payment method', 'In Progress', now() - interval '24 hours', now() - interval '20 hours'),
  ('GRV-102', 'Update business hours for holidays', 'Resolved', now() - interval '3 hours', now() - interval '2 hours')
on conflict (id) do nothing;

insert into activity_log (label, source, created_at)
select * from (values
  ('Sent order confirmation email to a customer', 'automation', now() - interval '3 minutes'),
  ('Low-stock alert sent for ''Ceramic Mug - Blue''', 'automation', now() - interval '42 minutes'),
  ('AI Assistant answered a customer question about business hours', 'ai', now() - interval '90 minutes'),
  ('Daily sales summary generated', 'automation', now() - interval '14 hours')
) as seed(label, source, created_at)
where not exists (select 1 from activity_log);
