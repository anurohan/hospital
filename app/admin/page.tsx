import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { getTodayStats } from "@/lib/services/analytics";
import { adminListDoctors, adminListDepartments, adminListStaff } from "@/lib/services/admin";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboard() {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to manage your hospital." />;

  const [stats, doctors, departments, staff] = await Promise.all([
    getTodayStats(hospitalId),
    adminListDoctors(hospitalId),
    adminListDepartments(hospitalId),
    adminListStaff(hospitalId),
  ]);

  const links = [
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/doctors", label: "Doctors" },
    { href: "/admin/departments", label: "Departments" },
    { href: "/admin/schedules", label: "Schedules" },
    { href: "/admin/staff", label: "Staff" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/audit-logs", label: "Audit logs" },
    { href: "/admin/appointments", label: "Appointments" },
  ];

  return (
    <div>
      <PageHeader title="Admin dashboard" description="Overview of your hospital today." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <StatCard label="Appointments today" value={stats.total_today} tone="primary" />
        <StatCard label="Online" value={stats.online_today} />
        <StatCard label="Walk-in" value={stats.walkin_today} />
        <StatCard label="Completed" value={stats.completed} tone="success" />
        <StatCard label="Doctors" value={doctors.filter((d) => d.is_active).length} />
        <StatCard label="Departments" value={departments.filter((d) => d.is_active).length} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Active staff" value={staff.filter((s) => s.is_active).length} />
        <StatCard label="No-shows today" value={stats.no_show} tone="danger" />
        <StatCard label="Cancelled today" value={stats.cancelled} />
      </div>

      <h2 className="mb-3 text-base font-semibold text-gray-900">Manage</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-sky-300 hover:text-sky-700">
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
