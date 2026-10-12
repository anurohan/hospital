-- ============================================================
-- Arogyan Hospital SaaS — Complete Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================
-- Run this against your Supabase project via the SQL editor
-- or Supabase CLI: supabase db push
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Custom Types ────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient','receptionist','doctor','admin','superadmin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'pending','confirmed','waiting','in_consultation','completed','cancelled','no_show'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_source AS ENUM ('online','walk_in');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_type AS ENUM ('opd','follow_up','emergency','teleconsult');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE day_of_week AS ENUM (
    'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('Male','Female','Other','Prefer not to say');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending','paid','waived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Hospitals ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  short_name    TEXT,
  tagline       TEXT,
  logo_url      TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  address_city  TEXT,
  address_state TEXT,
  address_pin   TEXT,
  address_country TEXT DEFAULT 'India',
  phone         TEXT,
  emergency_phone TEXT,
  email         TEXT,
  website       TEXT,
  map_url       TEXT,
  map_embed_url TEXT,
  timezone      TEXT DEFAULT 'Asia/Kolkata',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Profiles (extends Supabase auth.users) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'patient',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Departments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  color           TEXT,
  image_url       TEXT,
  display_order   INTEGER DEFAULT 0,
  head_doctor_id  UUID,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, slug)
);

-- ─── Doctors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  hospital_id           UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id         UUID REFERENCES departments(id) ON DELETE SET NULL,
  doctor_uid            TEXT UNIQUE,
  full_name             TEXT NOT NULL,
  specialization        TEXT NOT NULL,
  qualification         TEXT,
  experience_years      INTEGER DEFAULT 0,
  consultation_duration INTEGER DEFAULT 15,
  consultation_fee      NUMERIC(10,2),
  bio                   TEXT,
  avatar_url            TEXT,
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for department head after doctors table exists
ALTER TABLE departments
  DROP CONSTRAINT IF EXISTS fk_departments_head_doctor;
ALTER TABLE departments
  ADD CONSTRAINT fk_departments_head_doctor
  FOREIGN KEY (head_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

-- ─── Patients ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id              UUID REFERENCES profiles(id) ON DELETE SET NULL,
  hospital_id             UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  patient_uid             TEXT UNIQUE,
  full_name               TEXT NOT NULL,
  date_of_birth           DATE,
  gender                  gender_type,
  blood_group             TEXT DEFAULT 'Unknown',
  phone                   TEXT NOT NULL,
  email                   TEXT,
  address                 TEXT,
  city                    TEXT,
  state                   TEXT,
  pincode                 TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  allergies               TEXT[],
  notes                   TEXT,
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Doctor Schedules ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id             UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  hospital_id           UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  day_of_week           day_of_week NOT NULL,
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 15,
  max_patients          INTEGER DEFAULT 30,
  break_start           TIME,
  break_end             TIME,
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week)
);

-- ─── Appointment Slots ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointment_slots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id      UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  hospital_id    UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  schedule_id    UUID REFERENCES doctor_schedules(id) ON DELETE SET NULL,
  slot_date      DATE NOT NULL,
  start_time     TIME NOT NULL,
  end_time       TIME NOT NULL,
  is_booked      BOOLEAN DEFAULT FALSE,
  appointment_id UUID,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, slot_date, start_time)
);

-- ─── Appointments ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id         UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  appointment_uid     TEXT UNIQUE,
  patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id           UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
  slot_id             UUID REFERENCES appointment_slots(id) ON DELETE SET NULL,
  appointment_date    DATE NOT NULL,
  start_time          TIME NOT NULL,
  end_time            TIME,
  type                appointment_type NOT NULL DEFAULT 'opd',
  status              appointment_status NOT NULL DEFAULT 'pending',
  booking_source      booking_source NOT NULL DEFAULT 'online',
  token_number        TEXT,
  reason              TEXT,
  notes               TEXT,
  consultation_fee    NUMERIC(10,2),
  payment_status      payment_status DEFAULT 'pending',
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cancelled_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  cancelled_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Back-ref FK on slots
ALTER TABLE appointment_slots
  DROP CONSTRAINT IF EXISTS fk_slots_appointment;
ALTER TABLE appointment_slots
  ADD CONSTRAINT fk_slots_appointment
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Hospital Settings ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospital_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id   UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  setting_key   TEXT NOT NULL,
  setting_value TEXT,
  updated_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, setting_key)
);

