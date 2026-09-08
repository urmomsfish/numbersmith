/**
 * Adds problems that exist in the seed data but not yet in the database.
 *
 * This is deliberately *not* `npm run db:seed`. NumberSmith runs against one
 * Neon database for both development and production, and the full seed does
 * more than insert problems: it upserts today's DailyChallenge row for all
 * seven tracks. Running it would swap out the daily challenge underneath any
 * student who was partway through today's. This script touches nothing but the
 * Problem table, and only ever inserts.
 *
 * Existing rows are corrected only when the seed content has changed AND the
 * problem has no recorded attempts. A problem a student has already answered is
 * never rewritten — that would retroactively change what their stored attempt
 * was graded against. Those are reported and skipped instead.
 *
 * Run with: npm run db:sync-problems   (add --dry-run to preview)
 */
import { PrismaClient } from "../src/generated/prisma";
import { PROBLEMS } from "../prisma/seed-data/problems";
import { OLYMPIAD_PROBLEMS } from "../prisma/seed-data/problems-olympiad";
import { GENERATED_PROBLEMS, GENERATION_ISSUES } from "../prisma/seed-data/generators";
import { toProblemRow } from "../prisma/seed-data/problem-rows";

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  // Refuse to touch the database if any generated problem disagrees with its
  // own independent verification. Same gate the seed applies.
  const mismatches = GENERATION_ISSUES.filter((i) => i.detail.includes("independent check"));
  if (mismatches.length > 0) {
    throw new Error(
      `Refusing to sync: ${mismatches.length} generated problem(s) disagree with their own verification.`
    );
  }
  if (GENERATION_ISSUES.length > 0) {
    console.log(`  (${GENERATION_ISSUES.length} generation notes, no answer mismatches)`);
  }

  const topics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  const competitions = await prisma.competition.findMany({ select: { id: true, slug: true } });
  const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));
  const competitionIdBySlug = new Map(competitions.map((c) => [c.slug, c.id]));

  const existing = await prisma.problem.findMany({
    select: {
      id: true,
      slug: true,
      question: true,
      format: true,
      choices: true,
      answer: true,
      solution: true,
      hints: true,
      difficulty: true,
      _count: { select: { attempts: true } },
    },
  });
  const existingBySlug = new Map(existing.map((p) => [p.slug, p]));
  console.log(`Database currently holds ${existing.length} problems.`);

  const candidates = [
    ...PROBLEMS.map((p) => ({ seed: p, isPlacement: true })),
    ...GENERATED_PROBLEMS.map((p) => ({ seed: p, isPlacement: false })),
    ...OLYMPIAD_PROBLEMS.map((p) => ({ seed: p, isPlacement: false })),
  ];
  console.log(`Seed data defines ${candidates.length} problems.`);

  const rows = [];
  const updates: { id: string; slug: string; row: ReturnType<typeof toProblemRow> }[] = [];
  const lockedOut: string[] = [];
  const byTopic = new Map<string, number>();

  for (const { seed, isPlacement } of candidates) {
    const topicId = topicIdBySlug.get(seed.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${seed.topicSlug} (problem ${seed.slug})`);
    const row = toProblemRow(seed, {
      topicId,
      competitionId: seed.competitionSlug
        ? competitionIdBySlug.get(seed.competitionSlug) ?? null
        : null,
      isPlacement,
    });

    const current = existingBySlug.get(seed.slug);
    if (!current) {
      rows.push(row);
      byTopic.set(seed.topicSlug, (byTopic.get(seed.topicSlug) ?? 0) + 1);
      continue;
    }

    // Compare only the fields a student actually sees or is graded on.
    const changed =
      current.question !== row.question ||
      current.format !== row.format ||
      current.choices !== row.choices ||
      current.answer !== row.answer ||
      current.solution !== row.solution ||
      current.hints !== row.hints ||
      current.difficulty !== row.difficulty;
    if (!changed) continue;

    if (current._count.attempts > 0) {
      lockedOut.push(`${seed.slug} (${current._count.attempts} attempt(s))`);
      continue;
    }
    updates.push({ id: current.id, slug: seed.slug, row });
  }

  if (rows.length === 0 && updates.length === 0 && lockedOut.length === 0) {
    console.log("Nothing to do — the database is already in sync.");
    return;
  }

  if (rows.length > 0) {
    console.log(`\n${rows.length} new problems to insert:`);
    for (const [slug, n] of [...byTopic.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(5)}  ${slug}`);
    }
  }
  if (updates.length > 0) {
    console.log(`\n${updates.length} existing problems to correct (no attempts recorded).`);
  }
  if (lockedOut.length > 0) {
    console.log(
      `\n${lockedOut.length} problems differ from the seed but have been attempted, so they were left alone:`
    );
    for (const s of lockedOut.slice(0, 20)) console.log(`  ${s}`);
    if (lockedOut.length > 20) console.log(`  … and ${lockedOut.length - 20} more`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  // Batched — per-row round trips to a hosted Postgres take minutes at this
  // volume. skipDuplicates guards against a concurrent insert of the same slug.
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const result = await prisma.problem.createMany({ data: batch, skipDuplicates: true });
    inserted += result.count;
    console.log(`  inserted ${inserted}/${rows.length}`);
  }

  for (let i = 0; i < updates.length; i += 100) {
    await prisma.$transaction(
      updates.slice(i, i + 100).map((u) =>
        prisma.problem.update({
          where: { id: u.id },
          data: {
            question: u.row.question,
            format: u.row.format,
            choices: u.row.choices,
            answer: u.row.answer,
            solution: u.row.solution,
            hints: u.row.hints,
            difficulty: u.row.difficulty,
          },
        })
      )
    );
    console.log(`  corrected ${Math.min(i + 100, updates.length)}/${updates.length}`);
  }

  const finalCount = await prisma.problem.count();
  console.log(`\nDone. Database now holds ${finalCount} problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
