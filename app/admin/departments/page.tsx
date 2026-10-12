import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListDepartments } from "@/lib/services/admin";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import DepartmentManager from "./DepartmentManager";

export const metadata = { title: "Departments — Admin" };

export default async function AdminDepartmentsPage() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to manage departments." />;
  const departments = await adminListDepartments(hospitalId);
  return (
    <div>
      <PageHeader title="Departments" description="Create and manage hospital departments." />
      <DepartmentManager departments={departments} />
    </div>
  );
}
