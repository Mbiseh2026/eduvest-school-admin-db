## Plan

1. **Create one reliable class structure source**
   - Update the academic levels so each workspace owns the correct classes:
     - **Pre-Nursery**: English + French early years labels
     - **Nursery**: English + French nursery labels
     - **Primary**: English classes and French primary classes together
     - **Secondary**: Form 1–5 plus 6ème–2nde only
     - **Higher Education / High School**: Lower Sixth, Upper Sixth, Première, Terminale
     - **Higher Institute / University**: their own higher-level structure
   - Keep the existing workspace selector and layout unchanged.

2. **Stop data disappearing when language changes**
   - Fix filters so English and French class labels can coexist in the same workspace.
   - The dashboard will no longer replace English classes with French classes when toggling language.
   - Student, parent, finance, admissions, search and Digital ID filters will use stable class values.

3. **Add support for class divisions/streams**
   - Organize classes as:
     ```text
     Workspace → Class level → Division
     Example: Secondary → Form 1 → A
     Example: Secondary → 6ème → B
     Example: Primary → Class 3 → A
     ```
   - Display full class names like **Form 1 A**, **6ème B**, **Class 5 A** where the data has a division.
   - If a small school has no divisions, the division stays blank and the class remains simply **Form 1** or **6ème**.

4. **Fix CSV import expectations**
   - Update the CSV import guidance to separate class level and division:
     ```csv
     workspace,class,division,studentNumber,name,parent,guardian,parentPhone,parentEmail,totalFees,paidFees,registration
     Secondary,Form 1,A,GFS-2026-001,New Student,Jane Doe,Jane Doe,+237...,jane@x.com,300000,100000,Registered
     Secondary,6ème,B,GFS-2026-002,Nouvel Élève,Jean Doe,Jean Doe,+237...,jean@x.com,300000,100000,Registered
     ```
   - For schools without divisions, leave `division` empty.

5. **Apply the same class logic to Digital ID cards**
   - Digital ID student lists and previews will show the full class label including division when available.
   - Teacher ID lists remain workspace-scoped.

## Technical details

- Extend the student model with an optional `division` field while keeping existing `level` and `className` compatibility.
- Add helper functions in `academic-levels.ts` for:
  - canonical class lists by workspace,
  - class label display,
  - matching class filters safely across English/French labels.
- Update only the affected dashboard modules: students, parents, finance, admissions, Digital ID, and topbar search.
- No redesign, no sidebar/workspace structure changes, no backend/API work.