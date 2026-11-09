/**
 * The Forgelands — rules for the quest, as pure functions.
 *
 * WHAT CHANGED AND WHY. The Gauntlet was an endless score attack: rocks fell,
 * you answered, eventually you died. That is a game, but it is a game with one
 * verb and no memory — minute twenty is identical to minute two, nothing you
 * did earlier changes what happens next, and there is nowhere to get to.
 *
 * A quest fixes all three. You travel a map and choose your route, so the run
 * has a shape. You fight things with their own health, so a problem is a blow
 * rather than a tick. You collect relics that rewrite the rules, so the run
 * accumulates. And there is an end to reach, so finishing means something.
 *
 * Maths is still the only verb that does anything — a correct answer is your
 * attack and a wrong one is theirs — but it is no longer the subject. You are
 * not answering questions; you are getting through the Emberwastes.
 *
 * Nothing here touches the clock, the database or the request, so the whole
 * design is checkable: see scripts/check-quest-rules.ts.
 */

// ---------------------------------------------------------------------------
// Levelling
// ---------------------------------------------------------------------------

/**
 * The student's difficulty centre, on the scale the rating engine uses:
 * rating = 900 + 120 * difficulty. Shared with the other timed modes so they
 * all agree about what "at my level" means.
 */
export function centreForRating(rating: number): number {
  return Math.round((rating - 900) / 120);
}

/**
 * The difficulty window to draw from, centred on what the player can already
 * do. Narrow on purpose: a quest is a speed test on material inside their
 * reach, and a band wide enough to include problems they cannot start is a
 * band that kills them for reasons other than play.
 */
export function bandFor(centre: number): { floor: number; ceiling: number } {
  const floor = clampInt(centre - 1, 1, 10);
  const ceiling = clampInt(centre + 1, floor, 10);
  return { floor, ceiling };
}

const clampInt = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

// ---------------------------------------------------------------------------
// The hero
// ---------------------------------------------------------------------------

export const HERO_MAX_HP = 60;
/** Relics a hero can carry at once. Small, so picking one means refusing another. */
export const RELIC_SLOTS = 6;

// ---------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------

export const REGIONS = ["EMBERWASTES", "GLASS_REACH", "SUNKEN_VAULT"] as const;
export type Region = (typeof REGIONS)[number];

export type RegionSpec = {
  region: Region;
  index: number;
  name: string;
  subtitle: string;
  /** Steps on the road before the boss. */
  length: number;
  /** Seconds a plain enemy spends winding up, before its own modifier. */
  windupSeconds: number;
  /** Difficulty band offset applied on top of the player's own level. */
  difficultyLift: number;
  /** Scene palette, as [sky top, sky bottom, ground, rock] hex. */
  palette: { skyTop: string; skyBottom: string; ground: string; rock: string; accent: string };
};

export const REGION_SPECS: Record<Region, RegionSpec> = {
  EMBERWASTES: {
    region: "EMBERWASTES",
    index: 1,
    name: "The Emberwastes",
    subtitle: "Scorched plains under a low red sun.",
    length: 8,
    windupSeconds: 50,
    difficultyLift: 0,
    palette: {
      skyTop: "#2a1410",
      skyBottom: "#5e2a16",
      ground: "#2a1a16",
      rock: "#3d241c",
      accent: "#f97316",
    },
  },
  GLASS_REACH: {
    region: "GLASS_REACH",
    index: 2,
    name: "The Glass Reach",
    subtitle: "A frozen shelf where the air cuts.",
    length: 9,
    windupSeconds: 44,
    difficultyLift: 1,
    palette: {
      skyTop: "#0b1c2e",
      skyBottom: "#1f4a63",
      ground: "#17283a",
      rock: "#22384d",
      accent: "#7dd3fc",
    },
  },
  SUNKEN_VAULT: {
    region: "SUNKEN_VAULT",
    index: 3,
    name: "The Sunken Vault",
    subtitle: "Below the world, where the ledgers are kept.",
    length: 10,
    windupSeconds: 38,
    difficultyLift: 2,
    palette: {
      skyTop: "#160d26",
      skyBottom: "#2e1a4a",
      ground: "#1a1026",
      rock: "#2a1b3d",
      accent: "#a78bfa",
    },
  },
};

export const regionSpec = (r: Region) => REGION_SPECS[r];
export const regionAt = (index: number): Region => REGIONS[Math.min(REGIONS.length - 1, Math.max(0, index - 1))];

// ---------------------------------------------------------------------------
// Encounters
// ---------------------------------------------------------------------------

export const NODE_TYPES = ["BATTLE", "ELITE", "TREASURE", "FORGE", "BOSS"] as const;
export type NodeType = (typeof NODE_TYPES)[number];

