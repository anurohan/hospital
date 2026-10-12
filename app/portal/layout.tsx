import { requireRole } from "@/lib/auth/session";
import PortalShell from "@/components/portal/PortalShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["patient"], "/portal");
  return (
    <PortalShell
      title="Patient portal"
      userName={session.profile.full_name}
      roleLabel="Patient"
      nav={[
        { label: "Dashboard", href: "/portal" },
        { label: "Appointments", href: "/portal/appointments" },
        { label: "Notifications", href: "/portal/notifications" },
        { label: "Profile", href: "/portal/profile" },
      ]}
    >
      {children}
    </PortalShell>
  );
}
