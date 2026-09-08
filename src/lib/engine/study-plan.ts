import "server-only";
import { prisma } from "@/lib/prisma";
import { rankTopicsByPriority, rankTopicsForCompetition } from "@/lib/engine/practice";
import {
  PLAN_WEEKS,
  buildScheduleWeeks,
  upcomingCompetitions,
  type ScheduledCompetition,
  type ScheduledWeek,
} from "@/lib/engine/plan-schedule";

// Re-exported so callers have a single import site for "the study plan", while
// the pure rules stay importable without a request context.
export {
  PLAN_WEEKS,
  PLAN_PHASES,
  phaseForWeek,
  phaseForPlanWeek,
  planTotalWeeks,
  currentPlanWeek,
  isPlanComplete,
  todaysPlanDay,
  weekDays,
  buildScheduleWeeks,
  upcomingCompetitions,
  weeksBetween,
  phaseForTimeRemaining,
  difficultyBandFor,
} from "@/lib/engine/plan-schedule";
export type { PlanPhase, ScheduledCompetition, ScheduledWeek } from "@/lib/engine/plan-schedule";

/** Generates (or regenerates) the training plan from the student's competition
 * schedule.
 *
 * The plan is built backwards from real contest dates. Each week is aimed at the
 * next competition the student has not yet sat, its phase comes from how long is
 * left rather than from a fixed week number, and its topics are ranked by what
 * *that* contest emphasises. Timed sets and simulations quote the contest's own
 * question count and time limit. With no dated competition it falls back to the
 * generic PLAN_WEEKS progression.
 *
 * Called after onboarding, whenever the schedule is edited, and whenever
 * performance materially changes (new placement, big rating swing).
 */
