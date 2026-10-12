import "server-only";

import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { nowInTimeZone } from "./appointments";
import type { Appointment, DashboardStats } from "@/types";

/**
 * Real database-backed analytics. All numbers are computed from the
 * appointments table via aggregate queries — never hardcoded. When the DB is
 * empty the figures are genuine zeros (callers render an empty state).
 */

export async function getTodayStats(
  hospitalId: string,
  timezone = "Asia/Kolkata"
): Promise<DashboardStats> {
  const empty: DashboardStats = {
    total_today: 0,
    online_today: 0,
    walkin_today: 0,
    waiting: 0,
    in_consultation: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  };
  if (!isSupabaseConfigured()) return empty;

  const supabase = await getServerClient();
  const today = nowInTimeZone(timezone).date;
  const { data } = await supabase
    .from("appointments")
    .select("status,booking_source")
    .eq("hospital_id", hospitalId)
    .eq("appointment_date", today);

  const rows = (data as Pick<Appointment, "status" | "booking_source">[]) ?? [];
  const stats = { ...empty, total_today: rows.length };
  for (const r of rows) {
    if (r.booking_source === "online") stats.online_today++;
    if (r.booking_source === "walk_in") stats.walkin_today++;
    if (r.status === "waiting") stats.waiting++;
    if (r.status === "in_consultation") stats.in_consultation++;
    if (r.status === "completed") stats.completed++;
    if (r.status === "cancelled") stats.cancelled++;
    if (r.status === "no_show") stats.no_show++;
  }
  return stats;
}

export interface RangeStats {
  total: number;
  bySource: { online: number; walk_in: number };
  byStatus: Record<string, number>;
  byDepartment: { name: string; count: number }[];
  byHour: { hour: number; count: number }[];
  daily: { date: string; count: number }[];
}

/** Aggregations over an inclusive date range [start, end] (YYYY-MM-DD). */
export async function getRangeStats(
  hospitalId: string,
  start: string,
  end: string
): Promise<RangeStats> {
  const base: RangeStats = {
    total: 0,
    bySource: { online: 0, walk_in: 0 },
    byStatus: {},
    byDepartment: [],
    byHour: [],
    daily: [],
  };
  if (!isSupabaseConfigured()) return base;

  const supabase = await getServerClient();
  const { data } = await supabase
    .from("appointments")
    .select("status,booking_source,appointment_date,start_time, department:departments(name)")
    .eq("hospital_id", hospitalId)
    .gte("appointment_date", start)
    .lte("appointment_date", end);

  type Row = {
    status: string;
    booking_source: string;
    appointment_date: string;
    start_time: string;
    department: { name: string } | null;
  };
  const rows = (data as unknown as Row[]) ?? [];

  const dept = new Map<string, number>();
  const hour = new Map<number, number>();
  const day = new Map<string, number>();

  for (const r of rows) {
    base.total++;
    if (r.booking_source === "online") base.bySource.online++;
    if (r.booking_source === "walk_in") base.bySource.walk_in++;
    base.byStatus[r.status] = (base.byStatus[r.status] ?? 0) + 1;
    const dname = r.department?.name ?? "Unassigned";
    dept.set(dname, (dept.get(dname) ?? 0) + 1);
    const h = Number((r.start_time ?? "00:00").slice(0, 2));
    hour.set(h, (hour.get(h) ?? 0) + 1);
    day.set(r.appointment_date, (day.get(r.appointment_date) ?? 0) + 1);
  }

  base.byDepartment = [...dept.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  base.byHour = [...hour.entries()].map(([h, count]) => ({ hour: h, count })).sort((a, b) => a.hour - b.hour);
  base.daily = [...day.entries()].map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
  return base;
}
