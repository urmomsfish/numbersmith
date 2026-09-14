/**
 * Upserts Lesson (+ LessonProblem) rows from prisma/seed-data/lessons.ts.
 *
 * Deliberately not part of `npm run db:seed` — NumberSmith runs one shared
 * Neon database for development and production, and the full seed also
 * touches today's DailyChallenge row, which this must not do. This script
 * only ever touches Lesson and LessonProblem rows, matched by slug.
 *
 * A practiceProblemSlugs/challengeProblemSlug entry that doesn't resolve to
 * a real Problem is skipped rather than erroring — lessons ship before their
 * matching problem-bank entries always exist, and the UI already hides the
 * practice section when there are no attached problems.
 *
 * Run with: npm run db:sync-lessons   (add --dry-run to preview)
 */
import { PrismaClient } from "../src/generated/prisma";
import { LESSONS } from "../prisma/seed-data/lessons";

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const slugs = new Set(LESSONS.map((l) => l.slug));
  if (slugs.size !== LESSONS.length) {
    throw new Error("Duplicate slug in lessons.ts seed data.");
  }

  const topics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));

  const problems = await prisma.problem.findMany({ select: { id: true, slug: true } });
  const problemIdBySlug = new Map(problems.map((p) => [p.slug, p.id]));

  const existing = await prisma.lesson.findMany();
  const existingBySlug = new Map(existing.map((l) => [l.slug, l]));

  let inserted = 0;
  let updated = 0;

  for (const seed of LESSONS) {
    const topicId = topicIdBySlug.get(seed.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${seed.topicSlug} (lesson ${seed.slug})`);

    const row = {
      title: seed.title,
      topicId,
      concept: seed.concept,
      explanation: seed.explanation,
      workedExample: seed.workedExample,
      strategy: seed.strategy,
      commonMistakes: seed.commonMistakes,
      difficulty: seed.difficulty,
      isPremium: seed.isPremium,
    };

    let lessonId: string;
    const current = existingBySlug.get(seed.slug);
    if (!current) {
      inserted++;
      console.log(`  + insert  ${seed.slug}`);
      if (DRY_RUN) {
        continue;
      }
      const created = await prisma.lesson.create({ data: { slug: seed.slug, ...row } });
      lessonId = created.id;
    } else {
      const changed =
        current.title !== row.title ||
        current.topicId !== row.topicId ||
        current.concept !== row.concept ||
        current.explanation !== row.explanation ||
        current.workedExample !== row.workedExample ||
        current.strategy !== row.strategy ||
        current.commonMistakes !== row.commonMistakes ||
        current.difficulty !== row.difficulty ||
        current.isPremium !== row.isPremium;
      if (changed) {
        updated++;
        console.log(`  ~ update  ${seed.slug}`);
        if (!DRY_RUN) await prisma.lesson.update({ where: { id: current.id }, data: row });
      }
      lessonId = current.id;
    }

    if (DRY_RUN) continue;

    let order = 0;
    for (const slug of seed.practiceProblemSlugs) {
      const problemId = problemIdBySlug.get(slug);
      if (!problemId) continue;
      await prisma.lessonProblem.upsert({
        where: { lessonId_problemId: { lessonId, problemId } },
        update: { role: "PRACTICE", order },
        create: { lessonId, problemId, role: "PRACTICE", order },
      });
      order += 1;
    }
    if (seed.challengeProblemSlug) {
      const challengeId = problemIdBySlug.get(seed.challengeProblemSlug);
      if (challengeId) {
        await prisma.lessonProblem.upsert({
          where: { lessonId_problemId: { lessonId, problemId: challengeId } },
          update: { role: "CHALLENGE", order },
          create: { lessonId, problemId: challengeId, role: "CHALLENGE", order },
        });
      }
    }
  }

  console.log(
    `\n${DRY_RUN ? "[dry run] " : ""}${inserted} inserted, ${updated} updated, ${
      LESSONS.length - inserted - updated
    } unchanged.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
