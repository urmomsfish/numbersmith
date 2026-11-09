import "server-only";
import { prisma } from "@/lib/prisma";
import { awardXp, touchDailyActivity } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { TOTAL_PUZZLES } from "@/lib/games/escape";
import {
  GAME_KEYS,
  applyDailyBonus,
  dailyGame,
  parseState,
  type GameKey,
  type Standing,
  type StandingState,
} from "@/lib/games/shared";

export * from "@/lib/games/shared";

/**
 * The arcade's server side: standings in, standings out.
 *
 * WHERE THE RULES LIVE, and why it is different here. The quest keeps its
 * rules on the server because it hands out problems from the bank and must
 * not leak the answer key. These three games have no bank and no key — the
 * secret code, the tile board and the room answers are all generated or
 * authored client-side, and a player who edits their own browser is only
 * cheating themselves out of practice.
 *
 * So the server's job is narrower: it is the scoreboard, not the referee. It
 * records what happened, keeps the best of it, and pays the XP. That is the
 * whole backend, which is what the brief asked for.
 *
 * What it does *not* do is trust a claimed score blindly. Scores are clamped
 * to what each game can actually produce (see `SCORE_CEILING`), so a bad or
 * tampered payload cannot write a number nobody can ever beat and quietly
 * ruin the player's own records.
 */

/** The most one sitting of each game can plausibly score. A guard against a
 * garbage payload poisoning a personal best, not an anti-cheat measure. */
const SCORE_CEILING: Record<GameKey, number> = {
  // A 2048 board tops out around 20,000 before it is unplayable; a very long
  // 8192 run can reach six figures. This is loose on purpose.
  MERGE: 2_000_000,
  ESCAPE: TOTAL_PUZZLES,
  // Six digits, full allowance spare: base 600 + 12 × 6 × 25 + bonus.
  CODEBREAKER: 5_000,
};

const XP_CEILING = 400;

function isGameKey(x: string): x is GameKey {
  return (GAME_KEYS as readonly string[]).includes(x);
}

function toStanding(row: {
  game: string;
  variant: string;
  bestScore: number;
  plays: number;
  wins: number;
  totalXp: number;
  state: string;
  lastPlayedAt: Date;
}): Standing | null {
  if (!isGameKey(row.game)) return null;
  return {
    game: row.game,
    variant: row.variant,
    bestScore: row.bestScore,
    plays: row.plays,
    wins: row.wins,
    totalXp: row.totalXp,
    state: parseState(row.state),
    lastPlayedAt: row.lastPlayedAt.toISOString(),
  };
}

/** Everything the player has ever done in the arcade. */
export async function loadStandings(userId: string): Promise<Standing[]> {
  const rows = await prisma.gameScore.findMany({
    where: { userId },
    orderBy: { lastPlayedAt: "desc" },
  });
  return rows.map(toStanding).filter((s): s is Standing => s !== null);
}

export async function loadStanding(
  userId: string,
  game: GameKey,
  variant: string,
): Promise<Standing | null> {
  const row = await prisma.gameScore.findUnique({
    where: { userId_game_variant: { userId, game, variant } },
  });
  return row ? toStanding(row) : null;
}

// ---------------------------------------------------------------------------
// Recording a result
// ---------------------------------------------------------------------------

export type GameResult = {
  game: GameKey;
  variant: string;
  score: number;
  won: boolean;
  xp: number;
  /** Merged into the stored blob. Only the keys the game owns. */
  state?: StandingState;
  /** Number of guesses, for Codebreaker's running average. */
  attempts?: number;
};

export type RecordedResult = {
  standing: Standing;
  /** XP actually paid, after the daily bonus. */
  xpAwarded: number;
  /** True when the score beat the player's previous best. */
  personalBest: boolean;
  /** True when this game was today's challenge. */
  wasDaily: boolean;
  leveledUp: boolean;
};

/**
 * A seed for a game that needs a fresh board every visit.
 *
 * Async, and that is the point. The games need a clock to vary their boards,
 * but `Date.now()` called synchronously inside a component body is an impure
 * render — React's lint rule flags it, correctly, because a re-render would
 * silently reseed the game. Awaiting it makes the seed a value the page
 * *fetched* before rendering, which is what it actually is.
 */
