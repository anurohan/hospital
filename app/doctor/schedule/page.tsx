import { requireRole } from "@/lib/auth/session";
import { getDoctorByProfile, getDoctorSchedules } from "@/lib/services/directory";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { formatTime } from "@/lib/utils";

export const metadata = { title: "My schedule" };

const DAY_LABEL: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};
const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default async function DoctorSchedulePage() {
  const session = await requireRole(["doctor", "admin", "superadmin"]);
  const doctor = await getDoctorByProfile(session.id);
  if (!doctor) return <EmptyState title="No doctor profile linked" description="Ask an administrator to link your account." />;

  const schedules = (await getDoctorSchedules(doctor.id)).sort(
    (a, b) => DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
  );

  return (
    <div>
      <PageHeader title="My schedule" description="Your weekly clinic hours." />
      {schedules.length === 0 ? (
        <EmptyState title="No schedule set" description="Your clinic hours haven't been configured. Contact an administrator." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Hours</th>
                <th className="hidden px-4 py-3 sm:table-cell">Break</th>
                <th className="px-4 py-3">Slot</th>
                <th className="hidden px-4 py-3 sm:table-cell">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{DAY_LABEL[s.day_of_week]}</td>
                  <td className="px-4 py-3 text-gray-700">{formatTime(s.start_time.slice(0, 5))} – {formatTime(s.end_time.slice(0, 5))}</td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                    {s.break_start && s.break_end ? `${formatTime(s.break_start.slice(0, 5))} – ${formatTime(s.break_end.slice(0, 5))}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.slot_duration_minutes} min</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{s.max_patients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
