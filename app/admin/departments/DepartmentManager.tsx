"use client";

import { useActionState, useState } from "react";
import { saveDepartment, toggleDepartment, type AdminResult } from "../actions";
import { Button, Input, Badge } from "@/components/ui";
import { Textarea, Alert } from "@/components/ui/kit";
import type { Department } from "@/types";

export default function DepartmentManager({ departments }: { departments: Department[] }) {
  const [state, action, pending] = useActionState<AdminResult, FormData>(saveDepartment, {});
  const [editing, setEditing] = useState<Department | null>(null);
  const formKey = editing?.id ?? "new";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{d.name}</p><p className="font-mono text-xs text-gray-400">{d.slug}</p></td>
                <td className="px-4 py-3 text-gray-600">{d.display_order}</td>
                <td className="px-4 py-3">{d.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="gray">Inactive</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(d)} className="text-sm text-sky-700 hover:underline">Edit</button>
                    <form action={toggleDepartment}>
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="active" value={(!d.is_active).toString()} />
                      <button type="submit" className="text-sm text-gray-600 hover:underline">{d.is_active ? "Deactivate" : "Activate"}</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No departments yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{editing ? "Edit department" : "Add department"}</h2>
          {editing && <button type="button" onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:underline">New</button>}
        </div>
        {state.info && <Alert tone="success">{state.info}</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}
        <form key={formKey} action={action} className="mt-3 flex flex-col gap-3">
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <Input label="Name" name="name" defaultValue={editing?.name ?? ""} required error={state.fieldErrors?.name} />
          <Input label="Slug" name="slug" defaultValue={editing?.slug ?? ""} hint="lowercase-with-hyphens" error={state.fieldErrors?.slug} />
          <Textarea label="Description" name="description" defaultValue={editing?.description ?? ""} rows={3} />
          <Input label="Display order" name="displayOrder" type="number" defaultValue={String(editing?.display_order ?? 0)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={editing?.is_active ?? true} /> Active</label>
          <Button type="submit" loading={pending}>{editing ? "Save changes" : "Create department"}</Button>
        </form>
      </div>
    </div>
  );
}
