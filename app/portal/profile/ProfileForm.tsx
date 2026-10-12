"use client";

import { useActionState } from "react";
import { updateMyProfile, type ActionResult } from "../actions";
import { Button, Input } from "@/components/ui";
import { Alert } from "@/components/ui/kit";

export default function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(updateMyProfile, {});

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      {state.ok && <Alert tone="success">Profile updated.</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <Input label="Full name" name="fullName" defaultValue={fullName} required />
      <Input label="Phone" name="phone" type="tel" defaultValue={phone} />
      <Input label="Email" value={email} disabled hint="Email is managed by your login and can't be changed here." />

      <Button type="submit" loading={pending} className="self-start">Save changes</Button>
    </form>
  );
}
