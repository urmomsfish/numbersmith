// Verifies every tint in globals.css stays readable and visible.
//
// Each tint colours three surfaces, with different amounts of headroom:
//   --surface     sidebar / topbar / marketing header. Text is slate-600+, so
//                 this can carry the strong tint that makes the theme visible.
//   --background  page shell behind the cards. Bounded much more tightly,
//                 because page subtitles use slate-500 and the untinted
//                 default only clears AA by 0.05.
//   --card        dashboard boxes, settings panels, problem cards, etc. Both
//                 modes follow the tint's hue per block as a genuinely
//                 saturated colour (HSL, not a black-mixed shade of
//                 --background, which reads as grey/brown): dark lightens
//                 off its background, light is built directly at L78/S55.
//                 All light-mode muted card text was moved to slate-700
//                 (from slate-500/400) to keep headroom at that saturation;
//                 slate-600 drops several tints below AA. See the "Card
//                 colour" comment in globals.css.
//
// Run after touching any --background/--card value or adding a tint:
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
const SLATE_700 = "#334155"; // (light mode) card body/meta text
const SLATE_400 = "#94a3b8"; // card meta text, dark mode (the tighter of the
// two patterns the app uses: "text-slate-500 dark:text-slate-400" renders
// slate-400 in dark mode, and it sits closer in luminance to a lightened dark
// card than slate-500 does, making it the binding constraint there).

if (!base["--card"]) {
  console.error("✗ :root is missing --card");
  process.exitCode = 1;
}

const themes = [
  {
    id: "default",
    light: base["--background"],
    dark: baseDark["--background"],
    lightSurface: base["--surface"],
    darkSurface: baseDark["--surface"],
    lightCard: base["--card"],
    darkCard: baseDark["--card"],
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
  if (!darkDecls["--card"]) {
    console.error(`✗ ${id}: missing .dark[data-tint="${id}"] --card override`);
    process.exitCode = 1;
    continue;
  }
  if (!decls["--card"]) {
    console.error(`✗ ${id}: missing [data-tint="${id}"] --card override`);
    process.exitCode = 1;
    continue;
  }
  themes.push({
    id,
    light: decls["--background"],
    dark: darkDecls["--background"],
    lightSurface: decls["--surface"],
    darkSurface: darkDecls["--surface"],
    lightCard: decls["--card"],
    darkCard: darkDecls["--card"],
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

  // Card body text.
  need("light card: slate-700 body text", SLATE_700, t.lightCard);
  need("dark card: slate-400 meta text", SLATE_400, t.darkCard);

  // Cards must stay visually distinguishable from the page behind them, or
  // the fill reads as a seamless continuation of the shell — though the
  // border every card already has (border-slate-200/700) is the primary cue
  // for that, not the fill. This just asserts the fill is a genuine, distinct
  // value rather than 1.000 (identical to the background).
  const MIN_CARD_STEP = 1.001;
  const cardVsBg = ratio(t.lightCard, t.light);
  if (cardVsBg < MIN_CARD_STEP) checks.push(`light card melts into the page (${cardVsBg.toFixed(3)})`);
  const darkCardVsBg = ratio(t.darkCard, t.dark);
  if (darkCardVsBg < MIN_CARD_STEP) checks.push(`dark card melts into the page (${darkCardVsBg.toFixed(3)})`);

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
