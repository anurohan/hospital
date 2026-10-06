# Security Architecture

## Principles

1. **Never commit secrets** — All credentials in `.env.local` (gitignored)
2. **Least privilege** — RLS restricts data access at the DB level
3. **Server-side secrets** — Service role key never reaches the browser
4. **Input validation** — All form inputs validated server-side
5. **Audit trail** — All write operations logged to `audit_logs`

---

## Environment Variables

| Variable                       | Scope        | Notes                          |
|-------------------------------|--------------|--------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`    | Browser+Server | Safe to expose               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser+Server | Safe, RLS enforced          |
| `SUPABASE_SERVICE_ROLE_KEY`   | Server-only  | NEVER expose to browser        |

---

## Authentication Flow (Phase 1)

1. User signs up/in via Supabase Auth (email+password or OTP)
2. JWT issued by Supabase
3. Next.js middleware validates JWT on protected routes
4. Profile fetched from `profiles` table using `auth.uid()`
5. Role-based access enforced at component + API level

---

## Row Level Security

Every sensitive table has RLS enabled. Policies ensure:

- Patients can only see their own records
- Doctors see only their own hospital's patients
- Admins have full access within their hospital
- Superadmins have cross-hospital access (for SaaS admin)

---

## Data Protection

- Patient data encrypted at rest (Supabase default)
- HTTPS enforced in production (Vercel)
- No PHI in logs or error messages
- Consent collected before data entry (to be implemented)

---

## OWASP Top 10 Mitigations

| Threat              | Mitigation                            |
|--------------------|---------------------------------------|
| Injection          | Parameterized queries (Supabase SDK)  |
| Broken Auth        | Supabase Auth + JWT                   |
| XSS                | React escapes by default              |
| CSRF               | SameSite cookies, server actions      |
| Sensitive Data     | RLS + encrypted storage               |
| Broken Access      | Role-based middleware + RLS           |
