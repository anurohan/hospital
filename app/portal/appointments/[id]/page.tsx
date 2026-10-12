import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getPatientForProfile } from "@/lib/services/patients";
import { getAppointment } from "@/lib/services/appointment-queries";
import { nowInTimeZone } from "@/lib/services/appointments";
import { StatusBadge } from "@/components/ui/kit";
import { formatDate, formatTime } from "@/lib/utils";
import AppointmentActions from "./AppointmentActions";

export const metadata = { title: "Appointment details" };

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole(["patient"]);
  const patient = await getPatientForProfile(session.id);
  const appt = await getAppointment(id);

  // Ownership enforcement (defense in depth beyond RLS).
  if (!appt || !patient || appt.patient_id !== patient.id) notFound();

  const today = nowInTimeZone("Asia/Kolkata").date;
  const canModify =
    appt.appointment_date >= today && ["pending", "confirmed"].includes(appt.status);

  return (
    <div className="max-w-2xl">
      <Link href="/portal/appointments" className="text-sm text-sky-700 hover:underline">← Back to appointments</Link>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {formatDate(appt.appointment_date)} · {formatTime(appt.start_time.slice(0, 5))}
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-400">{appt.appointment_uid}</p>
          </div>
          <StatusBadge status={appt.status} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <Field label="Doctor" value={appt.doctor?.full_name ?? "—"} />
          <Field label="Department" value={appt.department?.name ?? "—"} />
          <Field label="Type" value={appt.type} />
          <Field label="Booking" value={appt.booking_source === "walk_in" ? "Walk-in" : "Online"} />
          {appt.token_number && <Field label="Token" value={appt.token_number} />}
          {appt.consultation_fee != null && <Field label="Fee" value={`₹${appt.consultation_fee}`} />}
        </dl>

        {appt.reason && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Reason</p>
            <p className="text-sm text-gray-700">{appt.reason}</p>
          </div>
        )}

        {appt.status === "cancelled" && appt.cancellation_reason && (
          <p className="mt-4 text-sm text-red-600">Cancelled: {appt.cancellation_reason}</p>
        )}

        {canModify ? (
          <AppointmentActions appointmentId={appt.id} doctorId={appt.doctor_id} />
        ) : (
          <p className="mt-6 text-sm text-gray-500">This appointment can no longer be changed online.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="font-medium capitalize text-gray-800">{value}</dd>
    </div>
  );
}
