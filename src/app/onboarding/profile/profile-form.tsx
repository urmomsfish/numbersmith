"use client";

import { useActionState, useState } from "react";
import { saveOnboardingProfileAction } from "@/lib/actions/onboarding-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const GRADE_OPTIONS = [
  { value: "0", label: "Kindergarten" },
  ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Grade ${i + 1}` })),
];

const AGE_RANGES = ["5-7", "8-10", "11-13", "14-15", "16-18"];

const EXPERIENCE_OPTIONS = [
  { value: "NONE", title: "New to this", desc: "I haven't done a math competition before." },
  { value: "SOME", title: "A little experience", desc: "I've tried a few contests or practice sets." },
  { value: "EXPERIENCED", title: "Experienced", desc: "I compete regularly and know the format." },
  { value: "ADVANCED", title: "Advanced", desc: "I've qualified for invitational or national rounds." },
];

const PRIOR_COMPETITIONS = [
  "Math Kangaroo",
  "MOEMS",
  "MathCounts",
  "AMC 8",
  "AMC 10",
  "AMC 12",
  "AIME",
  "Other / School team",
];

const LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "NOT_SURE", label: "Not sure — that's what we're here for" },
];

const PRACTICE_MINUTES = [15, 20, 30, 45, 60];

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(saveOnboardingProfileAction, undefined);
  const [experience, setExperience] = useState("NONE");
  const [level, setLevel] = useState("NOT_SURE");

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Grade</label>
        <select
          name="grade"
          required
          defaultValue="7"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
        >
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Age range</label>
        <div className="grid grid-cols-5 gap-2">
          {AGE_RANGES.map((range, i) => (
            <label key={range} className="cursor-pointer">
              <input
                type="radio"
                name="ageRange"
                value={range}
                defaultChecked={i === 2}
                className="peer sr-only"
                required
              />
              <div className="rounded-lg border border-slate-300 dark:border-slate-600 px-2 py-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300 peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700 dark:peer-checked:border-brand-400 dark:peer-checked:bg-brand-950 dark:peer-checked:text-brand-300">
                {range}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          Previous math competition experience
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="priorExperience"
                value={opt.value}
                checked={experience === opt.value}
                onChange={() => setExperience(opt.value)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "h-full rounded-xl border px-4 py-3 transition-colors",
                  experience === opt.value
                    ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-950"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{opt.title}</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          Competitions you&apos;ve participated in{" "}
          <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRIOR_COMPETITIONS.map((comp) => (
            <label key={comp} className="cursor-pointer">
              <input type="checkbox" name="priorCompetitions" value={comp} className="peer sr-only" />
              <div className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700 dark:peer-checked:border-brand-400 dark:peer-checked:bg-brand-950 dark:peer-checked:text-brand-300">
                {comp}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          Approximate math level (your best guess — we&apos;ll verify it)
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEVEL_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="approxLevel"
                value={opt.value}
                checked={level === opt.value}
                onChange={() => setLevel(opt.value)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs font-medium",
                  level === opt.value
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          How much time can you practice each day?
        </label>
        <select
          name="dailyPracticeMinutes"
          required
          defaultValue="30"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
        >
          {PRACTICE_MINUTES.map((m) => (
            <option key={m} value={m}>
              {m} minutes/day
            </option>
          ))}
        </select>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          Target score or rating <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
        </label>
        <input
          type="text"
          name="targetScore"
          placeholder="e.g. Qualify for AIME, or 100/150 on AMC 10"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
        />
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">{state.error}</p>
      )}

      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 text-center dark:border-brand-900 dark:bg-brand-950/40">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-50">Let&apos;s find your competition math level.</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A short adaptive assessment — takes about 15-20 minutes.
        </p>
        <Button type="submit" size="lg" disabled={pending} className="mt-4">
          {pending ? "Saving…" : "Start Free Placement Test"}
        </Button>
      </div>
    </form>
  );
}
