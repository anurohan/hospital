"use client";

import { useActionState, useState, useTransition } from "react";
import {
  registerPatient,
  bookWalkIn,
  searchPatientsAction,
  type StaffResult,
} from "../actions";
import { Button, Input } from "@/components/ui";
import { Select, Alert } from "@/components/ui/kit";
import type { Doctor, Patient } from "@/types";

export default function ReceptionPatients({ doctors }: { doctors: Doctor[] }) {
  const [regState, regAction, regPending] = useActionState<StaffResult, FormData>(registerPatient, {});
  const [walkState, walkAction, walkPending] = useActionState<StaffResult, FormData>(bookWalkIn, {});

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [searching, startSearch] = useTransition();

  function doSearch() {
    if (!query.trim()) return;
    startSearch(async () => setResults(await searchPatientsAction(query)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Register new patient */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Register new patient</h2>
        {regState.info && <Alert tone="success">{regState.info}</Alert>}
        {regState.error && <Alert tone="error">{regState.error}</Alert>}
        <form action={regAction} className="mt-3 grid grid-cols-2 gap-3">
          <div className="col-span-2"><Input label="Full name" name="fullName" required error={regState.fieldErrors?.fullName} /></div>
          <Input label="Phone" name="phone" type="tel" required error={regState.fieldErrors?.phone} />
          <Input label="Email" name="email" type="email" error={regState.fieldErrors?.email} />
          <Select label="Gender" name="gender">
            <option value="">—</option>
            <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
          </Select>
          <Input label="Date of birth" name="dateOfBirth" type="date" />
          <div className="col-span-2"><Input label="Address" name="address" /></div>
          <Input label="City" name="city" />
          <Input label="Pincode" name="pincode" />
          <div className="col-span-2 mt-1">
            <Button type="submit" loading={regPending}>Register patient</Button>
          </div>
        </form>
      </section>

      {/* Find patient + walk-in */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Find patient &amp; book walk-in</h2>
        <div className="flex gap-2">
          <Input placeholder="Name, phone or UID" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }} className="flex-1" />
          <Button variant="outline" onClick={doSearch} loading={searching}>Search</Button>
        </div>

        <div className="mt-3 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {results.map((p) => (
            <button key={p.id} type="button" onClick={() => setSelected(p)}
              className={`rounded-md border px-3 py-2 text-left text-sm ${selected?.id === p.id ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:bg-gray-50"}`}>
              <span className="font-medium text-gray-900">{p.full_name}</span>
              <span className="ml-2 text-gray-500">{p.phone}</span>
              {p.patient_uid && <span className="ml-2 font-mono text-xs text-gray-400">{p.patient_uid}</span>}
            </button>
          ))}
          {!searching && query && results.length === 0 && (
            <p className="text-sm text-gray-500">No matching patients. Register them on the left.</p>
          )}
        </div>

        {selected && (
          <form action={walkAction} className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-2 text-sm">Walk-in for <span className="font-semibold">{selected.full_name}</span></p>
            {walkState.info && <Alert tone="success">{walkState.info}</Alert>}
            {walkState.error && <Alert tone="error">{walkState.error}</Alert>}
            <input type="hidden" name="patientId" value={selected.id} />
            <Select label="Doctor" name="doctorId" required className="mt-2">
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.full_name} — {d.specialization}</option>)}
            </Select>
            <Input label="Reason (optional)" name="reason" className="mt-2" />
            <Button type="submit" className="mt-3" loading={walkPending}>Book walk-in</Button>
          </form>
        )}
      </section>
    </div>
  );
}
