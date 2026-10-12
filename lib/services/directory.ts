import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Department, Doctor, DoctorSchedule } from "@/types";

const DEMO_DEPARTMENTS: Department[] = [
  {
    id: "cardiology",
    hospital_id: "demo-hospital",
    name: "Cardiology",
    slug: "cardiology",
    description: "Demo department for local preview.",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "orthopedics",
    hospital_id: "demo-hospital",
    name: "Orthopedics",
    slug: "orthopedics",
    description: "Demo department for local preview.",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "neurology",
    hospital_id: "demo-hospital",
    name: "Neurology",
    slug: "neurology",
    description: "Demo department for local preview.",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_DOCTORS: Doctor[] = [
  {
    id: "doc-001",
    hospital_id: "demo-hospital",
    department_id: "cardiology",
    full_name: "Dr. Meera Shah",
    specialization: "Cardiologist",
    experience_years: 14,
    consultation_duration: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: DEMO_DEPARTMENTS[0],
  },
  {
    id: "doc-002",
    hospital_id: "demo-hospital",
    department_id: "orthopedics",
    full_name: "Dr. Arjun Nair",
    specialization: "Orthopedic Surgeon",
    experience_years: 12,
    consultation_duration: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: DEMO_DEPARTMENTS[1],
  },
  {
    id: "doc-003",
    hospital_id: "demo-hospital",
    department_id: "neurology",
    full_name: "Dr. Priya Sen",
    specialization: "Neurologist",
    experience_years: 10,
    consultation_duration: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: DEMO_DEPARTMENTS[2],
  },
];

/**
 * Public directory reads (departments & doctors). When Supabase is not yet
 * configured, we serve clearly-marked demo data so the application remains
 * navigable in preview mode without claiming a live DB connection.
 */

export async function listDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured()) return DEMO_DEPARTMENTS;
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return (data as Department[]) ?? [];
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  if (!isSupabaseConfigured()) {
    const match = DEMO_DEPARTMENTS.find((d) => d.slug === slug);
    return match ?? null;
  }
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("departments")
    .select("*, doctors(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as Department) ?? null;
}

export async function listDoctors(departmentId?: string): Promise<Doctor[]> {
  if (!isSupabaseConfigured()) {
    return departmentId ? DEMO_DOCTORS.filter((d) => d.department_id === departmentId) : DEMO_DOCTORS;
  }
  const supabase = await getServerClient();
  let query = supabase
    .from("doctors")
    .select("*, department:departments(*)")
    .eq("is_active", true)
    .order("full_name", { ascending: true });
  if (departmentId) query = query.eq("department_id", departmentId);
  const { data } = await query;
  return (data as Doctor[]) ?? [];
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_DOCTORS.find((d) => d.id === id) ?? null;
  }
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("doctors")
    .select("*, department:departments(*)")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  return (data as Doctor) ?? null;
}

export async function getDoctorSchedules(doctorId: string): Promise<DoctorSchedule[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("doctor_schedules")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("is_active", true);
  return (data as DoctorSchedule[]) ?? [];
}

export async function getDoctorByProfile(profileId: string): Promise<Doctor | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_DOCTORS.find((d) => d.profile_id === profileId) ?? null;
  }
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("doctors")
    .select("*, department:departments(*)")
    .eq("profile_id", profileId)
    .maybeSingle();
  return (data as Doctor) ?? null;
}
