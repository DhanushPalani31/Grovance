-- Grovance database RESET — run this ONLY if you want to wipe everything
-- and start clean (e.g. a previous schema.sql run was partial or broken).
-- Run this first, then run schema.sql fresh afterward.
--
-- WARNING: this deletes all data — every user account, ticket, lead, and
-- activity log entry. Do not run this against a database with real users
-- you want to keep.

drop function if exists simulate_order(integer);
drop function if exists next_ticket_number();

drop table if exists metrics cascade;
drop table if exists ticket_counter cascade;
drop table if exists activity_log cascade;
drop table if exists leads cascade;
drop table if exists tickets cascade;
drop table if exists rules cascade;
drop table if exists users cascade;
