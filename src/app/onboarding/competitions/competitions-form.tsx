"use client";

import { useActionState, useMemo, useState } from "react";
import { saveCompetitionsAction } from "@/lib/actions/onboarding-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { Competition } from "@/generated/prisma";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  ELEMENTARY_MIDDLE: {
    title: "Elementary / Middle School",
    description: "Grades K-8 competitions",
  },
  HIGH_SCHOOL: {
    title: "High School",
    description: "Grades 8-12 competitions",
  },
  OLYMPIAD: {
    title: "Olympiad / Advanced",
    description: "Proof-based, invitational-level mathematics",
  },
};

const FORMAT_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  SHORT_ANSWER: "Short Answer",
  INTEGER: "Short Answer (Integer)",
  PROOF: "Proof-Based",
};

const TEAM_LABEL: Record<string, string> = {
  INDIVIDUAL: "Individual",
  TEAM: "Team",
  BOTH: "Individual + Team",
};

export function CompetitionsForm({
  competitions,
  initialSelected,
  initialPrimary,
}: {
  competitions: Competition[];
  initialSelected: string[];
  initialPrimary?: string;
}) {
  const [state, formAction, pending] = useActionState(saveCompetitionsAction, undefined);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [primary, setPrimary] = useState<string | undefined>(initialPrimary);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, Competition[]>();
    for (const c of competitions) {
      if (!byCategory.has(c.category)) byCategory.set(c.category, []);
      byCategory.get(c.category)!.push(c);
    }
    return byCategory;
  }, [competitions]);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        if (primary === slug) setPrimary(undefined);
      } else {
        next.add(slug);
        if (!primary) setPrimary(slug);
      }
      return next;
    });
  }

  const selectedList = competitions.filter((c) => selected.has(c.slug));

  return (
    <form action={formAction} className="space-y-10">
      {["ELEMENTARY_MIDDLE", "HIGH_SCHOOL", "OLYMPIAD"].map((category) => {
        const meta = CATEGORY_META[category];
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={category}>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{meta.title}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">{meta.description}</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {items.map((c) => {
                const isSelected = selected.has(c.slug);
                return (
                  <label key={c.slug} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="competitionSlugs"
                      value={c.slug}
                      checked={isSelected}
                      onChange={() => toggle(c.slug)}
                      className="peer sr-only"
                    />
                    <div
                      className={cn(
                        "flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                        isSelected ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-950" : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs",
                          isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300"
                        )}
                      >
                        {isSelected && "✓"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge tone="slate">{FORMAT_LABEL[c.format] ?? c.format}</Badge>
                          <Badge tone="slate">{TEAM_LABEL[c.individualOrTeam] ?? c.individualOrTeam}</Badge>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      {state?.error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">{state.error}</p>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Which competition is your #1 priority?</h2>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          We&apos;ll weight your training plan and dashboard toward this competition.
        </p>
        {selectedList.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">Select at least one competition above first.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedList.map((c) => (
              <label key={c.slug} className="cursor-pointer">
                <input
                  type="radio"
                  name="primarySlug"
                  value={c.slug}
                  checked={primary === c.slug}
                  onChange={() => setPrimary(c.slug)}
                  className="peer sr-only"
                />
                <div
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                    primary === c.slug
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 text-slate-600 hover:border-slate-400"
                  )}
                >
                  {c.shortName}
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-center">
        <Button type="submit" size="lg" disabled={pending || selectedList.length === 0 || !primary}>
          {pending ? "Saving…" : "Build My Training Plan →"}
        </Button>
      </div>
    </form>
  );
}
