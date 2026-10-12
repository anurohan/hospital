"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyAppointment, rescheduleMyAppointment, type ActionResult } from "../../actions";
import { getSlotsAction, type SlotsResult } from "@/app/(public)/appointments/book/actions";
import { Button, Input } from "@/components/ui";
import { Alert } from "@/components/ui/kit";
import { formatTime } from "@/lib/utils";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export default function AppointmentActions({
  appointmentId,
  doctorId,
}: {
  appointmentId: string;
  doctorId: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "reschedule">("idle");
  const [cancelState, cancelAction, cancelPending] = useActionState<ActionResult, FormData>(cancelMyAppointment, {});

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<SlotsResult | null>(null);
  const [slot, setSlot] = useState("");
  const [rescheduleState, rescheduleAction, reschedulePending] = useActionState<ActionResult, FormData>(rescheduleMyAppointment, {});
  const [loadingSlots, startLoad] = useTransition();

  if (cancelState.ok) { router.refresh(); }
  if (rescheduleState.ok) { router.refresh(); }

  function loadSlots(d: string) {
    setSlot(""); setSlots(null);
    if (!d) return;
    startLoad(async () => setSlots(await getSlotsAction(doctorId, d)));
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {cancelState.error && <Alert tone="error">{cancelState.error}</Alert>}
      {rescheduleState.error && <Alert tone="error">{rescheduleState.error}</Alert>}

      {mode === "idle" && (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setMode("reschedule")}>Reschedule</Button>
          <form action={cancelAction}>
            <input type="hidden" name="appointmentId" value={appointmentId} />
            <input type="hidden" name="reason" value="Cancelled by patient" />
            <Button type="submit" variant="danger" loading={cancelPending}>Cancel appointment</Button>
          </form>
        </div>
      )}

      {mode === "reschedule" && (
        <form action={rescheduleAction} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="startTime" value={slot} />
          <Input label="New date" type="date" name="date" min={todayISO()} value={date}
            onChange={(e) => { setDate(e.target.value); loadSlots(e.target.value); }} required />

          {date && (
            <div className="mt-3">
              <p className="label mb-2">New time</p>
              {loadingSlots && !slots ? <p className="text-sm text-gray-500">Loading…</p>
                : slots?.closed ? <p className="text-sm text-gray-500">Closed that day.</p>
                : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots?.slots.filter((s) => s.is_available).map((s) => (
                    <button key={s.start_time} type="button" onClick={() => setSlot(s.start_time)}
                      className={`rounded-md border px-2 py-2 text-sm ${slot === s.start_time ? "border-sky-600 bg-sky-600 text-white" : "border-gray-300 bg-white hover:border-sky-400"}`}>
                      {formatTime(s.start_time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={!slot || reschedulePending} loading={reschedulePending}>Confirm new time</Button>
            <Button type="button" variant="ghost" onClick={() => setMode("idle")}>Back</Button>
          </div>
        </form>
      )}
    </div>
  );
}
