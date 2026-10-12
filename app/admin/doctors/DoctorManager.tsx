"use client";

import { useActionState, useState } from "react";
import { saveDoctor, toggleDoctor, type AdminResult } from "../actions";
import { Button, Input, Badge } from "@/components/ui";
import { Select, Textarea, Alert } from "@/components/ui/kit";
import type { Doctor, Department } from "@/types";

export default function DoctorManager({ doctors, departments }: { doctors: Doctor[]; departments: Department[] }) {
  const [state, action, pending] = useActionState<AdminResult, FormData>(saveDoctor, {});
  const [editing, setEditing] = useState<Doctor | null>(null);
  const formKey = editing?.id ?? "new";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="px-4 py-3">Doctor</th><th className="hidden px-4 py-3 sm:table-cell">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {doctors.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{d.full_name}</p><p className="text-xs text-gray-500">{d.specialization}</p></td>
                <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{d.department?.name ?? "—"}</td>
                <td className="px-4 py-3">{d.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="gray">Inactive</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(d)} className="text-sm text-sky-700 hover:underline">Edit</button>
                    <form action={toggleDoctor}>
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="active" value={(!d.is_active).toString()} />
                      <button type="submit" className="text-sm text-gray-600 hover:underline">{d.is_active ? "Deactivate" : "Activate"}</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No doctors yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{editing ? "Edit doctor" : "Add doctor"}</h2>
          {editing && <button type="button" onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:underline">New</button>}
        </div>
        {state.info && <Alert tone="success">{state.info}</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}
        <form key={formKey} action={action} className="mt-3 flex flex-col gap-3">
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <Input label="Full name" name="fullName" defaultValue={editing?.full_name ?? ""} required error={state.fieldErrors?.fullName} />
          <Input label="Specialization" name="specialization" defaultValue={editing?.specialization ?? ""} required error={state.fieldErrors?.specialization} />
          <Select label="Department" name="departmentId" defaultValue={editing?.department_id ?? ""}>
            <option value="">— None —</option>
            {departments.map((dep) => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
          </Select>
          <Input label="Qualification" name="qualification" defaultValue={editing?.qualification ?? ""} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Experience (yrs)" name="experienceYears" type="number" defaultValue={String(editing?.experience_years ?? 0)} />
            <Input label="Slot (min)" name="consultationDuration" type="number" defaultValue={String(editing?.consultation_duration ?? 15)} />
          </div>
          <Input label="Consultation fee (₹)" name="consultationFee" type="number" defaultValue={editing?.consultation_fee != null ? String(editing.consultation_fee) : ""} />
          <Textarea label="Bio" name="bio" defaultValue={editing?.bio ?? ""} rows={3} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={editing?.is_active ?? true} /> Active</label>
          <Button type="submit" loading={pending}>{editing ? "Save changes" : "Create doctor"}</Button>
        </form>
      </div>
    </div>
  );
}
