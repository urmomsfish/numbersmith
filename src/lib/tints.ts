/** Background tints. Each id has a matching `[data-tint="…"]` block in
 * globals.css that overrides only `--background` — the brand ramp deliberately
 * stays indigo in every tint, so buttons, links, and badges never change
 * colour and can never become hard to read against their own backgrounds.
 *
 * Adding one means editing both files, then running `npm run verify:contrast`.
 *
 * `swatch` is a vivid representative of the hue, not the tint itself: the
 * applied background is a few percent saturation and would be indistinguishable
 * from white as a 36px dot. Same trick Chrome uses — bold swatch, gentle
 * result. */
export const TINTS = [
  { id: "default", label: "None", swatch: "#94a3b8" },
  { id: "violet", label: "Violet", swatch: "#8b5cf6" },
  { id: "blue", label: "Blue", swatch: "#3b82f6" },
  { id: "cyan", label: "Cyan", swatch: "#0891b2" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "rose", label: "Rose", swatch: "#f43f5e" },
  { id: "amber", label: "Amber", swatch: "#d97706" },
  { id: "orange", label: "Orange", swatch: "#ea580c" },
] as const;

export type TintId = (typeof TINTS)[number]["id"];

/** The neutral slate background :root already declares, so this is also what
 * renders with no attribute set at all (SSR, JS off, cleared storage). */
export const DEFAULT_TINT: TintId = "default";

export const TINT_IDS: readonly TintId[] = TINTS.map((t) => t.id);

export function isTintId(value: string | null | undefined): value is TintId {
  return typeof value === "string" && (TINT_IDS as readonly string[]).includes(value);
}
