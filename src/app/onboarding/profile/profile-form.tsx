"use client";

import { useActionState, useState } from "react";
import { saveOnboardingProfileAction } from "@/lib/actions/onboarding-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const GRADE_OPTIONS = [
  { value: "0", label: "Kindergarten" },
  ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Grade ${i + 1}` })),
];

const EXPERIENCE_OPTIONS = [
  { value: "NONE", title: "New to this", desc: "I haven't done a math competition before." },
  { value: "SOME", title: "A little experience", desc: "I've tried a few contests or practice sets." },
  { value: "EXPERIENCED", title: "Experienced", desc: "I compete regularly and know the format." },
  { value: "ADVANCED", title: "Advanced", desc: "I've qualified for invitational or national rounds." },
];

const PRACTICE_MINUTES = [15, 20, 30, 45, 60];

const SELECT_CLASS =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ember-600/30";

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(saveOnboardingProfileAction, undefined);
  const [experience, setExperience] = useState("NONE");

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Grade</label>
        <select name="grade" required defaultValue="7" className={SELECT_CLASS}>
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
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
                <div className="mt-0.5 text-xs text-slate-700 dark:text-slate-400">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          How much time can you practice each day?
        </label>
        <select name="dailyPracticeMinutes" required defaultValue="30" className={SELECT_CLASS}>
          {PRACTICE_MINUTES.map((m) => (
            <option key={m} value={m}>
              {m} minutes/day
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-700 dark:text-slate-400">
          Sets the size of your daily plan. You can change it any time in Settings.
        </p>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">{state.error}</p>
      )}

      {/* Two submits, one form: the answers above are saved either way, so
          skipping the test costs nothing and is a real choice rather than a
          dead end. */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 text-center dark:border-brand-900 dark:bg-brand-950/40">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-50">Want us to find your level first?</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          The placement test is adaptive and takes about 15 minutes. It sets your starting rating and fills in
          your skill breakdown — but you can take it later, and practice works without it.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button type="submit" name="intent" value="placement" size="lg" disabled={pending}>
            {pending ? "Saving…" : "Take the placement test"}
          </Button>
          <button
            type="submit"
            name="intent"
            value="skip"
            disabled={pending}
            className="link text-sm font-semibold disabled:opacity-50"
          >
            Skip it — take me straight to practice
          </button>
        </div>
      </div>
    </form>
  );
}
