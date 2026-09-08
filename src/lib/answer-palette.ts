/** Symbols offered under the answer box for problems whose answers cannot be
 * typed on a standard keyboard.
 *
 * Kept in a plain module rather than the component so `verify:grading` can
 * assert that every stored typed answer is composable from the palette plus an
 * ordinary keyboard — a palette that is missing a symbol the bank actually uses
 * would leave those problems unanswerable, which is the bug this whole feature
 * exists to fix. */
export type PaletteSymbol = {
  /** What gets inserted into the input. */
  insert: string;
  /** What the button shows — usually the same, but radicals read better with a
   * placeholder box. */
  label: string;
  /** Tooltip / accessible name. */
  title: string;
};

export const ANSWER_PALETTE: PaletteSymbol[] = [
  { insert: "√", label: "√", title: "Square root — you can also type \"sqrt\"" },
  { insert: "π", label: "π", title: "Pi — you can also type \"pi\"" },
  { insert: "/", label: "a/b", title: "Fraction bar" },
  { insert: "^", label: "xʸ", title: "Exponent" },
  { insert: "°", label: "°", title: "Degrees" },
  { insert: "−", label: "−", title: "Minus sign" },
];

/** Every character the palette can produce. Used by the verification script. */
export const PALETTE_CHARS: string[] = ANSWER_PALETTE.flatMap((s) => s.insert.split(""));
