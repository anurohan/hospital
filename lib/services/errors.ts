import "server-only";

/** Standard result shape for service-layer calls. */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail(error: string, code?: string): ServiceResult<never> {
  return { ok: false, error, code };
}

/**
 * Normalize a Supabase/PostgREST error into a safe, user-facing message.
 * Never leaks SQL, table names, or secret values.
 */
export function normalizeDbError(err: unknown): { error: string; code?: string } {
  const e = err as { message?: string; code?: string } | null;
  const raw = e?.message ?? "";

  if (raw.includes("SLOT_TAKEN")) {
    return { error: "That time slot was just taken. Please pick another.", code: "SLOT_TAKEN" };
  }
  if (raw.includes("NOT_FOUND")) {
    return { error: "The requested record was not found.", code: "NOT_FOUND" };
  }
  if (e?.code === "23505" || raw.includes("duplicate key")) {
    return { error: "This record already exists.", code: "DUPLICATE" };
  }
  if (e?.code === "23503") {
    return { error: "A related record is missing or invalid.", code: "FK" };
  }
  if (e?.code === "42501" || raw.toLowerCase().includes("row-level security")) {
    return { error: "You don't have permission to do that.", code: "FORBIDDEN" };
  }
  // Generic fallback — do not echo raw DB text to the user.
  return { error: "Something went wrong. Please try again.", code: e?.code };
}
