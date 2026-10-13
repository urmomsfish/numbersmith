"use client";

import Link from "next/link";
import { startCustomSimulationAction } from "@/lib/actions/simulation-actions";
import { Button } from "@/components/ui/button";
import type { Topic } from "@/generated/prisma";

export function CustomSimulationForm({
  topics,
  isPro,
  canStart,
}: {
  topics: Topic[];
  isPro: boolean;
  canStart: boolean;
}) {
  return (
    <form
      action={startCustomSimulationAction}
      className="rounded-xl border border-slate-200 bg-card p-5 dark:border-slate-700"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Number of problems</span>
          <select
            name="problemCount"
            defaultValue="10"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Min difficulty</span>
          <select
            name="difficultyMin"
            defaultValue="3"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Max difficulty</span>
          <select
            name="difficultyMax"
            defaultValue="6"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Time limit</span>
          <select
            name="timeLimitMinutes"
            defaultValue="30"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            {[10, 20, 30, 45, 60, 75, 120, 180].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
          Topics <span className="font-normal text-slate-700 dark:text-slate-500">(leave empty for mixed)</span>
        </span>
        {/* These were hairline outlines sitting on the page background, which
            is exactly what an inert label looks like — nothing said they could
            be clicked. They now rest filled, darken on hover, and invert to a
            solid brand pill when chosen.

            Selected state is not carried by hue alone: an outlined chip and a
            filled one differ in weight and luminance, so the two states are
            still distinguishable without colour vision. A tick glyph was tried
            as a third signal and removed — `group-has-[:checked]` generated a
            rule that matched the element and still lost the cascade, and a
            decoration is not worth an unexplained CSS fight. */}
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.id} className="cursor-pointer">
              <input type="checkbox" name="topicSlugs" value={t.slug} className="peer sr-only" />
              <span className="inline-block rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-foreground peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:font-semibold peer-checked:text-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:peer-checked:border-brand-500 dark:peer-checked:bg-brand-500 dark:peer-checked:text-white">
                {t.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {!isPro && (
          <p className="text-xs text-slate-700 dark:text-slate-500">
            Custom timed sets are a Pro feature.{" "}
            <Link href="/pricing" className="link font-semibold">
              See Pro →
            </Link>
          </p>
        )}
        <Button type="submit" disabled={!canStart} className="ml-auto">
          {canStart ? "Start Custom Competition" : "Pro only"}
        </Button>
      </div>
    </form>
  );
}
