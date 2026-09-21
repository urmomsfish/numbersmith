import "server-only";
import { prisma } from "@/lib/prisma";
import { checkAnswer } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { setRating, ratingDelta, clampRating } from "@/lib/engine/rating";
import { touchDailyActivity, awardXp, recordProblemOutcome } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { levelById, levelForGrade, hasLevels } from "@/lib/competition-levels";

/** Maps a competition to the rating category its simulations should move. */
export function ratingCategoryForCompetition(slug: string): string {
  if (slug.startsWith("amc") || slug === "aime") return "AMC";
  if (slug === "mathcounts") return "MATHCOUNTS";
  if (["usamo", "imo", "imo-shortlist", "egmo", "usamts"].includes(slug)) return "OLYMPIAD";
  return "OVERALL";
}

export type CustomConfig = {
  problemCount: number;
  difficultyMin: number;
  difficultyMax: number;
  topicSlugs: string[];
  timeLimitMinutes: number;
};

async function pickSimulationProblems(opts: {
  competitionId?: string;
  count: number;
  difficultyMin: number;
  difficultyMax: number;
  topicIds?: string[];
  /**
   * The answer format the real contest uses. Problems matching it are drawn
   * first so a simulation doesn't hand a student five-choice questions on a
   * fill-in test (or vice versa). Off-format problems still backstop the pool
   * rather than leaving the paper short.
   */
  format?: string;
  /**
   * The grade band this paper is written for. Every problem already carries
   * gradeMin/gradeMax and nothing here used to read them, so a kindergartener
   * and a twelfth grader sitting the same competition drew from one identical
   * pool — the reason a Math Kangaroo simulation was the same test at every
   * level.
   *
   * It biases selection rather than filtering on it. Difficulty stays the hard
   * constraint: a ninth grader sitting AMC 10 must still get real AMC 10
   * problems, not easier ones because of their grade. Where a band genuinely
   * is easier — Kangaroo Levels 1–2 — that comes through the level's own
   * difficulty window, which is passed in above.
   */
  gradeMin?: number;
  gradeMax?: number;
}) {
  const baseWhere = {
    isPublished: true,
    difficulty: { gte: opts.difficultyMin, lte: opts.difficultyMax },
    format: { in: ["MULTIPLE_CHOICE", "SHORT_ANSWER", "INTEGER"] },
    ...(opts.topicIds && opts.topicIds.length > 0
      ? { OR: [{ topicId: { in: opts.topicIds } }, { topic: { parentId: { in: opts.topicIds } } }] }
      : {}),
  };

  /** True when a problem's own grade range overlaps the band being built. */
  const inBand = (p: { gradeMin: number; gradeMax: number }) =>
    opts.gradeMin === undefined ||
    opts.gradeMax === undefined ||
    (p.gradeMax >= opts.gradeMin && p.gradeMin <= opts.gradeMax);

  // Prefer problems tagged to this competition, then widen to the whole pool
  // so a simulation always fills its full question count. Within each of those
  // two tiers, on-format comes before off-format — competition provenance is
  // the stronger signal of "this looks like the real test", so a thin contest
  // keeps its own off-format problems ahead of generic on-format ones.
  const preferred = opts.competitionId
    ? await prisma.problem.findMany({ where: { ...baseWhere, competitionId: opts.competitionId } })
    : [];
  const rest = await prisma.problem.findMany({
    where: { ...baseWhere, ...(preferred.length ? { id: { notIn: preferred.map((p) => p.id) } } : {}) },
  });

  const byFormat = (list: typeof preferred) => {
    if (!opts.format) return shuffle(list);
    const match = list.filter((p) => p.format === opts.format);
    const other = list.filter((p) => p.format !== opts.format);
    return [...shuffle(match), ...shuffle(other)];
  };

  // Grade outranks format: a paper of on-format problems written for the wrong
  // age reads as the wrong test, while an off-format problem at the right level
  // is still a question this student can sit. Within each grade tier the
  // existing competition-then-format ordering is unchanged.
  const byGrade = (list: typeof preferred) => {
    const band = list.filter(inBand);
    const outside = list.filter((p) => !inBand(p));
    return [...byFormat(band), ...byFormat(outside)];
  };

  const pool = [...byGrade(preferred), ...byGrade(rest)];

  if (pool.length < opts.count) {
    const fallback = await prisma.problem.findMany({
      where: { isPublished: true, id: { notIn: pool.map((p) => p.id) } },
    });
    pool.push(...shuffle(fallback));
  }

  return pool.slice(0, opts.count).sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Fisher-Yates. The obvious `sort(() => Math.random() - 0.5)` is *not* a
 * uniform shuffle: comparison sorts assume a consistent comparator, so with a
 * random one elements drift only a little from where they started. Since this
 * shuffle feeds a `.slice(0, count)`, that bias decides which problems ever
 * reach a paper — measured on a 141-problem pool drawing 25, the front of the
 * array was picked ~3x as often as the back. Problems are read in insertion
 * order, so the back of the array is whatever was authored most recently,
 * which is exactly the hard tail the difficulty ramp depends on.
 */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function startOfficialSimulation(
  userId: string,
  competitionSlug: string,
  levelId?: string | null
) {
  const competition = await prisma.competition.findUniqueOrThrow({ where: { slug: competitionSlug } });
  if (competition.format === "PROOF") {
    throw new Error("Proof-based competitions do not support timed simulations");
  }

  // A level, where the contest has them, overrides length, clock, and
  // difficulty — those are the three things that differ between a Kangaroo
  // Levels 1–2 paper and a Levels 11–12 one. An unrecognised id falls back to
  // the band matching the student's own grade rather than erroring, so a stale
  // link cannot strand anyone.
  let level = levelById(competitionSlug, levelId);
  if (!level && hasLevels(competitionSlug)) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { grade: true },
    });
    level = levelForGrade(competitionSlug, profile?.grade ?? competition.gradeMin);
  }

  const count = level?.numQuestions ?? competition.numQuestions ?? 20;
  const timeLimitMinutes = level?.timeLimitMinutes ?? competition.timeLimitMinutes ?? 60;
  const difficultyMin = level?.difficultyMin ?? competition.difficultyMin;
  const difficultyMax = level?.difficultyMax ?? competition.difficultyMax;

  // Without a level the band is the competition's own published grade range,
  // which is still far better than the previous behaviour of ignoring grade
  // altogether — an AMC 8 paper stops being able to draw on grade 11 material.
  const gradeMin = level?.gradeMin ?? competition.gradeMin;
  const gradeMax = level?.gradeMax ?? competition.gradeMax;

  const problems = await pickSimulationProblems({
    competitionId: competition.id,
    count,
    difficultyMin: Math.max(1, difficultyMin - 1),
    difficultyMax: Math.min(10, difficultyMax + 1),
    format: competition.format,
    gradeMin,
    gradeMax,
  });

  const attempt = await prisma.competitionAttempt.create({
    data: {
      userId,
      competitionId: competition.id,
      mode: "OFFICIAL",
      status: "IN_PROGRESS",
      timeLimitSeconds: timeLimitMinutes * 60,
      totalQuestions: problems.length,
      // Recorded on the existing config column so results can name which paper
      // was sat — "Levels 3–4" is not a detail you want to lose.
      config: level ? JSON.stringify({ levelId: level.id, levelLabel: level.label }) : null,
      items: {
        create: problems.map((p, i) => ({ problemId: p.id, order: i })),
      },
    },
  });

  return attempt;
}

