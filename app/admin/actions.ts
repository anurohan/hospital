"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { auditLog } from "@/lib/services/audit";
import { departmentSchema, doctorSchema, fieldErrors } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export interface AdminResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  info?: string;
}

async function ctx() {
  const session = await requireRole(["admin", "superadmin"]);
  const hospitalId = (await getActiveHospitalId()) ?? session.profile.hospital_id ?? null;
  return { session, hospitalId };
}

// ─── Departments ──────────────────────────────────────────────────────────────
export async function saveDepartment(_prev: AdminResult, formData: FormData): Promise<AdminResult> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId || !isSupabaseConfigured()) return { error: "Hospital not configured." };
  const id = String(formData.get("id") ?? "");
  const parsed = departmentSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const supabase = await getServerClient();
  const payload = {
    hospital_id: hospitalId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    display_order: parsed.data.displayOrder,
    is_active: parsed.data.isActive,
  };
  const res = id
    ? await supabase.from("departments").update(payload).eq("id", id)
    : await supabase.from("departments").insert(payload);
  if (res.error) return { error: "Could not save department (slug may already exist)." };

  await auditLog({ hospitalId, actorId: session.id, action: id ? "department.update" : "department.create", entityType: "department", entityId: id || null });
  revalidatePath("/admin/departments");
  return { ok: true, info: "Department saved." };
}

export async function toggleDepartment(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId) return;
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("active") ?? "") === "true";
  const supabase = await getServerClient();
  await supabase.from("departments").update({ is_active: next }).eq("id", id);
  await auditLog({ hospitalId, actorId: session.id, action: "department.toggle", entityType: "department", entityId: id, newData: { is_active: next } });
  revalidatePath("/admin/departments");
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export async function saveDoctor(_prev: AdminResult, formData: FormData): Promise<AdminResult> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId || !isSupabaseConfigured()) return { error: "Hospital not configured." };
  const id = String(formData.get("id") ?? "");
  const parsed = doctorSchema.safeParse({
    fullName: formData.get("fullName"),
    specialization: formData.get("specialization"),
    departmentId: formData.get("departmentId") || "",
    qualification: formData.get("qualification") || undefined,
    experienceYears: formData.get("experienceYears") ?? 0,
    consultationDuration: formData.get("consultationDuration") ?? 15,
    consultationFee: formData.get("consultationFee") || undefined,
    bio: formData.get("bio") || undefined,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const supabase = await getServerClient();
  const payload = {
    hospital_id: hospitalId,
    full_name: parsed.data.fullName,
    specialization: parsed.data.specialization,
    department_id: parsed.data.departmentId || null,
    qualification: parsed.data.qualification ?? null,
    experience_years: parsed.data.experienceYears,
    consultation_duration: parsed.data.consultationDuration,
    consultation_fee: parsed.data.consultationFee ?? null,
    bio: parsed.data.bio ?? null,
    is_active: parsed.data.isActive,
  };
  const res = id
    ? await supabase.from("doctors").update(payload).eq("id", id)
    : await supabase.from("doctors").insert(payload);
  if (res.error) return { error: "Could not save doctor." };

  await auditLog({ hospitalId, actorId: session.id, action: id ? "doctor.update" : "doctor.create", entityType: "doctor", entityId: id || null });
  revalidatePath("/admin/doctors");
  return { ok: true, info: "Doctor saved." };
}

export async function toggleDoctor(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId) return;
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("active") ?? "") === "true";
  const supabase = await getServerClient();
  await supabase.from("doctors").update({ is_active: next }).eq("id", id);
  await auditLog({ hospitalId, actorId: session.id, action: "doctor.toggle", entityType: "doctor", entityId: id, newData: { is_active: next } });
  revalidatePath("/admin/doctors");
}

// ─── Staff role management ──────────────────────────────────────────────────
export async function setStaffRole(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  const id = String(formData.get("profileId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!["receptionist", "doctor", "admin"].includes(role)) return;
  if (id === session.id) return; // never change your own role here
  const supabase = await getServerClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  await auditLog({ hospitalId, actorId: session.id, action: "staff.role", entityType: "profile", entityId: id, newData: { role } });
  revalidatePath("/admin/staff");
}

export async function toggleStaffActive(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  const id = String(formData.get("profileId") ?? "");
  const next = String(formData.get("active") ?? "") === "true";
  if (id === session.id) return;
  const supabase = await getServerClient();
  await supabase.from("profiles").update({ is_active: next }).eq("id", id);
  await auditLog({ hospitalId, actorId: session.id, action: "staff.active", entityType: "profile", entityId: id, newData: { is_active: next } });
  revalidatePath("/admin/staff");
}

// ─── Hospital settings ──────────────────────────────────────────────────────
export async function updateSetting(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId) return;
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "");
  if (!key) return;
  const supabase = await getServerClient();
  await supabase.from("hospital_settings").upsert(
    { hospital_id: hospitalId, setting_key: key, setting_value: value, updated_by: session.id },
    { onConflict: "hospital_id,setting_key" }
  );
  await auditLog({ hospitalId, actorId: session.id, action: "setting.update", entityType: "hospital_setting", newData: { key } });
  revalidatePath("/admin/settings");
}

// ─── Doctor schedules ─────────────────────────────────────────────────────────
export async function saveSchedule(_prev: AdminResult, formData: FormData): Promise<AdminResult> {
  const { session, hospitalId } = await ctx();
  if (!hospitalId || !isSupabaseConfigured()) return { error: "Hospital not configured." };
  const doctorId = String(formData.get("doctorId") ?? "");
  const day = String(formData.get("day") ?? "");
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  const slot = Number(formData.get("slot") ?? 15);
  const maxPatients = Number(formData.get("maxPatients") ?? 30);
  if (!doctorId || !day || !start || !end) return { error: "Fill in all schedule fields." };

  const supabase = await getServerClient();
  const { error } = await supabase.from("doctor_schedules").upsert(
    {
      doctor_id: doctorId, hospital_id: hospitalId, day_of_week: day,
      start_time: start, end_time: end, slot_duration_minutes: slot,
      max_patients: maxPatients, is_active: true,
    },
    { onConflict: "doctor_id,day_of_week" }
  );
  if (error) return { error: "Could not save schedule." };
  await auditLog({ hospitalId, actorId: session.id, action: "schedule.upsert", entityType: "doctor_schedule", entityId: doctorId });
  revalidatePath("/admin/schedules");
  return { ok: true, info: "Schedule saved." };
}

export async function deleteSchedule(formData: FormData): Promise<void> {
  const { session, hospitalId } = await ctx();
  const id = String(formData.get("id") ?? "");
  const supabase = await getServerClient();
  await supabase.from("doctor_schedules").delete().eq("id", id);
  await auditLog({ hospitalId, actorId: session.id, action: "schedule.delete", entityType: "doctor_schedule", entityId: id });
  revalidatePath("/admin/schedules");
}
