# Arogyan Hospital SaaS — Architecture

## Overview

This is a **multi-tenant Hospital Appointment & Patient Management SaaS** built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and Supabase.

The first tenant is **Arogyan Nursing Hospital**, Bishunganj, Gaya, Bihar.

---

## Technology Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 16 (App Router)           |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS 4 + Custom CSS Tokens|
| Database      | PostgreSQL (via Supabase)         |
| Auth          | Supabase Auth                     |
| ORM/Client    | Supabase JS Client v2             |
| UI Primitives | Custom components + shadcn/ui     |
| Icons         | Inline SVG (zero dependency)      |
| Deployment    | Vercel (recommended)              |

---

## Directory Structure

```
D:\5th sem\hospital\
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (metadata, fonts)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Design system / tokens
│   └── (future routes)
│       ├── appointments/
│       ├── doctors/
│       ├── departments/
│       ├── portal/         # Patient portal
│       ├── admin/          # Admin dashboard
│       └── auth/
├── components/
│   ├── ui/                 # Primitive UI components
│   │   └── index.tsx       # Button, Card, Badge, Input, ...
│   ├── layout/             # App-wide layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/           # Homepage sections
│       ├── HeroSection.tsx
│       ├── DepartmentsSection.tsx
│       ├── WhyUsSection.tsx
│       └── ContactSection.tsx
├── config/
│   └── hospital.ts         # Multi-tenant hospital config
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Shared utilities
├── types/
│   └── index.ts            # TypeScript domain types
├── services/               # (Phase 1) Business logic / API calls
├── hooks/                  # (Phase 1) React hooks
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed/
├── docs/                   # Project documentation
├── public/                 # Static assets
│   └── images/
├── START.bat
├── STOP.bat
├── BUILD.bat
├── .env.example
├── .gitignore
└── README.md
```

---

## Multi-Tenant Architecture

The system is designed to support multiple hospitals:

1. **Configuration layer**: `config/hospital.ts` exports `HOSPITAL_CONFIG`. 
   - For multi-tenant SaaS: resolve config from subdomain → `hospitals` table.
2. **Database layer**: All tables have a `hospital_id` FK.
3. **Auth layer**: Profiles include `hospital_id`.
4. **RLS**: Row-level security enforces hospital isolation.

---

## App Router Conventions

- Server Components by default
- `"use client"` only where interactivity is needed (Header, forms)
- Route groups for layout sharing: `(public)`, `(auth)`, `(portal)`, `(admin)`
- Server Actions for form mutations (Phase 1+)
- Middleware for auth protection (Phase 1)

---

## Design System

Defined entirely in `app/globals.css` using CSS custom properties:

- Color tokens (primary blue, teal accent, navy dark, grays)
- Typography (Inter + Lexend from Google Fonts)
- Spacing scale
- Shadow scale
- Border radius scale
- Transition utilities
- Component foundations: `.btn`, `.card`, `.input`, `.badge`

---

## Security Architecture

See `docs/security.md` for full details.

- Supabase RLS enforces data isolation
- No secrets in source code
- Service role key server-side only
- Audit logs for all write operations
