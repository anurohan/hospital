import { requireRole } from "@/lib/auth/session";
import { getDoctorByProfile } from "@/lib/services/directory";
import { listDoctorPatients } from "@/lib/services/appointment-queries";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My patients" };

export default async function DoctorPatientsPage() {
  const session = await requireRole(["doctor", "admin", "superadmin"]);
  const doctor = await getDoctorByProfile(session.id);
  if (!doctor) return <EmptyState title="No doctor profile linked" description="Ask an administrator to link your account." />;

  const patients = await listDoctorPatients(doctor.id);

  return (
    <div>
      <PageHeader title="My patients" description="Patients you have appointments with." />
      {patients.length === 0 ? (
        <EmptyState title="No patients yet" description="Patients appear here once they book with you." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">UID</th>
                <th className="hidden px-4 py-3 sm:table-cell">Phone</th>
                <th className="px-4 py-3">Last visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.patient_uid ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{p.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(p.last_visit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-gray-400">
        Access is limited to patients with appointments assigned to you, enforced by database row-level security.
      </p>
    </div>
  );
}
