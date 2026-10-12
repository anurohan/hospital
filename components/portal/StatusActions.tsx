import { setStatus, cancelAsStaff } from "@/app/reception/actions";
import type { Appointment } from "@/types";

function StatusButton({ id, status, label, tone }: { id: string; status: string; label: string; tone: string }) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="appointmentId" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${tone}`}>{label}</button>
    </form>
  );
}

/** Reception/staff status controls, context-aware based on the current status. */
export default function StatusActions({ appointment }: { appointment: Appointment }) {
  const { id, status } = appointment;
  const terminal = ["completed", "cancelled", "no_show"].includes(status);
  if (terminal) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(status === "pending" || status === "confirmed") && (
        <StatusButton id={id} status="waiting" label="Check in" tone="bg-teal-600 text-white hover:bg-teal-700" />
      )}
      {status === "waiting" && (
        <StatusButton id={id} status="in_consultation" label="Start" tone="bg-sky-600 text-white hover:bg-sky-700" />
      )}
      {status === "in_consultation" && (
        <StatusButton id={id} status="completed" label="Complete" tone="bg-green-600 text-white hover:bg-green-700" />
      )}
      {(status === "waiting" || status === "confirmed" || status === "pending") && (
        <StatusButton id={id} status="no_show" label="No-show" tone="bg-amber-500 text-white hover:bg-amber-600" />
      )}
      {["pending", "confirmed"].includes(status) && (
        <form action={cancelAsStaff}>
          <input type="hidden" name="appointmentId" value={id} />
          <input type="hidden" name="reason" value="Cancelled at reception" />
          <button type="submit" className="rounded-md px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100">Cancel</button>
        </form>
      )}
    </div>
  );
}
