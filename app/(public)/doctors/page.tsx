import type { Metadata } from "next";
import Link from "next/link";
import { listDoctors } from "@/lib/services/directory";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Our Doctors",
  description: "Meet the specialist doctors available for consultation and online appointment booking.",
};

function initials(name: string) {
  return name.replace(/^Dr\.?\s*/i, "").split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export default async function DoctorsPage() {
  const doctors = await listDoctors();

  return (
    <section className="section">
      <div className="container">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Our Doctors</h1>
          <p className="mt-2 text-gray-500">Experienced specialists across every major department.</p>
        </div>

        {doctors.length === 0 ? (
          <EmptyState
            title="Doctor profiles are being updated"
            description="Our directory isn't available right now. Please call the hospital to book, or check back shortly."
            action={<Link href="/contact"><Button variant="outline">Contact us</Button></Link>}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <div key={d.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
                    {initials(d.full_name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-gray-900">{d.full_name}</h2>
                    <p className="truncate text-sm text-sky-700">{d.specialization}</p>
                  </div>
                </div>
                {d.qualification && <p className="mt-3 text-sm text-gray-500">{d.qualification}</p>}
                <p className="mt-1 text-sm text-gray-500">{d.experience_years}+ years experience</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/doctors/${d.id}`} className="flex-1">
                    <Button variant="outline" className="w-full justify-center">Profile</Button>
                  </Link>
                  <Link href={`/appointments/book?doctor=${d.id}`} className="flex-1">
                    <Button className="w-full justify-center">Book</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
