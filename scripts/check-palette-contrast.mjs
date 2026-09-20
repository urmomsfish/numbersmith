// Checks the graphite ramp against the surfaces it actually renders on.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const light = {
  background: "#f7f6f2", surface: "#fbfaf7", card: "#ffffff", white: "#ffffff",
  b50: "#efece8", b100: "#e3dfda", b300: "#c1bcb5", b400: "#918a82",
  b500: "#635c54", b600: "#423c36", b700: "#332e29", b800: "#292420", b900: "#1c1917",
  ember500: "#f97316", ember600: "#ea580c", ember700: "#c2410c",
  slate600: "#475569", slate900: "#0f172a", foreground: "#171a24",
};
const dark = {
  background: "#0b1120", surface: "#0f172a", card: "#171d2b", white: "#ffffff",
  b100: "#e3dfda", b200: "#dcd8d3", b300: "#c1bcb5", b400: "#918a82",
  b500: "#635c54", b600: "#6b635a", b700: "#7d746a", b800: "#3f3833", b950: "#2a2522",
  ember500: "#f97316", ember600: "#ea580c", ember400: "#fb923c",
  slate50: "#f8fafc", slate300: "#cbd5e1", slate400: "#94a3b8",
};

// [label, fg, bg, minimum, kind]
const TEXT = 4.5, UI = 3.0;
const checks = [
  // --- light mode ---
  ["L primary button: white on brand-600", light.white, light.b600, TEXT],
  ["L primary button vs page", light.b600, light.background, UI],
  ["L active nav fill vs surface", light.b50, light.surface, 1.06],
  ["L active nav text on fill", light.b800, light.b50, TEXT],
  ["L selected card fill vs card", light.b50, light.card, 1.06],
  ["L link text on card", light.foreground, light.card, TEXT],
  ["L link underline vs card", light.foreground, light.card, TEXT],
  ["L focus indicator vs card", light.foreground, light.card, UI],
  ["L ember link text on card", light.ember700, light.card, TEXT],
  ["L Pro accent text on card", light.ember700, light.card, TEXT],
  ["L progress fill vs track", light.b600, light.b100, UI],
  ["L logo mark on surface", light.ember600, light.surface, UI],
  ["L secondary btn text on white", light.b700, light.white, TEXT],
  ["L big stat number on card", light.b700, light.card, TEXT],
  // --- dark mode ---
  ["D primary button: white on brand-600", dark.white, dark.b600, TEXT],
  ["D primary button vs page", dark.b600, dark.background, UI],
  ["D primary hover vs page", dark.b700, dark.background, UI],
  ["D active nav fill vs surface", dark.b950, dark.surface, 1.06],
  ["D active nav text on fill", dark.b200, dark.b950, TEXT],
  ["D selected card fill vs card", dark.b950, dark.card, 1.06],
  ["D link text on card", dark.slate50, dark.card, TEXT],
  ["D link underline vs card", dark.slate50, dark.card, TEXT],
  ["D focus indicator vs card", dark.slate50, dark.card, UI],
  ["D focus indicator vs page", dark.slate50, dark.background, UI],
  ["D Pro accent text on card", dark.ember500, dark.card, TEXT],
  ["D border-brand-800 vs card", dark.b800, dark.card, 1.2],
  ["D secondary btn text", dark.b300, dark.surface, TEXT],
  ["D big stat number on card", dark.b300, dark.card, TEXT],
  ["D logo mark on surface", dark.ember500, dark.surface, UI],
];

let fails = 0;
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fails++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${r.toFixed(2).padStart(6)}:1  (min ${String(min).padStart(4)})  ${label}`);
}
console.log(fails === 0 ? `\nAll ${checks.length} pairs hold.` : `\n${fails} of ${checks.length} FAILED.`);
process.exit(fails === 0 ? 0 : 1);
