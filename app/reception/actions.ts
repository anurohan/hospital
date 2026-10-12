"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { updateStatus, cancelAppointment, bookAppointment, getAvailability, nowInTimeZone } from "@/lib/services/appointments";
import { createPatient } from "@/lib/services/patients";
import { searchPatients } from "@/lib/services/patients";
import type { Patient } from "@/types";
import { auditLog } from "@/lib/services/audit";
import { patientSchema, fieldErrors } from "@/lib/validation";
import type { AppointmentStatus } from "@/types";

export interface StaffResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  info?: string;
}

const ALLOWED: AppointmentStatus[] = ["waiting", "in_consultation", "completed", "no_show", "confirmed"];

/** One-click status change (used in plain <form action>). Revalidates on success. */
export async function setStatus(formData: FormData): Promise<void> {
  const session = await requireStaff();
  const id = String(formData.get("appointmentId") ?? "");
  const status = String(formData.get("status") ?? "") as AppointmentStatus;
  if (!ALLOWED.includes(status)) return;

  const res = await updateStatus(id, status);
  if (!res.ok) return;
  await auditLog({
    hospitalId: session.profile.hospital_id,
    actorId: session.id,
    action: `appointment.status.${status}`,
    entityType: "appointment",
    entityId: id,
  });
  revalidatePath("/reception/queue");
  revalidatePath("/reception/appointments");
  revalidatePath("/doctor");
  revalidatePath("/doctor/appointments");
}

export async function cancelAsStaff(formData: FormData): Promise<void> {
  const session = await requireStaff();
  const id = String(formData.get("appointmentId") ?? "");
  const reason = String(formData.get("reason") ?? "Cancelled at reception");
  const res = await cancelAppointment(id, reason, session.id);
  if (!res.ok) return;
  revalidatePath("/reception/appointments");
  revalidatePath("/reception/queue");
}

export async function registerPatient(_prev: StaffResult, formData: FormData): Promise<StaffResult> {
  const session = await requireStaff();
  const parsed = patientSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    gender: formData.get("gender") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || "",
    address: formData.get("address") || "",
    city: formData.get("city") || "",
    state: formData.get("state") || "",
    pincode: formData.get("pincode") || "",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const hospitalId = (await getActiveHospitalId()) ?? session.profile.hospital_id ?? null;
  if (!hospitalId) return { error: "Hospital not configured." };

  const res = await createPatient({
    hospitalId,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    gender: parsed.data.gender ?? null,
    dateOfBirth: parsed.data.dateOfBirth || null,
    address: parsed.data.address || null,
    city: parsed.data.city || null,
    state: parsed.data.state || null,
    pincode: parsed.data.pincode || null,
  });
  if (!res.ok) return { error: res.error };
  await auditLog({ hospitalId, actorId: session.id, action: "patient.create", entityType: "patient", entityId: res.data.id });
  revalidatePath("/reception/patients");
  return { ok: true, info: `Registered ${res.data.full_name} (${res.data.patient_uid ?? "new"}).` };
}

/** Register a walk-in: books the earliest available slot today for the doctor. */
export async function bookWalkIn(_prev: StaffResult, formData: FormData): Promise<StaffResult> {
  const session = await requireStaff();
  const patientId = String(formData.get("patientId") ?? "");
  const doctorId = String(formData.get("doctorId") ?? "");
  const reason = String(formData.get("reason") ?? "") || undefined;
  if (!patientId || !doctorId) return { error: "Select a patient and a doctor." };

  const hospitalId = (await getActiveHospitalId()) ?? session.profile.hospital_id ?? null;
  if (!hospitalId) return { error: "Hospital not configured." };

  const today = nowInTimeZone("Asia/Kolkata").date;
  const avail = await getAvailability(doctorId, today);
  if (avail.closed) return { error: "The doctor has no clinic today." };
  const next = avail.slots.find((s) => s.is_available);
  if (!next) return { error: "No open slots left for this doctor today." };

  const res = await bookAppointment({
    hospitalId, patientId, doctorId, date: today, startTime: next.start_time,
    slotMinutes: avail.slotMinutes, source: "walk_in", reason, createdBy: session.id,
  });
  if (!res.ok) return { error: res.error };
  revalidatePath("/reception/queue");
  revalidatePath("/reception/appointments");
  return { ok: true, info: `Walk-in booked. Token ${res.data.token_number ?? "—"} at ${next.start_time}.` };
}

/** Patient search for the reception desk (name / phone / UID). */
export async function searchPatientsAction(query: string): Promise<Patient[]> {
  const session = await requireStaff();
  const hospitalId = (await getActiveHospitalId()) ?? session.profile.hospital_id ?? null;
  if (!hospitalId) return [];
  return searchPatients(hospitalId, query);
}
