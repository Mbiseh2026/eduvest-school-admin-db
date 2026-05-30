## Goal

Refine (not redesign) the dashboard Attendance module so it acts purely as a **monitoring and reporting surface** for data produced by the EduVest Attendance App. No marking happens on the dashboard.

## Scope of changes

Only the attendance area of the dashboard plus its mock data layer. Sidebar, workspace switcher, theme, and other modules stay untouched.

### 1. Rename + repurpose menu

- Sidebar/topbar entry: **"Attendance"** stays, but the primary CTA becomes **"View Attendance"** (no "Mark attendance" button on dashboard).
- Remove the "Mark attendance" button from `src/routes/dashboard.attendance.tsx`.
- Add subtitle: *"Live data synced from the EduVest Attendance App."*

### 2. View Attendance drill-down

Replace the current single-table view with workspace-isolated drill-down:

```text
Workspace → Level → Stream → Records
e.g. Secondary → Form 1 → A → today's roll call
     Primary   → Class 4 → (no stream) → today's roll call
     Higher Ed → Lower Sixth → A
```

- Reuse `LEVELS_BY_WORKSPACE` from `academic-levels.ts` and the existing `useWorkspace` hook.
- Streams pulled from data (A/B/C…/none). No hard-coded cap.
- When workspace = "All School", show a workspace picker first. When a workspace is locked, jump straight to its levels.
- Breadcrumb chips for quick back-navigation (consistent with Students/Parents pattern).

### 3. Roll call monitoring panel

On the attendance landing page, surface:
- Today's totals: Present / Absent / Late / Excused (already exist — keep).
- **Roll Call Status** list: each scheduled class with status `Completed | Pending`, teacher name, submitted-at time.
- Two stat cards: "Roll calls completed X/Y" and "Teachers submitted X/Y".

### 4. Gate vs Class attendance views

Inside a selected class, two tabs:
- **Class roll call** — student list with Present/Absent/Late/Excused badges (read-only).
- **Gate entries** — chronological scans (time, gate, direction) for that class's students.

Plus a workspace-level **Live feed** card showing latest gate scans across the workspace (read-only).

### 5. Actions inside View Attendance

- **Print** daily attendance sheet (reuse `print-pdf.ts`).
- **Download** CSV export of current view.
- **Export** all-day report (CSV).
- **Import** button as a disabled placeholder with tooltip "Attendance is captured in the Attendance App."

### 6. Parent alerts (dashboard-controlled)

Add an **Alerts** section in View Attendance:
- Auto-generated entries for Late / Absent / No gate entry students of the day.
- Channel chips: `Email`, `WhatsApp (soon)`, `Dashboard message`.
- "Send now" + "Snooze" actions (mock — wired to existing messaging mock).

### 7. Weekly report → Sunday

- Update weekly summary card in `dashboard.attendance.tsx` so the schedule label reads **"Auto-shared with parents every Sunday evening."**
- Adjust mock weekly rows to Mon–Sat (or full week) with Sunday as send day.
- Per-parent summary fields: Present days, Absent days, Late count, Attendance %.

### 8. Teacher scoping note (dashboard side only)

No teacher-app build here, but document the contract in mock data:
- `TEACHERS[i].assignedClasses: { workspace, level, stream }[]`.
- Dashboard "Teachers" table gains a small "Assigned classes" column (read-only) so admins can verify what each teacher will see in the Attendance App.

### 9. Mock data layer

Extend `src/lib/eduvest/dashboard-mock.ts`:
- `ROLL_CALL_TODAY`: list of `{ workspaceId, level, stream, subject, teacher, startsAt, endsAt, status, submittedAt? }`.
- `ATTENDANCE_RECORDS`: per-student per-class status with timestamps.
- `GATE_EVENTS`: `{ studentId, gate, direction, timestamp }`.
- `PARENT_ALERTS_TODAY`: derived list.
- All datasets carry `workspace` so the existing isolation rule keeps working.

## Files to edit / add

- edit `src/routes/dashboard.attendance.tsx` (drill-down, tabs, roll-call panel, actions, Sunday label, alerts)
- edit `src/lib/eduvest/dashboard-mock.ts` (new datasets + types, teacher `assignedClasses`)
- edit `src/components/dashboard/DashboardSidebar.tsx` only if the label needs adjusting (likely no change)
- edit `src/routes/dashboard.teachers.tsx` (add "Assigned classes" column)
- reuse `src/lib/eduvest/academic-levels.ts`, `print-pdf.ts`, `useWorkspace`

## Out of scope

- No backend, no realtime transport wiring (mock-only sync).
- No redesign of dashboard chrome, sidebar, or other modules.
- No build of the Attendance App itself.
- No teacher-app login flow.
