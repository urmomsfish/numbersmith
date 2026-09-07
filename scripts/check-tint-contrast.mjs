// Verifies every background tint in globals.css stays readable and visible.
//
// Run after touching any --background value or adding a tint:
//   npm run verify:contrast
//
// Because the --brand-* ramp is deliberately shared by every tint, this does
// NOT need to re-check control contrast per theme the way a true accent system
// would — a button is the same indigo everywhere. What can go wrong instead is
// the background itself, in three ways, one of which pulls against the others:
//
//   1. Too dark  -> text sitting directly on the page background drops below
//                   WCAG AA. text-slate-500 is the binding case (page
//                   subtitles); the untinted default only clears it by 0.05.
//   2. Too close to the card colour in dark mode -> cards lose their edge and
//      the layout goes flat.
//   3. Too pale  -> the tint is invisible and picking a colour does nothing.
//
// (1) and (3) are in direct tension: lightening to win contrast bleeds out the
// hue. Chroma is measured separately from luminance for exactly that reason —
// a tint can be vividly coloured and still bright.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "src/app/globals.css"), "utf8");

/** selector -> { "--var": "value" } for every top-level rule in the file. */
function parseRules(source) {
  const rules = new Map();
  const stripped = source
    // Comments first: otherwise a comment preceding a rule is captured as part
    // of that rule's selector and the selector match fails.
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Statement at-rules (@import, @custom-variant) end in ';' and have no
    // block. They must go before the block at-rule pass, whose `[^{]*` would
    // otherwise run past them and swallow the following real rule.
    .replace(/@[a-z-]+[^;{]*;/gi, "")
    // Block at-rules (@theme, @layer) — none declare backgrounds, and their
    // nested braces would confuse this flat matcher.
    .replace(/@[a-z-]+[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gi, "");
  for (const [, selector, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const [, prop, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      decls[prop] = value.trim();
    }
    if (Object.keys(decls).length) rules.set(selector.trim(), decls);
  }
  return rules;
}

const rules = parseRules(css);
const base = rules.get(":root") ?? {};
const baseDark = rules.get(".dark") ?? {};

// Shared by every tint — read from :root so a brand edit is reflected here.
const BRAND_600 = base["--brand-600"];
const BRAND_400 = base["--brand-400"];
const BRAND_300 = base["--brand-300"];
const FG_LIGHT = base["--foreground"];
const FG_DARK = baseDark["--foreground"];

// Tailwind values used directly in component classNames, not via our CSS vars.
const SLATE_500 = "#64748b"; // text-slate-500 — muted copy on the page background
const CARD_DARK = "#0f172a"; // dark:bg-slate-900 — card surface in dark mode

const themes = [
  { id: "default", light: base["--background"], dark: baseDark["--background"] },
];

for (const [selector, decls] of rules) {
  const m = selector.match(/^\[data-tint="([\w-]+)"\]$/);
  if (!m) continue;
  const id = m[1];
  const darkDecls = rules.get(`.dark[data-tint="${id}"]`);
  if (!darkDecls?.["--background"]) {
    console.error(`✗ ${id}: missing .dark[data-tint="${id}"] background override`);
    process.exitCode = 1;
    continue;
  }
  themes.push({ id, light: decls["--background"], dark: darkDecls["--background"] });
}

function lum(hex) {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (hi + 0.05) / (lo + 0.05);
}
/** Colourfulness independent of brightness: distance between the strongest and
 * weakest channel. A grey has 0; the tints need enough to read as coloured. */
function chroma(hex) {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(...ch) - Math.min(...ch);
}

const AA = 4.5;
const MIN_CARD_SEPARATION = 1.035;
const MIN_CHROMA_LIGHT = 6;
const MIN_CHROMA_DARK = 8;

let failures = 0;
const fail = (id, msg) => {
  console.log(`     ✗ ${msg}`);
  failures++;
  void id;
};

for (const t of themes) {
  if (!t.light || !t.dark) {
    console.log(`✗ ${t.id}: missing a --background`);
    failures++;
    continue;
  }
  const before = failures;
  const checks = [];

  // Light mode
  const slate = ratio(SLATE_500, t.light);
  const fgL = ratio(FG_LIGHT, t.light);
  const brandL = ratio(BRAND_600, t.light);
  if (slate < AA) checks.push(`light: text-slate-500 ${slate.toFixed(2)} < ${AA}`);
  if (fgL < AA) checks.push(`light: body text ${fgL.toFixed(2)} < ${AA}`);
  if (brandL < AA) checks.push(`light: brand-600 link ${brandL.toFixed(2)} < ${AA}`);

  // Dark mode
  const fgD = ratio(FG_DARK, t.dark);
  const brand400 = ratio(BRAND_400, t.dark);
  const brand300 = ratio(BRAND_300, t.dark);
  const sep = ratio(CARD_DARK, t.dark);
  if (fgD < AA) checks.push(`dark: body text ${fgD.toFixed(2)} < ${AA}`);
  if (brand400 < AA) checks.push(`dark: brand-400 link ${brand400.toFixed(2)} < ${AA}`);
  if (brand300 < AA) checks.push(`dark: brand-300 ${brand300.toFixed(2)} < ${AA}`);
  if (sep < MIN_CARD_SEPARATION)
    checks.push(`dark: card separation ${sep.toFixed(3)} < ${MIN_CARD_SEPARATION} (cards blend in)`);

  // Visibility — the untinted default is exempt by definition.
  const cL = chroma(t.light);
  const cD = chroma(t.dark);
  if (t.id !== "default") {
    if (cL < MIN_CHROMA_LIGHT) checks.push(`light tint invisible (chroma ${cL} < ${MIN_CHROMA_LIGHT})`);
    if (cD < MIN_CHROMA_DARK) checks.push(`dark tint invisible (chroma ${cD} < ${MIN_CHROMA_DARK})`);
  }

  console.log(
    `${checks.length ? "✗" : "✓"} ${t.id.padEnd(9)} ` +
      `light: slate500 ${slate.toFixed(2)} chroma ${String(cL).padStart(2)} | ` +
      `dark: cardsep ${sep.toFixed(3)} chroma ${String(cD).padStart(2)}`
  );
  for (const c of checks) fail(t.id, c);
  void before;
}

console.log(
  `\n${themes.length} tint(s) checked — ${failures === 0 ? "all constraints hold" : `${failures} PROBLEM(S)`}`
);
if (failures > 0) process.exitCode = 1;
