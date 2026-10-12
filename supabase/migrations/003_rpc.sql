-- ============================================================
-- Arogyan Hospital SaaS — Migration 003: Booking RPC
-- ============================================================
-- Run AFTER 001 + 002. Idempotent (CREATE OR REPLACE).
--
-- Provides an atomic, concurrency-safe booking entrypoint. The app recomputes
-- availability on the server (lib/booking/availability.ts) before calling this;
-- the UNIQUE index uq_appointments_active_slot (migration 002) is the final
-- race guard. On a collision we raise a clean, catchable error.
--
-- SECURITY INVOKER (default): the caller's RLS INSERT policy still applies, so a
-- patient can only book for their own patient row, and staff for their hospital.
-- ============================================================

CREATE OR REPLACE FUNCTION book_appointment(
  p_hospital_id   UUID,
  p_patient_id    UUID,
  p_doctor_id     UUID,
  p_department_id UUID,
  p_date          DATE,
  p_start         TIME,
  p_end           TIME,
  p_type          appointment_type,
  p_source        booking_source,
  p_reason        TEXT,
  p_created_by    UUID
)
RETURNS appointments
LANGUAGE plpgsql
AS $$
DECLARE
  v_row appointments;
  v_fee NUMERIC(10,2);
BEGIN
  SELECT consultation_fee INTO v_fee FROM doctors WHERE id = p_doctor_id;

  INSERT INTO appointments (
    hospital_id, patient_id, doctor_id, department_id,
    appointment_date, start_time, end_time,
    type, status, booking_source, reason, consultation_fee, created_by
  ) VALUES (
    p_hospital_id, p_patient_id, p_doctor_id, p_department_id,
    p_date, p_start, p_end,
    COALESCE(p_type, 'opd'),
    CASE WHEN p_source = 'walk_in' THEN 'waiting' ELSE 'confirmed' END,
    COALESCE(p_source, 'online'),
    p_reason, v_fee, p_created_by
  )
  RETURNING * INTO v_row;

  RETURN v_row;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'SLOT_TAKEN: that time was just booked by someone else'
      USING ERRCODE = 'unique_violation';
END;
$$;

-- Cancel: frees the slot (status -> cancelled) with reason + actor.
CREATE OR REPLACE FUNCTION cancel_appointment(
  p_appointment_id UUID,
  p_reason TEXT,
  p_actor UUID
)
RETURNS appointments
LANGUAGE plpgsql
AS $$
DECLARE
  v_row appointments;
BEGIN
  UPDATE appointments
     SET status = 'cancelled',
         cancellation_reason = p_reason,
         cancelled_by = p_actor,
         cancelled_at = NOW()
   WHERE id = p_appointment_id
   RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: appointment % not found or not permitted', p_appointment_id;
  END IF;
  RETURN v_row;
END;
$$;
