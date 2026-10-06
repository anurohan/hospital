-- ============================================================
-- Arogyan Hospital SaaS — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================
-- Run this against your Supabase project via the SQL editor
-- or Supabase CLI: supabase db push
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Hospitals ────────────────────────────────────────────────────────────────
-- Supports multi-tenant / white-label deployment
CREATE TABLE IF NOT EXISTS hospitals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  short_name    TEXT,
  tagline       TEXT,
  address_line1 TEXT,
  address_city  TEXT,
  address_state TEXT,
  address_pin   TEXT,
  phone         TEXT,
  emergency_phone TEXT,
  email         TEXT,
  map_url       TEXT,
  logo_url      TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Profiles (extends Supabase auth.users) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id),
  full_name   TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'patient'
                CHECK (role IN ('patient','doctor','nurse','admin','superadmin')),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Departments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  color           TEXT,
  head_doctor_id  UUID,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Doctors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  hospital_id      UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  doctor_uid       TEXT UNIQUE,
  full_name        TEXT NOT NULL,
  specialization   TEXT NOT NULL,
  department_id    UUID REFERENCES departments(id),
  qualification    TEXT,
  experience_years INTEGER DEFAULT 0,
  bio              TEXT,
  avatar_url       TEXT,
  consultation_fee NUMERIC(10,2),
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for department head after doctors table exists
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
  gender                  TEXT CHECK (gender IN ('Male','Female','Other','Prefer not to say')),
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
  day_of_week           TEXT NOT NULL
                          CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 15,
  max_patients          INTEGER NOT NULL DEFAULT 20,
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Appointment Slots ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointment_slots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id      UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
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
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id      UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  appointment_uid  TEXT UNIQUE,
  patient_id       UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id        UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  department_id    UUID REFERENCES departments(id),
  slot_id          UUID REFERENCES appointment_slots(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type             TEXT NOT NULL DEFAULT 'opd'
                     CHECK (type IN ('opd','follow_up','emergency','teleconsult')),
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled','no_show')),
  reason           TEXT,
  notes            TEXT,
  consultation_fee NUMERIC(10,2),
  payment_status   TEXT DEFAULT 'pending'
                     CHECK (payment_status IN ('pending','paid','waived')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Back-ref FK on slots
ALTER TABLE appointment_slots
  ADD CONSTRAINT fk_slots_appointment
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
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
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, setting_key)
);

-- ─── Audit Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_hospital         ON profiles(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_hospital         ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_phone            ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital          ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department        ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital     ON appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient      ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor       ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date         ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status       ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_slots_doctor_date         ON appointment_slots(doctor_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user        ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity         ON audit_logs(entity_type, entity_id);

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
  FOREACH t IN ARRAY ARRAY['profiles','patients','doctors','appointments']
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t, t
    );
  END LOOP;
END;
$$;

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────
-- Enable RLS on sensitive tables
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs       ENABLE ROW LEVEL SECURITY;

-- Basic policy: users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Patients: staff/admin can access, patients can view their own record
CREATE POLICY "Patients: self access"
  ON patients FOR SELECT
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor','nurse','admin','superadmin')
      AND p.hospital_id = patients.hospital_id
    )
  );

-- Notifications: own only
CREATE POLICY "Notifications: own only"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- Appointments: patient or staff
CREATE POLICY "Appointments: patient or staff"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients pat
      WHERE pat.id = appointments.patient_id
      AND pat.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor','nurse','admin','superadmin')
      AND p.hospital_id = appointments.hospital_id
    )
  );

-- ─── Seed: Arogyan Hospital record ───────────────────────────────────────────
INSERT INTO hospitals (slug, name, short_name, tagline, address_line1, address_city, address_state, address_pin, phone, emergency_phone, email, map_url)
VALUES (
  'arogyan-nursing-hospital',
  'Arogyan Nursing Hospital',
  'Arogyan',
  'Compassionate Care, Advanced Medicine',
  'Bishunganj',
  'Gaya',
  'Bihar',
  '823003',
  '+91 94730 75435',
  '+91 94730 75435',
  'info@arogyanhospital.com',
  'https://maps.app.goo.gl/DrhWnC5T2ssiExSF9'
)
ON CONFLICT (slug) DO NOTHING;
