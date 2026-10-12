import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Department, Doctor, Patient, UserProfile, HospitalSetting } from "@/types";

/**
 * Admin-scoped reads. These rely on the admin RLS policies (is_admin) which
 * grant full visibility within the admin's hospital, including inactive rows.
 */

export async function adminListDepartments(hospitalId: string): Promise<Department[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("display_order", { ascending: true });
  return (data as Department[]) ?? [];
}

export async function adminListDoctors(hospitalId: string): Promise<Doctor[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("doctors")
    .select("*, department:departments(name)")
    .eq("hospital_id", hospitalId)
    .order("full_name", { ascending: true });
  return (data as Doctor[]) ?? [];
}

export async function adminListStaff(hospitalId: string): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("hospital_id", hospitalId)
    .in("role", ["receptionist", "doctor", "admin", "superadmin"])
    .order("full_name", { ascending: true });
  return (data as UserProfile[]) ?? [];
}

export async function adminListPatients(hospitalId: string, limit = 100): Promise<Patient[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Patient[]) ?? [];
}

export async function adminListSettings(hospitalId: string): Promise<HospitalSetting[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("hospital_settings")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("setting_key", { ascending: true });
  return (data as HospitalSetting[]) ?? [];
}
