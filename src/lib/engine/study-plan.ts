import "server-only";
import { prisma } from "@/lib/prisma";
import { rankTopicsByPriority } from "@/lib/engine/practice";
import { streakWeekday } from "@/lib/streak";

/** Generates (or regenerates) a one-week recurring study plan template from
 * the student's current mastery, weak topics, primary competition, and
 * available practice time. Called after onboarding completes and again
 * whenever performance materially changes (new placement, big rating swing). */
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
  const problemCount = Math.max(3, Math.round(minutesPerDay / 6));
  const currentRating = overallRating?.value ?? 1000;

  // Ranked by competition-weighted need, not raw mastery — so an AMC 8 student's
  // week is built from AMC 8 topics rather than whatever they happen to be worst at.
  const ranked = await rankTopicsByPriority(userId);
  const [weak1, weak2, weak3, weak4] = ranked.map((r) => r.topic);

  await prisma.studyPlan.updateMany({ where: { userId, active: true }, data: { active: false } });

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      primaryCompetitionId: primaryUserCompetition?.competitionId,
      currentRating,
      targetRating: currentRating + 150,
      minutesPerDay,
      active: true,
    },
  });

  const days: {
    dayOfWeek: number;
    taskType: string;
    topicId?: string;
    label: string;
  }[] = [
    { dayOfWeek: 1, taskType: "LESSON", topicId: weak1?.id, label: `${weak1?.name ?? "Algebra"} lesson + ${problemCount} problems` },
    { dayOfWeek: 2, taskType: "PRACTICE", topicId: weak2?.id, label: `${weak2?.name ?? "Geometry"} + ${problemCount} problems` },
    { dayOfWeek: 3, taskType: "LESSON", topicId: weak3?.id, label: `${weak3?.name ?? "Combinatorics"} lesson + ${problemCount} problems` },
    { dayOfWeek: 4, taskType: "PRACTICE", topicId: weak4?.id, label: `${weak4?.name ?? "Number Theory"} + ${problemCount} problems` },
    { dayOfWeek: 5, taskType: "TIMED_SET", label: "Mixed timed set" },
    { dayOfWeek: 6, taskType: "SIMULATION", label: primaryUserCompetition ? `${primaryUserCompetition.competition.shortName} simulation` : "Competition simulation" },
    { dayOfWeek: 0, taskType: "REVIEW", label: "Mistake review" },
  ];

  await prisma.studyPlanDay.createMany({
    data: days.map((d) => ({
      studyPlanId: studyPlan.id,
      weekNumber: 1,
      dayOfWeek: d.dayOfWeek,
      taskType: d.taskType,
      topicId: d.topicId,
      problemCount,
      label: d.label,
    })),
  });

  return prisma.studyPlan.findUniqueOrThrow({
    where: { id: studyPlan.id },
    include: { days: { orderBy: { dayOfWeek: "asc" }, include: { topic: true } }, primaryCompetition: true },
  });
}

export async function getActiveStudyPlan(userId: string) {
  return prisma.studyPlan.findFirst({
    where: { userId, active: true },
    include: { days: { orderBy: { dayOfWeek: "asc" }, include: { topic: true, lesson: true } }, primaryCompetition: true },
    orderBy: { generatedAt: "desc" },
  });
}

export function todaysPlanDay<T extends { dayOfWeek: number }>(days: T[]): T | null {
  // 0=Sunday..6=Saturday, matching our schema convention. Uses the same
  // midnight-Pacific boundary as streaks: getDay() would be the *server's*
  // weekday, so on Vercel
  // a user's plan flipped to tomorrow's at 5pm their time.
  const today = streakWeekday();
  return days.find((d) => d.dayOfWeek === today) ?? null;
}
