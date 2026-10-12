import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { getActiveHospital } from "@/lib/services/hospital";
import { HOSPITAL_CONFIG } from "@/config/hospital";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with us, find our location, and reach emergency services.",
};

export default async function ContactPage() {
  const hospital = await getActiveHospital();
  const phone = hospital?.phone ?? HOSPITAL_CONFIG.contact.phone;
  const emergency = hospital?.emergency_phone ?? HOSPITAL_CONFIG.contact.emergencyPhone;
  const email = hospital?.email ?? HOSPITAL_CONFIG.contact.email;
  const address = [
    hospital?.address_line1 ?? HOSPITAL_CONFIG.address.line1,
    hospital?.address_city ?? HOSPITAL_CONFIG.address.city,
    hospital?.address_state ?? HOSPITAL_CONFIG.address.state,
    hospital?.address_pin ?? HOSPITAL_CONFIG.address.pincode,
  ].filter(Boolean).join(", ");
  const mapUrl = hospital?.map_url ?? HOSPITAL_CONFIG.mapUrl;

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact us</h1>
          <p className="mt-2 text-gray-500">
            We&apos;re here to help. Send a message or reach us using the details below.
          </p>

          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-gray-800">Address</dt>
              <dd className="text-gray-600">{address}</dd>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
                View on Google Maps →
              </a>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Phone</dt>
              <dd><a href={`tel:${phone.replace(/\s/g, "")}`} className="text-gray-600 hover:text-sky-700">{phone}</a></dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Emergency (24×7)</dt>
              <dd><a href={`tel:${emergency.replace(/\s/g, "")}`} className="font-semibold text-red-600">{emergency}</a></dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">Email</dt>
              <dd><a href={`mailto:${email}`} className="text-gray-600 hover:text-sky-700">{email}</a></dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