export async function generateStudyPlan(userId: string) {
  const [profile, userCompetitions, overallRating] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userCompetition.findMany({
      where: { userId },
      include: { competition: true },
      orderBy: [{ isPrimary: "desc" }, { addedAt: "asc" }],
    }),
    prisma.rating.findUnique({ where: { userId_category: { userId, category: "OVERALL" } } }),
  ]);

  const minutesPerDay = profile?.dailyPracticeMinutes ?? 30;
  const baseProblemCount = Math.max(3, Math.round(minutesPerDay / 6));
  const currentRating = overallRating?.value ?? 1000;

  const schedule: ScheduledCompetition[] = userCompetitions.map((uc) => ({
    competitionId: uc.competitionId,
    shortName: uc.competition.shortName,
    targetDate: uc.targetDate,
    isPrimary: uc.isPrimary,
    difficultyMin: uc.competition.difficultyMin,
    difficultyMax: uc.competition.difficultyMax,
    format: uc.competition.format,
    numQuestions: uc.competition.numQuestions,
    timeLimitMinutes: uc.competition.timeLimitMinutes,
  }));

  const weeks = buildScheduleWeeks(schedule);
  const upcoming = upcomingCompetitions(schedule);
  const primary =
    userCompetitions.find((uc) => uc.isPrimary) ??
    userCompetitions.find((uc) => uc.competitionId === upcoming[0]?.competitionId);

  // Topic rankings are per competition and reused across that contest's weeks —
  // one query per distinct target rather than one per week.
  const rankingCache = new Map<string, { id: string; name: string }[]>();
  async function topicsFor(competitionId: string | null) {
    const key = competitionId ?? "__general__";
    const cached = rankingCache.get(key);
    if (cached) return cached;
    const ranked = competitionId
      ? await rankTopicsForCompetition(userId, competitionId)
      : await rankTopicsByPriority(userId);
    const topics = ranked.map((r) => ({ id: r.topic.id, name: r.topic.name }));
    rankingCache.set(key, topics);
    return topics;
  }

  await prisma.studyPlan.updateMany({ where: { userId, active: true }, data: { active: false } });

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      primaryCompetitionId: primary?.competitionId,
      competitionDate: upcoming[0]?.targetDate ?? null,
      currentRating,
      // Scaled to the length of the runway rather than to a fixed week count.
      targetRating: currentRating + Math.round(25 * Math.min(weeks.length, 24)),
      minutesPerDay,
      active: true,
    },
  });

  type PlanDay = {
    weekNumber: number;
    dayOfWeek: number;
    taskType: string;
    topicId?: string;
    problemCount: number;
    label: string;
  };
  const days: PlanDay[] = [];

  for (const week of weeks) {
    const topics = await topicsFor(week.target?.competitionId ?? null);
    /** Rotates through the ranked topics so later weeks widen coverage instead
     * of drilling the same few for months. */
    const topicAt = (offset: number) =>
      topics.length > 0 ? topics[offset % topics.length] : undefined;
    const rotation = (week.weekNumber - 1) * 2;
    const a = topicAt(rotation);
    const b = topicAt(rotation + 1);
    const c = topicAt(rotation + 2);
    const d = topicAt(rotation + 3);

    const name = week.target?.shortName ?? "Competition";
    // A timed set that mirrors the real paper, when we know its shape.
    const paper =
      week.target?.numQuestions && week.target?.timeLimitMinutes
        ? `${week.target.numQuestions} questions in ${week.target.timeLimitMinutes} min`
        : "Mixed timed set";

    const push = (
      dayOfWeek: number,
      taskType: string,
      label: string,
      topicId?: string,
      count = problemCountFor(week, baseProblemCount)
    ) => days.push({ weekNumber: week.weekNumber, dayOfWeek, taskType, topicId, problemCount: count, label });

    if (week.isTaper) {
      // Contest week: consolidate, do not cram. Light volume, review-heavy.
      const light = Math.max(3, Math.round(baseProblemCount * 0.6));
      push(1, "REVIEW", `${name} — review your mistake log`, undefined, light);
      push(2, "PRACTICE", `${a?.name ?? "Mixed"} — light confidence set`, a?.id, light);
      push(3, "TIMED_SET", `${name} pace check (${paper})`, undefined, light);
      push(4, "REVIEW", "Final mistake review", undefined, light);
      push(5, "PRACTICE", "Light mixed set — stay warm", undefined, light);
      push(6, "SIMULATION", `${name} — good luck`, undefined, light);
      push(0, "REVIEW", "Rest and review", undefined, light);
    } else if (week.phase.name === "Foundations") {
      push(1, "LESSON", `${a?.name ?? "Algebra"} lesson + practice`, a?.id);
      push(2, "PRACTICE", `${a?.name ?? "Algebra"} practice`, a?.id);
      push(3, "LESSON", `${b?.name ?? "Geometry"} lesson + practice`, b?.id);
      push(4, "PRACTICE", `${b?.name ?? "Geometry"} practice`, b?.id);
      push(5, "PRACTICE", `${c?.name ?? "Number Theory"} practice`, c?.id);
      push(6, "TIMED_SET", `Mixed timed set`);
      push(0, "REVIEW", "Mistake review");
    } else if (week.phase.name === "Build") {
      push(1, "PRACTICE", `${a?.name ?? "Algebra"} practice`, a?.id);
      push(2, "PRACTICE", `${b?.name ?? "Geometry"} practice`, b?.id);
      push(3, "LESSON", `${c?.name ?? "Combinatorics"} lesson + practice`, c?.id);
      push(4, "TIMED_SET", `${name} timed set (${paper})`);
      push(5, "PRACTICE", `${d?.name ?? "Probability"} practice`, d?.id);
      push(6, "SIMULATION", `${name} simulation`);
      push(0, "REVIEW", "Mistake review");
    } else {
      push(1, "TIMED_SET", `${name} pace work (${paper})`);
      push(2, "PRACTICE", `${a?.name ?? "Algebra"} — weak spot drill`, a?.id);
      push(3, "REVIEW", "Mistake review");
      push(4, "PRACTICE", `${b?.name ?? "Geometry"} — weak spot drill`, b?.id);
      push(5, "TIMED_SET", `${name} pace work (${paper})`);
      push(6, "SIMULATION", `Full ${name} simulation`);
      push(0, "REVIEW", "Mistake review");
    }
  }

  await prisma.studyPlanDay.createMany({
    data: days.map((d) => ({
      studyPlanId: studyPlan.id,
      weekNumber: d.weekNumber,
      dayOfWeek: d.dayOfWeek,
      taskType: d.taskType,
      topicId: d.topicId,
      problemCount: d.problemCount,
      label: d.label,
    })),
  });

  return prisma.studyPlan.findUniqueOrThrow({
    where: { id: studyPlan.id },
    include: {
      days: { orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }], include: { topic: true } },
      primaryCompetition: true,
    },
  });
}

/** Volume ramps as the contest approaches, then drops in the taper week. */
function problemCountFor(week: ScheduledWeek, base: number): number {
  if (week.isTaper) return Math.max(3, Math.round(base * 0.6));
  if (week.weeksUntilTarget === null) {
    return Math.round(base * (1 + 0.4 * ((week.weekNumber - 1) / Math.max(1, PLAN_WEEKS - 1))));
  }
  const closeness = Math.max(0, Math.min(1, 1 - week.weeksUntilTarget / 12));
  return Math.round(base * (1 + 0.4 * closeness));
}

export async function getActiveStudyPlan(userId: string) {
  return prisma.studyPlan.findFirst({
    where: { userId, active: true },
    include: {
      days: { orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }], include: { topic: true, lesson: true } },
      primaryCompetition: true,
    },
    orderBy: { generatedAt: "desc" },
  });
}
