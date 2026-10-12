/**
 * Global TypeScript types for Arogyan Hospital SaaS
 * These types mirror the database schema defined in supabase/migrations/001_initial_schema.sql
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'admin' | 'superadmin';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'waiting'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingSource = 'online' | 'walk_in';

export type AppointmentType = 'opd' | 'follow_up' | 'emergency' | 'teleconsult';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type BloodGroup =
  | 'A+' | 'A-'
  | 'B+' | 'B-'
  | 'AB+' | 'AB-'
  | 'O+' | 'O-'
  | 'Unknown';

export type PaymentStatus = 'pending' | 'paid' | 'waived';

export type NotificationType =
  | 'appointment_booked'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'appointment_reminder'
  | 'queue_update'
  | 'general';

// ─── Database Entities ────────────────────────────────────────────────────────

export interface Hospital {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  tagline?: string;
  logo_url?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_pin?: string;
  address_country: string;
  phone?: string;
  emergency_phone?: string;
  email?: string;
  website?: string;
  map_url?: string;
  map_embed_url?: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  hospital_id?: string;
  full_name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image_url?: string;
  display_order: number;
  head_doctor_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joins
  doctors?: Doctor[];
  head_doctor?: Doctor;
}

export interface Doctor {
  id: string;
  profile_id?: string;
  hospital_id: string;
  department_id?: string;
  doctor_uid?: string;
  full_name: string;
  specialization: string;
  qualification?: string;
  experience_years: number;
  consultation_duration: number;
  consultation_fee?: number;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joins
  department?: Department;
  schedules?: DoctorSchedule[];
}

export interface Patient {
  id: string;
  profile_id?: string;
  hospital_id: string;
  patient_uid?: string;
  full_name: string;
  date_of_birth?: string;
  gender?: Gender;
  blood_group: string;
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

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  hospital_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  max_patients: number;
  break_start?: string;
  break_end?: string;
  is_active: boolean;
  created_at: string;
  // Joins
  doctor?: Doctor;
}

export interface AppointmentSlot {
  id: string;
  doctor_id: string;
  hospital_id: string;
  schedule_id?: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  appointment_id?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  hospital_id: string;
  appointment_uid?: string;
  patient_id: string;
  doctor_id: string;
  department_id?: string;
  slot_id?: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  booking_source: BookingSource;
  token_number?: string;
  reason?: string;
  notes?: string;
  consultation_fee?: number;
  payment_status: PaymentStatus;
  created_by?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  // Joins
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
}

export interface Notification {
  id: string;
  hospital_id?: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface HospitalSetting {
  id: string;
  hospital_id: string;
  setting_key: string;
  setting_value?: string;
  updated_by?: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  hospital_id?: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joins
  actor?: UserProfile;
}

// ─── API / Utility Types ──────────────────────────────────────────────────────

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

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// ─── Appointment Booking Types ────────────────────────────────────────────────

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_id?: string;
}

export interface BookingFormData {
  department_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  slot_id?: string;
  reason?: string;
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
}

// ─── Dashboard Stats Types ───────────────────────────────────────────────────

export interface DashboardStats {
  total_today: number;
  online_today: number;
  walkin_today: number;
  waiting: number;
  in_consultation: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface AnalyticsPeriod {
  start_date: string;
  end_date: string;
  label: string;
}

// ─── Queue Types ──────────────────────────────────────────────────────────────

export interface QueueEntry {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
  position: number;
  estimated_time?: string;
}
