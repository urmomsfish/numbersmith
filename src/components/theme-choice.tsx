"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Light/dark as a labelled two-option control, living in Settings beside the
 * tint picker.
 *
 * Replaces the sun/moon icon button that used to sit in the top bar. A glyph
 * that has to encode both the current state and the action it performs is
 * ambiguous — it was captioned "Switch to dark mode" while showing a sun — and
 * appearance already had a home in Settings, so the two controls now sit
 * together instead of one being a permanent fixture of every page.
 *
 * Same shape as TintPicker: `peer sr-only` radios, and the checked state held
 * back until mount because the server cannot know the stored preference.
 */
const OPTIONS = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const;

type ThemeId = (typeof OPTIONS)[number]["id"];

function currentTheme(): ThemeId {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeChoice({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeId>(currentTheme);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-detection guard, not state sync
  useEffect(() => setMounted(true), []);

  function pick(next: ThemeId) {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private-mode / storage-disabled: the choice applies for this page load,
      // it just will not be remembered. Not worth surfacing.
    }
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700",
        className
      )}
    >
      {OPTIONS.map((option) => {
        const selected = mounted && theme === option.id;
        return (
          <label key={option.id} className="cursor-pointer">
            <input
              type="radio"
              name="theme"
              value={option.id}
              checked={selected}
              onChange={() => pick(option.id)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "block rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400",
                selected
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
              )}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
