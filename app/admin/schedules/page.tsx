import { requireRole } from "@/lib/auth/session";
import { getActiveHospitalId } from "@/lib/services/hospital";
import { adminListDoctors } from "@/lib/services/admin";
import { getDoctorSchedules } from "@/lib/services/directory";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import ScheduleManager from "./ScheduleManager";

export const metadata = { title: "Schedules — Admin" };

export default async function AdminSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string }>;
}) {
  await requireRole(["admin", "superadmin"]);
  const hospitalId = await getActiveHospitalId();
  if (!hospitalId) return <EmptyState title="Hospital not configured" description="Connect the database to manage schedules." />;

  const doctors = await adminListDoctors(hospitalId);
  const { doctor } = await searchParams;
  const selected = doctor || doctors[0]?.id || "";
  const schedules = selected ? await getDoctorSchedules(selected) : [];

  return (
    <div>
      <PageHeader title="Doctor schedules" description="Set weekly clinic hours per doctor." />

      {doctors.length === 0 ? (
        <EmptyState title="No doctors yet" description="Add doctors first, then set their schedules." />
      ) : (
        <>
          <form method="get" className="mb-4 flex items-end gap-2">
            <label className="label">
              Doctor
              <select name="doctor" defaultValue={selected} className="input mt-1">
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
              </select>
            </label>
            <button type="submit" className="btn btn-outline btn-md">View</button>
          </form>
          <ScheduleManager doctorId={selected} schedules={schedules} />
        </>
      )}
    </div>
  );
}
