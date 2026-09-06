import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Tone = "brand" | "ember" | "success" | "warning" | "danger" | "slate";

const toneClasses: Record<Tone, string> = {
  brand:
    "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-800",
  ember:
    "bg-orange-50 text-ember-600 ring-1 ring-inset ring-orange-200 dark:bg-orange-950 dark:text-ember-400 dark:ring-orange-900",
  success:
    "bg-emerald-50 text-success-600 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-900",
  warning:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-900",
  danger:
    "bg-red-50 text-danger-600 ring-1 ring-inset ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-900",
  slate:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
};

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
