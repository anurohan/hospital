import type { Metadata } from "next";
import Link from "next/link";
import { listDepartments } from "@/lib/services/directory";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore our multi-specialty departments and the care each one provides.",
};

export default async function DepartmentsPage() {
  const departments = await listDepartments();

  return (
    <section className="section">
      <div className="container">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="mt-2 text-gray-500">Comprehensive, multi-specialty care under one roof.</p>
        </div>

        {departments.length === 0 ? (
          <EmptyState
            title="Department information is being updated"
            description="Please check back shortly or contact the hospital for details."
            action={<Link href="/contact"><Button variant="outline">Contact us</Button></Link>}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <div
                  className="mb-3 h-10 w-10 rounded-lg"
                  style={{ background: dept.color ?? "var(--color-primary-100)" }}
                  aria-hidden
                />
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-sky-700">{dept.name}</h2>
                {dept.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-gray-500">{dept.description}</p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-sky-700">Learn more →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
