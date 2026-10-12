import type { Metadata } from "next";
import Link from "next/link";
import { getActiveHospital } from "@/lib/services/hospital";
import { HOSPITAL_CONFIG } from "@/config/hospital";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission, values, and commitment to compassionate, quality healthcare.",
};

export default async function AboutPage() {
  const hospital = await getActiveHospital();
  const name = hospital?.name ?? HOSPITAL_CONFIG.name;
  const city = hospital?.address_city ?? HOSPITAL_CONFIG.address.city;
  const state = hospital?.address_state ?? HOSPITAL_CONFIG.address.state;

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">About {name}</h1>
        <p className="mt-4 text-gray-600">
          {name} is a multi-specialty hospital in {city}, {state}, dedicated to providing
          compassionate, accessible, and high-quality healthcare. We combine experienced doctors,
          modern diagnostics, and patient-first service to care for our community.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Value title="Our mission">
            To make quality healthcare accessible to every family we serve, with dignity and care.
          </Value>
          <Value title="Our approach">
            Patient-first service, clear communication, and modern clinical practice across every department.
          </Value>
          <Value title="Emergency care">
            Round-the-clock emergency services, every day of the year.
          </Value>
          <Value title="Online booking">
            Book appointments online and manage them from your patient portal — no waiting on the phone.
          </Value>
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/appointments/book"><Button size="lg">Book an appointment</Button></Link>
          <Link href="/departments"><Button size="lg" variant="outline">Our departments</Button></Link>
        </div>
      </div>
    </section>
  );
}

function Value({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{children}</p>
    </div>
  );
}
