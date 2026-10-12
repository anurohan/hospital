import type { Metadata } from "next";
import Link from "next/link";
import BookingWizard from "./BookingWizard";
import { listDepartments, listDoctors } from "@/lib/services/directory";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { EmptyState, Alert } from "@/components/ui/kit";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book an appointment online with our specialist doctors.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string }>;
}) {
  const { doctor } = await searchParams;
  const demoMode = !isSupabaseConfigured();
  const [departments, doctors, session] = await Promise.all([
    listDepartments(),
    listDoctors(),
    getSessionUser(),
  ]);

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Book an appointment</h1>
        <p className="mt-2 text-gray-500">
          Choose a doctor and time that works for you.
          {!session && " You'll sign in to confirm."}
        </p>

        {demoMode && (
          <div className="mt-4">
            <Alert tone="info">
              Demo mode: live Supabase data is not configured yet, so this preview uses sample hospital data only.
            </Alert>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {doctors.length === 0 ? (
            <EmptyState
              title="Online booking isn't available yet"
              description="Our doctor directory isn't published. Please call the hospital to book your appointment."
              action={<Link href="/contact"><Button variant="outline">Contact us</Button></Link>}
            />
          ) : (
            <BookingWizard departments={departments} doctors={doctors} initialDoctorId={doctor} demoMode={demoMode} />
          )}
        </div>
      </div>
    </section>
  );
}
