"use client";

import { useLayoutEffect, useRef } from "react";
import { ANSWER_PALETTE } from "@/lib/answer-palette";

/** Text answer box with a symbol palette underneath.
 *
 * Several hundred problems have answers like "7√11" or "(36/5)π" that cannot be
 * produced on a normal keyboard. The palette inserts at the caret rather than
 * appending, so a student can build "7√11" by typing 7, tapping √, typing 11 —
 * and focus returns to the input so typing continues uninterrupted.
 *
 * The palette is a convenience, not the only route: `checkAnswer` also accepts
 * "sqrt" and "pi" spelled out, which is what a student on a physical keyboard
 * will reach for first. */
export function AnswerInput({
  value,
  onChange,
  onEnter,
  disabled,
  integerOnly,
}: {
  value: string;
  onChange: (next: string) => void;
  onEnter: () => void;
  disabled: boolean;
  /** INTEGER-format problems never need symbols, so the palette is hidden. */
  integerOnly: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  /** Where the caret should land once React has committed the inserted symbol.
   * Null except in the render immediately following a palette press. */
  const pendingCaret = useRef<number | null>(null);

  // Must run after the new value is in the DOM, and must be layout-phase so the
  // caret never paints in the wrong place.
  //
  // An earlier version did this in requestAnimationFrame, which races React's
  // commit: the rAF could fire while the input still held the old, shorter
  // value, so setSelectionRange clamped to the end of that and the caret ended
  // up at 0. Typing 7, pressing √, then typing 11 produced "117√" instead of
  // "7√11".
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el || pendingCaret.current === null) return;
    const caret = Math.min(pendingCaret.current, el.value.length);
    pendingCaret.current = null;
    el.focus();
    el.setSelectionRange(caret, caret);
  }, [value]);

  function insert(symbol: string) {
    const el = inputRef.current;
    if (!el) {
      onChange(value + symbol);
      return;
    }
    // Insert at the caret, replacing any selection, rather than appending —
    // a student building "7√11" presses √ in the middle of what they type.
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    pendingCaret.current = start + symbol.length;
    onChange(value.slice(0, start) + symbol + value.slice(end));
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {integerOnly ? "Enter an integer answer" : "Enter your answer"}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        placeholder="Your answer"
        className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:bg-slate-50 dark:disabled:bg-slate-800"
      />

      {!integerOnly && (
        <div className="mt-2 max-w-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {ANSWER_PALETTE.map((symbol) => (
              <button
                key={symbol.insert}
                type="button"
                disabled={disabled}
                onClick={() => insert(symbol.insert)}
                title={symbol.title}
                aria-label={symbol.title}
                className="min-w-9 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm text-slate-700 dark:text-slate-200 transition hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {symbol.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            You can also type <span className="font-mono">sqrt</span> or{" "}
            <span className="font-mono">pi</span>.
          </p>
        </div>
      )}
    </div>
  );
}
