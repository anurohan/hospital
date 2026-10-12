import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { nowInTimeZone } from "./appointments";
import { addMinutes } from "@/lib/booking/time";
import { ok, fail, normalizeDbError, type ServiceResult } from "./errors";
import type { Appointment } from "@/types";

const WITH_JOINS =
  "*, patient:patients(*), doctor:doctors(*), department:departments(*)";

export async function listPatientAppointments(patientId: string): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("appointments")
    .select(WITH_JOINS)
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false });
  return (data as Appointment[]) ?? [];
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getServerClient();
  const { data } = await supabase.from("appointments").select(WITH_JOINS).eq("id", id).maybeSingle();
  return (data as Appointment) ?? null;
}

export async function listDoctorAppointments(
  doctorId: string,
  isoDate: string
): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("appointments")
    .select(WITH_JOINS)
    .eq("doctor_id", doctorId)
    .eq("appointment_date", isoDate)
    .order("start_time", { ascending: true });
  return (data as Appointment[]) ?? [];
}

export async function listHospitalAppointments(
  hospitalId: string,
  isoDate: string
): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("appointments")
    .select(WITH_JOINS)
    .eq("hospital_id", hospitalId)
    .eq("appointment_date", isoDate)
    .order("start_time", { ascending: true });
  return (data as Appointment[]) ?? [];
}

/** Today's live queue: waiting + in_consultation, ordered by token then time. */
export async function getQueue(hospitalId: string, timezone = "Asia/Kolkata"): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const today = nowInTimeZone(timezone).date;
  const { data } = await supabase
    .from("appointments")
    .select(WITH_JOINS)
    .eq("hospital_id", hospitalId)
    .eq("appointment_date", today)
    .in("status", ["waiting", "in_consultation"])
    .order("token_number", { ascending: true });
  return (data as Appointment[]) ?? [];
}

/** Reschedule: move date/time if the new slot is free (unique index guards races). */
export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newStart: string,
  slotMinutes: number
): Promise<ServiceResult<Appointment>> {
  if (!isSupabaseConfigured()) return fail("Database is not configured.", "NO_DB");
  const supabase = await getServerClient();

  const { data: current } = await supabase
    .from("appointments")
    .select("reschedule_count")
    .eq("id", appointmentId)
    .maybeSingle();

  const { data, error } = await supabase
    .from("appointments")
    .update({
      appointment_date: newDate,
      start_time: newStart,
      end_time: addMinutes(newStart, slotMinutes),
      status: "confirmed",
      reschedule_count: ((current?.reschedule_count as number) ?? 0) + 1,
    })
    .eq("id", appointmentId)
    .select("*")
    .single();

  if (error) {
    const n = normalizeDbError(error);
    return fail(n.error, n.code);
  }
  return ok(data as Appointment);
}

/** Distinct patients this doctor has (or had) appointments with. */
export async function listDoctorPatients(doctorId: string): Promise<
  { id: string; full_name: string; patient_uid?: string; phone: string; last_visit: string }[]
> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("appointments")
    .select("appointment_date, patient:patients(id, full_name, patient_uid, phone)")
    .eq("doctor_id", doctorId)
    .order("appointment_date", { ascending: false });

  type Row = { appointment_date: string; patient: { id: string; full_name: string; patient_uid?: string; phone: string } | null };
  const rows = (data as unknown as Row[]) ?? [];
  const map = new Map<string, { id: string; full_name: string; patient_uid?: string; phone: string; last_visit: string }>();
  for (const r of rows) {
    if (!r.patient) continue;
    if (!map.has(r.patient.id)) {
      map.set(r.patient.id, { ...r.patient, last_visit: r.appointment_date });
    }
  }
  return [...map.values()];
}
