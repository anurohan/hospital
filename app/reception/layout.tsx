import { requireRole } from "@/lib/auth/session";
import PortalShell from "@/components/portal/PortalShell";

export default async function ReceptionLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["receptionist", "admin", "superadmin"], "/reception");
  return (
    <PortalShell
      title="Reception"
      userName={session.profile.full_name}
      roleLabel="Reception desk"
      nav={[
        { label: "Dashboard", href: "/reception" },
        { label: "Queue", href: "/reception/queue" },
        { label: "Appointments", href: "/reception/appointments" },
        { label: "Patients", href: "/reception/patients" },
      ]}
    >
      {children}
    </PortalShell>
  );
}
