/**
 * Recomputes TopicMastery.problemsAttempted / problemsCorrect from the Attempt
 * table.
 *
 * Why this is needed: the placement test used to increment these counters
 * directly, so they measured "placement questions + practice" rather than
 * practice. Now that src/lib/engine/progress.ts treats them as the evidence
 * behind a mastery claim, the inflated values would keep overstating progress
 * for every existing account — one of which had zero practice attempts and a
 * dashboard reading 100% mastered across six domains.
 *
 * Attempt rows are the ground truth: they are written once per real problem
 * solved, and the placement test does not create them. masteryPercent is left
 * alone — that is the skill estimate, and seeding it from placement is correct.
 *
 * Run with: npm run db:backfill-mastery   (add --dry-run to preview)
 */
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const topics = await prisma.topic.findMany({ select: { id: true, parentId: true, slug: true } });
  const parentOf = new Map(topics.map((t) => [t.id, t.parentId]));

  const attempts = await prisma.attempt.findMany({
    select: { userId: true, correct: true, problem: { select: { topicId: true } } },
  });
  console.log(`${attempts.length} attempts across the whole app.`);

  // key: `${userId}:${topicId}` -> counts. An attempt counts for its own topic
  // AND its parent domain, matching updateTopicAndDomainMastery.
  const tally = new Map<string, { attempted: number; correct: number }>();
  const bump = (userId: string, topicId: string, correct: boolean) => {
    const key = `${userId}:${topicId}`;
    const row = tally.get(key) ?? { attempted: 0, correct: 0 };
    row.attempted++;
    if (correct) row.correct++;
    tally.set(key, row);
  };
  for (const a of attempts) {
    if (!a.problem?.topicId) continue;
    bump(a.userId, a.problem.topicId, a.correct);
    const parentId = parentOf.get(a.problem.topicId);
    if (parentId) bump(a.userId, parentId, a.correct);
  }

  const rows = await prisma.topicMastery.findMany({
    select: { id: true, userId: true, topicId: true, problemsAttempted: true, problemsCorrect: true },
  });

  const changes: { id: string; attempted: number; correct: number; wasAttempted: number }[] = [];
  for (const r of rows) {
    const truth = tally.get(`${r.userId}:${r.topicId}`) ?? { attempted: 0, correct: 0 };
    if (r.problemsAttempted !== truth.attempted || r.problemsCorrect !== truth.correct) {
      changes.push({
        id: r.id,
        attempted: truth.attempted,
        correct: truth.correct,
        wasAttempted: r.problemsAttempted,
      });
    }
  }

  console.log(`${rows.length} mastery rows, ${changes.length} need correcting.`);
  const inflated = changes.filter((c) => c.wasAttempted > c.attempted);
  console.log(
    `  ${inflated.length} overstated (placement counted as practice), ` +
      `${changes.length - inflated.length} understated.`
  );
  const totalRemoved = inflated.reduce((s, c) => s + (c.wasAttempted - c.attempted), 0);
  console.log(`  ${totalRemoved} phantom "problems attempted" removed in total.`);

  if (changes.length === 0) {
    console.log("Nothing to do.");
    return;
  }
  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  for (let i = 0; i < changes.length; i += 100) {
    await prisma.$transaction(
      changes.slice(i, i + 100).map((c) =>
        prisma.topicMastery.update({
          where: { id: c.id },
          data: { problemsAttempted: c.attempted, problemsCorrect: c.correct },
        })
      )
    );
  }
  console.log(`\nDone. Corrected ${changes.length} rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
