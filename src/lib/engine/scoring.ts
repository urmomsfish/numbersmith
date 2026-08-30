import type { Problem } from "@/generated/prisma";

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^\$|\$$/g, "")
    .replace(/,/g, "");
}

/** Checks a submitted answer against a problem's canonical answer.
 * MULTIPLE_CHOICE answers are stored/compared as the option letter (A, B, C...).
 * SHORT_ANSWER / INTEGER answers are compared as normalized text. */
export function checkAnswer(problem: Pick<Problem, "format" | "answer">, given: string): boolean {
  if (!given) return false;
  if (problem.format === "MULTIPLE_CHOICE") {
    return given.trim().toUpperCase() === problem.answer.trim().toUpperCase();
  }
  return normalize(given) === normalize(problem.answer);
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
