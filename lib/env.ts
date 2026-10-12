/**
 * Environment variable validation.
 * ---------------------------------
 * Validates presence/shape of env vars at module load. We intentionally do NOT
 * throw at import time for the public (browser-safe) vars, because the public
 * marketing site must render even when Supabase is not yet configured. Instead
 * we expose typed getters + an `isSupabaseConfigured()` guard that feature code
 * checks before hitting the database.
 *
 * Secrets (service-role key) are only ever read on the server.
 */

import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const parsed = publicSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

const PLACEHOLDER_URL = "https://placeholder.supabase.co";

export const publicEnv = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      NEXT_PUBLIC_APP_URL: undefined,
    };

export const SUPABASE_URL = publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? PLACEHOLDER_URL;
export const SUPABASE_ANON_KEY =
  publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
export const APP_URL = publicEnv.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** True only when real (non-placeholder) Supabase credentials are present. */
export function isSupabaseConfigured(): boolean {
  return (
    !!publicEnv.NEXT_PUBLIC_SUPABASE_URL &&
    !!publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    publicEnv.NEXT_PUBLIC_SUPABASE_URL !== PLACEHOLDER_URL
  );
}

/** Server-only: service role key. Returns undefined if not configured. */
export function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || undefined;
}
