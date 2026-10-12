import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { generateSlots, type DaySchedule, type SlotView } from "@/lib/booking/availability";
import { dayOfWeek, addMinutes } from "@/lib/booking/time";
import { ok, fail, normalizeDbError, type ServiceResult } from "./errors";
import type { Appointment, AppointmentStatus, BookingSource } from "@/types";

/** Current wall-clock date/time in a given IANA timezone. */
export function nowInTimeZone(tz: string): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${hour}:${parts.minute}` };
}

export interface AvailabilityResult {
  slots: SlotView[];
  closed: boolean; // doctor has no schedule that day
  slotMinutes: number;
}

/** Compute bookable slots for a doctor on an ISO date, honoring tz + existing bookings. */
export async function getAvailability(
  doctorId: string,
  isoDate: string,
  timezone = "Asia/Kolkata",
  minLeadMinutes = 0
): Promise<AvailabilityResult> {
  if (!isSupabaseConfigured()) {
    const daySchedule: DaySchedule = {
      start_time: "09:00",
      end_time: "17:00",
      slot_duration_minutes: 30,
      break_start: null,
      break_end: null,
      max_patients: null,
    };
    const now = nowInTimeZone(timezone);
    const slots = generateSlots(daySchedule, {
      nowIfToday: isoDate === now.date ? now.time : null,
      minLeadMinutes,
    });
    return { slots, closed: false, slotMinutes: 30 };
  }
  const supabase = await getServerClient();

  const dow = dayOfWeek(isoDate);
  const { data: schedule } = await supabase
    .from("doctor_schedules")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("day_of_week", dow)
    .eq("is_active", true)
    .maybeSingle();

  if (!schedule) return { slots: [], closed: true, slotMinutes: 0 };

  const { data: booked } = await supabase
    .from("appointments")
    .select("start_time,status")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", isoDate)
    .not("status", "in", "(cancelled,no_show)");

  const now = nowInTimeZone(timezone);
  const schedForEngine: DaySchedule = {
    start_time: (schedule.start_time as string).slice(0, 5),
    end_time: (schedule.end_time as string).slice(0, 5),
    slot_duration_minutes: schedule.slot_duration_minutes as number,
    break_start: schedule.break_start ? (schedule.break_start as string).slice(0, 5) : null,
    break_end: schedule.break_end ? (schedule.break_end as string).slice(0, 5) : null,
    max_patients: schedule.max_patients as number | null,
  };

  const slots = generateSlots(schedForEngine, {
    bookedStartTimes: (booked ?? []).map((b) => (b.start_time as string).slice(0, 5)),
    nowIfToday: isoDate === now.date ? now.time : null,
    minLeadMinutes,
  });

  return { slots, closed: false, slotMinutes: schedForEngine.slot_duration_minutes };
}

export interface BookInput {
  hospitalId: string;
  patientId: string;
  doctorId: string;
  departmentId?: string | null;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  slotMinutes: number;
  source: BookingSource;
  reason?: string;
  createdBy?: string | null;
  timezone?: string;
}

/** Book an appointment: re-validate availability server-side, then atomic RPC. */
export async function bookAppointment(input: BookInput): Promise<ServiceResult<Appointment>> {
  if (!isSupabaseConfigured()) {
    const mock: Appointment = {
      id: `demo-${Date.now()}`,
      hospital_id: input.hospitalId,
      appointment_uid: `DEMO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      patient_id: input.patientId,
      doctor_id: input.doctorId,
      department_id: input.departmentId ?? undefined,
      appointment_date: input.date,
      start_time: input.startTime,
      end_time: addMinutes(input.startTime, input.slotMinutes || 30),
      type: "opd",
      status: "confirmed",
      booking_source: input.source,
      token_number: `Q-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      reason: input.reason ?? undefined,
      consultation_fee: 0,
      payment_status: "pending",
      created_by: input.createdBy ?? undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return ok(mock);
  }
  const supabase = await getServerClient();

  // 1. Server-side availability re-check (never trust the client).
  const avail = await getAvailability(input.doctorId, input.date, input.timezone ?? "Asia/Kolkata");
  if (avail.closed) return fail("The doctor is not available on this date.", "CLOSED");

  const stillFree = avail.slots.some(
    (s) => s.start_time === input.startTime.slice(0, 5) && s.is_available
  );
  if (!stillFree) {
    return fail("That time slot is no longer available.", "SLOT_TAKEN");
  }

  const slotMinutes = input.slotMinutes || avail.slotMinutes;
  const endTime = addMinutes(input.startTime, slotMinutes);

  // 2. Atomic insert via RPC (unique index is the final race guard).
  const { data, error } = await supabase.rpc("book_appointment", {
    p_hospital_id: input.hospitalId,
    p_patient_id: input.patientId,
    p_doctor_id: input.doctorId,
    p_department_id: input.departmentId ?? null,
    p_date: input.date,
    p_start: input.startTime,
    p_end: endTime,
    p_type: "opd",
    p_source: input.source,
    p_reason: input.reason ?? null,
    p_created_by: input.createdBy ?? null,
  });

  if (error) {
    const n = normalizeDbError(error);
    return fail(n.error, n.code);
  }
  return ok(data as Appointment);
}

export async function cancelAppointment(
  appointmentId: string,
  reason: string,
  actorId: string | null
): Promise<ServiceResult<Appointment>> {
  if (!isSupabaseConfigured()) return fail("Database is not configured.", "NO_DB");
  const supabase = await getServerClient();
  const { data, error } = await supabase.rpc("cancel_appointment", {
    p_appointment_id: appointmentId,
    p_reason: reason,
    p_actor: actorId,
  });
  if (error) {
    const n = normalizeDbError(error);
    return fail(n.error, n.code);
  }
  return ok(data as Appointment);
}

const STATUS_TIMESTAMP: Partial<Record<AppointmentStatus, string>> = {
  waiting: "checked_in_at",
  in_consultation: "consultation_started_at",
  completed: "consultation_ended_at",
};

export async function updateStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<ServiceResult<Appointment>> {
  if (!isSupabaseConfigured()) return fail("Database is not configured.", "NO_DB");
  const supabase = await getServerClient();
  const patch: Record<string, unknown> = { status };
  const tsField = STATUS_TIMESTAMP[status];
  if (tsField) patch[tsField] = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", appointmentId)
    .select("*")
    .single();
  if (error) {
    const n = normalizeDbError(error);
    return fail(n.error, n.code);
  }
  return ok(data as Appointment);
}
