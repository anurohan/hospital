import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListPatients } from "@/lib/services/admin";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Patients — Admin" };

export default async function AdminPatientsPage() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const patients = hospitalId ? await adminListPatients(hospitalId) : [];

  return (
    <div>
      <PageHeader title="Patients" description="All registered patients in your hospital." />
      {patients.length === 0 ? (
        <EmptyState title="No patients yet" description="Registered patients appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">UID</th><th className="hidden px-4 py-3 sm:table-cell">Phone</th><th className="hidden px-4 py-3 md:table-cell">Registered</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.patient_uid ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{p.phone}</td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
