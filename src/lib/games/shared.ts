/**
 * What the three arcade games have in common.
 *
 * Pure: the catalogue the dashboard renders from, the shapes of the saved
 * state, and the derivation of records and achievements from them. No
 * database, no React — so a client component and a server component can both
 * import it, and scripts/check-games.ts can check it.
 *
 * The progression is deliberately small. There is one currency (XP), one
 * number per game that counts as a personal best, and a short fixed list of
 * achievements. A deeper reward economy would be more to build and more to
 * read, and would not make anyone better at arithmetic.
 */

export const GAME_KEYS = ["MERGE", "ESCAPE", "CODEBREAKER"] as const;
export type GameKey = (typeof GAME_KEYS)[number];

export type GameMeta = {
  key: GameKey;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** What skill it actually trains, said plainly. */
  trains: string;
  /** How the best score is phrased on the card. */
  bestLabel: string;
  difficulty: "Relaxed" | "Moderate" | "Sharp";
  xpRange: string;
  /** Two hex stops for the card artwork gradient. */
  art: { from: string; to: string; ink: string };
};

export const GAMES: Record<GameKey, GameMeta> = {
  MERGE: {
    key: "MERGE",
    slug: "merge",
    name: "Factor Forge",
    tagline: "Divides, so it fuses",
    description:
      "Two tiles fuse when one of them divides the other, and leave behind their sum — 3 and 6 make 9. Matching pairs are only the easy case. Read the board for factors and push one tile as high as it will go.",
    trains: "Divisibility, factors, mental addition, forward planning",
    bestLabel: "Best score",
    difficulty: "Moderate",
    xpRange: "8–180 XP",
    art: { from: "#f59e0b", to: "#ef4444", ink: "#1c1917" },
  },
  ESCAPE: {
    key: "ESCAPE",
    slug: "escape",
    name: "Equation Escape",
    tagline: "Five rooms, one way out",
    description:
      "A temple, a laboratory, a bunker, a library and an observatory. Every door is held by mechanisms that only open for the right number. Get one wrong and the room tells you why.",
    trains: "Order of operations, fractions, algebra, patterns, geometry",
    bestLabel: "Puzzles solved",
    difficulty: "Moderate",
    xpRange: "9–37 XP each",
    art: { from: "#22d3ee", to: "#6366f1", ink: "#f8fafc" },
  },
  CODEBREAKER: {
    key: "CODEBREAKER",
    slug: "codebreaker",
    name: "Codebreaker",
    tagline: "Find the hidden calculation",
    description:
      "You are given a target number and have to find the calculation that makes it. Every guess must itself be a sum that equals the target — so each attempt is real arithmetic — and comes back marked character by character.",
    trains: "Order of operations, factors, mental arithmetic, deduction",
    bestLabel: "Best score",
    difficulty: "Sharp",
    xpRange: "3–60 XP",
    art: { from: "#a78bfa", to: "#ec4899", ink: "#f8fafc" },
  },
};

export const GAME_LIST: GameMeta[] = GAME_KEYS.map((k) => GAMES[k]);

export function gameBySlug(slug: string): GameMeta | undefined {
  return GAME_LIST.find((g) => g.slug === slug);
}

// ---------------------------------------------------------------------------
// Saved state
// ---------------------------------------------------------------------------

/** One stored standing: a row of GameScore, with its blob parsed. */
export type Standing = {
  game: GameKey;
  variant: string;
  bestScore: number;
  plays: number;
  wins: number;
  totalXp: number;
  state: StandingState;
  lastPlayedAt: string | null;
};

export type StandingState = {
  /** Number Merge: the highest tile ever reached. */
  peak?: number;
  /** Number Merge: the longest merge streak. */
  bestCombo?: number;
  /** Equation Escape: puzzle ids solved, and rooms cleared. */
  solved?: string[];
  cleared?: string[];
  /** Equation Escape: fastest clear per room key, in seconds. */
  bestTimes?: Record<string, number>;
  /** Codebreaker: wins in a row, and the best such run. */
  streak?: number;
  bestStreak?: number;
  /** Codebreaker: guesses used across all wins, for the average. */
  winAttempts?: number;
};

