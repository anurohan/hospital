"use server";

import { headers } from "next/headers";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { rateLimit } from "@/lib/ratelimit";

export interface ContactState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    company: formData.get("company"), // honeypot
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  // Honeypot tripped -> pretend success, drop silently.
  if (parsed.data.company) return { ok: true };

  // Best-effort rate limit by client IP.
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const { allowed } = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!allowed) return { error: "Too many messages. Please try again in a minute." };

  if (!isSupabaseConfigured()) {
    return { error: "Messaging is temporarily unavailable. Please call the hospital directly." };
  }

  const supabase = await getServerClient();
  const hospitalId = await getActiveHospitalId();
  const { error } = await supabase.from("contact_messages").insert({
    hospital_id: hospitalId,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    message: parsed.data.message,
  });
  if (error) return { error: "Could not send your message. Please try again." };

  return { ok: true };
}
