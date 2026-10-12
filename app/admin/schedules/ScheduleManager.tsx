"use client";

import { useActionState } from "react";
import { saveSchedule, deleteSchedule, type AdminResult } from "../actions";
import { Button, Input } from "@/components/ui";
import { Select, Alert } from "@/components/ui/kit";
import { formatTime } from "@/lib/utils";
import type { DoctorSchedule } from "@/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function ScheduleManager({
  doctorId,
  schedules,
}: {
  doctorId: string;
  schedules: DoctorSchedule[];
}) {
  const [state, action, pending] = useActionState<AdminResult, FormData>(saveSchedule, {});

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="px-4 py-3">Day</th><th className="px-4 py-3">Hours</th><th className="px-4 py-3">Slot</th><th className="px-4 py-3">Max</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium capitalize text-gray-900">{s.day_of_week}</td>
                <td className="px-4 py-3 text-gray-700">{formatTime(s.start_time.slice(0, 5))} – {formatTime(s.end_time.slice(0, 5))}</td>
                <td className="px-4 py-3 text-gray-600">{s.slot_duration_minutes}m</td>
                <td className="px-4 py-3 text-gray-600">{s.max_patients}</td>
                <td className="px-4 py-3">
                  <form action={deleteSchedule}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {schedules.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No schedule set for this doctor.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Add / update day</h2>
        {state.info && <Alert tone="success">{state.info}</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}
        <form action={action} className="mt-3 flex flex-col gap-3">
          <input type="hidden" name="doctorId" value={doctorId} />
          <Select label="Day" name="day" required>
            {DAYS.map((d) => <option key={d} value={d} className="capitalize">{d}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" name="start" type="time" required />
            <Input label="End" name="end" type="time" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Slot (min)" name="slot" type="number" defaultValue="15" />
            <Input label="Max patients" name="maxPatients" type="number" defaultValue="30" />
          </div>
          <Button type="submit" loading={pending}>Save day</Button>
          <p className="text-xs text-gray-400">Saving a day replaces any existing entry for that weekday.</p>
        </form>
      </div>
    </div>
  );
}
