"use client";

/**
 * Browser Supabase client — for use inside client components.
 *
 * Session persistence is intentionally DISABLED here: the authoritative session
 * lives in httpOnly cookies managed by the server (see lib/supabase/server.ts +
 * the /api/auth/* route handlers). The browser client is used only for the
 * initial credential exchange (signInWithPassword / signUp / resetPassword);
 * the returned tokens are then handed to the server to be stored in httpOnly
 * cookies. This keeps access/refresh tokens out of localStorage.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
  if (client) return client;
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
