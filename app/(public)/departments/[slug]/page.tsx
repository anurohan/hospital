import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartmentBySlug } from "@/lib/services/directory";
import { Button } from "@/components/ui";
import type { Doctor } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  return { title: dept ? dept.name : "Department" };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) notFound();

  const doctors: Doctor[] = (dept.doctors ?? []).filter((d) => d.is_active);

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Link href="/departments" className="text-sm text-sky-700 hover:underline">← All departments</Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{dept.name}</h1>
        {dept.description && <p className="mt-3 max-w-2xl text-gray-600">{dept.description}</p>}

        <h2 className="mt-8 mb-3 text-lg font-semibold text-gray-900">Doctors in this department</h2>
        {doctors.length === 0 ? (
          <p className="text-sm text-gray-500">No doctors are currently listed for this department.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {doctors.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{d.full_name}</p>
                  <p className="truncate text-sm text-gray-500">{d.specialization}</p>
                </div>
                <Link href={`/appointments/book?doctor=${d.id}`}>
                  <Button size="sm">Book</Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/appointments/book"><Button size="lg">Book an appointment</Button></Link>
        </div>
      </div>
    </section>
  );
}
