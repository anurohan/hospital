/**
 * Global TypeScript types for Arogyan Hospital SaaS
 */

// ─── User / Auth ─────────────────────────────────────────────────────────────

export type UserRole = "patient" | "doctor" | "nurse" | "admin" | "superadmin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  hospital_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface Patient {
  id: string;
  profile_id?: string;
  hospital_id: string;
  patient_uid: string; // e.g. ARG-2024-00001
  full_name: string;
  date_of_birth?: string;
  gender: Gender;
  blood_group: BloodGroup;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  allergies?: string[];
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  profile_id: string;
  hospital_id: string;
  doctor_uid: string; // e.g. ARG-DR-001
  full_name: string;
  specialization: string;
  department_id: string;
  qualification: string;
  experience_years: number;
  bio?: string;
  avatar_url?: string;
  consultation_fee?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  head_doctor_id?: string;
  is_active: boolean;
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType = "opd" | "follow_up" | "emergency" | "teleconsult";

export interface Appointment {
  id: string;
  hospital_id: string;
  appointment_uid: string; // e.g. ARG-APT-20240001
  patient_id: string;
  doctor_id: string;
  department_id: string;
  appointment_date: string;
  appointment_time: string;
  slot_id?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  consultation_fee?: number;
  payment_status?: "pending" | "paid" | "waived";
  created_at: string;
  updated_at: string;
  // Joins
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
}

// ─── Doctor Schedule ──────────────────────────────────────────────────────────

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  slot_duration_minutes: number;
  max_patients: number;
  is_active: boolean;
}

export interface AppointmentSlot {
  id: string;
  doctor_id: string;
  schedule_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  appointment_id?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "general";

export interface Notification {
  id: string;
  hospital_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─── Hospital Settings ────────────────────────────────────────────────────────

export interface HospitalSettings {
  id: string;
  hospital_id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  hospital_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
