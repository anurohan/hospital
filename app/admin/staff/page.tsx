import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListStaff } from "@/lib/services/admin";
import { setStaffRole, toggleStaffActive } from "../actions";
import { Badge } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Staff — Admin" };

export default async function AdminStaffPage() {
  const session = await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  const staff = hospitalId ? await adminListStaff(hospitalId) : [];

  return (
    <div>
      <PageHeader title="Staff & roles" description="Manage receptionists, doctors, and administrators." />
      {staff.length === 0 ? (
        <EmptyState title="No staff yet" description="Staff accounts appear here once provisioned." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">Name</th><th className="hidden px-4 py-3 sm:table-cell">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Active</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s) => {
                const isSelf = s.id === session.id;
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.full_name}{isSelf && <span className="ml-2 text-xs text-gray-400">(you)</span>}</td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{s.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <Badge variant="blue">{s.role}</Badge>
                      ) : (
                        <form action={setStaffRole} className="flex items-center gap-2">
                          <input type="hidden" name="profileId" value={s.id} />
                          <select name="role" defaultValue={s.role} className="input !h-8 !py-0 text-xs">
                            <option value="receptionist">receptionist</option>
                            <option value="doctor">doctor</option>
                            <option value="admin">admin</option>
                          </select>
                          <button type="submit" className="text-xs text-sky-700 hover:underline">Set</button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="gray">Inactive</Badge>}
                      {!isSelf && (
                        <form action={toggleStaffActive} className="mt-1">
                          <input type="hidden" name="profileId" value={s.id} />
                          <input type="hidden" name="active" value={(!s.is_active).toString()} />
                          <button type="submit" className="text-xs text-gray-600 hover:underline">{s.is_active ? "Deactivate" : "Activate"}</button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-gray-400">
        New staff accounts are created by signing them up, then promoting the role here. Role changes are
        enforced by database row-level security — only admins can elevate roles.
      </p>
    </div>
  );
}
