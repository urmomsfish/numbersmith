import { prisma } from "@/lib/prisma";
import { parseChoices } from "@/lib/engine/scoring";
import type { QuizProblem } from "@/components/video-lessons/lesson-quiz";

export const QUIZ_LENGTH = 5;

/** Picks the quiz questions that close out a video lesson.
 *
 * Questions are drawn from the same problem bank the rest of the app uses
 * rather than authored per-lesson: those problems are already answer-verified,
 * already carry worked solutions, and already sit under the lesson's own topic.
 *
 * Selection widens in two stages. First it looks for problems in the lesson's
 * exact topic near its difficulty, which is the ideal set. If that topic is too
 * thin to fill five slots — some subtopics are much smaller than others — it
 * falls back to the parent domain so a lesson never ends with a half-empty
 * quiz. Duplicates are impossible because the second pass excludes what the
 * first already took. */
export async function pickQuizProblems(
  topicId: string,
  difficulty: number
): Promise<QuizProblem[]> {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { id: true, parentId: true },
  });
  if (!topic) return [];

  const spread = 2;
  const select = {
    id: true,
    question: true,
    diagram: true,
    format: true,
    choices: true,
    difficulty: true,
  } as const;

  const near = await prisma.problem.findMany({
    where: {
      topicId,
      isPublished: true,
      difficulty: { gte: difficulty - spread, lte: difficulty + spread },
    },
    select,
    take: 60,
  });

  const chosen = sample(near, QUIZ_LENGTH);

  if (chosen.length < QUIZ_LENGTH) {
    // Widen to sibling topics under the same domain, then to any difficulty,
    // before giving up. A short quiz is better than a broken one, so whatever
    // this yields is what the lesson shows.
    const siblingScope = topic.parentId
      ? { topic: { parentId: topic.parentId } }
      : { topic: { OR: [{ id: topic.id }, { parentId: topic.id }] } };

    const wider = await prisma.problem.findMany({
      where: {
        isPublished: true,
        id: { notIn: chosen.map((p) => p.id) },
        ...siblingScope,
      },
      select,
      take: 80,
    });
    chosen.push(...sample(wider, QUIZ_LENGTH - chosen.length));
  }

  return chosen.map((p) => ({
    id: p.id,
    question: p.question,
    diagram: p.diagram,
    format: p.format as QuizProblem["format"],
    choices: parseChoices(p.choices),
    difficulty: p.difficulty,
  }));
}

/** Fisher-Yates over a copy, then take the first n. */
function sample<T>(items: T[], n: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
