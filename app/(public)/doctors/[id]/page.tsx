import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoctorById, getDoctorSchedules } from "@/lib/services/directory";
import { Button } from "@/components/ui";
import { formatTime } from "@/lib/utils";

const DAY_LABEL: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};
const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  return { title: doctor ? doctor.full_name : "Doctor" };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) notFound();

  const schedules = (await getDoctorSchedules(doctor.id)).sort(
    (a, b) => DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
  );

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <Link href="/doctors" className="text-sm text-sky-700 hover:underline">← All doctors</Link>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{doctor.full_name}</h1>
          <p className="mt-1 text-sky-700">{doctor.specialization}</p>
          {doctor.department?.name && (
            <p className="mt-1 text-sm text-gray-500">Department: {doctor.department.name}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {doctor.qualification && <Info label="Qualification" value={doctor.qualification} />}
            <Info label="Experience" value={`${doctor.experience_years}+ years`} />
            {doctor.consultation_fee != null && (
              <Info label="Consultation fee" value={`₹${doctor.consultation_fee}`} />
            )}
          </div>
          {doctor.bio && <p className="mt-4 text-sm leading-relaxed text-gray-600">{doctor.bio}</p>}

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-800">Weekly availability</h2>
            {schedules.length === 0 ? (
              <p className="text-sm text-gray-500">Availability not published. Please contact the hospital.</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {schedules.map((s) => (
                  <li key={s.id} className="flex justify-between px-3 py-2 text-sm">
                    <span className="font-medium text-gray-700">{DAY_LABEL[s.day_of_week]}</span>
                    <span className="text-gray-500">
                      {formatTime(s.start_time.slice(0, 5))} – {formatTime(s.end_time.slice(0, 5))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href={`/appointments/book?doctor=${doctor.id}`} className="mt-6 inline-block">
            <Button size="lg">Book an appointment</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
