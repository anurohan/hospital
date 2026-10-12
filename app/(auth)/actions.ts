"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/env";
import { ACCESS_COOKIE, REFRESH_COOKIE, sessionCookieOptions } from "@/lib/supabase/cookies";
import { loginSchema, registerSchema, fieldErrors } from "@/lib/validation";
import { homeForRole, safeInternalPath } from "@/lib/auth/roles";
import type { UserRole } from "@/types";

export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string>;
  notice?: string;
}

function anonClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function setSessionCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, sessionCookieOptions());
  store.set(REFRESH_COOKIE, refreshToken, sessionCookieOptions());
}

async function clearSessionCookies() {
  const store = await cookies();
  store.set(ACCESS_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  store.set(REFRESH_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: "Sign-in is unavailable: the database is not configured yet." };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const supabase = anonClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session) return { error: "Invalid email or password." };

  await setSessionCookies(data.session.access_token, data.session.refresh_token);

  const profileRole = (data.user?.user_metadata?.role as UserRole | undefined) ?? "patient";
  const next = safeInternalPath((formData.get("next") as string | null) ?? undefined, homeForRole(profileRole));
  redirect(next);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: "Registration is unavailable: the database is not configured yet." };

  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const supabase = anonClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // role is forced to 'patient'; staff accounts are provisioned by admins.
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone, role: "patient" },
    },
  });
  if (error) return { error: error.message.includes("already") ? "An account with this email already exists." : "Could not create the account. Please try again." };

  if (data.session) {
    await setSessionCookies(data.session.access_token, data.session.refresh_token);
    redirect("/portal");
  }
  // Email confirmation required — no session yet.
  return { notice: "Account created. Please check your email to confirm, then sign in." };
}

export async function signOut() {
  await clearSessionCookies();
  redirect("/login");
}
