import { requireRole } from "@/lib/auth/session";
import { getDoctorByProfile } from "@/lib/services/directory";
import { listDoctorAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, EmptyState, StatusBadge } from "@/components/ui/kit";
import StatusActions from "@/components/portal/StatusActions";
import { formatTime, formatDate } from "@/lib/utils";

export const metadata = { title: "My appointments" };

export default async function DoctorAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await requireRole(["doctor", "admin", "superadmin"]);
  const doctor = await getDoctorByProfile(session.id);
  const { date } = await searchParams;
  const target = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : nowInTimeZone("Asia/Kolkata").date;

  if (!doctor) return <EmptyState title="No doctor profile linked" description="Ask an administrator to link your account." />;

  const appts = await listDoctorAppointments(doctor.id, target);

  return (
    <div>
      <PageHeader title="Appointments" description={formatDate(target)} />

      <form method="get" className="mb-4 flex items-end gap-2">
        <label className="label">
          Date
          <input type="date" name="date" defaultValue={target} className="input mt-1" />
        </label>
        <button type="submit" className="btn btn-outline btn-md">View</button>
      </form>

      {appts.length === 0 ? (
        <EmptyState title="No appointments" description="Nothing scheduled for this date." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Patient</th>
                <th className="hidden px-4 py-3 sm:table-cell">Reason</th>
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
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{a.reason ?? "—"}</td>
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
