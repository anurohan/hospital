import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-sky-700">{HOSPITAL_CONFIG.name}</span>
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          {HOSPITAL_CONFIG.tagline}
        </p>
      </div>
    </div>
  );
}
