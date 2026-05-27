import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Search, Menu, Globe, LogOut, User, ChevronDown, Check, GraduationCap, Users, UserCog, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLanguage } from "@/hooks/use-language";
import { NOTIFICATIONS, STUDENTS, PARENTS, TEACHERS } from "@/lib/eduvest/dashboard-mock";
import { getAllWorkspaces, getLevels } from "@/lib/eduvest/academic-levels";

export function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workspace, setWorkspace } = useWorkspace();
  const { state } = useOnboarding();
  const { lang, setLang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isAll = workspace === "All School";
  const lockedWs = isAll ? null : workspace;

  const workspaces = state.profile.schoolTypes.length
    ? [...state.profile.schoolTypes, "All School"]
    : ["Primary", "Secondary", "All School"];

  // Avoid hydration mismatch — user comes from localStorage on client only.
  const initials = mounted ? (user?.fullName?.slice(0, 2).toUpperCase() || "AD") : "AD";

  const students = lockedWs ? STUDENTS.filter((s) => s.workspace === lockedWs) : STUDENTS;
  const parents = lockedWs ? PARENTS.filter((p) => p.workspace === lockedWs) : PARENTS;
  const teachers = lockedWs ? TEACHERS.filter((t) => t.workspace === lockedWs) : TEACHERS;

  const classes = useMemo(() => {
    const out: { workspace: string; level: string }[] = [];
    const wsList = lockedWs ? [lockedWs] : getAllWorkspaces();
    wsList.forEach((w) => getLevels(w, lang).forEach((l) => out.push({ workspace: w, level: l })));
    return out;
  }, [lang, lockedWs]);


  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          onClick={onMenu}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <span className="hidden sm:inline text-muted-foreground text-xs">Workspace:</span>
              <span className="font-semibold">{workspace}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces.map((w) => (
              <DropdownMenuItem key={w} onClick={() => setWorkspace(w)} className="justify-between">
                {w}
                {workspace === w && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/workspace" })}>
              All workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Global search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="relative ml-auto hidden h-10 w-full max-w-md items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 truncate">Search students, parents, teachers, classes…</span>
          <kbd className="hidden rounded bg-background px-1.5 py-0.5 text-[10px] font-semibold lg:inline">⌘K</kbd>
        </button>
        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          aria-label="Toggle language"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-secondary"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border pl-1 pr-3 hover:bg-secondary">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                {initials}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user?.fullName || "Admin"}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 opacity-60 sm:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{user?.fullName || "Admin"}</span>
              <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/settings" })}>
              <User className="mr-2 h-4 w-4" /> Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search students, parents, teachers, classes…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Students">
            {STUDENTS.map((s) => (
              <CommandItem key={s.id} value={`${s.name} ${s.studentId} ${s.level}`} onSelect={() => { setSearchOpen(false); navigate({ to: "/dashboard/students" }); }}>
                <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{s.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{s.workspace} · {s.level}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Parents">
            {PARENTS.map((p) => (
              <CommandItem key={p.id} value={`${p.name} ${p.children.join(" ")}`} onSelect={() => { setSearchOpen(false); navigate({ to: "/dashboard/parents" }); }}>
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{p.children.join(", ")}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Teachers">
            {TEACHERS.map((t) => (
              <CommandItem key={t.id} value={`${t.name} ${t.subject}`} onSelect={() => { setSearchOpen(false); navigate({ to: "/dashboard/teachers" }); }}>
                <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{t.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{t.subject}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Classes">
            {classes.map((c) => (
              <CommandItem key={`${c.workspace}-${c.level}`} value={`${c.workspace} ${c.level}`} onSelect={() => { setSearchOpen(false); navigate({ to: "/dashboard/students" }); }}>
                <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{c.level}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.workspace}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
