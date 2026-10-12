import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getPatientForProfile } from "@/lib/services/patients";
import { listPatientAppointments } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { Button } from "@/components/ui";
import AppointmentListItem from "@/components/portal/AppointmentListItem";

export const metadata = { title: "My Appointments" };

export default async function PatientAppointmentsPage() {
  const session = await requireRole(["patient"]);
  const patient = await getPatientForProfile(session.id);
  const appts = patient ? await listPatientAppointments(patient.id) : [];
  const today = nowInTimeZone("Asia/Kolkata").date;

  const upcoming = appts.filter(
    (a) => a.appointment_date >= today && !["cancelled", "completed", "no_show"].includes(a.status)
  );
  const history = appts.filter((a) => !upcoming.includes(a));

  return (
    <div>
      <PageHeader
        title="My appointments"
        actions={<Link href="/appointments/book"><Button>Book appointment</Button></Link>}
      />

      {appts.length === 0 ? (
        <EmptyState title="No appointments yet" description="Your booked appointments will appear here." action={<Link href="/appointments/book"><Button>Book now</Button></Link>} />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">Upcoming ({upcoming.length})</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming appointments.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {upcoming.map((a) => <AppointmentListItem key={a.id} appointment={a} href={`/portal/appointments/${a.id}`} />)}
              </div>
            )}
          </section>

          {history.length > 0 && (
            <section>
              <h2 className="mb-3 text-base font-semibold text-gray-900">History ({history.length})</h2>
              <div className="flex flex-col gap-3">
                {history.map((a) => <AppointmentListItem key={a.id} appointment={a} href={`/portal/appointments/${a.id}`} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
