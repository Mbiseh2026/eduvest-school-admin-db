import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 font-bold text-lg tracking-tight", className)}>
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-brand",
          variant === "light" && "bg-white text-primary shadow-none",
        )}
      >
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className={cn(variant === "light" ? "text-white" : "text-foreground")}>
        Edu<span className="text-primary">Vest</span>
      </span>
    </Link>
  );
}
