import "server-only";

/**
 * Server Supabase clients.
 *
 *  - getServerClient():  request-scoped client that runs AS THE LOGGED-IN USER.
 *    It attaches the user's access token (from the httpOnly cookie) in the
 *    Authorization header so Postgres RLS sees auth.uid(). Safe to use in Server
 *    Components, Route Handlers and Server Actions for reads/writes that must be
 *    authorized by RLS.
 *
 *  - getAdminClient(): uses the service-role key and BYPASSES RLS. Use ONLY for
 *    trusted server-side privileged operations (never import into client code).
 */
import { cookies } from "next/headers";
import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
  getServiceRoleKey,
} from "@/lib/env";
import { ACCESS_COOKIE } from "./cookies";

/** Request-scoped, memoized so repeated calls in one render reuse one client. */
export const getServerClient = cache(async (): Promise<SupabaseClient> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
});

/** Service-role client. Throws if the key is missing so callers fail loudly. */
export function getAdminClient(): SupabaseClient {
  const key = getServiceRoleKey();
  if (!isSupabaseConfigured() || !key) {
    throw new Error(
      "[supabase] Admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { isSupabaseConfigured };
