import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getTodayStats } from "@/lib/services/analytics";
import { getQueue, listHospitalAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";
import { Button } from "@/components/ui";
import AppointmentListItem from "@/components/portal/AppointmentListItem";

export const metadata = { title: "Reception dashboard" };

export default async function ReceptionDashboard() {
  await requireRole(["receptionist", "admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const today = nowInTimeZone("Asia/Kolkata").date;

  if (!hospitalId) {
    return <EmptyState title="Hospital not configured" description="Connect the database to see live data." />;
  }

  const [stats, queue, appts] = await Promise.all([
    getTodayStats(hospitalId),
    getQueue(hospitalId),
    listHospitalAppointments(hospitalId, today),
  ]);

  return (
    <div>
      <PageHeader
        title="Today at a glance"
        description={today}
        actions={<Link href="/reception/patients"><Button>New patient / walk-in</Button></Link>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total today" value={stats.total_today} tone="primary" />
        <StatCard label="Online" value={stats.online_today} />
        <StatCard label="Walk-in" value={stats.walkin_today} />
        <StatCard label="Waiting" value={stats.waiting} tone="teal" />
        <StatCard label="In consult" value={stats.in_consultation} />
        <StatCard label="Completed" value={stats.completed} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Live queue ({queue.length})</h2>
            <Link href="/reception/queue" className="text-sm text-sky-700 hover:underline">Manage →</Link>
          </div>
          {queue.length === 0 ? (
            <p className="text-sm text-gray-500">No patients in the queue right now.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {queue.slice(0, 5).map((a) => (
                <AppointmentListItem key={a.id} appointment={a} showPatient showDoctor />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Today&apos;s appointments ({appts.length})</h2>
            <Link href="/reception/appointments" className="text-sm text-sky-700 hover:underline">View all →</Link>
          </div>
          {appts.length === 0 ? (
            <p className="text-sm text-gray-500">No appointments scheduled today.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {appts.slice(0, 5).map((a) => (
                <AppointmentListItem key={a.id} appointment={a} showPatient showDoctor />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
