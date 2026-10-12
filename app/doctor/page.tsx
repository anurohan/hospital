import { requireRole } from "@/lib/auth/session";
import { getDoctorByProfile } from "@/lib/services/directory";
import { listDoctorAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, StatCard, EmptyState, StatusBadge } from "@/components/ui/kit";
import StatusActions from "@/components/portal/StatusActions";
import { formatTime } from "@/lib/utils";

export const metadata = { title: "Doctor dashboard" };

export default async function DoctorDashboard() {
  const session = await requireRole(["doctor", "admin", "superadmin"]);
  const doctor = await getDoctorByProfile(session.id);
  const today = nowInTimeZone("Asia/Kolkata").date;

  if (!doctor) {
    return (
      <EmptyState
        title="No doctor profile linked"
        description="Your login isn't linked to a doctor record yet. Ask an administrator to link your account."
      />
    );
  }

  const appts = await listDoctorAppointments(doctor.id, today);
  const waiting = appts.filter((a) => a.status === "waiting");
  const inConsult = appts.filter((a) => a.status === "in_consultation");
  const completed = appts.filter((a) => a.status === "completed");

  return (
    <div>
      <PageHeader title={`Good day, ${doctor.full_name}`} description={`${doctor.specialization} · ${today}`} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Today" value={appts.length} tone="primary" />
        <StatCard label="Waiting" value={waiting.length} tone="teal" />
        <StatCard label="In consultation" value={inConsult.length} />
        <StatCard label="Completed" value={completed.length} tone="success" />
      </div>

      <h2 className="mb-3 text-base font-semibold text-gray-900">Today&apos;s schedule</h2>
      {appts.length === 0 ? (
        <EmptyState title="No appointments today" description="Your booked patients for today will appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appts.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-gray-700">{formatTime(a.start_time.slice(0, 5))}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{a.token_number ?? "—"}</td>
                  <td className="px-4 py-3">{a.patient?.full_name ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3"><StatusActions appointment={a} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
