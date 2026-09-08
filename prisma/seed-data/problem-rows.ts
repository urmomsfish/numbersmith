import type { ProblemSeed } from "./problems";

/**
 * Shared mapping from a `ProblemSeed` to a database row.
 *
 * Extracted so that `prisma/seed.ts` and `scripts/sync-problem-bank.ts` cannot
 * drift apart. They previously would have held two copies of the grade-band
 * and time-estimate tables, and a change to one would have silently produced
 * problems with different metadata depending on which path inserted them.
 */

export function gradesForDifficulty(difficulty: number): [number, number] {
  if (difficulty <= 2) return [2, 6];
  if (difficulty <= 4) return [5, 9];
  if (difficulty <= 6) return [7, 11];
  if (difficulty <= 8) return [9, 12];
  return [10, 12];
}

export function secondsForDifficulty(difficulty: number): number {
  if (difficulty <= 2) return 60;
  if (difficulty <= 4) return 90;
  if (difficulty <= 6) return 150;
  if (difficulty <= 8) return 240;
  return 360;
}

export type ProblemRow = {
  slug: string;
  question: string;
  format: ProblemSeed["format"];
  choices: string | null;
  answer: string;
  solution: string;
  hints: string;
  difficulty: number;
  topicId: string;
  competitionId: string | null;
  gradeMin: number;
  gradeMax: number;
  estimatedTimeSeconds: number;
  tags: string;
  isPlacement: boolean;
};

export function toProblemRow(
  p: ProblemSeed,
  opts: {
    topicId: string;
    competitionId: string | null;
    /** Placement problems are held out of the practice pool so a student's
     * rating is never set by questions they have already drilled. */
    isPlacement: boolean;
  }
): ProblemRow {
  const [gradeMin, gradeMax] = gradesForDifficulty(p.difficulty);
  return {
    slug: p.slug,
    question: p.question,
    format: p.format,
    choices: p.choices ? JSON.stringify(p.choices) : null,
    answer: p.answer,
    solution: p.solution,
    hints: JSON.stringify(p.hints),
    difficulty: p.difficulty,
    topicId: opts.topicId,
    competitionId: opts.competitionId,
    gradeMin,
    gradeMax,
    estimatedTimeSeconds: secondsForDifficulty(p.difficulty),
    tags: JSON.stringify([p.topicSlug, ...(p.competitionSlug ? [p.competitionSlug] : [])]),
    isPlacement: opts.isPlacement,
  };
}
