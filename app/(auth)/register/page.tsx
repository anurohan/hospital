import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import { getSessionUser } from "@/lib/auth/session";
import { homeForRole } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const session = await getSessionUser();
  if (session) redirect(homeForRole(session.profile.role));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">Register as a patient to book and track appointments.</p>
      <RegisterForm />
    </div>
  );
}
