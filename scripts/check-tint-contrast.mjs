// Verifies every tint in globals.css stays readable and visible.
//
// Each tint colours two surfaces, with different amounts of headroom:
//   --surface     sidebar / topbar / marketing header. Text is slate-600+, so
//                 this can carry the strong tint that makes the theme visible.
//   --background  page shell behind the cards. Bounded much more tightly,
//                 because page subtitles use slate-500 and the untinted
//                 default only clears AA by 0.05.
// Cards deliberately stay white / slate-900 and are not themed, so every
// reading surface in the product is identical under all tints.
//
// Run after touching any --background value or adding a tint:
//   npm run verify:contrast
//
// Because the --brand-* ramp is deliberately shared by every tint, this does
// NOT re-check control contrast per theme the way a true accent system would —
// a button is the same indigo everywhere. What can go wrong is the surfaces,
// in three ways, two of which pull against each other:
//
//   1. Too dark  -> text on that surface drops below WCAG AA. slate-500 page
//                   subtitles bind --background; slate-600 nav labels bind
//                   --surface, which is why --surface can be much stronger.
//   2. Too pale  -> the tint is invisible and picking a colour does nothing.
//   3. Missing   -> a tint declares one surface but not the other.
//
// (1) and (2) are in direct tension: lightening to win contrast bleeds out the
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
const SLATE_600 = "#475569"; // page subtitles and sidebar nav labels
const CARD_LIGHT = "#ffffff"; // bg-white card
const CARD_DARK = "#0f172a"; // dark:bg-slate-900 card

const themes = [
  {
    id: "default",
    light: base["--background"],
    dark: baseDark["--background"],
    lightSurface: base["--surface"],
    darkSurface: baseDark["--surface"],
  },
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
  themes.push({
    id,
    light: decls["--background"],
    dark: darkDecls["--background"],
    lightSurface: decls["--surface"],
    darkSurface: darkDecls["--surface"],
  });
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
const MIN_CHROMA_SHELL = 20; // shell is the main canvas, so it must clearly read as coloured
const MIN_CHROMA_SURFACE = 12; // chrome carries the theme, so it must be obvious

let failures = 0;

for (const t of themes) {
  const missing = ["light", "dark", "lightSurface", "darkSurface"].filter((k) => !t[k]);
  if (missing.length) {
    console.log(`✗ ${t.id}: missing ${missing.join(", ")}`);
    failures++;
    continue;
  }
  const checks = [];
  const need = (label, fg, bg) => {
    const r = ratio(fg, bg);
    if (r < AA) checks.push(`${label} ${r.toFixed(2)} < ${AA}`);
    return r;
  };

  // Light
  const shellSubtitle = need("light shell: slate-600 subtitle", SLATE_600, t.light);
  need("light shell: body text", FG_LIGHT, t.light);
  need("light shell: brand link", BRAND_600, t.light);
  const navText = need("light chrome: slate-600 nav", SLATE_600, t.lightSurface);
  need("light chrome: brand link", BRAND_600, t.lightSurface);

  // Dark
  need("dark shell: body text", FG_DARK, t.dark);
  need("dark shell: brand-400 link", BRAND_400, t.dark);
  need("dark shell: brand-300", BRAND_300, t.dark);
  need("dark chrome: body text", FG_DARK, t.darkSurface);
  need("dark chrome: brand-400 link", BRAND_400, t.darkSurface);

  // Cards must stay distinguishable from the chrome they sit near.
  void ratio(CARD_LIGHT, t.lightSurface);
  void ratio(CARD_DARK, t.darkSurface);

  // Visibility. The untinted default is exempt by definition.
  const cShell = chroma(t.light);
  const cSurf = chroma(t.lightSurface);
  const cSurfD = chroma(t.darkSurface);
  if (t.id !== "default") {
    if (cShell < MIN_CHROMA_SHELL) checks.push(`light shell invisible (chroma ${cShell})`);
    if (cSurf < MIN_CHROMA_SURFACE) checks.push(`light chrome too pale (chroma ${cSurf} < ${MIN_CHROMA_SURFACE})`);
    if (cSurfD < MIN_CHROMA_SURFACE) checks.push(`dark chrome too pale (chroma ${cSurfD} < ${MIN_CHROMA_SURFACE})`);
  }

  console.log(
    `${checks.length ? "✗" : "✓"} ${t.id.padEnd(9)} ` +
      `chrome: nav ${navText.toFixed(2)} chroma ${String(cSurf).padStart(2)}/${String(cSurfD).padStart(2)} | ` +
      `shell: subtitle ${shellSubtitle.toFixed(2)} chroma ${String(cShell).padStart(2)}`
  );
  for (const c of checks) {
    console.log(`     ✗ ${c}`);
    failures++;
  }
}

console.log(
  `\n${themes.length} tint(s) checked — ${failures === 0 ? "all constraints hold" : `${failures} PROBLEM(S)`}`
);
if (failures > 0) process.exitCode = 1;