export async function freshSeed(): Promise<number> {
  return (Date.now() | 0) || 1;
}

/** The day key used for the daily challenge rotation. */
export function arcadeDayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Merges new state into old.
 *
 * Every field is a *best* or a *union*, never an overwrite, because a result
 * arrives from a browser that may be a tab the player left open before their
 * last three games. Taking the maximum means a stale tab can no longer
 * silently roll a record back.
 */
function mergeState(prev: StandingState, next: StandingState | undefined): StandingState {
  if (!next) return prev;
  const out: StandingState = { ...prev };
  if (next.peak !== undefined) out.peak = Math.max(prev.peak ?? 0, next.peak);
  if (next.bestCombo !== undefined) out.bestCombo = Math.max(prev.bestCombo ?? 0, next.bestCombo);
  if (next.bestStreak !== undefined) out.bestStreak = Math.max(prev.bestStreak ?? 0, next.bestStreak);
  // The current streak is the one thing that genuinely replaces: a loss sets
  // it back to zero and that must stick.
  if (next.streak !== undefined) out.streak = next.streak;
  if (next.solved) out.solved = [...new Set([...(prev.solved ?? []), ...next.solved])];
  if (next.cleared) out.cleared = [...new Set([...(prev.cleared ?? []), ...next.cleared])];
  if (next.bestTimes) {
    // A time is the one figure where *smaller* is the record.
    const merged = { ...(prev.bestTimes ?? {}) };
    for (const [room, secs] of Object.entries(next.bestTimes)) {
      const have = merged[room];
      if (secs > 0 && (have === undefined || secs < have)) merged[room] = secs;
    }
    out.bestTimes = merged;
  }
  if (next.winAttempts !== undefined) out.winAttempts = (prev.winAttempts ?? 0) + next.winAttempts;
  return out;
}

/**
 * Records a finished game and pays for it.
 *
 * Also touches the daily activity streak and runs the app-wide achievement
 * check, so a session in the arcade counts as showing up — the same as a
 * practice set does. That is the point of putting the games inside
 * NumberSmith rather than beside it.
 */
export async function recordResult(userId: string, result: GameResult): Promise<RecordedResult> {
  const ceiling = SCORE_CEILING[result.game];
  const score = Math.max(0, Math.min(ceiling, Math.round(result.score || 0)));
  const baseXp = Math.max(0, Math.min(XP_CEILING, Math.round(result.xp || 0)));

  const wasDaily = dailyGame(arcadeDayKey()) === result.game;
  const xpAwarded = Math.min(XP_CEILING, applyDailyBonus(baseXp, wasDaily));

  const existing = await prisma.gameScore.findUnique({
    where: { userId_game_variant: { userId, game: result.game, variant: result.variant } },
  });
  const prevState = existing ? parseState(existing.state) : {};
  const prevBest = existing?.bestScore ?? 0;
  const personalBest = score > prevBest;

  const nextState = mergeState(prevState, {
    ...result.state,
    ...(result.won && result.attempts !== undefined ? { winAttempts: result.attempts } : {}),
  });

  const row = await prisma.gameScore.upsert({
    where: { userId_game_variant: { userId, game: result.game, variant: result.variant } },
    create: {
      userId,
      game: result.game,
      variant: result.variant,
      bestScore: score,
      plays: 1,
      wins: result.won ? 1 : 0,
      totalXp: xpAwarded,
      state: JSON.stringify(nextState),
    },
    update: {
      bestScore: Math.max(prevBest, score),
      plays: { increment: 1 },
      wins: { increment: result.won ? 1 : 0 },
      totalXp: { increment: xpAwarded },
      state: JSON.stringify(nextState),
      lastPlayedAt: new Date(),
    },
  });

  let leveledUp = false;
  if (xpAwarded > 0) {
    const awarded = await awardXp(userId, xpAwarded);
    leveledUp = awarded.leveledUp;
  }
  await touchDailyActivity(userId);
  await checkAndUnlockAchievements(userId);

  const standing = toStanding(row);
  return {
    standing: standing ?? {
      game: result.game,
      variant: result.variant,
      bestScore: score,
      plays: 1,
      wins: result.won ? 1 : 0,
      totalXp: xpAwarded,
      state: nextState,
      lastPlayedAt: new Date().toISOString(),
    },
    xpAwarded,
    personalBest,
    wasDaily,
    leveledUp,
  };
}

