# Students & Attendance UI Adjustments

No redesign. Targeted UI + data-flow adjustments using existing tokens, components, and mock data layer.

## 1. Students = source of truth

All student records (online admissions + CSV imports + manual adds) live in one store and are read by Attendance, Digital ID, Finance, Messages, Parents.

- Keep `STUDENTS` in `src/lib/eduvest/dashboard-mock.ts` as the single source.
- Admission "Accept" pushes the admission record into `STUDENTS` (currently it only changes status).
- CSV import stays on Students page only — remove duplicate import entry points elsewhere if any.
- Attendance, Digital ID etc. continue to read from `STUDENTS` (already true) — no logic rewrite, just confirm.

## 2. New Students page layout (matches reference)

Top of page, in order:
1. Section toggle: **English Section** / **French Section** (pill tabs).
2. Date label on the right ("Date: 10th May 2026").
3. Analytics row — **fees-focused** (replaces attendance metrics):
   - Total Students
   - Fees Completed
   - Fees Started (partial)
   - Not Started
   - Registered
   - Pending Registration
4. Workspace label + "Apply Filters" button.
5. Class chips row: `All · Form 1 · Form 2 · Form 3 · Form 4 · Form 5` (English) or `6ème · 5ème · 4ème · 3ème · 2nde` (French), driven by the section toggle.
6. Search bar.
7. **Subclass column** (left): when a class is selected, list its subclasses (`Form 1A`, `Form 1B`…) with an "+ Add subclass" button.
8. Student table on the right of the subclass column.

The section toggle, analytics row, and class/subclass chips are reused across **every workspace** (Pre-Nursery, Nursery, Primary, Secondary, Higher Ed, Higher Institute, University). Layout is identical; only the class labels differ per workspace.

## 3. Subclasses (streams A/B/C/D…)

- `division` already exists on `Student`. Add a derived `subclasses(workspace, level)` helper that returns the sorted, unique divisions present + any manually-added ones.
- "Add subclass" opens a small dialog: pick letter (A–Z), optionally import CSV scoped to that subclass.
- New subclasses persist in localStorage keyed by `${workspace}:${level}` so `Form 1C` shows up sorted between `Form 1B` and `Form 2A`.
- Sort order: `level index` then `division alpha` (so Form 1A, Form 1B, Form 1C, Form 2A…).

## 4. Student row → 3-dot menu

Replace row-click open with a 3-dot menu on the right of each row:
- **View student details** — opens full profile dialog
- Message parent
- Print ID card
- Edit
- Remove

## 5. Full student profile (from admission data)

Extend `Student` type with the admission fields:
- `dob`, `gender`, `nationality`, `address`
- `health`: blood group, allergies, conditions, emergency contact
- `family`: mother, father, guardian (if different), marital status of parents
- `previousSchool`, `religion` (optional)
- `documents`: photo, birth cert, prior reports (mock URLs)
- `fees` breakdown: registration, tuition, paid, balance

Profile dialog gets tabs: **Overview · Family · Health · Academic · Fees · Documents**.

The Admissions "Review" dialog shows the same tabs + fee status, with **Accept / Reject / Waitlist** buttons. Accepting promotes the admission into `STUDENTS`.

## 6. Remark Today

- Add `remarks: { date, teacher, text }[]` to `Student`.
- "Remark Today" lives on the **Attendance** page (not Students). Clicking a student in Attendance opens a small panel where the teacher types today's remark; it appends to the array.
- Student profile → Academic tab shows full remark history.

## 7. Attendance page — receive the moved metrics

Move from Students to Attendance:
- Total Students · Present Today · Absent Today · Late Today · Excused Today · Remarks Today
- Two sub-tabs already exist: **Gate Attendance** / **Class Attendance** — keep.
- Class Attendance shows per-subclass roster with check-in toggles and a remark input per row.

## 8. Teachers responsibility model

- Secondary / High School / Higher Institute / University: teachers are assigned to **subjects + class periods** (many-to-many).
- Pre-Nursery / Nursery / Primary: each subclass has **one lead teacher + optional assistant**.

Reflect this in mock data (`teachers-mock` extension) and surface in:
- Student profile → Academic tab ("Class teachers" list per workspace rules).
- Attendance → Class Attendance header shows the responsible teacher(s) for that subclass/period.

## 9. Files to touch

- `src/lib/eduvest/dashboard-mock.ts` — extend Student type, add admission-rich fields, remarks array, subclass helpers.
- `src/lib/eduvest/academic-levels.ts` — add `englishLevels(workspace)` / `frenchLevels(workspace)` split (keep combined list as fallback).
- `src/lib/eduvest/admissions-mock.ts` — add full admission detail fields + `promoteToStudent()`.
- `src/routes/dashboard.students.tsx` — new layout (section toggle, fees analytics, subclass column, 3-dot menu, profile dialog with tabs).
- `src/routes/dashboard.attendance.tsx` — receive moved metrics, add remark editor per student, show responsible teacher.
- `src/routes/dashboard.admissions.tsx` — richer review dialog with tabs + Accept-promotes-to-student.
- New: `src/components/eduvest/SectionToggle.tsx` (English/French pill tabs, reused everywhere).
- New: `src/components/eduvest/StudentProfileDialog.tsx` (shared by Students + Admissions review).

## 10. Out of scope (confirm if you want these too)

- Real backend / Lovable Cloud wiring — staying on mock data unless you say otherwise.
- Teacher scheduling UI (timetable already exists; only the assignment data model is extended here).
- Bulk subclass rename / merge.

Ready to switch to build mode?
