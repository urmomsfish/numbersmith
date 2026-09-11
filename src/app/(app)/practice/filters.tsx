"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { Topic, Competition } from "@/generated/prisma";
import { difficultyLabel } from "@/lib/types";

type Params = {
  topic?: string;
  competition?: string;
  difficulty?: string;
  format?: string;
  q?: string;
};

export function PracticeFilters({
  domains,
  subtopics,
  competitions,
  current,
}: {
  domains: Topic[];
  subtopics: Topic[];
  competitions: Competition[];
  current: Params;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(current.q ?? "");

  function update(next: Partial<Params>) {
    const merged: Params = { ...current, ...next };
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    router.push(`${pathname}?${qs.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-3">
      <select
        value={current.topic ?? ""}
        onChange={(e) => update({ topic: e.target.value || undefined })}
        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <option value="">All Topics</option>
        {domains.map((d) => (
          <optgroup key={d.id} label={d.name}>
            <option value={d.slug}>{d.name} (all)</option>
            {subtopics.filter((s) => s.parentId === d.id).map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <select
        value={current.competition ?? ""}
        onChange={(e) => update({ competition: e.target.value || undefined })}
        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <option value="">All Competitions</option>
        {competitions.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.shortName}
          </option>
        ))}
      </select>

      <select
        value={current.difficulty ?? ""}
        onChange={(e) => update({ difficulty: e.target.value || undefined })}
        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <option value="">All Difficulties</option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            {d} — {difficultyLabel(d)}
          </option>
        ))}
      </select>

      <select
        value={current.format ?? ""}
        onChange={(e) => update({ format: e.target.value || undefined })}
        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <option value="">All Formats</option>
        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        <option value="SHORT_ANSWER">Short Answer</option>
        <option value="INTEGER">Integer</option>
      </select>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: q || undefined });
        }}
        className="ml-auto flex items-center gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search problems…"
          className="w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
        />
      </form>

      {(current.topic || current.competition || current.difficulty || current.format || current.q) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm font-medium text-slate-700 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
        >
          Clear
        </button>
      )}
    </div>
  );
}
