import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getPatientForProfile } from "@/lib/services/patients";
import { listPatientAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";
import { Button } from "@/components/ui";
import AppointmentListItem from "@/components/portal/AppointmentListItem";
import type { Appointment } from "@/types";

export default async function PortalDashboard() {
  const session = await requireRole(["patient"]);
  const patient = await getPatientForProfile(session.id);
  const appts: Appointment[] = patient ? await listPatientAppointments(patient.id) : [];

  const today = nowInTimeZone("Asia/Kolkata").date;
  const upcoming = appts.filter(
    (a) => a.appointment_date >= today && !["cancelled", "completed", "no_show"].includes(a.status)
  );
  const past = appts.filter((a) => !upcoming.includes(a));

  return (
    <div>
      <PageHeader
        title={`Welcome, ${session.profile.full_name.split(" ")[0]}`}
        description="Manage your appointments and profile."
        actions={<Link href="/appointments/book"><Button>Book appointment</Button></Link>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Upcoming" value={upcoming.length} tone="primary" />
        <StatCard label="Total" value={appts.length} />
        <StatCard label="Completed" value={appts.filter((a) => a.status === "completed").length} tone="success" />
        <StatCard label="Cancelled" value={appts.filter((a) => a.status === "cancelled").length} />
      </div>

      <h2 className="mb-3 text-base font-semibold text-gray-900">Upcoming appointments</h2>
      {upcoming.length === 0 ? (
        <EmptyState
          title="No upcoming appointments"
          description="Book an appointment with one of our specialists."
          action={<Link href="/appointments/book"><Button>Book now</Button></Link>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((a) => (
            <AppointmentListItem key={a.id} appointment={a} href={`/portal/appointments/${a.id}`} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent history</h2>
            <Link href="/portal/appointments" className="text-sm text-sky-700 hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {past.slice(0, 3).map((a) => (
              <AppointmentListItem key={a.id} appointment={a} href={`/portal/appointments/${a.id}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
