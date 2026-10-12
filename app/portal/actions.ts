"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import { getAppointment } from "@/lib/services/appointment-queries";
import { cancelAppointment } from "@/lib/services/appointments";
import { rescheduleAppointment } from "@/lib/services/appointment-queries";
import { getPatientForProfile } from "@/lib/services/patients";
import { markRead, markAllRead } from "@/lib/services/notifications";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getAvailability } from "@/lib/services/appointments";

export interface ActionResult {
  ok?: boolean;
  error?: string;
}

/** Verify the appointment belongs to the signed-in patient. */
async function assertOwnAppointment(appointmentId: string): Promise<string | null> {
  const session = await getSessionUser();
  if (!session) return "Not signed in.";
  const patient = await getPatientForProfile(session.id);
  if (!patient) return "No patient record.";
  const appt = await getAppointment(appointmentId);
  if (!appt || appt.patient_id !== patient.id) return "Appointment not found.";
  return null;
}

export async function cancelMyAppointment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("appointmentId") ?? "");
  const reason = String(formData.get("reason") ?? "Cancelled by patient");
  const err = await assertOwnAppointment(id);
  if (err) return { error: err };

  const session = await getSessionUser();
  const res = await cancelAppointment(id, reason, session?.id ?? null);
  if (!res.ok) return { error: res.error };
  revalidatePath("/portal/appointments");
  revalidatePath(`/portal/appointments/${id}`);
  return { ok: true };
}

export async function rescheduleMyAppointment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("appointmentId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const err = await assertOwnAppointment(id);
  if (err) return { error: err };
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const appt = await getAppointment(id);
  if (!appt) return { error: "Appointment not found." };

  // Re-validate the new slot server-side.
  const avail = await getAvailability(appt.doctor_id, date);
  if (avail.closed || !avail.slots.some((s) => s.start_time === startTime.slice(0, 5) && s.is_available)) {
    return { error: "That new time is not available. Please pick another." };
  }
  const res = await rescheduleAppointment(id, date, startTime, avail.slotMinutes);
  if (!res.ok) return { error: res.error };
  revalidatePath("/portal/appointments");
  revalidatePath(`/portal/appointments/${id}`);
  return { ok: true };
}

export async function updateMyProfile(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await getSessionUser();
  if (!session) return { error: "Not signed in." };
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const full_name = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (full_name.length < 2) return { error: "Please enter your full name." };

  const supabase = await getServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone })
    .eq("id", session.id);
  if (error) return { error: "Could not update your profile." };

  // Keep the linked patient record's contact details in sync if it exists.
  const patient = await getPatientForProfile(session.id);
  if (patient) {
    await supabase.from("patients").update({ full_name, phone }).eq("id", patient.id);
  }
  revalidatePath("/portal/profile");
  return { ok: true };
}

export async function markNotificationRead(formData: FormData): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  if (id) await markRead(id);
  revalidatePath("/portal/notifications");
}

export async function markAllNotificationsRead(): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;
  await markAllRead(session.id);
  revalidatePath("/portal/notifications");
}
