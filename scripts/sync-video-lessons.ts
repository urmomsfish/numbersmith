/**
 * Upserts VideoLesson rows from prisma/seed-data/video-lessons.ts.
 *
 * Deliberately not part of `npm run db:seed` — NumberSmith runs one shared
 * Neon database for development and production, and the full seed also
 * touches today's DailyChallenge row, which this must not do. This script
 * only ever touches the VideoLesson table, matched by slug. Unlike problems,
 * editing a video lesson's content doesn't invalidate anything a student has
 * already been graded against (there's no answer to regrade), so existing
 * rows are simply updated in place rather than locked once "attempted".
 *
 * Run with: npm run db:sync-video-lessons   (add --dry-run to preview)
 */
import { PrismaClient } from "../src/generated/prisma";
import { VIDEO_LESSONS } from "../prisma/seed-data/video-lessons";

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const slugs = new Set(VIDEO_LESSONS.map((l) => l.slug));
  if (slugs.size !== VIDEO_LESSONS.length) {
    throw new Error("Duplicate slug in video-lessons.ts seed data.");
  }

  const topics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));

  const existing = await prisma.videoLesson.findMany();
  const existingBySlug = new Map(existing.map((l) => [l.slug, l]));

  let inserted = 0;
  let updated = 0;

  for (const [order, seed] of VIDEO_LESSONS.entries()) {
    const topicId = topicIdBySlug.get(seed.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${seed.topicSlug} (video lesson ${seed.slug})`);

    const row = {
      title: seed.title,
      topicId,
      difficulty: seed.difficulty,
      order,
      summary: seed.summary,
      durationMinutes: seed.durationMinutes,
      scenes: JSON.stringify(seed.scenes),
    };

    const current = existingBySlug.get(seed.slug);
    if (!current) {
      inserted++;
      console.log(`  + insert  ${seed.slug}`);
      if (!DRY_RUN) await prisma.videoLesson.create({ data: { slug: seed.slug, ...row } });
      continue;
    }

    const changed =
      current.title !== row.title ||
      current.topicId !== row.topicId ||
      current.difficulty !== row.difficulty ||
      current.order !== row.order ||
      current.summary !== row.summary ||
      current.durationMinutes !== row.durationMinutes ||
      current.scenes !== row.scenes;
    if (!changed) continue;

    updated++;
    console.log(`  ~ update  ${seed.slug}`);
    if (!DRY_RUN) await prisma.videoLesson.update({ where: { id: current.id }, data: row });
  }

  console.log(
    `\n${DRY_RUN ? "[dry run] " : ""}${inserted} inserted, ${updated} updated, ${
      VIDEO_LESSONS.length - inserted - updated
    } unchanged.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
