import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { streakWeekday } from "@/lib/streak";
import { TASK_ICON, TASK_LABEL } from "@/components/app/task-icon";
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

const TASK_TONE: Record<string, "brand" | "ember" | "success" | "slate" | "warning"> = {
  LESSON: "brand",
  PRACTICE: "success",
  TIMED_SET: "warning",
  SIMULATION: "ember",
  REVIEW: "slate",
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

/** Renders ONE week. Callers must pass a single week's days — a multi-week plan
 * has seven rows per week, and they collide in the map below. */
export function WeekPlanTable({ days, highlightToday = true }: { days: PlanDay[]; highlightToday?: boolean }) {
  // streakWeekday, not getDay(): the latter is the *server's* weekday, so on
  // Vercel the highlighted row jumped to tomorrow at 5pm Pacific.
  const today = streakWeekday();
  const byDay = new Map(days.map((d) => [d.dayOfWeek, d]));

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      {DAY_ORDER.map((dow) => {
        const day = byDay.get(dow);
        const Icon = day ? TASK_ICON[day.taskType] : undefined;
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
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />}
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
                  <Badge tone={TASK_TONE[day.taskType] ?? "slate"}>{TASK_LABEL[day.taskType] ?? day.taskType}</Badge>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
