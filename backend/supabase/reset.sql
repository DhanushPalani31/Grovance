-- Grovance database RESET — run this ONLY if you want to wipe everything
-- and start clean. Run this first, then run schema.sql fresh afterward.
--
-- WARNING: this deletes all data. Do not run against a database with
-- real data you want to keep.

drop table if exists activity_log cascade;
drop table if exists leads cascade;
