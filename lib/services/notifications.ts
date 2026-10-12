import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Notification } from "@/types";

/**
 * In-app notifications. Reminder/email/SMS delivery is handled separately by the
 * provider abstraction (lib/notifications/providers). These functions only touch
 * the in-app `notifications` table.
 */

export async function createNotification(input: {
  hospitalId?: string | null;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await getServerClient();
  await supabase.from("notifications").insert({
    hospital_id: input.hospitalId ?? null,
    user_id: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    metadata: input.metadata ?? {},
  });
}

export async function listNotifications(userId: string, limit = 30): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Notification[]) ?? [];
}

export async function unreadCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = await getServerClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}

export async function markRead(notificationId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await getServerClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
}

export async function markAllRead(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await getServerClient();
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
}
