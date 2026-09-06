import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  tone = "brand",
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  tone?: "brand" | "ember" | "success" | "slate";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass = {
    brand: "bg-brand-600",
    ember: "bg-ember-500",
    success: "bg-success-500",
    slate: "bg-slate-500",
  }[tone];

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass, barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
