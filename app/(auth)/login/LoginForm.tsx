"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthState } from "../actions";
import { Button, Input } from "@/components/ui";
import { Alert } from "@/components/ui/kit";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />

      <Button type="submit" size="lg" loading={pending} className="mt-2 w-full justify-center">
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        New patient?{" "}
        <Link href="/register" className="font-medium text-sky-700 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
