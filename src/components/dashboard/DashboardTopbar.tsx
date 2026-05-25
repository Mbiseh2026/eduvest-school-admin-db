import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Search, Menu, Globe, LogOut, User, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLanguage } from "@/hooks/use-language";
import { NOTIFICATIONS } from "@/lib/eduvest/dashboard-mock";
import { cn } from "@/lib/utils";

export function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workspace, setWorkspace } = useWorkspace();
  const { state } = useOnboarding();
  const { lang, setLang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);

  const workspaces = state.profile.schoolTypes.length
    ? [...state.profile.schoolTypes, "All School"]
    : ["Primary", "Secondary", "All School"];

  const initials = user?.fullName?.slice(0, 2).toUpperCase() || "AD";

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

        {/* Workspace switcher */}
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

        {/* Search */}
        <div className="relative ml-auto hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search students, parents, transactions…"
            className="h-10 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-background"
          />
        </div>
        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label="Search"
          onClick={() => setSearchOpen((o) => !o)}
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Language */}
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          aria-label="Toggle language"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang}
        </button>

        {/* Notifications */}
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

        {/* User */}
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

      {searchOpen && (
        <div className={cn("border-t border-border bg-background p-3 md:hidden")}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search…"
              className="h-10 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
