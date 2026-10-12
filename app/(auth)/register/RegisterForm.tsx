"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "../actions";
import { Button, Input } from "@/components/ui";
import { Alert } from "@/components/ui/kit";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {});

  if (state.notice) {
    return <Alert tone="success">{state.notice}</Alert>;
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Input label="Full name" name="fullName" autoComplete="name" required error={state.fieldErrors?.fullName} />
      <Input label="Email" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" required error={state.fieldErrors?.phone} />
      <Input label="Password" name="password" type="password" autoComplete="new-password" required error={state.fieldErrors?.password} hint="At least 8 characters" />
      <Button type="submit" size="lg" loading={pending} className="mt-2 w-full justify-center">
        Create account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sky-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
