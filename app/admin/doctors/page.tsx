import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListDoctors, adminListDepartments } from "@/lib/services/admin";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import DoctorManager from "./DoctorManager";

export const metadata = { title: "Doctors — Admin" };

export default async function AdminDoctorsPage() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to manage doctors." />;
  const [doctors, departments] = await Promise.all([
    adminListDoctors(hospitalId),
    adminListDepartments(hospitalId),
  ]);
  return (
    <div>
      <PageHeader title="Doctors" description="Add doctors and manage their profiles." />
      <DoctorManager doctors={doctors} departments={departments} />
      <p className="mt-4 text-xs text-gray-400">
        Note: creating a doctor record here does not create a login. To let a doctor sign in, create their
        auth account and link it via the Staff section (profile → doctor link).
      </p>
    </div>
  );
}