export function parseState(raw: string): StandingState {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StandingState;
  } catch {
    // A corrupt blob must not take a page down — the worst case is a player
    // who sees zeroes, which is recoverable by playing. Throwing here would
    // make the whole arcade unreachable.
    return {};
  }
}

export const EMPTY_STANDING = (game: GameKey, variant = "default"): Standing => ({
  game,
  variant,
  bestScore: 0,
  plays: 0,
  wins: 0,
  totalXp: 0,
  state: {},
  lastPlayedAt: null,
});

/** Every standing for one game, newest-best first. */
export function standingsFor(all: readonly Standing[], game: GameKey): Standing[] {
  return all.filter((s) => s.game === game);
}

/** The single headline number a game's card should show. */
export function headlineFor(all: readonly Standing[], game: GameKey): number {
  const rows = standingsFor(all, game);
  if (game === "ESCAPE") {
    // Progress, not score: the solved set is the same across variants.
    const solved = new Set<string>();
    rows.forEach((r) => (r.state.solved ?? []).forEach((id) => solved.add(id)));
    return solved.size;
  }
  return rows.reduce((n, r) => Math.max(n, r.bestScore), 0);
}

export function playsFor(all: readonly Standing[], game: GameKey): number {
  return standingsFor(all, game).reduce((n, r) => n + r.plays, 0);
}

export function xpFor(all: readonly Standing[], game: GameKey): number {
  return standingsFor(all, game).reduce((n, r) => n + r.totalXp, 0);
}

export function totalPlays(all: readonly Standing[]): number {
  return all.reduce((n, r) => n + r.plays, 0);
}

export function totalXp(all: readonly Standing[]): number {
  return all.reduce((n, r) => n + r.totalXp, 0);
}

/** The merged set of escape puzzles solved, across every stored variant. */
export function escapeSolved(all: readonly Standing[]): string[] {
  const out = new Set<string>();
  for (const s of standingsFor(all, "ESCAPE")) {
    for (const id of s.state.solved ?? []) out.add(id);
  }
  return [...out];
}

export function mergePeak(all: readonly Standing[]): number {
  return standingsFor(all, "MERGE").reduce((n, r) => Math.max(n, r.state.peak ?? 0), 0);
}

export function codeBestStreak(all: readonly Standing[]): number {
  return standingsFor(all, "CODEBREAKER").reduce((n, r) => Math.max(n, r.state.bestStreak ?? 0), 0);
}

/** Codebreaker's average attempts per win — null until there is a win. */
export function codeAverageAttempts(all: readonly Standing[]): number | null {
  const rows = standingsFor(all, "CODEBREAKER");
  const wins = rows.reduce((n, r) => n + r.wins, 0);
  if (wins === 0) return null;
  const attempts = rows.reduce((n, r) => n + (r.state.winAttempts ?? 0), 0);
  if (attempts === 0) return null;
  return Math.round((attempts / wins) * 10) / 10;
}

