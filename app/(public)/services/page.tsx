import type { Metadata } from "next";
import Link from "next/link";
import { getActiveHospital } from "@/lib/services/hospital";
import { HOSPITAL_CONFIG } from "@/config/hospital";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services & Facilities",
  description: "OPD, 24×7 emergency care, diagnostics, pharmacy, and online appointment booking.",
};

const FACILITIES = [
  { title: "Outpatient (OPD)", desc: "Consultations across all major specialties with online and walk-in booking." },
  { title: "24×7 Emergency", desc: "Round-the-clock emergency and casualty services." },
  { title: "Diagnostics", desc: "Laboratory and imaging services to support accurate diagnosis." },
  { title: "Pharmacy", desc: "In-house pharmacy for prescribed medicines." },
  { title: "Inpatient care", desc: "Comfortable wards and attentive nursing care." },
  { title: "Online appointments", desc: "Book and manage appointments from your patient portal." },
];

export default async function ServicesPage() {
  const hospital = await getActiveHospital();
  const hours = HOSPITAL_CONFIG.hours;

  return (
    <section className="section">
      <div className="container">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Services &amp; Facilities</h1>
          <p className="mt-2 text-gray-500">Everything your family needs, under one roof.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">{f.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Hours</h2>
          <dl className="space-y-2 text-sm">
            <Row label="OPD" value={hours.opd} />
            <Row label="Emergency" value={hours.emergency} />
            <Row label="Pharmacy" value={hours.pharmacy} />
          </dl>
        </div>

        <div className="mt-10 text-center">
          <Link href="/appointments/book"><Button size="lg">Book an appointment</Button></Link>
          {hospital?.name ? null : null}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
