import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { getSessionUser } from "@/lib/auth/session";
import { homeForRole } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await getSessionUser();
  if (session) redirect(homeForRole(session.profile.role));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-500">Sign in to manage your appointments.</p>
      <LoginForm next={next} />
    </div>
  );
}
