import { requireRole } from "@/lib/auth/session";
import PortalShell from "@/components/portal/PortalShell";

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["doctor", "admin", "superadmin"], "/doctor");
  return (
    <PortalShell
      title="Doctor portal"
      userName={session.profile.full_name}
      roleLabel="Doctor"
      nav={[
        { label: "Dashboard", href: "/doctor" },
        { label: "Appointments", href: "/doctor/appointments" },
        { label: "Patients", href: "/doctor/patients" },
        { label: "Schedule", href: "/doctor/schedule" },
      ]}
    >
      {children}
    </PortalShell>
  );
}
