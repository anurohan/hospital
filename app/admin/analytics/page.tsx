import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getRangeStats } from "@/lib/services/analytics";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Analytics" };

function daysAgo(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - n);
  return dt.toISOString().slice(0, 10);
}

function Bars({ data, labelKey, valueKey }: { data: Record<string, unknown>[]; labelKey: string; valueKey: string }) {
  const max = Math.max(1, ...data.map((d) => Number(d[valueKey])));
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-28 shrink-0 truncate text-gray-600">{String(d[labelKey])}</span>
          <div className="h-4 flex-1 rounded bg-gray-100">
            <div className="h-4 rounded bg-sky-500" style={{ width: `${(Number(d[valueKey]) / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right font-medium text-gray-700">{String(d[valueKey])}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const today = nowInTimeZone("Asia/Kolkata").date;
  const sp = await searchParams;
  const end = sp.end && /^\d{4}-\d{2}-\d{2}$/.test(sp.end) ? sp.end : today;
  const start = sp.start && /^\d{4}-\d{2}-\d{2}$/.test(sp.start) ? sp.start : daysAgo(end, 30);

  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to view analytics." />;

  const stats = await getRangeStats(hospitalId, start, end);

  return (
    <div>
      <PageHeader title="Analytics" description={`${start} → ${end}`} />

      <form method="get" className="mb-6 flex flex-wrap items-end gap-2">
        <label className="label">From<input type="date" name="start" defaultValue={start} className="input mt-1" /></label>
        <label className="label">To<input type="date" name="end" defaultValue={end} className="input mt-1" /></label>
        <button type="submit" className="btn btn-outline btn-md">Apply</button>
      </form>

      {stats.total === 0 ? (
        <EmptyState title="No appointments in this range" description="Pick a different date range, or data will appear here once appointments are booked." />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total" value={stats.total} tone="primary" />
            <StatCard label="Online" value={stats.bySource.online} />
            <StatCard label="Walk-in" value={stats.bySource.walk_in} />
            <StatCard label="Completed" value={stats.byStatus["completed"] ?? 0} tone="success" />
          </div>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">By department</h2>
            <Bars data={stats.byDepartment} labelKey="name" valueKey="count" />
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">Peak hours</h2>
            <Bars data={stats.byHour.map((h) => ({ label: `${String(h.hour).padStart(2, "0")}:00`, count: h.count }))} labelKey="label" valueKey="count" />
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">Daily trend</h2>
            <Bars data={stats.daily} labelKey="date" valueKey="count" />
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">By status</h2>
            <Bars data={Object.entries(stats.byStatus).map(([label, count]) => ({ label, count }))} labelKey="label" valueKey="count" />
          </section>
        </div>
      )}
    </div>
  );
}
