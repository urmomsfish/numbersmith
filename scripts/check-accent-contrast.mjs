// Verifies every accent theme in globals.css against the brand-shade pairings
// the app actually renders, at WCAG AA.
//
// This parses the real CSS rather than keeping its own copy of the palettes, so
// it cannot silently drift from what ships. Run it after touching any
// --brand-* value or adding an accent:
//
//   npm run verify:contrast
//
// The pairings below were derived from a grep of bg-brand-*, text-brand-*, and
// dark:text-brand-* across src/ — they are the combinations that exist, not a
// theoretical matrix. Update them if the UI starts using a new shade pairing.

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
    // Block at-rules (@theme, @layer) — none declare the brand ramp, and their
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
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const base = rules.get(":root") ?? {};
const baseDark = rules.get(".dark") ?? {};

const themes = [
  {
    id: "indigo (default)",
    scale: STEPS.map((s) => base[`--brand-${s}`]),
    bgLight: base["--background"],
    bgDark: baseDark["--background"],
  },
];

for (const [selector, decls] of rules) {
  const m = selector.match(/^\[data-accent="([\w-]+)"\]$/);
  if (!m) continue;
  const id = m[1];
  const darkDecls = rules.get(`.dark[data-accent="${id}"]`);
  if (!darkDecls?.["--background"]) {
    console.error(`✗ ${id}: missing .dark[data-accent="${id}"] background override`);
    process.exitCode = 1;
    continue;
  }
  themes.push({
    id,
    scale: STEPS.map((s) => decls[`--brand-${s}`]),
    bgLight: decls["--background"],
    bgDark: darkDecls["--background"],
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

const WHITE = "#ffffff";
// 4.5 = AA for normal text. 3.0 = AA for large/bold text and for non-text UI
// boundaries such as the selected-choice borders.
function pairs(t) {
  const s = (n) => t.scale[STEPS.indexOf(n)];
  return [
    ["white on brand-600 (primary button)", WHITE, s(600), 4.5],
    ["brand-600 text on tinted light bg", s(600), t.bgLight, 4.5],
    ["brand-700 text on tinted light bg", s(700), t.bgLight, 4.5],
    ["brand-600 text on white card", s(600), WHITE, 4.5],
    ["brand-700 text on white card", s(700), WHITE, 4.5],
    ["brand-800 on brand-50 (selected choice)", s(800), s(50), 4.5],
    ["brand-700 on brand-50 (badge)", s(700), s(50), 4.5],
    ["brand-400 text on dark bg", s(400), t.bgDark, 4.5],
    ["brand-300 text on dark bg", s(300), t.bgDark, 4.5],
    ["brand-300 on brand-950 (dark selected)", s(300), s(950), 4.5],
    ["brand-400 on brand-950 (dark badge)", s(400), s(950), 4.5],
    ["white on brand-700", WHITE, s(700), 4.5],
    ["brand-500 border on light bg", s(500), t.bgLight, 3.0],
    ["brand-400 border on dark bg", s(400), t.bgDark, 3.0],
  ];
}

let failures = 0;
for (const t of themes) {
  if (t.scale.some((v) => !v) || !t.bgLight || !t.bgDark) {
    console.error(`✗ ${t.id}: incomplete ramp (missing a --brand-* or --background)`);
    failures++;
    continue;
  }
  const rows = pairs(t).map(([label, fg, bg, min]) => ({
    label,
    r: ratio(fg, bg),
    min,
  }));
  const bad = rows.filter((r) => r.r < r.min);
  failures += bad.length;
  const tightest = Math.min(...rows.map((r) => r.r));
  console.log(
    `${bad.length ? "✗" : "✓"} ${t.id.padEnd(18)} tightest ${tightest.toFixed(2)}:1`
  );
  for (const r of bad) {
    console.log(`     ✗ ${r.label.padEnd(40)} ${r.r.toFixed(2)} (need ${r.min})`);
  }
}

console.log(
  `\n${themes.length} theme(s) checked — ${failures === 0 ? "all pairings pass" : `${failures} FAILING PAIRING(S)`}`
);
if (failures > 0) process.exitCode = 1;
