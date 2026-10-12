-- ============================================================
-- Arogyan Hospital SaaS — Seed Data for Development
-- ============================================================
-- Run AFTER 001_initial_schema.sql
-- This creates demo departments, doctors, and schedules
-- ============================================================

-- Get the Arogyan hospital ID
DO $$
DECLARE
  h_id UUID;
BEGIN
  SELECT id INTO h_id FROM hospitals WHERE slug = 'arogyan-nursing-hospital';

  IF h_id IS NULL THEN
    RAISE EXCEPTION 'Hospital not found. Run 001_initial_schema.sql first.';
  END IF;

  -- ─── Departments ──────────────────────────────────────────────────────
  INSERT INTO departments (hospital_id, name, slug, description, icon, color, display_order, is_active) VALUES
    (h_id, 'General Medicine', 'general-medicine',
     'Comprehensive diagnosis and treatment for adult conditions including fever, infections, diabetes, hypertension, and chronic diseases.',
     'activity', '#0a6ebd', 1, TRUE),
    (h_id, 'Orthopaedics', 'orthopaedics',
     'Bone, joint, and muscle care with advanced surgical options. Treatment of fractures, sports injuries, and joint replacements.',
     'bone', '#7c3aed', 2, TRUE),
    (h_id, 'Gynaecology & Obstetrics', 'gynaecology',
     'Complete women''s health services including maternity care, reproductive medicine, and preventive screenings.',
     'heart', '#db2777', 3, TRUE),
    (h_id, 'Paediatrics', 'paediatrics',
     'Specialised care for infants, children, and adolescents covering growth monitoring, vaccinations, and childhood illnesses.',
     'baby', '#d97706', 4, TRUE),
    (h_id, 'General Surgery', 'general-surgery',
     'Minimally invasive and open surgical procedures including appendectomy, hernia repair, and gallbladder surgery.',
     'scissors', '#059669', 5, TRUE),
    (h_id, 'ENT', 'ent',
     'Ear, nose, and throat care for all age groups including hearing tests, sinus treatment, and tonsil surgery.',
     'ear', '#0284c7', 6, TRUE),
    (h_id, 'Dermatology', 'dermatology',
     'Skin, hair, and nail conditions including acne, eczema, psoriasis, and cosmetic dermatology.',
     'scan', '#8b5cf6', 7, TRUE),
    (h_id, 'Ophthalmology', 'ophthalmology',
     'Complete eye care services including vision correction, cataract surgery, and retinal treatment.',
     'eye', '#06b6d4', 8, TRUE)
  ON CONFLICT (hospital_id, slug) DO NOTHING;

  -- ─── Demo Doctors ─────────────────────────────────────────────────────
  -- NOTE: These are DEMO doctors for development. Replace with real data before production.
  INSERT INTO doctors (hospital_id, department_id, doctor_uid, full_name, specialization, qualification, experience_years, consultation_duration, consultation_fee, bio, is_active) VALUES
    (h_id, (SELECT id FROM departments WHERE slug = 'general-medicine' AND hospital_id = h_id),
     'ARO-DR-001', 'Dr. Rajesh Kumar', 'General Medicine',
     'MBBS, MD (Internal Medicine)', 15, 15, 500.00,
     'Senior physician with 15 years of experience in internal medicine. Specializes in chronic disease management.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'general-medicine' AND hospital_id = h_id),
     'ARO-DR-002', 'Dr. Priya Sharma', 'General Medicine',
     'MBBS, DNB (General Medicine)', 8, 15, 400.00,
     'Dedicated physician focused on preventive healthcare and lifestyle diseases.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'orthopaedics' AND hospital_id = h_id),
     'ARO-DR-003', 'Dr. Amit Singh', 'Orthopaedics',
     'MBBS, MS (Orthopaedics)', 12, 20, 600.00,
     'Expert orthopaedic surgeon specializing in joint replacements and sports injuries.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'gynaecology' AND hospital_id = h_id),
     'ARO-DR-004', 'Dr. Sunita Devi', 'Gynaecology & Obstetrics',
     'MBBS, MS (OBG), DGO', 18, 20, 500.00,
     'Senior gynaecologist with expertise in high-risk pregnancies and reproductive health.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'paediatrics' AND hospital_id = h_id),
     'ARO-DR-005', 'Dr. Vikram Patel', 'Paediatrics',
     'MBBS, MD (Paediatrics)', 10, 15, 400.00,
     'Child specialist with focus on neonatal care and childhood nutrition.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'general-surgery' AND hospital_id = h_id),
     'ARO-DR-006', 'Dr. Anand Verma', 'General Surgery',
     'MBBS, MS (General Surgery)', 14, 20, 700.00,
     'Experienced surgeon proficient in laparoscopic and minimally invasive techniques.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'ent' AND hospital_id = h_id),
     'ARO-DR-007', 'Dr. Neha Gupta', 'ENT',
     'MBBS, MS (ENT)', 7, 15, 400.00,
     'ENT specialist treating conditions of the ear, nose, and throat with modern techniques.', TRUE),

    (h_id, (SELECT id FROM departments WHERE slug = 'dermatology' AND hospital_id = h_id),
     'ARO-DR-008', 'Dr. Kavita Rao', 'Dermatology',
     'MBBS, MD (Dermatology)', 9, 15, 500.00,
     'Dermatologist specializing in skin allergies, cosmetic procedures, and laser treatments.', TRUE)
  ON CONFLICT (doctor_uid) DO NOTHING;

  -- ─── Doctor Schedules ─────────────────────────────────────────────────
  -- Dr. Rajesh Kumar — Mon-Sat, 9AM-1PM, 2PM-5PM (with lunch break)
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '09:00', '17:00', 15, 30, '13:00', '14:00', TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday','saturday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-001' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Priya Sharma — Mon-Fri, 10AM-4PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '10:00', '16:00', 15, 24, '13:00', '13:30', TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-002' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Amit Singh — Mon-Sat, 9AM-2PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '09:00', '14:00', 20, 15, NULL, NULL, TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday','saturday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-003' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Sunita Devi — Mon-Sat, 10AM-4PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '10:00', '16:00', 20, 18, '13:00', '13:30', TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday','saturday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-004' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Vikram Patel — Mon-Fri, 9AM-1PM, 4PM-6PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '09:00', '18:00', 15, 30, '13:00', '16:00', TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-005' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Anand Verma — Mon,Wed,Fri, 9AM-2PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '09:00', '14:00', 20, 15, NULL, NULL, TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','wednesday','friday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-006' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Neha Gupta — Tue,Thu,Sat, 10AM-3PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '10:00', '15:00', 15, 20, NULL, NULL, TRUE
  FROM doctors d,
       UNNEST(ARRAY['tuesday','thursday','saturday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-007' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- Dr. Kavita Rao — Mon-Fri, 11AM-5PM
  INSERT INTO doctor_schedules (doctor_id, hospital_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients, break_start, break_end, is_active)
  SELECT d.id, h_id, dow, '11:00', '17:00', 15, 24, '13:30', '14:00', TRUE
  FROM doctors d,
       UNNEST(ARRAY['monday','tuesday','wednesday','thursday','friday']::day_of_week[]) AS dow
  WHERE d.doctor_uid = 'ARO-DR-008' AND d.hospital_id = h_id
  ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

  -- ─── Default Hospital Settings ────────────────────────────────────────
  INSERT INTO hospital_settings (hospital_id, setting_key, setting_value) VALUES
    (h_id, 'opd_hours', 'Mon–Sat: 8:00 AM – 8:00 PM'),
    (h_id, 'emergency_hours', '24 × 7'),
    (h_id, 'pharmacy_hours', 'Mon–Sat: 8:00 AM – 9:00 PM'),
    (h_id, 'appointment_advance_days', '30'),
    (h_id, 'cancellation_hours_before', '2'),
    (h_id, 'allow_reschedule', 'true'),
    (h_id, 'max_reschedule_count', '2'),
    (h_id, 'walk_in_enabled', 'true'),
    (h_id, 'online_booking_enabled', 'true'),
    (h_id, 'auto_confirm_online', 'true'),
    (h_id, 'sms_notifications', 'false'),
    (h_id, 'email_notifications', 'false'),
    (h_id, 'whatsapp_notifications', 'false')
  ON CONFLICT (hospital_id, setting_key) DO NOTHING;

  RAISE NOTICE 'Seed data inserted successfully for hospital: %', h_id;
END;
$$;
