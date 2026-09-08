import type { Problem } from "@/generated/prisma";
import { answersMatch } from "./answer-format";

/** Checks a submitted answer against a problem's canonical answer.
 * MULTIPLE_CHOICE answers are stored/compared as the option letter (A, B, C...).
 *
 * SHORT_ANSWER / INTEGER answers go through `answersMatch`, which understands
 * the notations a student can reasonably type for the same value — "7 sqrt 11"
 * for "7√11", "36π/5" for "(36/5)π", "0.5" for "1/2". It stops short of
 * simplifying radicands, so a question asking for a simplified radical still
 * requires one. Anything it does not recognise as numeric falls back to the
 * same trimmed, case-insensitive text comparison used before. */
export function checkAnswer(problem: Pick<Problem, "format" | "answer">, given: string): boolean {
  if (!given) return false;
  if (problem.format === "MULTIPLE_CHOICE") {
    return given.trim().toUpperCase() === problem.answer.trim().toUpperCase();
  }
  return answersMatch(given, problem.answer);
}

export function parseChoices(choices: string | null): string[] {
  if (!choices) return [];
  try {
    return JSON.parse(choices) as string[];
  } catch {
    return [];
  }
}

export function parseHints(hints: string): string[] {
  try {
    return JSON.parse(hints) as string[];
  } catch {
    return [];
  }
}

export function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags) as string[];
  } catch {
    return [];
  }
}

export const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];