-- ─── Audit Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_hospital           ON profiles(hospital_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role               ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_hospital           ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_phone              ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_uid                ON patients(patient_uid);
CREATE INDEX IF NOT EXISTS idx_patients_profile            ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital            ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department          ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctors_profile             ON doctors(profile_id);
CREATE INDEX IF NOT EXISTS idx_departments_hospital        ON departments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_departments_slug            ON departments(hospital_id, slug);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor            ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_hospital          ON doctor_schedules(hospital_id);
CREATE INDEX IF NOT EXISTS idx_slots_doctor_date           ON appointment_slots(doctor_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_hospital              ON appointment_slots(hospital_id);
CREATE INDEX IF NOT EXISTS idx_slots_booked                ON appointment_slots(is_booked) WHERE is_booked = FALSE;
CREATE INDEX IF NOT EXISTS idx_appointments_hospital       ON appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient        ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor         ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date           ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status         ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_uid            ON appointments(appointment_uid);
CREATE INDEX IF NOT EXISTS idx_appointments_source         ON appointments(booking_source);
CREATE INDEX IF NOT EXISTS idx_appointments_token          ON appointments(hospital_id, appointment_date, token_number);
CREATE INDEX IF NOT EXISTS idx_notifications_user          ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_hospital      ON notifications(hospital_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity           ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor            ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_hospital         ON audit_logs(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospital_settings_hospital  ON hospital_settings(hospital_id);

-- ─── Updated_at trigger function ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['hospitals','profiles','patients','doctors','departments','appointments']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %s', t, t
    );
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t, t
    );
  END LOOP;
END;
$$;

-- ─── Appointment UID generation function ──────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_appointment_uid()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  -- Get hospital short prefix
  SELECT COALESCE(short_name, 'HSP') INTO prefix FROM hospitals WHERE id = NEW.hospital_id;
  prefix := UPPER(LEFT(REGEXP_REPLACE(prefix, '[^a-zA-Z]', '', 'g'), 3));
  IF prefix = '' THEN prefix := 'HSP'; END IF;

  today_str := TO_CHAR(NEW.appointment_date, 'YYYYMMDD');

  -- Get next sequence for this hospital+date
  SELECT COUNT(*) + 1 INTO seq_num
  FROM appointments
  WHERE hospital_id = NEW.hospital_id
    AND appointment_date = NEW.appointment_date;

  NEW.appointment_uid := prefix || '-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_appointment_uid ON appointments;
CREATE TRIGGER trg_appointment_uid
  BEFORE INSERT ON appointments
  FOR EACH ROW
  WHEN (NEW.appointment_uid IS NULL)
  EXECUTE FUNCTION generate_appointment_uid();

-- ─── Patient UID generation function ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_patient_uid()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  yr TEXT;
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(short_name, 'HSP') INTO prefix FROM hospitals WHERE id = NEW.hospital_id;
  prefix := UPPER(LEFT(REGEXP_REPLACE(prefix, '[^a-zA-Z]', '', 'g'), 3));
  IF prefix = '' THEN prefix := 'HSP'; END IF;

  yr := TO_CHAR(NOW(), 'YYYY');

  SELECT COUNT(*) + 1 INTO seq_num
  FROM patients
  WHERE hospital_id = NEW.hospital_id;

  NEW.patient_uid := prefix || '-' || yr || '-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_patient_uid ON patients;
CREATE TRIGGER trg_patient_uid
  BEFORE INSERT ON patients
  FOR EACH ROW
  WHEN (NEW.patient_uid IS NULL)
  EXECUTE FUNCTION generate_patient_uid();

-- ─── Token generation function ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_token_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
  prefix TEXT;
BEGIN
  -- Count today's appointments for this hospital to generate sequential token
  SELECT COUNT(*) + 1 INTO seq_num
  FROM appointments
  WHERE hospital_id = NEW.hospital_id
    AND appointment_date = NEW.appointment_date
    AND token_number IS NOT NULL;

  -- Prefix based on booking source
  IF NEW.booking_source = 'walk_in' THEN
    prefix := 'W';
  ELSE
    prefix := 'A';
  END IF;

  NEW.token_number := prefix || '-' || LPAD(seq_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_token_number ON appointments;
CREATE TRIGGER trg_token_number
  BEFORE INSERT ON appointments
  FOR EACH ROW
  WHEN (NEW.token_number IS NULL)
  EXECUTE FUNCTION generate_token_number();

-- ─── Auto-create profile on auth signup ──────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────

-- Enable RLS on ALL sensitive tables
ALTER TABLE hospitals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots  ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;

-- ─── Helper: check if current user has a staff role ──────────────────────────
CREATE OR REPLACE FUNCTION is_staff(check_hospital_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('receptionist','doctor','admin','superadmin')
      AND is_active = TRUE
      AND (check_hospital_id IS NULL OR hospital_id = check_hospital_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin(check_hospital_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin','superadmin')
      AND is_active = TRUE
      AND (check_hospital_id IS NULL OR hospital_id = check_hospital_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_hospital_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT hospital_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ─── RLS: hospitals ──────────────────────────────────────────────────────────
-- Public can read active hospitals
CREATE POLICY "Hospitals: public read" ON hospitals
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Hospitals: admin update" ON hospitals
  FOR UPDATE USING (is_admin(id));

-- ─── RLS: profiles ──────────────────────────────────────────────────────────
CREATE POLICY "Profiles: read own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Profiles: staff read hospital" ON profiles
  FOR SELECT USING (
    is_staff(hospital_id)
  );

CREATE POLICY "Profiles: update own" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Profiles: admin update" ON profiles
  FOR UPDATE USING (is_admin(hospital_id));

CREATE POLICY "Profiles: insert own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ─── RLS: departments ────────────────────────────────────────────────────────
-- Public read (for appointment booking)
CREATE POLICY "Departments: public read active" ON departments
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Departments: admin manage" ON departments
  FOR ALL USING (is_admin(hospital_id));

-- ─── RLS: doctors ────────────────────────────────────────────────────────────
-- Public read active doctors (for booking)
CREATE POLICY "Doctors: public read active" ON doctors
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Doctors: admin manage" ON doctors
  FOR ALL USING (is_admin(hospital_id));

CREATE POLICY "Doctors: self read" ON doctors
  FOR SELECT USING (profile_id = auth.uid());

-- ─── RLS: patients ──────────────────────────────────────────────────────────
CREATE POLICY "Patients: self read" ON patients
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Patients: staff read hospital" ON patients
  FOR SELECT USING (is_staff(hospital_id));

CREATE POLICY "Patients: self insert" ON patients
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    OR is_staff(hospital_id)
  );

CREATE POLICY "Patients: self update" ON patients
  FOR UPDATE USING (
    profile_id = auth.uid()
    OR is_staff(hospital_id)
  );

CREATE POLICY "Patients: admin delete" ON patients
  FOR DELETE USING (is_admin(hospital_id));

-- ─── RLS: doctor_schedules ──────────────────────────────────────────────────
CREATE POLICY "Schedules: public read active" ON doctor_schedules
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Schedules: admin manage" ON doctor_schedules
  FOR ALL USING (is_admin(hospital_id));

CREATE POLICY "Schedules: doctor self read" ON doctor_schedules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM doctors d WHERE d.id = doctor_id AND d.profile_id = auth.uid())
  );

-- ─── RLS: appointment_slots ─────────────────────────────────────────────────
-- Anyone can read slots (needed for booking UI)
CREATE POLICY "Slots: public read" ON appointment_slots
  FOR SELECT USING (TRUE);

CREATE POLICY "Slots: staff manage" ON appointment_slots
  FOR ALL USING (is_staff(hospital_id));

-- ─── RLS: appointments ──────────────────────────────────────────────────────
-- Patient can see own appointments
CREATE POLICY "Appointments: patient read own" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Staff can see hospital appointments
CREATE POLICY "Appointments: staff read hospital" ON appointments
  FOR SELECT USING (is_staff(hospital_id));

-- Doctor can see own appointments
CREATE POLICY "Appointments: doctor read own" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors d
      WHERE d.id = doctor_id AND d.profile_id = auth.uid()
    )
  );

-- Patient can create own appointments
CREATE POLICY "Appointments: patient insert" ON appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
    OR is_staff(hospital_id)
  );

-- Patient can update own (for cancellation)
CREATE POLICY "Appointments: patient update own" ON appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Staff can update hospital appointments
CREATE POLICY "Appointments: staff update" ON appointments
  FOR UPDATE USING (is_staff(hospital_id));

-- Admin can delete
CREATE POLICY "Appointments: admin delete" ON appointments
  FOR DELETE USING (is_admin(hospital_id));

-- ─── RLS: notifications ─────────────────────────────────────────────────────
CREATE POLICY "Notifications: own read" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Notifications: own update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Notifications: staff insert" ON notifications
  FOR INSERT WITH CHECK (is_staff(hospital_id) OR user_id = auth.uid());

-- ─── RLS: hospital_settings ─────────────────────────────────────────────────
CREATE POLICY "Settings: staff read" ON hospital_settings
  FOR SELECT USING (is_staff(hospital_id));

CREATE POLICY "Settings: admin manage" ON hospital_settings
  FOR ALL USING (is_admin(hospital_id));

-- ─── RLS: audit_logs ────────────────────────────────────────────────────────
CREATE POLICY "Audit: admin read" ON audit_logs
  FOR SELECT USING (is_admin(hospital_id));

CREATE POLICY "Audit: system insert" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ─── Seed: Arogyan Hospital record ───────────────────────────────────────────
INSERT INTO hospitals (
  slug, name, short_name, tagline,
  address_line1, address_city, address_state, address_pin, address_country,
  phone, emergency_phone, email, map_url, timezone
)
VALUES (
  'arogyan-nursing-hospital',
  'Arogyan Nursing Hospital',
  'Arogyan',
  'Compassionate Care, Advanced Medicine',
  'Bishunganj', 'Gaya', 'Bihar', '823003', 'India',
  '+91 94730 75435', '+91 94730 75435',
  'info@arogyanhospital.com',
  'https://maps.app.goo.gl/DrhWnC5T2ssiExSF9',
  'Asia/Kolkata'
)
ON CONFLICT (slug) DO NOTHING;
