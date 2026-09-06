import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import type { Topic } from "@/generated/prisma";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const TASK_META: Record<string, { icon: string; tone: "brand" | "ember" | "success" | "slate" | "warning" }> = {
  LESSON: { icon: "📘", tone: "brand" },
  PRACTICE: { icon: "✏️", tone: "success" },
  TIMED_SET: { icon: "⏱️", tone: "warning" },
  SIMULATION: { icon: "🏆", tone: "ember" },
  REVIEW: { icon: "🔁", tone: "slate" },
};

type PlanDay = {
  id: string;
  dayOfWeek: number;
  taskType: string;
  label: string;
  problemCount: number;
  completed: boolean;
  topic: Topic | null;
};

export function WeekPlanTable({ days, highlightToday = true }: { days: PlanDay[]; highlightToday?: boolean }) {
  const today = new Date().getDay();
  const byDay = new Map(days.map((d) => [d.dayOfWeek, d]));

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      {DAY_ORDER.map((dow) => {
        const day = byDay.get(dow);
        const meta = day ? TASK_META[day.taskType] : undefined;
        const isToday = highlightToday && dow === today;
        return (
          <div
            key={dow}
            className={cn(
              "flex items-center justify-between gap-4 px-4 py-3 sm:px-5",
              isToday ? "bg-brand-50/60 dark:bg-brand-950/40" : "bg-white dark:bg-slate-900"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0">
                <p className={cn("text-sm font-semibold", isToday ? "text-brand-700 dark:text-brand-300" : "text-slate-700 dark:text-slate-200")}>
                  {DAY_NAMES[dow]}
                </p>
                {isToday && <p className="text-[10px] font-semibold uppercase text-brand-500">Today</p>}
              </div>
              {day ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta?.icon}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{day.label}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-300 dark:text-slate-600">Rest day</span>
              )}
            </div>
            {day && (
              <div className="flex shrink-0 items-center gap-2">
                {day.completed ? (
                  <Badge tone="success">Done</Badge>
                ) : (
                  <Badge tone={meta?.tone ?? "slate"}>{day.taskType.replace("_", " ")}</Badge>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
