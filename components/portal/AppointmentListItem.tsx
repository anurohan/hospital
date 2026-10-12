import Link from "next/link";
import { StatusBadge } from "@/components/ui/kit";
import { formatDate, formatTime } from "@/lib/utils";
import type { Appointment } from "@/types";

export default function AppointmentListItem({
  appointment,
  href,
  showDoctor = true,
  showPatient = false,
}: {
  appointment: Appointment;
  href?: string;
  showDoctor?: boolean;
  showPatient?: boolean;
}) {
  const a = appointment;
  const body = (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-sky-300">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {formatDate(a.appointment_date)} · {formatTime(a.start_time.slice(0, 5))}
        </p>
        {showPatient && a.patient?.full_name && (
          <p className="truncate text-sm text-gray-700">{a.patient.full_name}</p>
        )}
        {showDoctor && a.doctor?.full_name && (
          <p className="truncate text-sm text-gray-500">{a.doctor.full_name}{a.department?.name ? ` · ${a.department.name}` : ""}</p>
        )}
        <p className="mt-1 font-mono text-xs text-gray-400">{a.appointment_uid}{a.token_number ? ` · Token ${a.token_number}` : ""}</p>
      </div>
      <div className="shrink-0 text-right">
        <StatusBadge status={a.status} />
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}
