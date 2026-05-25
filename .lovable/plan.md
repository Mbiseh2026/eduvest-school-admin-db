# EduVest School SaaS — MVP Build Plan

A clean, modern, mobile-responsive multi-tenant School SaaS frontend. No backend yet — mock data + scalable API placeholders. PWA-ready (manifest + installable; no aggressive service-worker caching in preview).

> Note on stack: the project template uses **TanStack Start (React 19 + TanStack Router + Tailwind v4)**, not React 18 + Vite 5 + React Router. I'll deliver the same UX and architecture on this stack — it's the supported foundation here and gives you SSR + file-based routing for free. All other choices (TanStack Query, shadcn/ui, Lucide, Montserrat, EduVest tokens) are honored as-is.

---

## 1. Design System

Update `src/styles.css`:
- Brand tokens in `oklch`: `--primary` = EduVest Green `#16A34A`, `--secondary`/`--accent` = Navy `#1E3A8A`, soft neutrals, success/warning/destructive.
- Add `--gradient-hero`, `--gradient-brand`, `--shadow-soft`, `--shadow-elevated`, `--radius` = 1rem.
- Load **Montserrat** via Google Fonts in `__root.tsx` head; set as default font.
- Dark mode tokens included but not exposed in UI (per instructions, no theme toggle).

Tailwind utilities driven entirely by semantic tokens — no raw hex in components.

---

## 2. Routes (file-based)

```
src/routes/
  __root.tsx                  shell + fonts + QueryClientProvider
  index.tsx                   landing page
  about.tsx                   about EduVest
  features.tsx                products & features
  pricing.tsx
  ai.tsx                      AI positioning page
  contact.tsx
  login.tsx
  signup.tsx
  forgot-password.tsx
  verify.tsx                  verification placeholder
  onboarding.tsx              wizard shell (9 steps, in-page stepper)
  workspace.tsx               post-onboarding workspace selector
```

Each public route gets its own `head()` metadata (title, description, og). Sitemap + robots added.

---

## 3. Landing Page

Single scroll-rich landing built from sections (each its own component in `src/components/landing/`):
- `Hero` — headline, sub, dual CTA (Start free / Book demo), generated dashboard mockup image, trust strip.
- `About` — mission, vision, why EduVest.
- `Features` — 10 module cards (Admissions, Attendance, Digital ID, Payroll, Finance, Timetable, AI, HR, Communication, Reports) with Lucide icons.
- `Customers` — 4 segments (Schools, Teachers, Parents, Students).
- `AI` — informational only; explains General App (parents/teachers/students) vs Dashboard (authorities, analytics, finance trends); mentions future offline AI.
- `Pricing` — Starter / Standard / Enterprise placeholder cards.
- `Testimonials` — 3 placeholder cards.
- `FAQ` — shadcn accordion, 6 questions.
- `Footer` — contact, socials, policies, demo CTA, language switcher (EN/FR, stub).

Shared `SiteHeader` with nav + Login/Get Started.

---

## 4. Auth

Modern split-screen layout (brand panel + form):
- `login.tsx`, `signup.tsx`, `forgot-password.tsx`, `verify.tsx`.
- Client-side mock auth via `useAuth` hook backed by `localStorage` (placeholder; swap for real backend later).
- Signup → redirects to `/onboarding` (NOT dashboard).
- Login (when onboarded) → `/workspace`; (when not) → `/onboarding`.

---

## 5. Onboarding Wizard (`/onboarding`)

Single route with left vertical stepper (desktop) / top progress bar (mobile). State persisted to `localStorage` so refresh resumes.

Steps:
1. **Create account** — confirms identity (prefilled from signup).
2. **School profile** — name, address, country, phone, email, motto, website, logo upload (preview), principal name, **school type multi-select** (Prenursery, Nursery, Primary, Secondary, High School, High Institute, University).
3. **Academic structure** — define Sections, Campuses, Streams, Levels (dynamic add/remove chips).
4. **Branding** — logo, primary/secondary color pickers, motto, website, social links, letterhead placeholder upload.
5. **Students + parents** — import placeholder (CSV upload UI, no parsing) + manual count inputs.
6. **Teachers + HR** — same pattern.
7. **Timetable + reports** — academic year, term system, report card template picker (placeholder).
8. **Finance setup** — currency (default XAF), fee categories, payment methods toggles.
9. **Launch workspace** — summary + "Launch" CTA → marks onboarded, routes to `/workspace`.

Language selector (EN/FR) visible in wizard header — single architecture, just swaps copy via a tiny i18n dict (EN complete; FR for key labels; expandable).

---

## 6. Workspace Selector (`/workspace`)

Shown after onboarding and on login. Cards generated from the school's selected types + an "All School" option. Selecting a workspace stores choice and shows a "Dashboard coming soon" placeholder card (dashboard itself is out of scope per spec: "Only onboarding and architecture for now").

---

## 7. State & Data

- `src/hooks/useAuth.ts` — mock auth (localStorage).
- `src/hooks/useOnboarding.ts` — wizard state + persistence.
- `src/lib/mock/` — placeholder data (modules, pricing, FAQ, testimonials).
- `src/lib/api/` — typed stub functions returning Promises so swapping to real fetch later is trivial.
- TanStack Query already wired in root; used for any async stubs.

---

## 8. PWA-ready

- `public/manifest.webmanifest` with EduVest icons (generated), `display: standalone`, theme color = brand green.
- Manifest link added in `__root.tsx` head.
- **No service worker** (per Lovable PWA guidance — service workers break preview). Installable + branded; offline can be added post-MVP.

---

## 9. Components (shadcn-based)

Reuse existing shadcn primitives (Button, Card, Input, Label, Select, Tabs, Accordion, Progress, Dialog, Sheet, Badge, Avatar). Add brand variants via `cva` where needed (e.g. `Button variant="hero"`, `variant="brand"`).

---

## 10. Assets

Generate with imagegen:
- Hero dashboard mockup (premium SaaS preview).
- Abstract brand pattern for auth split-panel.
- Open Graph image.
- App icons (192, 512) for manifest.

---

## 11. Out of scope (explicitly deferred)

- Actual dashboard screens (attendance grids, finance ledgers, etc.).
- Real backend / Lovable Cloud — will enable when you're ready.
- Real i18n library — using a lightweight dict now; swap to `i18next` later.
- Service worker / offline mode.
- Real CSV parsing, file storage, payments.

---

## Deliverable

A polished, navigable EduVest experience: landing → signup → 9-step onboarding → workspace selector, with EduVest brand identity throughout and architecture ready for backend + dashboard modules.
