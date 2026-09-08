import "server-only";
import { prisma } from "@/lib/prisma";
import { rankTopicsByPriority } from "@/lib/engine/practice";
import {
  PLAN_WEEKS,
  phaseForWeek,
} from "@/lib/engine/plan-schedule";

// Re-exported so callers have a single import site for "the study plan", while
// the pure rules stay importable without a request context.
export {
  PLAN_WEEKS,
  PLAN_PHASES,
  phaseForWeek,
  planTotalWeeks,
  currentPlanWeek,
  isPlanComplete,
  todaysPlanDay,
  weekDays,
} from "@/lib/engine/plan-schedule";
export type { PlanPhase } from "@/lib/engine/plan-schedule";

/** Generates (or regenerates) a phased multi-week study plan from the student's
 * current mastery, weak topics, primary competition, and available practice
 * time. Called after onboarding completes and again whenever performance
 * materially changes (new placement, big rating swing). */
export async function generateStudyPlan(userId: string) {
  const [profile, primaryUserCompetition, overallRating] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userCompetition.findFirst({
      where: { userId, isPrimary: true },
      include: { competition: true },
    }),
    prisma.rating.findUnique({ where: { userId_category: { userId, category: "OVERALL" } } }),
  ]);

  const minutesPerDay = profile?.dailyPracticeMinutes ?? 30;
  const baseProblemCount = Math.max(3, Math.round(minutesPerDay / 6));
  const currentRating = overallRating?.value ?? 1000;

  // Ranked by competition-weighted need, not raw mastery — so an AMC 8 student's
  // week is built from AMC 8 topics rather than whatever they happen to be worst at.
  const ranked = await rankTopicsByPriority(userId);
  const topics = ranked.map((r) => r.topic);
  const competitionName = primaryUserCompetition?.competition.shortName ?? "Competition";

  await prisma.studyPlan.updateMany({ where: { userId, active: true }, data: { active: false } });

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      primaryCompetitionId: primaryUserCompetition?.competitionId,
      currentRating,
      // A twelve-week target, so the goal is proportional to the runway rather
      // than to a single week.
      targetRating: currentRating + 300,
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
  /** Rotates through the ranked topics so later weeks widen coverage instead of
   * drilling the same four topics for three months. Falls back gracefully when
   * a student has fewer ranked topics than the rotation asks for. */
  const topicAt = (offset: number) =>
    topics.length > 0 ? topics[offset % topics.length] : undefined;

  for (let week = 1; week <= PLAN_WEEKS; week++) {
    const phase = phaseForWeek(week);
    // Volume ramps ~40% across the twelve weeks.
    const problemCount = Math.round(baseProblemCount * (1 + 0.4 * ((week - 1) / (PLAN_WEEKS - 1))));
    const rotation = (week - 1) * 2;

    const a = topicAt(rotation);
    const b = topicAt(rotation + 1);
    const c = topicAt(rotation + 2);
    const d = topicAt(rotation + 3);

    if (phase.name === "Foundations") {
      days.push(
        { weekNumber: week, dayOfWeek: 1, taskType: "LESSON", topicId: a?.id, problemCount, label: `${a?.name ?? "Algebra"} lesson + ${problemCount} problems` },
        { weekNumber: week, dayOfWeek: 2, taskType: "PRACTICE", topicId: a?.id, problemCount, label: `${a?.name ?? "Algebra"} practice` },
        { weekNumber: week, dayOfWeek: 3, taskType: "LESSON", topicId: b?.id, problemCount, label: `${b?.name ?? "Geometry"} lesson + ${problemCount} problems` },
        { weekNumber: week, dayOfWeek: 4, taskType: "PRACTICE", topicId: b?.id, problemCount, label: `${b?.name ?? "Geometry"} practice` },
        { weekNumber: week, dayOfWeek: 5, taskType: "PRACTICE", topicId: c?.id, problemCount, label: `${c?.name ?? "Number Theory"} practice` },
        { weekNumber: week, dayOfWeek: 6, taskType: "TIMED_SET", problemCount, label: "Mixed timed set" },
        { weekNumber: week, dayOfWeek: 0, taskType: "REVIEW", problemCount, label: "Mistake review" }
      );
    } else if (phase.name === "Build") {
      days.push(
        { weekNumber: week, dayOfWeek: 1, taskType: "PRACTICE", topicId: a?.id, problemCount, label: `${a?.name ?? "Algebra"} practice` },
        { weekNumber: week, dayOfWeek: 2, taskType: "PRACTICE", topicId: b?.id, problemCount, label: `${b?.name ?? "Geometry"} practice` },
        { weekNumber: week, dayOfWeek: 3, taskType: "LESSON", topicId: c?.id, problemCount, label: `${c?.name ?? "Combinatorics"} lesson + ${problemCount} problems` },
        { weekNumber: week, dayOfWeek: 4, taskType: "TIMED_SET", problemCount, label: "Mixed timed set" },
        { weekNumber: week, dayOfWeek: 5, taskType: "PRACTICE", topicId: d?.id, problemCount, label: `${d?.name ?? "Probability"} practice` },
        { weekNumber: week, dayOfWeek: 6, taskType: "SIMULATION", problemCount, label: `${competitionName} simulation` },
        { weekNumber: week, dayOfWeek: 0, taskType: "REVIEW", problemCount, label: "Mistake review" }
      );
    } else {
      days.push(
        { weekNumber: week, dayOfWeek: 1, taskType: "TIMED_SET", problemCount, label: "Timed set at contest pace" },
        { weekNumber: week, dayOfWeek: 2, taskType: "PRACTICE", topicId: a?.id, problemCount, label: `${a?.name ?? "Algebra"} — weak spot drill` },
        { weekNumber: week, dayOfWeek: 3, taskType: "REVIEW", problemCount, label: "Mistake review" },
        { weekNumber: week, dayOfWeek: 4, taskType: "PRACTICE", topicId: b?.id, problemCount, label: `${b?.name ?? "Geometry"} — weak spot drill` },
        { weekNumber: week, dayOfWeek: 5, taskType: "TIMED_SET", problemCount, label: "Timed set at contest pace" },
        { weekNumber: week, dayOfWeek: 6, taskType: "SIMULATION", problemCount, label: `Full ${competitionName} simulation` },
        { weekNumber: week, dayOfWeek: 0, taskType: "REVIEW", problemCount, label: "Mistake review" }
      );
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
