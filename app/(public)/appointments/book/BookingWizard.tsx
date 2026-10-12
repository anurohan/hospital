"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSlotsAction, createBookingAction, type SlotsResult } from "./actions";
import { Button, Input } from "@/components/ui";
import { Select, Textarea, Alert, EmptyState } from "@/components/ui/kit";
import { formatTime } from "@/lib/utils";
import type { Department, Doctor } from "@/types";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export default function BookingWizard({
  departments,
  doctors,
  initialDoctorId,
  demoMode = false,
}: {
  departments: Department[];
  doctors: Doctor[];
  initialDoctorId?: string;
  demoMode?: boolean;
}) {
  const router = useRouter();
  const initialDoctor = doctors.find((d) => d.id === initialDoctorId);
  const [departmentId, setDepartmentId] = useState(initialDoctor?.department_id ?? "");
  const [doctorId, setDoctorId] = useState(initialDoctorId ?? "");
  const [date, setDate] = useState("");
  const [slotData, setSlotData] = useState<SlotsResult | null>(null);
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{ uid?: string; token?: string | null } | null>(null);
  const [pending, startTransition] = useTransition();

  const visibleDoctors = departmentId
    ? doctors.filter((d) => d.department_id === departmentId)
    : doctors;

  function loadSlots(nextDoctor: string, nextDate: string) {
    setSlot("");
    setSlotData(null);
    if (!nextDoctor || !nextDate) return;
    startTransition(async () => {
      setSlotData(await getSlotsAction(nextDoctor, nextDate));
    });
  }

  function confirm() {
    setError("");
    startTransition(async () => {
      const res = await createBookingAction({ doctorId, departmentId: departmentId || undefined, date, startTime: slot, reason });
      if (res.needAuth) {
        const q = new URLSearchParams({ next: `/appointments/book?doctor=${doctorId}` });
        router.push(`/login?${q.toString()}`);
        return;
      }
      if (res.error) { setError(res.error); loadSlots(doctorId, date); return; }
      setConfirmation({ uid: res.appointmentUid, token: res.tokenNumber });
    });
  }

  if (confirmation) {
    return (
      <Alert tone="success">
        <p className="font-semibold">Appointment confirmed!</p>
        {confirmation.uid && <p>Reference: <span className="font-mono">{confirmation.uid}</span></p>}
        {confirmation.token && <p>Token: <span className="font-mono">{confirmation.token}</span></p>}
        <p className="mt-2">
          <Link href="/portal/appointments" className="font-medium underline">View in your portal →</Link>
        </p>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {error && <Alert tone="error">{error}</Alert>}
      {demoMode && (
        <Alert tone="warning">
          Demo booking only: no live Supabase database is connected yet, so this confirmation is a preview and will not persist.
        </Alert>
      )}

      <Select label="Department (optional)" value={departmentId}
        onChange={(e) => { setDepartmentId(e.target.value); setDoctorId(""); setSlotData(null); }}>
        <option value="">All departments</option>
        {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </Select>

      <Select label="Doctor" value={doctorId}
        onChange={(e) => { setDoctorId(e.target.value); loadSlots(e.target.value, date); }}>
        <option value="">Select a doctor</option>
        {visibleDoctors.map((d) => <option key={d.id} value={d.id}>{d.full_name} — {d.specialization}</option>)}
      </Select>

      <Input label="Date" type="date" min={todayISO()} value={date}
        onChange={(e) => { setDate(e.target.value); loadSlots(doctorId, e.target.value); }} />

      {doctorId && date && (
        <div>
          <p className="label mb-2">Available times</p>
          {pending && !slotData ? (
            <p className="text-sm text-gray-500">Loading availability…</p>
          ) : slotData?.closed ? (
            <EmptyState title="Not available" description="The doctor has no clinic on this day. Try another date." />
          ) : slotData && slotData.slots.filter((s) => s.is_available).length === 0 ? (
            <EmptyState title="Fully booked" description="No open slots for this date. Please pick another day." />
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slotData?.slots.filter((s) => s.is_available).map((s) => (
                <button key={s.start_time} type="button" onClick={() => setSlot(s.start_time)}
                  className={`rounded-md border px-2 py-2 text-sm font-medium ${slot === s.start_time ? "border-sky-600 bg-sky-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:border-sky-400"}`}>
                  {formatTime(s.start_time)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {slot && <Textarea label="Reason for visit (optional)" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />}

      <Button size="lg" disabled={!slot || pending} loading={pending} onClick={confirm} className="justify-center">
        Confirm booking
      </Button>
    </div>
  );
}
