import { requireRole } from "@/lib/auth/session";
import PortalShell from "@/components/portal/PortalShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["admin", "superadmin"], "/admin");
  return (
    <PortalShell
      title="Admin"
      userName={session.profile.full_name}
      roleLabel="Administrator"
      nav={[
        { label: "Dashboard", href: "/admin" },
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Appointments", href: "/admin/appointments" },
        { label: "Patients", href: "/admin/patients" },
        { label: "Doctors", href: "/admin/doctors" },
        { label: "Departments", href: "/admin/departments" },
        { label: "Staff", href: "/admin/staff" },
        { label: "Schedules", href: "/admin/schedules" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Audit logs", href: "/admin/audit-logs" },
      ]}
    >
      {children}
    </PortalShell>
  );
}
