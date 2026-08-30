"use client";

import { useMemo, useState } from "react";
import { updateCompetitionsAction } from "@/lib/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { CATEGORY_LABEL, FORMAT_LABEL, TEAM_LABEL } from "@/lib/competition-meta";
import type { Competition } from "@/generated/prisma";

export function EditCompetitionsForm({
  competitions,
  initialSelected,
  initialPrimary,
}: {
  competitions: Competition[];
  initialSelected: string[];
  initialPrimary?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [primary, setPrimary] = useState<string | undefined>(initialPrimary);

  const grouped = useMemo(() => {
    const map = new Map<string, Competition[]>();
    for (const c of competitions) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return map;
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
    <form action={updateCompetitionsAction} className="space-y-8">
      {["ELEMENTARY_MIDDLE", "HIGH_SCHOOL", "OLYMPIAD"].map((category) => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={category}>
            <h2 className="text-base font-bold text-slate-900">{CATEGORY_LABEL[category]}</h2>
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
                        "flex items-start gap-3 rounded-xl border px-4 py-3",
                        isSelected ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-slate-300"
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
                        <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge tone="slate">{FORMAT_LABEL[c.format]}</Badge>
                          <Badge tone="slate">{TEAM_LABEL[c.individualOrTeam]}</Badge>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">#1 Priority Competition</h2>
        {selectedList.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Select at least one competition above.</p>
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

      <Button type="submit" size="lg" disabled={selectedList.length === 0 || !primary}>
        Save Competitions
      </Button>
    </form>
  );
}
