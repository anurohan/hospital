-- ============================================================
-- Arogyan Hospital SaaS — Read-only verification script
-- ============================================================
-- Run in the Supabase SQL editor AFTER applying 001 + 002.
-- It only SELECTs; it changes nothing. Use it to confirm the
-- database is in the expected state before trusting the app.
-- ============================================================

-- 1. All expected tables exist
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'hospitals','profiles','patients','departments','doctors',
    'doctor_schedules','appointment_slots','appointments',
    'notifications','hospital_settings','audit_logs'
  )
ORDER BY tablename;

-- 2. RLS is ENABLED on every sensitive table (rowsecurity must be true)
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relkind = 'r'
  AND relname IN (
    'hospitals','profiles','patients','departments','doctors',
    'doctor_schedules','appointment_slots','appointments',
    'notifications','hospital_settings','audit_logs'
  )
ORDER BY relname;

-- 3. Policies present per table
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- 4. Double-booking + token-uniqueness indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN ('uq_appointments_active_slot', 'uq_appointments_token_per_day');

-- 5. Hardening columns exist on appointments
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'appointments'
  AND column_name IN (
    'reschedule_count','rescheduled_from','checked_in_at',
    'consultation_started_at','consultation_ended_at'
  )
ORDER BY column_name;

-- 6. Seed sanity: hospital + departments + doctors counts
SELECT
  (SELECT COUNT(*) FROM hospitals)   AS hospitals,
  (SELECT COUNT(*) FROM departments) AS departments,
  (SELECT COUNT(*) FROM doctors)     AS doctors,
  (SELECT COUNT(*) FROM doctor_schedules) AS schedules;

-- 7. Triggers present
SELECT tgname, tgrelid::regclass AS table_name
FROM pg_trigger
WHERE NOT tgisinternal
  AND tgrelid::regclass::text IN ('appointments','patients','auth.users')
ORDER BY table_name, tgname;
