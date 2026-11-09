/**
 * How a Number Merge tile looks.
 *
 * Separated from the engine because it is pure presentation, and kept out of
 * the component because it is worth checking: the ramp has to cover every
 * value a tile can reach, and the text has to stay legible on every face.
 *
 * The ramp is a heat ramp — cool stone at 2, then amber, then fire, then
 * white-hot, then a violet that reads as "past the top of the scale". That is
 * the one visual job the palette has to do: a player should know roughly how
 * big a tile is from the corner of their eye, before reading the number.
 * NumberSmith's ember accent is the centre of it, so the board still looks
 * like it belongs to this app.
 */

import type { Tile } from "@/lib/games/merge";

export type TileStyle = {
  /** CSS background, usually a gradient. */
  background: string;
  /** Text colour. */
  ink: string;
  /** Border colour, for the thin inner edge. */
  edge: string;
  /** Outer glow. "none" for the low tiles, which should stay calm. */
  glow: string;
  /** Font size as a fraction of the cell, so 1024 still fits. */
  scale: number;
};

const RAMP: { upTo: number; style: Omit<TileStyle, "scale"> }[] = [
  {
    upTo: 3,
    style: {
      background: "linear-gradient(145deg, #4b5565, #37404e)",
      ink: "#e7ecf3",
      edge: "rgba(255,255,255,0.14)",
      glow: "none",
    },
  },
  {
    upTo: 6,
    style: {
      background: "linear-gradient(145deg, #5d6878, #434d5c)",
      ink: "#f1f5f9",
      edge: "rgba(255,255,255,0.16)",
      glow: "none",
    },
  },
  {
    upTo: 12,
    style: {
      background: "linear-gradient(145deg, #a16207, #78350f)",
      ink: "#fffbeb",
      edge: "rgba(253,230,138,0.3)",
      glow: "none",
    },
  },
  {
    upTo: 24,
    style: {
      background: "linear-gradient(145deg, #d97706, #92400e)",
      ink: "#fffbeb",
      edge: "rgba(253,230,138,0.38)",
      glow: "0 0 12px -2px rgba(217,119,6,0.5)",
    },
  },
  {
    upTo: 48,
    style: {
      background: "linear-gradient(145deg, #f59e0b, #b45309)",
      ink: "#2a1a05",
      edge: "rgba(255,255,255,0.4)",
      glow: "0 0 16px -2px rgba(245,158,11,0.55)",
    },
  },
  {
    upTo: 96,
    style: {
      background: "linear-gradient(145deg, #f97316, #c2410c)",
      ink: "#fff7ed",
      edge: "rgba(255,237,213,0.45)",
      glow: "0 0 18px -2px rgba(249,115,22,0.6)",
    },
  },
  {
    upTo: 192,
    style: {
      background: "linear-gradient(145deg, #ef4444, #b91c1c)",
      ink: "#fef2f2",
      edge: "rgba(254,226,226,0.45)",
      glow: "0 0 22px -2px rgba(239,68,68,0.65)",
    },
  },
  {
    upTo: 384,
    style: {
      background: "linear-gradient(145deg, #fb7185, #be123c)",
      ink: "#fff1f2",
      edge: "rgba(255,228,230,0.5)",
      glow: "0 0 26px -2px rgba(244,63,94,0.7)",
    },
  },
  {
    upTo: 768,
    style: {
      background: "linear-gradient(145deg, #fbbf24, #ea580c 55%, #be123c)",
      ink: "#1c1917",
      edge: "rgba(255,255,255,0.55)",
      glow: "0 0 30px -2px rgba(251,146,60,0.8)",
    },
  },
  {
    upTo: 1536,
    style: {
      background: "linear-gradient(145deg, #fef3c7, #fbbf24 50%, #f97316)",
      ink: "#431407",
      edge: "rgba(255,255,255,0.8)",
      glow: "0 0 34px -2px rgba(251,191,36,0.85)",
    },
  },
  {
    upTo: 3072,
    style: {
      background: "linear-gradient(145deg, #ffffff, #fde68a 45%, #fb923c)",
      ink: "#431407",
      edge: "#ffffff",
      glow: "0 0 44px -4px rgba(255,255,255,0.9)",
    },
  },
];

/** Past the top of the ramp the heat has run out, so it changes element. */
const BEYOND: Omit<TileStyle, "scale"> = {
  background: "linear-gradient(145deg, #e0e7ff, #a78bfa 45%, #7c3aed)",
  ink: "#1e1b4b",
  edge: "#ede9fe",
  glow: "0 0 48px -4px rgba(167,139,250,0.95)",
};



/** Digits get smaller as they get more numerous, so 16384 still fits a cell. */
function scaleFor(label: string): number {
  if (label.length <= 2) return 0.42;
  if (label.length === 3) return 0.34;
  if (label.length === 4) return 0.26;
  return 0.21;
}

export function tileStyle(tile: Pick<Tile, "value">): TileStyle {
  const band = RAMP.find((b) => tile.value <= b.upTo)?.style ?? BEYOND;
  return { ...band, scale: scaleFor(String(tile.value)) };
}

/** Merges worth a particle burst, and how many sparks it gets. */
export function sparkCount(value: number): number {
  if (value < 24) return 0;
  if (value < 96) return 8;
  if (value < 384) return 14;
  return 22;
}

/** Spark colour, matched to the tile that produced it. */
export function sparkColor(value: number): string {
  if (value >= 1536) return "#ffffff";
  if (value >= 384) return "#fbbf24";
  if (value >= 96) return "#fb7185";
  return "#fb923c";
}
