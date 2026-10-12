"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";
import { Button, Input } from "@/components/ui";
import { Textarea, Alert } from "@/components/ui/kit";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {});

  if (state.ok) {
    return <Alert tone="success">Thanks for reaching out — we&apos;ve received your message and will get back to you soon.</Alert>;
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state.error && <Alert tone="error">{state.error}</Alert>}

      {/* Honeypot field — hidden from humans, left empty. */}
      <div aria-hidden className="hidden">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <Input label="Your name" name="name" required error={state.fieldErrors?.name} />
      <Input label="Phone" name="phone" type="tel" required error={state.fieldErrors?.phone} />
      <Input label="Email (optional)" name="email" type="email" error={state.fieldErrors?.email} />
      <Textarea label="Message" name="message" rows={5} required error={state.fieldErrors?.message} />

      <Button type="submit" size="lg" loading={pending} className="justify-center">
        Send message
      </Button>
    </form>
  );
}
