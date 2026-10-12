import "server-only";

/**
 * Data Access Layer (DAL) for authentication & authorization.
 *
 * This is the AUTHORITATIVE auth check for the app. Per the Next.js 16 security
 * guidance, Proxy (middleware) only does optimistic cookie-presence redirects;
 * real authorization happens here, close to the data, and is backed by Postgres
 * RLS. Always call requireUser / requireRole in protected Server Components and
 * Server Actions — never rely on hidden UI alone.
 */
import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isStaff, matchedRouteRoles, safeInternalPath } from "./roles";
import type { UserProfile, UserRole } from "@/types";

export interface SessionUser {
  id: string;
  email: string | null;
  profile: UserProfile;
}

/**
 * Returns the current authenticated user + profile, or null.
 * Validates the access token with Supabase (auth.getUser) — not just decoding
 * the cookie — so a tampered/expired token resolves to null.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await getServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;
  return { id: user.id, email: user.email ?? null, profile: profile as UserProfile };
});

/** Redirects to /login (optionally with ?next=) when no session. */
export async function requireUser(nextPath?: string): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session) {
    const safePath = safeInternalPath(nextPath, "/");
    const loginTarget = safePath === "/" ? "/login" : `/login?next=${encodeURIComponent(safePath)}`;
    redirect(loginTarget);
  }
  return session;
}

/** Requires one of `roles`; redirects to /unauthorized on mismatch. */
export async function requireRole(
  roles: UserRole[],
  nextPath?: string
): Promise<SessionUser> {
  const session = await requireUser(nextPath);
  if (!roles.includes(session.profile.role)) redirect("/unauthorized");
  return session;
}

/** Requires any staff role. */
export async function requireStaff(nextPath?: string): Promise<SessionUser> {
  const session = await requireUser(nextPath);
  if (!isStaff(session.profile.role)) redirect("/unauthorized");
  return session;
}

/** Enforce the role map for a given pathname (used by protected layouts). */
export async function requireForPath(pathname: string): Promise<SessionUser> {
  const roles = matchedRouteRoles(pathname);
  const session = await requireUser(pathname);
  if (roles && !roles.includes(session.profile.role)) redirect("/unauthorized");
  return session;
}
