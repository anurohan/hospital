import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { AuditLog } from "@/types";

/**
 * Append-only audit logging for sensitive changes (admin CRUD, role changes,
 * cancellations). Best-effort: a logging failure never blocks the primary
 * action. We never log credentials or clinical free-text.
 */
export async function auditLog(input: {
  hospitalId?: string | null;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await getServerClient();
    await supabase.from("audit_logs").insert({
      hospital_id: input.hospitalId ?? null,
      actor_id: input.actorId ?? null,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      old_data: input.oldData ?? null,
      new_data: input.newData ?? null,
    });
  } catch {
    // best-effort; swallow
  }
}

export async function listAuditLogs(hospitalId: string, limit = 100): Promise<AuditLog[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*, actor:profiles(*)")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AuditLog[]) ?? [];
}
