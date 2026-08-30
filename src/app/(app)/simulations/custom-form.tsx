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
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Number of problems</span>
          <select
            name="problemCount"
            defaultValue="10"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Min difficulty</span>
          <select
            name="difficultyMin"
            defaultValue="3"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Max difficulty</span>
          <select
            name="difficultyMax"
            defaultValue="6"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Time limit</span>
          <select
            name="timeLimitMinutes"
            defaultValue="30"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
        <span className="mb-2 block text-xs font-semibold text-slate-600">
          Topics <span className="font-normal text-slate-400">(leave empty for mixed)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.id} className="cursor-pointer">
              <input type="checkbox" name="topicSlugs" value={t.slug} className="peer sr-only" />
              <span className="inline-block rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700">
                {t.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {!isPro && (
          <p className="text-xs text-slate-400">
            Custom sets count toward your free weekly simulation limit.{" "}
            <Link href="/pricing" className="font-semibold text-brand-600">
              Go unlimited →
            </Link>
          </p>
        )}
        <Button type="submit" disabled={!canStart} className="ml-auto">
          {canStart ? "Start Custom Competition" : "Weekly Limit Reached"}
        </Button>
      </div>
    </form>
  );
}
