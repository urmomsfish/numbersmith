/**
 * Upserts Competition rows (and their CompetitionTopic weights) from seed
 * data, without touching anything else in the database — unlike `npm run
 * db:seed`, which also upserts today's DailyChallenge and would disrupt a
 * student mid-challenge. Safe to run any time the COMPETITIONS seed data
 * changes (e.g. adding/splitting/reordering competitions).
 *
 * Run with: npm run db:sync-competitions
 */
import { PrismaClient } from "../src/generated/prisma";
import { COMPETITIONS, CATEGORY_TOPIC_WEIGHTS } from "../prisma/seed-data/competitions";

const prisma = new PrismaClient();

async function main() {
  const topics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));

  let created = 0;
  let updated = 0;

  for (const c of COMPETITIONS) {
    const existing = await prisma.competition.findUnique({ where: { slug: c.slug } });

    const competition = await prisma.competition.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        shortName: c.shortName,
        category: c.category,
        format: c.format,
        individualOrTeam: c.individualOrTeam,
        gradeMin: c.gradeMin,
        gradeMax: c.gradeMax,
        difficultyMin: c.difficultyMin,
        difficultyMax: c.difficultyMax,
        numQuestions: c.numQuestions,
        timeLimitMinutes: c.timeLimitMinutes,
        organization: c.organization,
        description: c.description,
        roadmap: c.roadmap,
        order: c.order,
      },
      create: {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName,
        category: c.category,
        format: c.format,
        individualOrTeam: c.individualOrTeam,
        gradeMin: c.gradeMin,
        gradeMax: c.gradeMax,
        difficultyMin: c.difficultyMin,
        difficultyMax: c.difficultyMax,
        numQuestions: c.numQuestions,
        timeLimitMinutes: c.timeLimitMinutes,
        organization: c.organization,
        description: c.description,
        roadmap: c.roadmap,
        order: c.order,
      },
    });

    if (existing) updated++;
    else created++;

    const weights = CATEGORY_TOPIC_WEIGHTS[c.category] ?? {};
    for (const [topicSlug, weight] of Object.entries(weights)) {
      const topicId = topicIdBySlug.get(topicSlug);
      if (!topicId) continue;
      await prisma.competitionTopic.upsert({
        where: { competitionId_topicId: { competitionId: competition.id, topicId } },
        update: { weight },
        create: { competitionId: competition.id, topicId, weight },
      });
    }
  }

  console.log(`Competitions: ${created} created, ${updated} updated, ${COMPETITIONS.length} total in seed data.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
