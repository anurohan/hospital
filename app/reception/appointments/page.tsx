import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { listHospitalAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, EmptyState, StatusBadge } from "@/components/ui/kit";
import StatusActions from "@/components/portal/StatusActions";
import { formatTime } from "@/lib/utils";

export const metadata = { title: "Today's appointments" };

export default async function ReceptionAppointmentsPage() {
  await requireRole(["receptionist", "admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const today = nowInTimeZone("Asia/Kolkata").date;
  const appts = hospitalId ? await listHospitalAppointments(hospitalId, today) : [];

  return (
    <div>
      <PageHeader title="Today's appointments" description={today} />
      {appts.length === 0 ? (
        <EmptyState title="No appointments today" description="Online and walk-in appointments for today appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Patient</th>
                <th className="hidden px-4 py-3 md:table-cell">Doctor</th>
                <th className="hidden px-4 py-3 sm:table-cell">Source</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appts.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-gray-700">{formatTime(a.start_time.slice(0, 5))}</td>
                  <td className="px-4 py-3">{a.patient?.full_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{a.doctor?.full_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{a.booking_source === "walk_in" ? "Walk-in" : "Online"}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{a.token_number ?? "—"}</td>
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
