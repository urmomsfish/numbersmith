/** Accent themes. Each id has a matching `[data-accent="…"]` block in
 * globals.css that swaps the whole --brand-* ramp and the tinted page
 * background; this module is only the metadata the picker and the no-flash
 * script need. Adding one means editing both files, then running
 * `npm run verify:contrast`.
 *
 * `swatch` is the ramp's --brand-500 — the most saturated, recognisable step —
 * used purely to paint the picker dot. It is duplicated from the CSS rather
 * than read from it because the picker has to render it before any element
 * carrying that variable exists. */
export const ACCENTS = [
  { id: "indigo", label: "Indigo", swatch: "#6366f1" },
  { id: "violet", label: "Violet", swatch: "#8b5cf6" },
  { id: "blue", label: "Blue", swatch: "#3b82f6" },
  { id: "cyan", label: "Cyan", swatch: "#0891b2" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "rose", label: "Rose", swatch: "#f43f5e" },
  { id: "amber", label: "Amber", swatch: "#d97706" },
  { id: "orange", label: "Orange", swatch: "#ea580c" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

/** Indigo is what :root declares, so this is also what renders when no
 * attribute is set at all (SSR, JS disabled, cleared storage). */
export const DEFAULT_ACCENT: AccentId = "indigo";

export const ACCENT_IDS: readonly AccentId[] = ACCENTS.map((a) => a.id);

export function isAccentId(value: string | null | undefined): value is AccentId {
  return typeof value === "string" && (ACCENT_IDS as readonly string[]).includes(value);
}