export async function startCustomSimulation(userId: string, config: CustomConfig) {
  const topics = config.topicSlugs.length
    ? await prisma.topic.findMany({ where: { slug: { in: config.topicSlugs } } })
    : [];

  const problems = await pickSimulationProblems({
    count: config.problemCount,
    difficultyMin: config.difficultyMin,
    difficultyMax: config.difficultyMax,
    topicIds: topics.map((t) => t.id),
  });

  // Custom sets are still attached to a competition row for reporting; we use
  // the student's primary competition, falling back to AMC 8 as a neutral default.
  const primary = await prisma.userCompetition.findFirst({
    where: { userId, isPrimary: true },
  });
  const fallback = await prisma.competition.findUniqueOrThrow({ where: { slug: "amc8" } });
  const competitionId = primary?.competitionId ?? fallback.id;

  return prisma.competitionAttempt.create({
    data: {
      userId,
      competitionId,
      mode: "CUSTOM",
      status: "IN_PROGRESS",
      timeLimitSeconds: config.timeLimitMinutes * 60,
      totalQuestions: problems.length,
      config: JSON.stringify(config),
      items: { create: problems.map((p, i) => ({ problemId: p.id, order: i })) },
    },
  });
}

export async function submitSimulation(
  attemptId: string,
  answers: Record<string, string>,
  flagged: string[]
) {
  const attempt = await prisma.competitionAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { items: { include: { problem: true } }, competition: true },
  });

  if (attempt.status === "SUBMITTED") return attempt;

  const flaggedSet = new Set(flagged);
  let correctCount = 0;

  for (const item of attempt.items) {
    const given = answers[item.id] ?? "";
    const correct = given ? checkAnswer(item.problem, given) : false;
    if (correct) correctCount += 1;

    await prisma.competitionAttemptItem.update({
      where: { id: item.id },
      data: { answerGiven: given || null, correct, flagged: flaggedSet.has(item.id) },
    });

    await prisma.attempt.create({
      data: {
        userId: attempt.userId,
        problemId: item.problemId,
        mode: "SIMULATION",
        answerGiven: given || null,
        correct,
        timeSeconds: Math.round(attempt.timeLimitSeconds / Math.max(1, attempt.totalQuestions)),
      },
    });

    await updateTopicAndDomainMastery(attempt.userId, item.problem.topicId, correct);
    await recordProblemOutcome(attempt.userId, correct);

    if (!correct) {
      await prisma.mistake.upsert({
        where: { userId_problemId: { userId: attempt.userId, problemId: item.problemId } },
        update: {
          reason: given ? "INCORRECT" : "SKIPPED",
          resolved: false,
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: attempt.userId,
          problemId: item.problemId,
          reason: given ? "INCORRECT" : "SKIPPED",
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  const submitted = await prisma.competitionAttempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      correctCount,
      score: Math.round((correctCount / Math.max(1, attempt.totalQuestions)) * 100),
    },
  });

  // Simulations move both the overall rating and the competition-family rating.
  const avgDifficulty =
    attempt.items.reduce((sum, i) => sum + i.problem.difficulty, 0) / Math.max(1, attempt.items.length);
  const accuracy = correctCount / Math.max(1, attempt.totalQuestions);
  const category = ratingCategoryForCompetition(attempt.competition.slug);
  const reason = `${attempt.competition.shortName} Simulation`;

  for (const cat of new Set(["OVERALL", category])) {
    const existing = await prisma.rating.upsert({
      where: { userId_category: { userId: attempt.userId, category: cat } },
      update: {},
      create: { userId: attempt.userId, category: cat, value: 1000 },
    });
    // Scale a single-problem delta up by the number of questions, damped so a
    // full simulation moves the rating meaningfully but not wildly.
    const perProblem = ratingDelta(existing.value, Math.round(avgDifficulty), accuracy >= 0.5);
    const scaled = Math.round(perProblem * Math.min(6, attempt.totalQuestions / 4));
    await setRating(attempt.userId, cat, clampRating(existing.value + scaled), reason);
  }

  await touchDailyActivity(attempt.userId);
  await awardXp(attempt.userId, 40 + correctCount * 5);
  await checkAndUnlockAchievements(attempt.userId);

  return submitted;
}