/** Win rate across every Codebreaker game played, as a percentage. */
export function codeWinRate(all: readonly Standing[]): number | null {
  const rows = standingsFor(all, "CODEBREAKER");
  const plays = rows.reduce((n, r) => n + r.plays, 0);
  if (plays === 0) return null;
  const wins = rows.reduce((n, r) => n + r.wins, 0);
  return Math.round((wins / plays) * 100);
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export type ArcadeAchievement = {
  key: string;
  name: string;
  blurb: string;
  game: GameKey | "ANY";
  /** How far along, 0-1. 1 means earned. */
  progress: number;
  earned: boolean;
  /** "3 / 5" style, for the ones worth counting. */
  detail: string;
};

/**
 * Derives the achievement list from the standings.
 *
 * Nothing is stored: an achievement is a *reading* of the saved numbers, so
 * there is no unlock event to miss, no row to backfill, and no way for the
 * badge wall to disagree with the statistics beside it.
 */
export function arcadeAchievements(all: readonly Standing[], escapeTotal: number): ArcadeAchievement[] {
  const peak = mergePeak(all);
  const solved = escapeSolved(all).length;
  const streak = codeBestStreak(all);
  const plays = totalPlays(all);
  const expertWin = standingsFor(all, "CODEBREAKER").some(
    (s) => s.variant.includes("expert") && s.wins > 0,
  );
  const codeWins = standingsFor(all, "CODEBREAKER").reduce((n, r) => n + r.wins, 0);

  const step = (have: number, need: number) => Math.max(0, Math.min(1, have / need));

  return [
    // Highly composite targets rather than powers of two: 120 is 2³·3·5 and
    // 720 is 6!, and a game about factors should aim at numbers with plenty
    // of them. Both are calibrated against measured play — see MILESTONES.
    {
      key: "merge-120",
      name: "Highly Composite",
      blurb: "Build a 120 tile in Factor Forge.",
      game: "MERGE",
      progress: step(peak, 120),
      earned: peak >= 120,
      detail: `${peak} / 120`,
    },
    {
      key: "merge-720",
      name: "Seven Twenty",
      blurb: "Build a 720 tile — six factorial.",
      game: "MERGE",
      progress: step(peak, 720),
      earned: peak >= 720,
      detail: `${peak} / 720`,
    },
    {
      key: "escape-room-one",
      name: "Out of the Temple",
      blurb: "Clear the first room of Equation Escape.",
      game: "ESCAPE",
      progress: step(solved, 3),
      earned: solved >= 3,
      detail: `${Math.min(solved, 3)} / 3`,
    },
    {
      key: "escape-all",
      name: "Nothing Holds You",
      blurb: "Solve every puzzle in Equation Escape.",
      game: "ESCAPE",
      progress: step(solved, escapeTotal),
      earned: solved >= escapeTotal,
      detail: `${solved} / ${escapeTotal}`,
    },
    {
      key: "code-first",
      name: "First Crack",
      blurb: "Break your first code.",
      game: "CODEBREAKER",
      progress: step(codeWins, 1),
      earned: codeWins >= 1,
      detail: codeWins >= 1 ? "Done" : "0 / 1",
    },
    {
      key: "code-streak",
      name: "On a Roll",
      blurb: "Break five codes in a row.",
      game: "CODEBREAKER",
      progress: step(streak, 5),
      earned: streak >= 5,
      detail: `${Math.min(streak, 5)} / 5`,
    },
    {
      key: "code-expert",
      name: "Six Digits",
      blurb: "Break an Expert code.",
      game: "CODEBREAKER",
      progress: expertWin ? 1 : 0,
      earned: expertWin,
      detail: expertWin ? "Done" : "Not yet",
    },
    {
      key: "arcade-regular",
      name: "Regular",
      blurb: "Play twenty-five games across the arcade.",
      game: "ANY",
      progress: step(plays, 25),
      earned: plays >= 25,
      detail: `${Math.min(plays, 25)} / 25`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Daily challenge
// ---------------------------------------------------------------------------

/**
 * Which game is today's challenge.
 *
 * Rotates on the date so it is the same for everybody and needs nothing
 * stored. A small XP multiplier is the entire incentive — enough to steer a
 * player towards a game they would not have picked, not enough that missing a
 * day matters.
 */
export const DAILY_XP_MULTIPLIER = 1.5;

export function dailyGame(dayKey: string): GameKey {
  let h = 0;
  for (let i = 0; i < dayKey.length; i++) h = (h * 31 + dayKey.charCodeAt(i)) >>> 0;
  return GAME_KEYS[h % GAME_KEYS.length];
}

export function applyDailyBonus(xp: number, isDaily: boolean): number {
  return isDaily ? Math.round(xp * DAILY_XP_MULTIPLIER) : xp;
}
