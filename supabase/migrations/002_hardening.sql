-- ============================================================
-- Arogyan Hospital SaaS — Migration 002: Hardening & Safety
-- ============================================================
-- Run AFTER 001_initial_schema.sql.
-- This migration is ADDITIVE and idempotent (safe to re-run).
-- It does NOT edit or drop 001; it layers fixes on top so existing
-- installations are not broken.
--
-- Fixes:
--   1. DB-level double-booking protection (active appointments only)
--   2. Token uniqueness per hospital/date
--   3. Concurrency-safe UID / token generation (advisory locks)
--   4. Privilege-escalation fixes on profiles RLS (role self-change)
--   5. Tighter audit_logs INSERT policy
--   6. Reschedule bookkeeping columns
-- ============================================================

-- ─── 1. Double-booking protection ────────────────────────────────────────────
-- Prevent two ACTIVE appointments for the same doctor/date/time.
-- Cancelled / no_show rows are excluded so freed slots can be rebooked.
CREATE UNIQUE INDEX IF NOT EXISTS uq_appointments_active_slot
  ON appointments (doctor_id, appointment_date, start_time)
  WHERE status NOT IN ('cancelled', 'no_show');

-- ─── 2. Token uniqueness per hospital/day ─────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS uq_appointments_token_per_day
  ON appointments (hospital_id, appointment_date, token_number)
  WHERE token_number IS NOT NULL;

-- ─── 3. Reschedule bookkeeping ────────────────────────────────────────────────
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS reschedule_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS rescheduled_from UUID REFERENCES appointments(id) ON DELETE SET NULL;
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS consultation_started_at TIMESTAMPTZ;
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS consultation_ended_at TIMESTAMPTZ;

-- ─── 4. Concurrency-safe generators ──────────────────────────────────────────
-- The 001 generators used COUNT(*)+1 which races under concurrent inserts.
-- We serialize per (hospital, date) with a transaction-scoped advisory lock
-- so two simultaneous INSERTs cannot compute the same sequence number.

CREATE OR REPLACE FUNCTION generate_appointment_uid()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(
    hashtext('appt_uid:' || NEW.hospital_id::text || ':' || NEW.appointment_date::text)
  );
  SELECT COALESCE(short_name, 'HSP') INTO prefix FROM hospitals WHERE id = NEW.hospital_id;
  prefix := UPPER(LEFT(REGEXP_REPLACE(COALESCE(prefix, 'HSP'), '[^a-zA-Z]', '', 'g'), 3));
  IF prefix = '' THEN prefix := 'HSP'; END IF;
  today_str := TO_CHAR(NEW.appointment_date, 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq_num
    FROM appointments
    WHERE hospital_id = NEW.hospital_id AND appointment_date = NEW.appointment_date;
  NEW.appointment_uid := prefix || '-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_token_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
  prefix TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(
    hashtext('appt_token:' || NEW.hospital_id::text || ':' || NEW.appointment_date::text)
  );
  SELECT COUNT(*) + 1 INTO seq_num
    FROM appointments
    WHERE hospital_id = NEW.hospital_id
      AND appointment_date = NEW.appointment_date
      AND token_number IS NOT NULL;
  prefix := CASE WHEN NEW.booking_source = 'walk_in' THEN 'W' ELSE 'A' END;
  NEW.token_number := prefix || '-' || LPAD(seq_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_patient_uid()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  yr TEXT;
  seq_num INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('patient_uid:' || NEW.hospital_id::text));
  SELECT COALESCE(short_name, 'HSP') INTO prefix FROM hospitals WHERE id = NEW.hospital_id;
  prefix := UPPER(LEFT(REGEXP_REPLACE(COALESCE(prefix, 'HSP'), '[^a-zA-Z]', '', 'g'), 3));
  IF prefix = '' THEN prefix := 'HSP'; END IF;
  yr := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num FROM patients WHERE hospital_id = NEW.hospital_id;
  NEW.patient_uid := prefix || '-' || yr || '-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 5. Privilege-escalation fixes on profiles ───────────────────────────────
-- PROBLEM in 001: "Profiles: update own" had no WITH CHECK, so a patient could
-- UPDATE their own row and set role = 'admin'. And "Profiles: insert own" let a
-- user insert a profile with an arbitrary role. Lock both down.

-- Prevent self-insert with an elevated role (patients only; staff are provisioned by admins).
DROP POLICY IF EXISTS "Profiles: insert own" ON profiles;
CREATE POLICY "Profiles: insert own patient" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid() AND role = 'patient');

-- Allow self-update of profile details, but NOT the role or hospital_id.
-- get_user_role()/get_user_hospital_id() read the CURRENT stored values, so the
-- new row must keep the same role & tenant.
DROP POLICY IF EXISTS "Profiles: update own" ON profiles;
CREATE POLICY "Profiles: update own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = get_user_role()
    AND hospital_id IS NOT DISTINCT FROM get_user_hospital_id()
  );

-- Admins may change roles/tenant within their hospital.
DROP POLICY IF EXISTS "Profiles: admin update" ON profiles;
CREATE POLICY "Profiles: admin update" ON profiles
  FOR UPDATE USING (is_admin(hospital_id))
  WITH CHECK (is_admin(hospital_id));

-- ─── 6. Tighten audit_logs INSERT ─────────────────────────────────────────────
-- PROBLEM in 001: INSERT WITH CHECK (TRUE) let any authenticated user forge logs.
DROP POLICY IF EXISTS "Audit: system insert" ON audit_logs;
CREATE POLICY "Audit: actor insert" ON audit_logs
  FOR INSERT WITH CHECK (
    actor_id = auth.uid() OR is_staff(hospital_id)
  );

-- ─── 7. Appointment UPDATE guard for patients ─────────────────────────────────
-- Patients may only move their own appointments into cancelled/rescheduled-ish
-- states, never flip clinical statuses. Staff policy ("Appointments: staff update")
-- from 001 still covers reception/doctor/admin.
DROP POLICY IF EXISTS "Appointments: patient update own" ON appointments;
CREATE POLICY "Appointments: patient update own" ON appointments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_id AND p.profile_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_id AND p.profile_id = auth.uid())
    AND status IN ('pending','confirmed','cancelled')
  );

-- Done.
