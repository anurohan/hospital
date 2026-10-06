# Arogyan Nursing Hospital — Management SaaS

> **Production-quality Hospital Appointment & Patient Management System**  
> Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

---

## 🏥 First Client

**Arogyan Nursing Hospital**  
Bishunganj, Gaya, Bihar, India  
📞 +91 94730 75435  
🗺️ [Google Maps](https://maps.app.goo.gl/DrhWnC5T2ssiExSF9)

---

## 🚀 Quick Start (Windows)

1. **Double-click `START.bat`** — checks Node, installs deps, starts server, opens browser.

Or manually:

```bash
# Install dependencies
npm install

# Configure environment
copy .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛑 Stop Server

Double-click **`STOP.bat`**

---

## 🏗️ Build for Production

Double-click **`BUILD.bat`** — runs TypeScript check → ESLint → production build.

Or manually:

```bash
npx tsc --noEmit   # TypeScript check
npm run lint       # ESLint
npm run build      # Production build
npm run start      # Preview production build
```

---

## 🔧 Environment Setup

```bash
copy .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📁 Project Structure

```
hospital/
├── app/              # Next.js App Router pages
├── components/
│   ├── ui/           # Reusable UI primitives
│   ├── layout/       # Header, Footer
│   └── sections/     # Homepage sections
├── config/           # Hospital configuration
├── lib/              # Utilities, Supabase client
├── types/            # TypeScript types
├── supabase/
│   └── migrations/   # Database schema
├── docs/             # Project documentation
├── START.bat         # Start dev server
├── STOP.bat          # Stop dev server
└── BUILD.bat         # Production build
```

---

## 📚 Documentation

| Document                   | Description                     |
|----------------------------|---------------------------------|
| [Architecture](docs/architecture.md) | System design & stack |
| [Database](docs/database.md)         | Schema & RLS policies |
| [UI/UX Guide](docs/ui-ux.md)         | Design system         |
| [Security](docs/security.md)         | Security architecture |
| [Testing](docs/testing.md)           | QA & testing guide    |
| [Handover](docs/HANDOVER.md)         | Phase handover notes  |

---

## 🛣️ Roadmap

- **Phase 0** ✅ — Foundation (current)
- **Phase 1** — Appointment booking engine + patient portal
- **Phase 2** — Doctor dashboard + schedule management
- **Phase 3** — Admin dashboard + analytics
- **Phase 4** — Medical records + prescriptions
- **Phase 5** — Payments + notifications

---

## 🔐 Security

- Supabase Row Level Security on all sensitive tables
- No secrets in source code
- `.env.local` is gitignored
- Full audit log trail

---

## 📄 License

Proprietary — All rights reserved.  
© 2024 Arogyan Nursing Hospital / Hospital SaaS Project.