export type NodeSpec = { type: NodeType; label: string; blurb: string };

export const NODE_SPECS: Record<NodeType, NodeSpec> = {
  BATTLE: { type: "BATTLE", label: "Skirmish", blurb: "Something is in the way." },
  ELITE: { type: "ELITE", label: "Champion", blurb: "Dangerous. Carries a relic." },
  TREASURE: { type: "TREASURE", label: "Cache", blurb: "A relic, no fight." },
  FORGE: { type: "FORGE", label: "Forge", blurb: "Mend your wounds." },
  BOSS: { type: "BOSS", label: "Warden", blurb: "The way out." },
};

/** Healing a Forge gives, as a share of max HP. */
export const FORGE_HEAL_SHARE = 0.3;

// ---------------------------------------------------------------------------
// Monsters
// ---------------------------------------------------------------------------

export type MonsterSpec = {
  key: string;
  name: string;
  region: Region;
  tier: "COMMON" | "ELITE" | "BOSS";
  hp: number;
  /** Damage dealt when its wind-up completes or you answer wrong. */
  attack: number;
  /** Multiplies the region's wind-up — slow bruisers, fast skirmishers. */
  windupScale: number;
  /** Which procedural silhouette the canvas draws. */
  art: "IMP" | "BEAST" | "WRAITH" | "GOLEM" | "TYRANT" | "MITE" | "STALKER" | "HOUND" | "SHARDMAW" | "ARCHIVIST" | "CRAWLER" | "SHADE" | "GEARWYRM" | "AXIOM";
  taunt: string;
};

export const MONSTERS: MonsterSpec[] = [
  // --- Emberwastes -------------------------------------------------------
  { key: "cinder-imp", name: "Cinder Imp", region: "EMBERWASTES", tier: "COMMON", hp: 28, attack: 7, windupScale: 0.8, art: "IMP", taunt: "It skitters just out of reach." },
  { key: "slagbeast", name: "Slagbeast", region: "EMBERWASTES", tier: "COMMON", hp: 42, attack: 10, windupScale: 1.2, art: "BEAST", taunt: "Molten rock drips where it stands." },
  { key: "ash-wraith", name: "Ash Wraith", region: "EMBERWASTES", tier: "COMMON", hp: 34, attack: 9, windupScale: 1, art: "WRAITH", taunt: "It is mostly smoke, and entirely patient." },
  { key: "magma-golem", name: "Magma Golem", region: "EMBERWASTES", tier: "ELITE", hp: 78, attack: 14, windupScale: 1.25, art: "GOLEM", taunt: "Each step cracks the ground." },
  { key: "kiln-tyrant", name: "The Kiln Tyrant", region: "EMBERWASTES", tier: "BOSS", hp: 125, attack: 16, windupScale: 1.15, art: "TYRANT", taunt: "It was here before the waste was waste." },

  // --- Glass Reach -------------------------------------------------------
  { key: "frost-mite", name: "Frost Mite", region: "GLASS_REACH", tier: "COMMON", hp: 34, attack: 9, windupScale: 0.75, art: "MITE", taunt: "Quick, and there are never just one." },
  { key: "glass-stalker", name: "Glass Stalker", region: "GLASS_REACH", tier: "COMMON", hp: 46, attack: 11, windupScale: 1, art: "STALKER", taunt: "You see it only when it moves." },
  { key: "rime-hound", name: "Rime Hound", region: "GLASS_REACH", tier: "COMMON", hp: 40, attack: 12, windupScale: 0.85, art: "HOUND", taunt: "Its breath frosts the air between you." },
  { key: "shardmaw", name: "Shardmaw", region: "GLASS_REACH", tier: "ELITE", hp: 92, attack: 16, windupScale: 1.1, art: "SHARDMAW", taunt: "A mouth of broken glass, and nothing else." },
  { key: "pale-archivist", name: "The Pale Archivist", region: "GLASS_REACH", tier: "BOSS", hp: 150, attack: 18, windupScale: 1, art: "ARCHIVIST", taunt: "It has been expecting you, and has notes." },

  // --- Sunken Vault ------------------------------------------------------
  { key: "vault-crawler", name: "Vault Crawler", region: "SUNKEN_VAULT", tier: "COMMON", hp: 44, attack: 11, windupScale: 0.9, art: "CRAWLER", taunt: "It drags something heavy behind it." },
  { key: "null-shade", name: "Null Shade", region: "SUNKEN_VAULT", tier: "COMMON", hp: 38, attack: 13, windupScale: 0.8, art: "SHADE", taunt: "Where it passes, the numbers stop meaning things." },
  { key: "gearwyrm", name: "Gearwyrm", region: "SUNKEN_VAULT", tier: "ELITE", hp: 104, attack: 17, windupScale: 1.05, art: "GEARWYRM", taunt: "It turns, and the room turns with it." },
  { key: "the-axiom", name: "The Axiom", region: "SUNKEN_VAULT", tier: "BOSS", hp: 180, attack: 20, windupScale: 0.95, art: "AXIOM", taunt: "It does not need to be true. It only needs to be assumed." },
];

