import Link from "next/link";
import { cn } from "@/lib/cn";
import { dateKeyIndex, streakDayIndex } from "@/lib/streak";
import { monthGrid, planDayForDayIndex, shiftMonth } from "@/lib/engine/plan-schedule";
import type { Topic } from "@/generated/prisma";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Colour and glyph per task type. Kept in step with WeekPlanTable so the same
 * task reads the same way in both views. */
const TASK_META: Record<string, { icon: string; chip: string }> = {
  LESSON: {
    icon: "📘",
    chip: "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300",
  },
  PRACTICE: {
    icon: "✏️",
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  TIMED_SET: {
    icon: "⏱️",
    chip: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  SIMULATION: {
    icon: "🏆",
    chip: "bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
  },
  REVIEW: {
    icon: "🔁",
    chip: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

type PlanDay = {
  id: string;
  dayOfWeek: number;
  weekNumber: number;
  taskType: string;
  label: string;
  problemCount: number;
  completed: boolean;
  topic: Topic | null;
};

export type ContestMarker = {
  date: Date;
  shortName: string;
};

export function MonthPlanCalendar({
  plan,
  year,
  month,
  contests,
  today,
}: {
  plan: { generatedAt: Date; days: PlanDay[] };
  year: number;
  month: number;
  contests: ContestMarker[];
  /** Passed in rather than read here so the whole page agrees on "today". */
  today: Date;
}) {
  const dates = monthGrid(year, month);
  // `today` is an instant; grid cells and contest dates are date-only values at
  // UTC midnight. They need different converters — running a date-only value
  // through streakDayIndex lands it on the previous day. See dateKeyIndex.
  const todayIndex = streakDayIndex(today);
  const contestByDay = new Map(contests.map((c) => [dateKeyIndex(c.date), c]));

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const href = (y: number, m: number) =>
    `/study-plan?view=month&month=${y}-${String(m).padStart(2, "0")}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Link
            href={href(prev.year, prev.month)}
            aria-label="Previous month"
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ‹
          </Link>
          <Link
            href="/study-plan?view=month"
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Today
          </Link>
          <Link
            href={href(next.year, next.month)}
            aria-label="Next month"
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ›
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {dates.map((date) => {
            const inMonth = date.getUTCMonth() + 1 === month && date.getUTCFullYear() === year;
            const dayIndex = dateKeyIndex(date);
            const isToday = dayIndex === todayIndex;
            const isPast = dayIndex < todayIndex;
            const task = planDayForDayIndex(plan, dayIndex, date.getUTCDay());
            const meta = task ? TASK_META[task.taskType] : undefined;
            const contest = contestByDay.get(dayIndex);

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "min-h-[86px] border-b border-r border-slate-100 dark:border-slate-800 p-1.5",
                  inMonth ? "bg-white dark:bg-slate-900" : "bg-slate-50/60 dark:bg-slate-900/40",
                  isToday && "bg-brand-50/70 dark:bg-brand-950/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums",
                      isToday
                        ? "bg-brand-600 text-white"
                        : inMonth
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-300 dark:text-slate-600"
                    )}
                  >
                    {date.getUTCDate()}
                  </span>
                  {task?.completed && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓
                    </span>
                  )}
                </div>

                {contest && (
                  <div className="mt-1 truncate rounded-md bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    🎯 {contest.shortName}
                  </div>
                )}

                {task && inMonth && (
                  <div
                    className={cn(
                      "mt-1 rounded-md px-1.5 py-1 text-[11px] leading-tight",
                      meta?.chip ?? "bg-slate-100 text-slate-600",
                      // Past days fade so the eye lands on what is still ahead.
                      isPast && !isToday && "opacity-45"
                    )}
                    title={`${task.label} · ${task.problemCount} problems`}
                  >
                    <span className="mr-0.5">{meta?.icon}</span>
                    <span className="line-clamp-2 align-middle">{task.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        {Object.entries(TASK_META).map(([type, m]) => (
          <span key={type} className="flex items-center gap-1">
            <span>{m.icon}</span>
            {type.replace("_", " ").toLowerCase()}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span>🎯</span>
          competition day
        </span>
      </div>
    </div>
  );
}
