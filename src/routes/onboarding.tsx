import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles } from "lucide-react";
import { Logo } from "@/components/eduvest/Logo";
import { Button } from "@/components/ui/button";
import { Stepper, MobileStepper } from "@/components/onboarding/Stepper";
import { Field, ChipInput, Toggle } from "@/components/onboarding/Field";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLanguage } from "@/hooks/use-language";
import { SCHOOL_TYPES, ONBOARDING_STEPS, type SchoolType } from "@/lib/eduvest/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your workspace — EduVest" },
      { name: "description", content: "Complete your school's onboarding to launch EduVest." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, markOnboarded } = useAuth();
  const { state, update, setStep } = useOnboarding();
  const { lang, toggle: toggleLang } = useLanguage();

  useEffect(() => {
    if (!user) navigate({ to: "/signup" });
  }, [user, navigate]);

  const stepMeta = ONBOARDING_STEPS[state.step - 1];

  const canContinue = useMemo(() => {
    switch (state.step) {
      case 2:
        return !!state.profile.schoolName && state.profile.schoolTypes.length > 0;
      default:
        return true;
    }
  }, [state]);

  const next = () => {
    if (state.step >= 9) {
      markOnboarded();
      navigate({ to: "/workspace" });
      return;
    }
    setStep(state.step + 1);
  };
  const back = () => setStep(state.step - 1);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:bg-secondary"
            >
              {lang === "en" ? "EN · FR" : "FR · EN"}
            </button>
          </div>
        </header>

        <MobileStepper current={state.step} />

        <div className="grid flex-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-10 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-4 px-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Workspace setup</p>
                <p className="mt-1 text-sm text-muted-foreground">{state.step} of 9 steps</p>
              </div>
              <Stepper current={state.step} onJump={setStep} />
            </div>
          </aside>

          <main>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
              <p className="text-sm font-semibold text-primary">Step {state.step} of 9</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{stepMeta.label}</h1>

              <div className="mt-8">
                {state.step === 1 && <StepAccount user={user} />}
                {state.step === 2 && <StepProfile state={state} update={update} />}
                {state.step === 3 && <StepAcademic state={state} update={update} />}
                {state.step === 4 && <StepBranding state={state} update={update} />}
                {state.step === 5 && <StepStudents state={state} update={update} />}
                {state.step === 6 && <StepTeachers state={state} update={update} />}
                {state.step === 7 && <StepTimetable state={state} update={update} />}
                {state.step === 8 && <StepFinance state={state} update={update} />}
                {state.step === 9 && <StepLaunch state={state} />}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" onClick={back} disabled={state.step === 1}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button variant="hero" size="lg" onClick={next} disabled={!canContinue}>
                  {state.step === 9 ? (
                    <>Launch workspace <Sparkles className="h-4 w-4" /></>
                  ) : (
                    <>Continue <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ============ Steps ============

type U = ReturnType<typeof useOnboarding>["update"];
type S = ReturnType<typeof useOnboarding>["state"];

function StepAccount({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">We'll use this account as the school's primary admin.</p>
      <div className="rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-primary-foreground">
            {user?.fullName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Check className="h-3 w-3" /> Verified
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">You can invite teammates after the workspace is launched.</p>
    </div>
  );
}

function StepProfile({ state, update }: { state: S; update: U }) {
  const p = state.profile;
  const set = (patch: Partial<S["profile"]>) => update("profile", { ...p, ...patch });

  const toggleType = (t: SchoolType) => {
    const has = p.schoolTypes.includes(t);
    set({ schoolTypes: has ? p.schoolTypes.filter((x) => x !== t) : [...p.schoolTypes, t] });
  };

  const onLogo = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="School name *">
          <input className="field-input" value={p.schoolName} onChange={(e) => set({ schoolName: e.target.value })} placeholder="Greenfield Academy" />
        </Field>
        <Field label="Principal name">
          <input className="field-input" value={p.principalName} onChange={(e) => set({ principalName: e.target.value })} placeholder="Mr. Samuel K." />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <input className="field-input" value={p.address} onChange={(e) => set({ address: e.target.value })} placeholder="123 School Road, Douala" />
        </Field>
        <Field label="Country">
          <input className="field-input" value={p.country} onChange={(e) => set({ country: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className="field-input" value={p.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+237 ..." />
        </Field>
        <Field label="Contact email">
          <input className="field-input" type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} placeholder="contact@school.com" />
        </Field>
        <Field label="Website">
          <input className="field-input" value={p.website} onChange={(e) => set({ website: e.target.value })} placeholder="https://school.com" />
        </Field>
        <Field label="Motto" className="sm:col-span-2">
          <input className="field-input" value={p.motto} onChange={(e) => set({ motto: e.target.value })} placeholder="Knowledge. Character. Excellence." />
        </Field>
      </div>

      <Field label="School logo" hint="PNG or JPG, square works best.">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/40">
            {p.logoDataUrl ? (
              <img src={p.logoDataUrl} alt="Logo preview" className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
            <Upload className="h-4 w-4" />
            {p.logoDataUrl ? "Replace logo" : "Upload logo"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onLogo(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      </Field>

      <Field label="School type * (select all that apply)">
        <div className="flex flex-wrap gap-2">
          {SCHOOL_TYPES.map((t) => {
            const on = p.schoolTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  on
                    ? "border-primary bg-primary text-primary-foreground shadow-brand"
                    : "border-border bg-background hover:border-primary/40 hover:bg-secondary",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function StepAcademic({ state, update }: { state: S; update: U }) {
  const a = state.academic;
  const set = (patch: Partial<S["academic"]>) => update("academic", { ...a, ...patch });
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Define how your school is structured. You can change this later.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Sections" hint="e.g. Primary, Secondary, University">
          <ChipInput values={a.sections} onChange={(v) => set({ sections: v })} placeholder="Add a section" />
        </Field>
        <Field label="Campuses" hint="e.g. Main Campus, Annex">
          <ChipInput values={a.campuses} onChange={(v) => set({ campuses: v })} placeholder="Add a campus" />
        </Field>
        <Field label="Streams" hint="e.g. Science, Arts, Commercial">
          <ChipInput values={a.streams} onChange={(v) => set({ streams: v })} placeholder="Add a stream" />
        </Field>
        <Field label="Levels" hint="e.g. Form 1, Form 2, Class 6">
          <ChipInput values={a.levels} onChange={(v) => set({ levels: v })} placeholder="Add a level" />
        </Field>
      </div>
    </div>
  );
}

function StepBranding({ state, update }: { state: S; update: U }) {
  const b = state.branding;
  const set = (patch: Partial<S["branding"]>) => update("branding", { ...b, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary color">
          <div className="flex items-center gap-3">
            <input type="color" value={b.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-background" />
            <input className="field-input" value={b.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} />
          </div>
        </Field>
        <Field label="Secondary color">
          <div className="flex items-center gap-3">
            <input type="color" value={b.secondaryColor} onChange={(e) => set({ secondaryColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-background" />
            <input className="field-input" value={b.secondaryColor} onChange={(e) => set({ secondaryColor: e.target.value })} />
          </div>
        </Field>
      </div>
      <Field label="Social links">
        <div className="grid gap-3 sm:grid-cols-2">
          {(["facebook", "twitter", "instagram", "linkedin"] as const).map((s) => (
            <input
              key={s}
              className="field-input"
              placeholder={`${s[0].toUpperCase() + s.slice(1)} URL`}
              value={b.socials[s]}
              onChange={(e) => set({ socials: { ...b.socials, [s]: e.target.value } })}
            />
          ))}
        </div>
      </Field>
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
        <Upload className="mx-auto mb-2 h-5 w-5" />
        Letterhead template upload — coming soon
      </div>
    </div>
  );
}

function StepStudents({ state, update }: { state: S; update: U }) {
  const s = state.students;
  const set = (patch: Partial<S["students"]>) => update("students", { ...s, ...patch });
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Tell us roughly how many students and parents to expect.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estimated students">
          <input type="number" className="field-input" value={s.studentCount} onChange={(e) => set({ studentCount: Number(e.target.value) })} />
        </Field>
        <Field label="Estimated parents">
          <input type="number" className="field-input" value={s.parentCount} onChange={(e) => set({ parentCount: Number(e.target.value) })} />
        </Field>
      </div>
      <Field label="Bulk import (CSV)" hint="We'll parse and validate after backend setup.">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-8 text-sm text-muted-foreground hover:border-primary">
          <Upload className="h-5 w-5" />
          {s.importFileName ? s.importFileName : "Drop CSV here or click to upload"}
          <input type="file" accept=".csv" className="hidden" onChange={(e) => set({ importFileName: e.target.files?.[0]?.name ?? "" })} />
        </label>
      </Field>
    </div>
  );
}

function StepTeachers({ state, update }: { state: S; update: U }) {
  const t = state.teachers;
  const set = (patch: Partial<S["teachers"]>) => update("teachers", { ...t, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of teachers">
          <input type="number" className="field-input" value={t.teacherCount} onChange={(e) => set({ teacherCount: Number(e.target.value) })} />
        </Field>
        <Field label="HR / non-teaching staff">
          <input type="number" className="field-input" value={t.hrCount} onChange={(e) => set({ hrCount: Number(e.target.value) })} />
        </Field>
      </div>
      <Field label="Staff import (CSV)">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-8 text-sm text-muted-foreground hover:border-primary">
          <Upload className="h-5 w-5" />
          {t.importFileName ? t.importFileName : "Drop CSV here or click to upload"}
          <input type="file" accept=".csv" className="hidden" onChange={(e) => set({ importFileName: e.target.files?.[0]?.name ?? "" })} />
        </label>
      </Field>
    </div>
  );
}

function StepTimetable({ state, update }: { state: S; update: U }) {
  const t = state.timetable;
  const set = (patch: Partial<S["timetable"]>) => update("timetable", { ...t, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Academic year">
          <input className="field-input" value={t.academicYear} onChange={(e) => set({ academicYear: e.target.value })} />
        </Field>
        <Field label="Term system">
          <div className="flex gap-2">
            {(["Trimester", "Semester"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set({ termSystem: opt })}
                className={cn(
                  "flex-1 rounded-full border px-4 py-2 text-sm font-medium",
                  t.termSystem === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Report card template" className="sm:col-span-2">
          <div className="grid gap-2 sm:grid-cols-3">
            {["Standard", "Detailed", "Minimal"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set({ reportTemplate: opt })}
                className={cn(
                  "rounded-2xl border p-4 text-left text-sm font-medium transition-colors",
                  t.reportTemplate === opt
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background hover:bg-secondary",
                )}
              >
                {opt}
                <p className="mt-1 text-xs font-normal text-muted-foreground">Template preview placeholder</p>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepFinance({ state, update }: { state: S; update: U }) {
  const f = state.finance;
  const set = (patch: Partial<S["finance"]>) => update("finance", { ...f, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Currency">
          <select className="field-input" value={f.currency} onChange={(e) => set({ currency: e.target.value })}>
            {["XAF", "XOF", "NGN", "USD", "EUR", "GHS", "KES"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Fee categories">
          <ChipInput values={f.feeCategories} onChange={(v) => set({ feeCategories: v })} placeholder="e.g. Tuition" />
        </Field>
      </div>
      <Field label="Payment methods">
        <div className="grid gap-2 sm:grid-cols-2">
          <Toggle label="Mobile Money" checked={f.paymentMethods.mobileMoney} onChange={(v) => set({ paymentMethods: { ...f.paymentMethods, mobileMoney: v } })} />
          <Toggle label="Bank Transfer" checked={f.paymentMethods.bankTransfer} onChange={(v) => set({ paymentMethods: { ...f.paymentMethods, bankTransfer: v } })} />
          <Toggle label="Cash" checked={f.paymentMethods.cash} onChange={(v) => set({ paymentMethods: { ...f.paymentMethods, cash: v } })} />
          <Toggle label="Card" checked={f.paymentMethods.card} onChange={(v) => set({ paymentMethods: { ...f.paymentMethods, card: v } })} />
        </div>
      </Field>
    </div>
  );
}

function StepLaunch({ state }: { state: S }) {
  const summary = [
    { label: "School", value: state.profile.schoolName || "—" },
    { label: "Types", value: state.profile.schoolTypes.join(", ") || "—" },
    { label: "Sections", value: state.academic.sections.join(", ") || "—" },
    { label: "Campuses", value: state.academic.campuses.join(", ") || "—" },
    { label: "Students (est.)", value: String(state.students.studentCount) },
    { label: "Teachers", value: String(state.teachers.teacherCount) },
    { label: "Academic year", value: state.timetable.academicYear },
    { label: "Currency", value: state.finance.currency },
  ];
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-brand p-1">
        <div className="rounded-[14px] bg-card p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Ready to launch
          </div>
          <h2 className="mt-3 text-xl font-bold">Your EduVest workspace is configured.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the summary below and launch when you're ready. You can edit everything later.
          </p>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