export const monsterByKey = (key: string): MonsterSpec | undefined => MONSTERS.find((m) => m.key === key);

/** Picks a monster for a node, given a roll in [0, 1). Pure, so the pool for
 * every region and tier can be swept in the tests. */
export function monsterFor(region: Region, type: NodeType, roll: number): MonsterSpec {
  const tier = type === "BOSS" ? "BOSS" : type === "ELITE" ? "ELITE" : "COMMON";
  const pool = MONSTERS.filter((m) => m.region === region && m.tier === tier);
  // Every region is authored with at least one monster of every tier; the
  // fallback exists so a future region with a gap degrades to a fight rather
  // than crashing a run in progress.
  const safe = pool.length > 0 ? pool : MONSTERS.filter((m) => m.tier === tier);
  return safe[Math.min(safe.length - 1, Math.floor(roll * safe.length))];
}

/** The wind-up clock for one exchange, in milliseconds. */
export function windupMsFor(region: Region, m: MonsterSpec): number {
  return Math.round(regionSpec(region).windupSeconds * m.windupScale * 1000);
}

// ---------------------------------------------------------------------------
// Relics
// ---------------------------------------------------------------------------

export const RELICS = [
  "whetstone",
  "hourglass",
  "wardstone",
  "loupe",
  "emberheart",
  "ledger",
  "focus",
  "bulwark",
] as const;
export type Relic = (typeof RELICS)[number];

export type RelicSpec = {
  relic: Relic;
  name: string;
  blurb: string;
  /** Drawn as a small glyph in the HUD. */
  glyph: string;
};

export const RELIC_SPECS: Record<Relic, RelicSpec> = {
  whetstone: { relic: "whetstone", name: "Whetstone", blurb: "Your strikes hit 30% harder.", glyph: "◆" },
  hourglass: { relic: "hourglass", name: "Hourglass", blurb: "Every wind-up is 7 seconds longer.", glyph: "⧗" },
  wardstone: { relic: "wardstone", name: "Wardstone", blurb: "The first blow of each fight is blocked.", glyph: "✶" },
  loupe: { relic: "loupe", name: "Jeweller's Loupe", blurb: "One wrong option is struck out, every time.", glyph: "◎" },
  emberheart: { relic: "emberheart", name: "Emberheart", blurb: "Killing something mends 5 health.", glyph: "♥" },
  ledger: { relic: "ledger", name: "The Ledger", blurb: "Half as much gold again.", glyph: "❂" },
  focus: { relic: "focus", name: "Focus", blurb: "Your combo builds after 2 hits, not 3.", glyph: "⟡" },
  bulwark: { relic: "bulwark", name: "Bulwark", blurb: "You take 3 less from every blow.", glyph: "⬢" },
};

export const hasRelic = (relics: readonly string[], r: Relic) => relics.includes(r);

/**
 * Gold paid for walking away from a relic.
 *
 * Exists so a reward can never be a dead end. With six slots full the offer
 * has nothing to give, and a screen whose only button does nothing is worse
 * than no screen — so there is always something to take.
 */
export const RELIC_SKIP_GOLD = 60;

/** True when the pack is full and only gold is on the table. */
export const packIsFull = (relics: readonly string[]) => relics.length >= RELIC_SLOTS;

