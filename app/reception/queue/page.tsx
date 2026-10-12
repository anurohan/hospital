import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getQueue } from "@/lib/services/appointment-queries";
import { PageHeader, EmptyState, StatusBadge } from "@/components/ui/kit";
import StatusActions from "@/components/portal/StatusActions";
import { formatTime } from "@/lib/utils";

export const metadata = { title: "Queue" };

export default async function QueuePage() {
  await requireRole(["receptionist", "admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const queue = hospitalId ? await getQueue(hospitalId) : [];

  return (
    <div>
      <PageHeader title="Live queue" description="Patients checked in and in consultation today." />
      {queue.length === 0 ? (
        <EmptyState title="Queue is empty" description="Checked-in patients appear here in token order." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Patient</th>
                <th className="hidden px-4 py-3 sm:table-cell">Doctor</th>
                <th className="hidden px-4 py-3 sm:table-cell">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{a.token_number ?? "—"}</td>
                  <td className="px-4 py-3">{a.patient?.full_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{a.doctor?.full_name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{formatTime(a.start_time.slice(0, 5))}</td>
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
