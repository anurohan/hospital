import { requireRole } from "@/lib/auth/session";
import { listDoctors } from "@/lib/services/directory";
import { PageHeader } from "@/components/ui/kit";
import ReceptionPatients from "./ReceptionPatients";

export const metadata = { title: "Patients" };

export default async function ReceptionPatientsPage() {
  await requireRole(["receptionist", "admin", "superadmin"]);
  const doctors = await listDoctors();
  return (
    <div>
      <PageHeader title="Patients" description="Register new patients and book walk-in appointments." />
      <ReceptionPatients doctors={doctors} />
    </div>
  );
}
