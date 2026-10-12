import { z } from "zod";

/** Shared zod validation schemas for forms + server actions. */

const phone = z
  .string()
  .trim()
  .min(10, "Enter a valid phone number")
  .max(20)
  .regex(/^[+0-9 ()-]+$/, "Enter a valid phone number");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone,
  password: z.string().min(8, "Use at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please add a few more details").max(2000),
  // Honeypot: must stay empty (bots fill it).
  company: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  departmentId: z.string().uuid().optional().or(z.literal("")),
  doctorId: z.string().uuid("Select a doctor"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a time"),
  reason: z.string().trim().max(500).optional(),
  // Only used when staff books for a new/unauthenticated patient:
  patientName: z.string().trim().max(120).optional(),
  patientPhone: phone.optional().or(z.literal("")),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const patientSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone,
  email: z.string().trim().email().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  pincode: z.string().trim().max(10).optional(),
});
export type PatientFormInput = z.infer<typeof patientSchema>;

export const departmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "lowercase, hyphens only"),
  description: z.string().trim().max(1000).optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});
export type DepartmentFormInput = z.infer<typeof departmentSchema>;

export const doctorSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(120),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  qualification: z.string().trim().max(200).optional(),
  experienceYears: z.coerce.number().int().min(0).max(80).default(0),
  consultationDuration: z.coerce.number().int().min(5).max(120).default(15),
  consultationFee: z.coerce.number().min(0).max(100000).optional(),
  bio: z.string().trim().max(1000).optional(),
  isActive: z.coerce.boolean().default(true),
});
export type DoctorFormInput = z.infer<typeof doctorSchema>;

/** Flatten zod errors to a field->message map for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
