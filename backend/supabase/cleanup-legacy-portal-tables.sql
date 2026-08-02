-- Run this ONCE in your EXISTING Supabase project's SQL Editor to remove
-- the tables/functions left over from the portal/dashboard feature, which
-- has been removed from the app entirely. Safe to run — leads and
-- activity_log (the tables the app still uses) are untouched.

drop function if exists simulate_order(integer);
drop function if exists next_ticket_number();

drop table if exists metrics cascade;
drop table if exists ticket_counter cascade;
drop table if exists tickets cascade;
drop table if exists rules cascade;
drop table if exists users cascade;
