# Database Architecture

## Database: PostgreSQL via Supabase

---

## Entity Relationship Summary

```
hospitals
  ├── profiles       (auth users extended)
  ├── departments    (head_doctor_id → doctors)
  ├── doctors        (department_id → departments)
  ├── patients       (profile_id → profiles)
  ├── doctor_schedules (doctor_id → doctors)
  ├── appointment_slots
  ├── appointments   (patient_id, doctor_id, department_id, slot_id)
  ├── notifications  (user_id → auth.users)
  ├── hospital_settings
  └── audit_logs
```

---

## Tables

### `hospitals`
Multi-tenant root table. Each hospital has a unique `slug`.

### `profiles`
Extends `auth.users`. Stores role, name, phone, hospital membership.

Roles: `patient | doctor | nurse | admin | superadmin`

### `patients`
Patient master record. Can be linked to a profile (registered user) or remain anonymous (walk-in). Each gets a `patient_uid` like `ARG-2024-00001`.

### `doctors`
Doctor profile with specialization, department, fees. Linked to a `profile`.

### `departments`
Hospital departments. Has optional `head_doctor_id`.

### `doctor_schedules`
Weekly schedule per doctor. Defines time slots.

### `appointment_slots`
Pre-generated or on-demand slots derived from schedules.

### `appointments`
Core booking record. Links patient ↔ doctor ↔ slot ↔ department.

Statuses: `pending → confirmed → in_progress → completed`
Also: `cancelled | no_show`

### `notifications`
In-app notification feed. Type-safe notification categories.

### `hospital_settings`
Key-value store for per-hospital configuration overrides.

### `audit_logs`
Immutable log of all write actions with before/after JSON snapshots.

---

## Row Level Security

All sensitive tables have RLS enabled. Key policies:

| Table          | Policy                                |
|----------------|---------------------------------------|
| `profiles`     | Own profile only                      |
| `patients`     | Self or staff in same hospital        |
| `appointments` | Patient or staff in same hospital     |
| `notifications`| Own only                              |
| `audit_logs`   | Admin/superadmin only (to be added)   |

---

## Migration

File: `supabase/migrations/001_initial_schema.sql`

To apply:
```bash
# Via Supabase CLI
supabase db push

# Or paste into Supabase Dashboard → SQL Editor
```

---

## Future Tables (Phase 2+)

- `medical_records` — Clinical notes, diagnoses
- `prescriptions` — Medication records
- `documents` — File attachments (Supabase Storage)
- `payments` — Payment records + receipts
- `lab_orders` / `lab_results` — Diagnostic integration
- `wards` / `beds` — In-patient management
