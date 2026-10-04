"use client";

import { useMemo, useState } from "react";
import { MathText } from "@/components/math-text";
import { REFERENCE, matchesQuery, type ReferenceEntry } from "@/lib/reference";

/**
 * The cheat sheet, filtered in the browser.
 *
 * All of it ships in the bundle because all of it is constant — there is no
 * per-student state here and no reason to round-trip to the server to hide
 * twenty lines of text. That is what makes the search feel instant, which is
 * the entire point of a reference you reach for mid-problem.
 */
export function ReferenceBrowser() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string | null>(null);

  const sections = useMemo(() => {
    return REFERENCE.map((s) => ({
      ...s,
      entries: s.entries.filter((e) => matchesQuery({ ...e, section: s.title }, query)),
    })).filter((s) => (section === null || s.slug === section) && s.entries.length > 0);
  }, [query, section]);

  const total = sections.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 pb-3 pt-1 backdrop-blur sm:-mx-6 sm:px-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search — try 'roots', 'circle', 'mod', 'at least one'…"
          aria-label="Search the reference sheet"
          className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip active={section === null} onClick={() => setSection(null)}>
            All
          </FilterChip>
          {REFERENCE.map((s) => (
            <FilterChip
              key={s.slug}
              active={section === s.slug}
              onClick={() => setSection(section === s.slug ? null : s.slug)}
            >
              {s.title}
            </FilterChip>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          Nothing matches &ldquo;{query}&rdquo;. Try a shorter word — the search looks at names,
          formulas and the notes.
        </p>
      ) : (
        <div className="mt-4 space-y-8">
          {sections.map((s) => (
            <section key={s.slug}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{s.title}</h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{s.blurb}</p>
              <ul className="mt-3 space-y-2">
                {s.entries.map((e) => (
                  <EntryCard key={e.name} entry={e} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
        active
          ? "bg-brand-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function EntryCard({ entry }: { entry: ReferenceEntry }) {
  return (
    <li className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{entry.name}</p>

      {/* The formula gets its own line and a tinted panel: this is what a
          student is scanning for, and burying it in prose defeats the page.

          The two arbitrary variants enlarge fraction parts only. MathText
          renders an inline fraction as sup⁄sub at 0.72em, which is right in
          prose — a fraction inside a sentence should not disturb the line —
          but wrong here, where the fraction IS the formula: Vieta's measured
          out at 10px against a 14px panel, so the answer was smaller than the
          operators around it. Exponents are left alone, since 0.72em is
          correct for b².

          This targets the renderer's own markup (a frac is the only thing that
          emits sup and sub inside one nowrap span), so it is coupled to that
          implementation. A display mode on MathText would be the better fix if
          a second surface ever needs this. */}
      <p className="mt-1.5 overflow-x-auto rounded-md bg-slate-50 px-2.5 py-2 font-mono text-base leading-relaxed text-slate-900 [&_.whitespace-nowrap>sub]:text-[0.85em] [&_.whitespace-nowrap>sup]:text-[0.85em] dark:bg-slate-800 dark:text-slate-50">
        <MathText>{entry.statement}</MathText>
      </p>

      {entry.conditions && (
        <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold">Holds when: </span>
          <MathText>{entry.conditions}</MathText>
        </p>
      )}
      {entry.when && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          <MathText>{entry.when}</MathText>
        </p>
      )}
    </li>
  );
}
