"use server";

import { getSessionUser } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getAvailability, bookAppointment } from "@/lib/services/appointments";
import { ensurePatientForProfile } from "@/lib/services/patients";
import { getDoctorById } from "@/lib/services/directory";
import { createNotification } from "@/lib/services/notifications";
import { isSupabaseConfigured } from "@/lib/env";
import { generateSlots } from "@/lib/booking/availability";
import type { SlotView } from "@/lib/booking/availability";

export interface SlotsResult {
  closed: boolean;
  slots: SlotView[];
  slotMinutes: number;
}

/** Fetch availability for a doctor+date (called from the booking wizard). */
export async function getSlotsAction(doctorId: string, date: string): Promise<SlotsResult> {
  if (!doctorId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { closed: true, slots: [], slotMinutes: 0 };
  }
  if (!isSupabaseConfigured()) {
    const slotMinutes = 30;
    const slots = generateSlots(
      { start_time: "09:00", end_time: "17:00", slot_duration_minutes: slotMinutes },
      { nowIfToday: date === new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()) ? new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }) : null }
    );
    return { closed: false, slots, slotMinutes };
  }
  const result = await getAvailability(doctorId, date);
  return { closed: result.closed, slots: result.slots, slotMinutes: result.slotMinutes };
}

export interface BookResult {
  ok?: boolean;
  needAuth?: boolean;
  error?: string;
  appointmentUid?: string;
  tokenNumber?: string | null;
}

/** Create an online appointment for the signed-in patient. */
export async function createBookingAction(input: {
  doctorId: string;
  departmentId?: string;
  date: string;
  startTime: string;
  reason?: string;
}): Promise<BookResult> {
  const session = await getSessionUser();
  if (!session) return { needAuth: true };
  if (session.profile.role !== "patient") {
    return { error: "Only patients can self-book here. Staff should use the reception desk." };
  }

  if (!isSupabaseConfigured()) {
    const uid = `DEMO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return {
      ok: true,
      appointmentUid: uid,
      tokenNumber: `Q-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    };
  }

  const hospitalId = (await getActiveHospitalId()) ?? session.profile.hospital_id ?? null;
  if (!hospitalId) return { error: "Hospital is not configured." };

  // Ensure this patient has a patient record (RLS ties it to their profile).
  const patientRes = await ensurePatientForProfile(
    session.id,
    hospitalId,
    session.profile.full_name,
    session.profile.phone ?? "",
    session.profile.email ?? null
  );
  if (!patientRes.ok) return { error: patientRes.error };

  const doctor = await getDoctorById(input.doctorId);
  const departmentId = input.departmentId || doctor?.department_id || null;

  const result = await bookAppointment({
    hospitalId,
    patientId: patientRes.data.id,
    doctorId: input.doctorId,
    departmentId,
    date: input.date,
    startTime: input.startTime,
    slotMinutes: 0, // resolved server-side from the schedule
    source: "online",
    reason: input.reason,
    createdBy: session.id,
  });

  if (!result.ok) return { error: result.error };

  await createNotification({
    hospitalId,
    userId: session.id,
    type: "appointment_booked",
    title: "Appointment booked",
    message: `Your appointment ${result.data.appointment_uid ?? ""} is confirmed.`,
    metadata: { appointment_id: result.data.id },
  });

  return {
    ok: true,
    appointmentUid: result.data.appointment_uid ?? undefined,
    tokenNumber: result.data.token_number ?? null,
  };
}