/**
 * Saves escape progress without counting a play.
 *
 * Equation Escape has no end-of-game moment to report — it is one long run
 * across five rooms, and a player who closes the tab after two puzzles must
 * come back to those two puzzles solved. So each solve saves immediately,
 * and `plays` is left alone: it is incremented once, on the first solve, so
 * that "games played" means "runs started" rather than "puzzles answered".
 */
export async function recordEscapeSolve(
  userId: string,
  input: {
    puzzleId: string;
    xp: number;
    clearedRoom: string | null;
    /** Seconds taken to clear the room, when this solve cleared one. */
    roomSeconds?: number;
  },
): Promise<RecordedResult> {
  const xpBase = Math.max(0, Math.min(XP_CEILING, Math.round(input.xp || 0)));
  const wasDaily = dailyGame(arcadeDayKey()) === "ESCAPE";
  const xpAwarded = Math.min(XP_CEILING, applyDailyBonus(xpBase, wasDaily));

  const existing = await prisma.gameScore.findUnique({
    where: { userId_game_variant: { userId, game: "ESCAPE", variant: "run" } },
  });
  const prevState = existing ? parseState(existing.state) : {};
  const alreadySolved = (prevState.solved ?? []).includes(input.puzzleId);

  const nextState = mergeState(prevState, {
    solved: [input.puzzleId],
    ...(input.clearedRoom ? { cleared: [input.clearedRoom] } : {}),
    ...(input.clearedRoom && input.roomSeconds && input.roomSeconds > 0
      ? { bestTimes: { [input.clearedRoom]: Math.round(input.roomSeconds) } }
      : {}),
  });
  const solvedCount = (nextState.solved ?? []).length;
  const escaped = solvedCount >= TOTAL_PUZZLES;

  const row = await prisma.gameScore.upsert({
    where: { userId_game_variant: { userId, game: "ESCAPE", variant: "run" } },
    create: {
      userId,
      game: "ESCAPE",
      variant: "run",
      bestScore: solvedCount,
      plays: 1,
      wins: escaped ? 1 : 0,
      totalXp: xpAwarded,
      state: JSON.stringify(nextState),
    },
    update: {
      bestScore: Math.max(existing?.bestScore ?? 0, solvedCount),
      // Re-solving a puzzle the player already had pays nothing and counts
      // nothing — otherwise a refresh would farm XP.
      wins: escaped && (existing?.wins ?? 0) === 0 ? 1 : undefined,
      totalXp: { increment: alreadySolved ? 0 : xpAwarded },
      state: JSON.stringify(nextState),
      lastPlayedAt: new Date(),
    },
  });

  let leveledUp = false;
  if (!alreadySolved && xpAwarded > 0) {
    const awarded = await awardXp(userId, xpAwarded);
    leveledUp = awarded.leveledUp;
  }
  if (!alreadySolved) {
    await touchDailyActivity(userId);
    await checkAndUnlockAchievements(userId);
  }

  const standing = toStanding(row);
  return {
    standing: standing ?? {
      game: "ESCAPE",
      variant: "run",
      bestScore: solvedCount,
      plays: 1,
      wins: escaped ? 1 : 0,
      totalXp: xpAwarded,
      state: nextState,
      lastPlayedAt: new Date().toISOString(),
    },
    xpAwarded: alreadySolved ? 0 : xpAwarded,
    personalBest: !alreadySolved,
    wasDaily,
    leveledUp,
  };
}

/** Wipes one game's escape progress so a player can run it again. */
export async function resetEscape(userId: string): Promise<void> {
  const existing = await prisma.gameScore.findUnique({
    where: { userId_game_variant: { userId, game: "ESCAPE", variant: "run" } },
  });
  if (!existing) return;
  const state = parseState(existing.state);
  await prisma.gameScore.update({
    where: { id: existing.id },
    data: {
      // The solved set is cleared, but the totals are not: XP already earned
      // is earned, and "best" stays the furthest the player has ever got.
      state: JSON.stringify({ ...state, solved: [], cleared: [] }),
      plays: { increment: 1 },
    },
  });
}
