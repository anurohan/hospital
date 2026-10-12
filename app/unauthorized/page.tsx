import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Access denied" };

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">403 — Access denied</p>
      <h1 className="text-2xl font-bold text-gray-900">You don&apos;t have permission to view this page</h1>
      <p className="max-w-md text-sm text-gray-500">
        Your account role doesn&apos;t allow access to this area. If you believe this is a mistake,
        contact your hospital administrator.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/"><Button variant="outline">Go home</Button></Link>
        <Link href="/login"><Button>Switch account</Button></Link>
      </div>
    </div>
  );
}
