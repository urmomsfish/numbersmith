"use client";

import { useEffect, useState } from "react";
import { TINTS, DEFAULT_TINT, isTintId, type TintId } from "@/lib/tints";
import { cn } from "@/lib/cn";

/** Reads what the no-flash script already put on <html>, so the correct swatch
 * is ringed on first paint rather than flicking over from the default. */
function currentTint(): TintId {
  if (typeof document === "undefined") return DEFAULT_TINT;
  const value = document.documentElement.getAttribute("data-tint");
  return isTintId(value) ? value : DEFAULT_TINT;
}

export function TintPicker({ className }: { className?: string }) {
  const [tint, setTint] = useState<TintId>(currentTint);
  // The server can't know the stored preference, so the checked state is held
  // back until mount — otherwise hydration mismatches on the radio inputs.
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-detection guard, not state sync
  useEffect(() => setMounted(true), []);

  function pick(id: TintId) {
    setTint(id);
    document.documentElement.setAttribute("data-tint", id);
    try {
      localStorage.setItem("tint", id);
    } catch {
      // Private-mode / storage-disabled: the tint still applies for this page
      // load, it just won't be remembered. Not worth surfacing.
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {TINTS.map((t) => {
        const selected = mounted && tint === t.id;
        return (
          <label key={t.id} title={t.label} className="cursor-pointer">
            <input
              type="radio"
              name="tint"
              value={t.id}
              checked={selected}
              onChange={() => pick(t.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              style={{ backgroundColor: t.swatch }}
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
            <span className="sr-only">{t.label}</span>
          </label>
        );
      })}
    </div>
  );
}
