import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { listAuditLogs } from "@/lib/services/audit";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Audit logs — Admin" };

export default async function AuditLogsPage() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const logs = hospitalId ? await listAuditLogs(hospitalId, 150) : [];

  return (
    <div>
      <PageHeader title="Audit logs" description="Recent sensitive changes in your hospital." />
      {logs.length === 0 ? (
        <EmptyState title="No audit entries yet" description="Admin and staff actions are recorded here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="hidden px-4 py-3 sm:table-cell">Actor</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-gray-600">{new Date(l.created_at).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-800">{l.action}</td>
                  <td className="px-4 py-3 text-gray-600">{l.entity_type}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{l.actor?.full_name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
