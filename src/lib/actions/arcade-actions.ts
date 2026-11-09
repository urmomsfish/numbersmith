"use server";

import { requireUser } from "@/lib/auth";
import {
  loadStandings,
  recordEscapeSolve,
  recordResult,
  resetEscape,
  type GameResult,
  type RecordedResult,
  type Standing,
} from "@/lib/engine/arcade";
import { GAME_KEYS, type GameKey } from "@/lib/games/shared";
import { ROOMS, isRoomClear, xpForPuzzle, xpForRoom } from "@/lib/games/escape";

/**
 * The arcade's server actions.
 *
 * There is no run id to own-check here, because there is no server-side run:
 * every action writes only to the signed-in user's own GameScore row, keyed
 * by their session. A player cannot name someone else's record to overwrite.
 *
 * Results come back as values rather than thrown errors, for the usual
 * reason — Next replaces a thrown Server Action message with an opaque digest
 * in production, and "Couldn't save your score" needs to reach the player.
 *
 * Saving must never cost the player their game. Every one of these is called
 * from a `.catch()`-guarded path in the UI, and a failure surfaces as a quiet
 * note beside the score rather than a thrown dialog over the board.
 */

export type SaveOutcome =
  | { ok: true; result: RecordedResult }
  | { ok: false; error: string };

function asMessage(err: unknown, fallback: string): string {
  const digest = (err as { digest?: unknown } | null)?.digest;
  if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
  console.error(`${fallback}:`, err);
  return fallback;
}

function isGameKey(x: string): x is GameKey {
  return (GAME_KEYS as readonly string[]).includes(x);
}

/** A variant label the player cannot use to write arbitrary keys. */
function cleanVariant(raw: string): string {
  const v = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return v || "default";
}

export async function loadStandingsAction(): Promise<Standing[]> {
  const user = await requireUser();
  return loadStandings(user.id);
}

/** Records a finished Number Merge or Codebreaker game. */
export async function saveGameAction(input: {
  game: string;
  variant: string;
  score: number;
  won: boolean;
  xp: number;
  peak?: number;
  bestCombo?: number;
  streak?: number;
  bestStreak?: number;
  attempts?: number;
}): Promise<SaveOutcome> {
  try {
    const user = await requireUser();
    if (!isGameKey(input.game)) return { ok: false, error: "Unknown game." };
    // Escape has its own action, because a solve is not a finished game.
    if (input.game === "ESCAPE") return { ok: false, error: "Wrong action for that game." };

    const result: GameResult = {
      game: input.game,
      variant: cleanVariant(input.variant),
      score: Number(input.score) || 0,
      won: !!input.won,
      xp: Number(input.xp) || 0,
      attempts: input.attempts,
      state: {
        ...(input.peak !== undefined ? { peak: Number(input.peak) || 0 } : {}),
        ...(input.bestCombo !== undefined ? { bestCombo: Number(input.bestCombo) || 0 } : {}),
        ...(input.streak !== undefined ? { streak: Number(input.streak) || 0 } : {}),
        ...(input.bestStreak !== undefined ? { bestStreak: Number(input.bestStreak) || 0 } : {}),
      },
    };
    return { ok: true, result: await recordResult(user.id, result) };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't save your score.") };
  }
}

/**
 * Records one solved escape puzzle.
 *
 * The puzzle id is validated against the authored room list rather than
 * trusted, so the stored progress set can only ever contain real puzzles —
 * otherwise a stray id would inflate the solved count and could make the
 * "escaped" condition trigger without the player solving anything.
 */
/**
 * @unowned-id puzzleId names a puzzle in the authored content of
 * src/lib/games/escape.ts, not a database row, so there is no owner to
 * compare against. It is validated against ROOMS below and rejected if it is
 * not a real puzzle, and every write this action makes is scoped to the
 * session user via recordEscapeSolve(user.id, …) — a caller cannot name
 * somebody else's progress, only their own.
 */
export async function saveEscapeSolveAction(input: {
  puzzleId: string;
  /** Seconds elapsed in the room, for the best-time record. */
  roomSeconds?: number;
}): Promise<SaveOutcome> {
  try {
    const user = await requireUser();

    const room = ROOMS.find((r) => r.puzzles.some((p) => p.id === input.puzzleId));
    const puzzle = room?.puzzles.find((p) => p.id === input.puzzleId);
    if (!room || !puzzle) return { ok: false, error: "Unknown puzzle." };

    // Work out whether this solve is the one that clears the room, so the
    // room bonus is paid exactly once.
    const standings = await loadStandings(user.id);
    const already = new Set(
      standings
        .filter((s) => s.game === "ESCAPE")
        .flatMap((s) => s.state.solved ?? []),
    );
    const wasAlreadyClear = isRoomClear(room, [...already]);
    already.add(input.puzzleId);
    const clears = isRoomClear(room, [...already]);

    // The XP is derived from the authored puzzle, never taken from the client,
    // and the room bonus is paid only by the solve that actually clears it.
    const xp = xpForPuzzle(puzzle) + (clears && !wasAlreadyClear ? xpForRoom(room) : 0);

    return {
      ok: true,
      result: await recordEscapeSolve(user.id, {
        puzzleId: input.puzzleId,
        xp,
        clearedRoom: clears ? room.key : null,
        // Clamped to the room's own limit: a clear cannot honestly have taken
        // longer than the clock allowed, so anything bigger is a bad payload.
        roomSeconds:
          input.roomSeconds && input.roomSeconds > 0
            ? Math.min(input.roomSeconds, room.timeLimit)
            : undefined,
      }),
    };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't save your progress.") };
  }
}

export async function resetEscapeAction(): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await requireUser();
    await resetEscape(user.id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: asMessage(err, "Couldn't reset the run.") };
  }
}
