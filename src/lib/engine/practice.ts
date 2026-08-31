import "server-only";
import { prisma } from "@/lib/prisma";
import { DOMAIN_TOPIC_SLUGS } from "@/lib/types";

export function ratingToDifficulty(rating: number): number {
  return Math.max(1, Math.min(10, Math.round((rating - 900) / 120)));
}

export type PracticeFocus = "CHALLENGE" | "MEDIUM" | "TIMED" | "ACCURACY" | "STANDARD";

/** Implements the section-14 adaptive rules:
 *  - consistently correct on easy problems -> raise difficulty
 *  - repeatedly missing hard problems -> step back to medium
 *  - accurate but slow -> timed practice
 *  - fast but inaccurate -> accuracy-focused (slightly easier) practice */
async function detectFocus(userId: string, topicId: string, baseDifficulty: number) {
  const recent = await prisma.attempt.findMany({
    where: { userId, problem: { topicId } },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { problem: { select: { estimatedTimeSeconds: true, difficulty: true } } },
  });

  if (recent.length < 3) return { focus: "STANDARD" as PracticeFocus, difficulty: baseDifficulty };

  const accuracy = recent.filter((a) => a.correct).length / recent.length;
  const avgTimeRatio =
    recent.reduce((sum, a) => sum + a.timeSeconds / Math.max(30, a.problem.estimatedTimeSeconds), 0) /
    recent.length;

  const recentHard = recent.filter((a) => a.problem.difficulty >= baseDifficulty + 1);
  const missedHard = recentHard.length >= 2 && recentHard.filter((a) => !a.correct).length / recentHard.length > 0.6;

  const recentEasy = recent.filter((a) => a.problem.difficulty <= baseDifficulty);
  const acedEasy = recentEasy.length >= 3 && recentEasy.every((a) => a.correct);

  if (missedHard) return { focus: "MEDIUM" as PracticeFocus, difficulty: Math.max(1, baseDifficulty - 1) };
  if (acedEasy) return { focus: "CHALLENGE" as PracticeFocus, difficulty: Math.min(10, baseDifficulty + 1) };
  if (accuracy >= 0.85 && avgTimeRatio > 1.3) return { focus: "TIMED" as PracticeFocus, difficulty: baseDifficulty };
  if (accuracy < 0.6 && avgTimeRatio < 0.7)
    return { focus: "ACCURACY" as PracticeFocus, difficulty: Math.max(1, baseDifficulty - 1) };

  return { focus: "STANDARD" as PracticeFocus, difficulty: baseDifficulty };
}

/** Ranks every domain topic by how much practice it needs *for this student's
 * competitions*, highest priority first. Score = competition weight × mastery
 * gap, so an AMC 8 student is never steered into olympiad material just because
 * their olympiad mastery is low, while an AIME student with the same profile is.
 * Topics carrying no weight for any selected competition get a small residual
 * weight so they can still surface once the relevant topics are strong. */
export async function rankTopicsByPriority(userId: string) {
  const userCompetitions = await prisma.userCompetition.findMany({
    where: { userId },
    include: { competition: { include: { topics: { include: { topic: true } } } } },
  });

  const weightByDomain = new Map<string, number>();
  if (userCompetitions.length > 0) {
    for (const uc of userCompetitions) {
      const multiplier = uc.isPrimary ? 2 : 1;
      for (const ct of uc.competition.topics) {
        if (ct.topic.parentId) continue; // only domain-level topics carry weight
        weightByDomain.set(
          ct.topic.slug,
          (weightByDomain.get(ct.topic.slug) ?? 0) + ct.weight * multiplier
        );
      }
    }
  } else {
    for (const slug of DOMAIN_TOPIC_SLUGS) weightByDomain.set(slug, 1);
  }

  const domainTopics = await prisma.topic.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
  });
  const masteryRows = await prisma.topicMastery.findMany({
    where: { userId, topicId: { in: domainTopics.map((t) => t.id) } },
  });
  const masteryByTopicId = new Map(masteryRows.map((m) => [m.topicId, m.masteryPercent]));

  return domainTopics
    .map((topic) => {
      const weight = weightByDomain.get(topic.slug) ?? 0.25;
      const mastery = masteryByTopicId.get(topic.id) ?? 40;
      return { topic, mastery, weight, score: weight * (100 - mastery) };
    })
    .sort((a, b) => b.score - a.score);
}

/** Picks the single highest-priority topic to work on right now. */
export async function pickPriorityTopic(userId: string) {
  const ranked = await rankTopicsByPriority(userId);
  return ranked[0].topic;
}

export async function pickNextPracticeProblems(
  userId: string,
  opts: { topicSlug?: string; competitionSlug?: string; difficulty?: number; count?: number } = {}
) {
  const count = opts.count ?? 5;

  const domainTopic = opts.topicSlug
    ? await prisma.topic.findUnique({ where: { slug: opts.topicSlug } })
    : await pickPriorityTopic(userId);
  if (!domainTopic) return { problems: [], topic: null, focus: "STANDARD" as PracticeFocus };

  const overallRating = await prisma.rating.findUnique({
    where: { userId_category: { userId, category: "OVERALL" } },
  });
  const baseDifficulty = opts.difficulty ?? ratingToDifficulty(overallRating?.value ?? 1000);

  const { focus, difficulty } = await detectFocus(userId, domainTopic.id, baseDifficulty);

  const recentCorrectIds = (
    await prisma.attempt.findMany({
      where: { userId, correct: true },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: { problemId: true },
    })
  ).map((a) => a.problemId);

  const competition = opts.competitionSlug
    ? await prisma.competition.findUnique({ where: { slug: opts.competitionSlug } })
    : null;

  const where = {
    isPublished: true,
    // The placement bank is held back from practice. Otherwise a student trains
    // on the very questions that set their rating, which both inflates their
    // measured mastery and wastes the only problems we know their level from.
    isPlacement: false,
    id: { notIn: recentCorrectIds },
    topic: { OR: [{ id: domainTopic.id }, { parentId: domainTopic.id }] },
    difficulty: { gte: Math.max(1, difficulty - 1), lte: Math.min(10, difficulty + 1) },
    ...(competition ? { competitionId: competition.id } : {}),
    ...(focus === "TIMED" ? { estimatedTimeSeconds: { lte: 150 } } : {}),
  };

  let problems = await prisma.problem.findMany({ where, take: count * 3 });
  if (problems.length === 0) {
    problems = await prisma.problem.findMany({
      where: {
        isPublished: true,
        isPlacement: false,
        topic: { OR: [{ id: domainTopic.id }, { parentId: domainTopic.id }] },
      },
      take: count * 3,
    });
  }

  const shuffled = problems.sort(() => Math.random() - 0.5).slice(0, count);

  return { problems: shuffled, topic: domainTopic, focus, difficulty };
}
