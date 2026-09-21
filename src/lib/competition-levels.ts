/** Grade-banded versions of a competition.
 *
 * Several contests are not one test — they are a family of tests sharing a
 * name, where the grade band decides both how hard the paper is and how long
 * it runs. Math Kangaroo is the clearest case: a Level 1–2 paper and a Level
 * 11–12 paper have nothing in common except the branding. Simulating them from
 * a single question count, time limit, and difficulty window produces a paper
 * that is wrong for everyone.
 *
 * This lives in code rather than a `CompetitionLevel` table on purpose. The
 * bands are fixed facts about each contest, they change about as often as the
 * competition list itself, and putting them here avoids another migration
 * against the production database for data that is never edited at runtime.
 * The chosen level is recorded on the attempt's existing `config` JSON.
 *
 * `difficultyMin/Max` are this band's own window, not the parent competition's
 * — that is the whole point. `gradeMin/Max` select problems written for the
 * band; see pickSimulationProblems for how strictly that is applied.
 */
export type CompetitionLevel = {
  /** Stable id, stored on the attempt. Never reuse one for a different band. */
  id: string;
  label: string;
  gradeMin: number;
  gradeMax: number;
  numQuestions: number;
  timeLimitMinutes: number;
  difficultyMin: number;
  difficultyMax: number;
};

/** Math Kangaroo's official levels. Every level runs 75 minutes; grades 1–4
 * answer 24 questions and grades 5 and up answer 30. The difficulty windows
 * ramp across the bands, which is what makes a Level 1–2 paper genuinely
 * easier rather than merely shorter. */
const MATH_KANGAROO_LEVELS: CompetitionLevel[] = [
  { id: "1-2", label: "Levels 1–2", gradeMin: 1, gradeMax: 2, numQuestions: 24, timeLimitMinutes: 75, difficultyMin: 1, difficultyMax: 2 },
  { id: "3-4", label: "Levels 3–4", gradeMin: 3, gradeMax: 4, numQuestions: 24, timeLimitMinutes: 75, difficultyMin: 1, difficultyMax: 3 },
  { id: "5-6", label: "Levels 5–6", gradeMin: 5, gradeMax: 6, numQuestions: 30, timeLimitMinutes: 75, difficultyMin: 2, difficultyMax: 4 },
  { id: "7-8", label: "Levels 7–8", gradeMin: 7, gradeMax: 8, numQuestions: 30, timeLimitMinutes: 75, difficultyMin: 3, difficultyMax: 5 },
  { id: "9-10", label: "Levels 9–10", gradeMin: 9, gradeMax: 10, numQuestions: 30, timeLimitMinutes: 75, difficultyMin: 4, difficultyMax: 6 },
  { id: "11-12", label: "Levels 11–12", gradeMin: 11, gradeMax: 12, numQuestions: 30, timeLimitMinutes: 75, difficultyMin: 5, difficultyMax: 7 },
];

/** Purple Comet runs two separate contests under one name, and they differ in
 * length as well as difficulty: 20 problems in 60 minutes for middle school,
 * 30 in 90 for high school. */
const PURPLE_COMET_LEVELS: CompetitionLevel[] = [
  { id: "middle", label: "Middle school", gradeMin: 6, gradeMax: 8, numQuestions: 20, timeLimitMinutes: 60, difficultyMin: 3, difficultyMax: 6 },
  { id: "high", label: "High school", gradeMin: 9, gradeMax: 12, numQuestions: 30, timeLimitMinutes: 90, difficultyMin: 5, difficultyMax: 9 },
];

/** Only contests that really are several papers under one name belong here.
 * MOEMS Divisions E and M are already separate competition rows, and the AMCs
 * are separate contests rather than levels of one — neither needs an entry. */
export const COMPETITION_LEVELS: Record<string, CompetitionLevel[]> = {
  "math-kangaroo": MATH_KANGAROO_LEVELS,
  "purple-comet": PURPLE_COMET_LEVELS,
};

export function levelsFor(slug: string): CompetitionLevel[] {
  return COMPETITION_LEVELS[slug] ?? [];
}

export function hasLevels(slug: string): boolean {
  return levelsFor(slug).length > 0;
}

/** The level a student in `grade` would actually sit.
 *
 * Falls back to the nearest band rather than returning nothing: a grade is
 * always a number, and a student outside the published range (a kindergartener
 * looking at Kangaroo, say) is better served the closest real paper than an
 * empty page. Returns null only when the competition has no levels at all. */
export function levelForGrade(slug: string, grade: number): CompetitionLevel | null {
  const levels = levelsFor(slug);
  if (levels.length === 0) return null;
  const exact = levels.find((l) => grade >= l.gradeMin && grade <= l.gradeMax);
  if (exact) return exact;
  return levels.reduce((best, l) => {
    const d = grade < l.gradeMin ? l.gradeMin - grade : grade - l.gradeMax;
    const bestD = grade < best.gradeMin ? best.gradeMin - grade : grade - best.gradeMax;
    return d < bestD ? l : best;
  }, levels[0]);
}

export function levelById(slug: string, id: string | null | undefined): CompetitionLevel | null {
  if (!id) return null;
  return levelsFor(slug).find((l) => l.id === id) ?? null;
}
