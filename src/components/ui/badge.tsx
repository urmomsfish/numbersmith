import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Tone = "brand" | "ember" | "success" | "warning" | "danger" | "slate";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  ember: "bg-orange-50 text-ember-600 ring-1 ring-inset ring-orange-200",
  success: "bg-emerald-50 text-success-600 ring-1 ring-inset ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  danger: "bg-red-50 text-danger-600 ring-1 ring-inset ring-red-200",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
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
