import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { ok, fail, normalizeDbError, type ServiceResult } from "./errors";
import type { Patient, Gender } from "@/types";

export async function getPatientForProfile(profileId: string): Promise<Patient | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();
  return (data as Patient) ?? null;
}

export async function getPatient(id: string): Promise<Patient | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getServerClient();
  const { data } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
  return (data as Patient) ?? null;
}

export interface PatientInput {
  hospitalId: string;
  profileId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

/** Create a patient record (patient_uid is assigned by a DB trigger). */
export async function createPatient(input: PatientInput): Promise<ServiceResult<Patient>> {
  if (!isSupabaseConfigured()) return fail("Database is not configured.", "NO_DB");
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("patients")
    .insert({
      hospital_id: input.hospitalId,
      profile_id: input.profileId ?? null,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email ?? null,
      gender: input.gender ?? null,
      date_of_birth: input.dateOfBirth ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      pincode: input.pincode ?? null,
    })
    .select("*")
    .single();
  if (error) {
    const n = normalizeDbError(error);
    return fail(n.error, n.code);
  }
  return ok(data as Patient);
}

/** Find the caller's own patient row, creating one if absent (self-booking). */
export async function ensurePatientForProfile(
  profileId: string,
  hospitalId: string,
  fullName: string,
  phone: string,
  email?: string | null
): Promise<ServiceResult<Patient>> {
  const existing = await getPatientForProfile(profileId);
  if (existing) return ok(existing);
  return createPatient({ hospitalId, profileId, fullName, phone, email });
}

/** Reception patient search by name / phone / UID within the hospital. */
export async function searchPatients(hospitalId: string, query: string): Promise<Patient[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];
  const supabase = await getServerClient();
  const q = query.trim().replace(/[%,]/g, "");
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("hospital_id", hospitalId)
    .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,patient_uid.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(25);
  return (data as Patient[]) ?? [];
}
