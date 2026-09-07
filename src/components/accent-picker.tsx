"use client";

import { useEffect, useState } from "react";
import { ACCENTS, DEFAULT_ACCENT, isAccentId, type AccentId } from "@/lib/accents";
import { cn } from "@/lib/cn";

/** Reads what the no-flash script already put on <html>, so the correct swatch
 * is ringed on first paint rather than flicking over from the default. */
function currentAccent(): AccentId {
  if (typeof document === "undefined") return DEFAULT_ACCENT;
  const value = document.documentElement.getAttribute("data-accent");
  return isAccentId(value) ? value : DEFAULT_ACCENT;
}

export function AccentPicker({ className }: { className?: string }) {
  const [accent, setAccent] = useState<AccentId>(currentAccent);
  // The server can't know the stored preference, so the checked state is held
  // back until mount — otherwise hydration mismatches on the radio inputs.
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-detection guard, not state sync
  useEffect(() => setMounted(true), []);

  function pick(id: AccentId) {
    setAccent(id);
    document.documentElement.setAttribute("data-accent", id);
    try {
      localStorage.setItem("accent", id);
    } catch {
      // Private-mode / storage-disabled: the colour still applies for this
      // page load, it just won't be remembered. Not worth surfacing.
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {ACCENTS.map((a) => {
        const selected = mounted && accent === a.id;
        return (
          <label
            key={a.id}
            title={a.label}
            className="cursor-pointer"
          >
            <input
              type="radio"
              name="accent"
              value={a.id}
              checked={selected}
              onChange={() => pick(a.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              style={{ backgroundColor: a.swatch }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 transition-all",
                "ring-offset-white dark:ring-offset-slate-900",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400",
                selected
                  ? "ring-2 ring-slate-900 dark:ring-slate-100"
                  : "ring-0 hover:scale-110"
              )}
            >
              {selected && (
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
                  <path
                    d="m5 13 4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="sr-only">{a.label}</span>
          </label>
        );
      })}
    </div>
  );
}