/** Relics on offer, excluding ones already held. Deterministic given the roll. */
export function relicChoices(held: readonly string[], roll: number, count = 3): Relic[] {
  const pool = RELICS.filter((r) => !held.includes(r));
  if (pool.length === 0) return [];
  const out: Relic[] = [];
  // Walk the pool from a roll-derived start so the offer is varied but never
  // repeats a relic within one draw.
  let i = Math.floor(roll * pool.length);
  while (out.length < Math.min(count, pool.length)) {
    out.push(pool[i % pool.length]);
    i++;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Consecutive hits needed per step of the combo multiplier. */
export const COMBO_STEP = 3;
export const COMBO_STEP_FOCUSED = 2;
export const MAX_COMBO = 4;

export function comboFor(streak: number, relics: readonly string[]): number {
  const step = hasRelic(relics, "focus") ? COMBO_STEP_FOCUSED : COMBO_STEP;
  return Math.min(MAX_COMBO, 1 + Math.floor(streak / step));
}

/**
 * Damage one correct answer deals.
 *
 * Difficulty is the body of it, speed is a bonus on top, and the combo scales
 * the whole thing — so the way to kill a Warden is a sustained run on hard
 * problems, which is the same thing that wins a contest. Rounded once at the
 * end so a relic cannot be lost to flooring.
 */
export function strikeDamage(input: {
  difficulty: number;
  combo: number;
  fractionLeft: number;
  relics: readonly string[];
}): number {
  const base = 5 + input.difficulty * 2.2;
  const speed = base * 0.45 * clamp(input.fractionLeft, 0, 1);
  const whet = hasRelic(input.relics, "whetstone") ? 1.3 : 1;
  return Math.max(1, Math.round((base + speed) * whet * input.combo));
}

/** Damage the hero takes from one enemy blow. */
export function blowDamage(attack: number, relics: readonly string[]): number {
  return Math.max(1, attack - (hasRelic(relics, "bulwark") ? 3 : 0));
}

export function windupWithRelics(baseMs: number, relics: readonly string[]): number {
  return baseMs + (hasRelic(relics, "hourglass") ? 7000 : 0);
}

/** Gold for felling something. */
export function goldFor(m: MonsterSpec, relics: readonly string[]): number {
  const base = m.tier === "BOSS" ? 120 : m.tier === "ELITE" ? 70 : 25;
  return Math.round(base * (hasRelic(relics, "ledger") ? 1.5 : 1));
}

/** Score, kept alongside the quest so there is still a number to beat. */
export function scoreFor(input: { damage: number; tier: MonsterSpec["tier"] }): number {
  const weight = input.tier === "BOSS" ? 12 : input.tier === "ELITE" ? 6 : 3;
  return input.damage * weight;
}

export const FORGE_HEAL = Math.round(HERO_MAX_HP * FORGE_HEAL_SHARE);

// ---------------------------------------------------------------------------
// The road
// ---------------------------------------------------------------------------

export type QuestNode = { type: NodeType; monster?: string };
/** Each step of the road offers one or two ways forward. */
export type QuestStep = QuestNode[];

/**
 * Lays out a region's road.
 *
 * `rolls` is a flat list of numbers in [0, 1) supplied by the caller, which is
 * what keeps this pure and therefore checkable: the test feeds it fixed
 * sequences and asserts the shape, and the engine feeds it Math.random.
 *
 * The shape is deliberate. Step 0 is always a plain skirmish so a run opens on
 * the mechanic rather than on a decision; the last step is always the Warden;
 * a Forge is guaranteed in the back half so a mauled hero has somewhere to
 * recover; and every other step offers a real choice between two node types.
 */
export function buildRoad(region: Region, rolls: number[]): QuestStep[] {
  const spec = regionSpec(region);
  const take = (i: number) => rolls[i % rolls.length] ?? 0.5;
  const steps: QuestStep[] = [];
  let r = 0;

  steps.push([{ type: "BATTLE", monster: monsterFor(region, "BATTLE", take(r++)).key }]);

  const mid = spec.length - 1;
  // One guaranteed Forge and one guaranteed Champion, placed in the back half
  // where they matter, then the rest rolled.
  const forgeAt = Math.max(2, Math.floor(mid * 0.6));
  const eliteAt = Math.max(3, Math.floor(mid * 0.8));

  for (let i = 1; i < mid; i++) {
    const options: QuestNode[] = [];
    if (i === forgeAt) options.push({ type: "FORGE" });
    if (i === eliteAt) options.push({ type: "ELITE", monster: monsterFor(region, "ELITE", take(r++)).key });

    while (options.length < 2) {
      const roll = take(r++);
      const type: NodeType = roll < 0.56 ? "BATTLE" : roll < 0.74 ? "ELITE" : roll < 0.88 ? "TREASURE" : "FORGE";
      // Never offer the same two things, or the choice is not a choice.
      if (options.some((o) => o.type === type)) continue;
      options.push(
        type === "BATTLE" || type === "ELITE"
          ? { type, monster: monsterFor(region, type, take(r++)).key }
          : { type }
      );
    }
    steps.push(options);
  }

  steps.push([{ type: "BOSS", monster: monsterFor(region, "BOSS", take(r++)).key }]);
  return steps;
}

export function isLastRegion(region: Region): boolean {
  return REGIONS.indexOf(region) === REGIONS.length - 1;
}

export function nextRegion(region: Region): Region | null {
  const i = REGIONS.indexOf(region);
  return i < REGIONS.length - 1 ? REGIONS[i + 1] : null;
}
