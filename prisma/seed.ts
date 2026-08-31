import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { TOPICS } from "./seed-data/topics";
import { COMPETITIONS } from "./seed-data/competitions";
import { PROBLEMS } from "./seed-data/problems";
import { GENERATED_PROBLEMS, GENERATION_ISSUES } from "./seed-data/generators";
import { OLYMPIAD_PROBLEMS } from "./seed-data/problems-olympiad";
import { LESSONS } from "./seed-data/lessons";
import { ACHIEVEMENTS } from "./seed-data/achievements";

const prisma = new PrismaClient();

function gradesForDifficulty(difficulty: number): [number, number] {
  if (difficulty <= 2) return [2, 6];
  if (difficulty <= 4) return [5, 9];
  if (difficulty <= 6) return [7, 11];
  if (difficulty <= 8) return [9, 12];
  return [10, 12];
}

function secondsForDifficulty(difficulty: number): number {
  if (difficulty <= 2) return 60;
  if (difficulty <= 4) return 90;
  if (difficulty <= 6) return 150;
  if (difficulty <= 8) return 240;
  return 360;
}

// Default topic emphasis per competition category — used to populate each
// competition's "main topics" without hand-authoring 20 separate lists.
const CATEGORY_TOPIC_WEIGHTS: Record<string, Record<string, number>> = {
  ELEMENTARY_MIDDLE: {
    arithmetic: 5,
    "number-theory": 3,
    geometry: 3,
    combinatorics: 3,
    logic: 4,
    algebra: 2,
    probability: 2,
  },
  HIGH_SCHOOL: {
    algebra: 5,
    geometry: 5,
    "number-theory": 4,
    combinatorics: 4,
    probability: 3,
    logic: 2,
  },
  OLYMPIAD: {
    "advanced-olympiad": 5,
    algebra: 4,
    geometry: 4,
    "number-theory": 4,
    combinatorics: 4,
  },
};

async function main() {
  console.log("Seeding NumberSmith database...");

  // ---------------------------------------------------------------------
  // Topics
  // ---------------------------------------------------------------------
  const topicIdBySlug = new Map<string, string>();
  for (const domain of TOPICS) {
    const parent = await prisma.topic.upsert({
      where: { slug: domain.slug },
      update: { name: domain.name, order: domain.order },
      create: { slug: domain.slug, name: domain.name, order: domain.order },
    });
    topicIdBySlug.set(domain.slug, parent.id);

    for (const child of domain.children ?? []) {
      const childTopic = await prisma.topic.upsert({
        where: { slug: child.slug },
        update: { name: child.name, order: child.order, parentId: parent.id },
        create: { slug: child.slug, name: child.name, order: child.order, parentId: parent.id },
      });
      topicIdBySlug.set(child.slug, childTopic.id);
    }
  }
  console.log(`  Topics: ${topicIdBySlug.size}`);

  // ---------------------------------------------------------------------
  // Competitions + topic weights
  // ---------------------------------------------------------------------
  const competitionIdBySlug = new Map<string, string>();
  for (const c of COMPETITIONS) {
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
    competitionIdBySlug.set(c.slug, competition.id);

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
  console.log(`  Competitions: ${competitionIdBySlug.size}`);

  // ---------------------------------------------------------------------
  // Problems
  // ---------------------------------------------------------------------
  const problemIdBySlug = new Map<string, string>();
  for (const p of PROBLEMS) {
    const topicId = topicIdBySlug.get(p.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${p.topicSlug} (problem ${p.slug})`);
    const competitionId = p.competitionSlug ? competitionIdBySlug.get(p.competitionSlug) : null;
    const [gradeMin, gradeMax] = gradesForDifficulty(p.difficulty);
    const tags = [p.topicSlug, ...(p.competitionSlug ? [p.competitionSlug] : [])];

    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {
        question: p.question,
        format: p.format,
        choices: p.choices ? JSON.stringify(p.choices) : null,
        answer: p.answer,
        solution: p.solution,
        hints: JSON.stringify(p.hints),
        difficulty: p.difficulty,
        topicId,
        competitionId,
        gradeMin,
        gradeMax,
        estimatedTimeSeconds: secondsForDifficulty(p.difficulty),
        tags: JSON.stringify(tags),
        isPlacement: true,
      },
      create: {
        slug: p.slug,
        question: p.question,
        format: p.format,
        choices: p.choices ? JSON.stringify(p.choices) : null,
        answer: p.answer,
        solution: p.solution,
        hints: JSON.stringify(p.hints),
        difficulty: p.difficulty,
        topicId,
        competitionId,
        gradeMin,
        gradeMax,
        estimatedTimeSeconds: secondsForDifficulty(p.difficulty),
        tags: JSON.stringify(tags),
        isPlacement: true,
      },
    });
    problemIdBySlug.set(p.slug, problem.id);
  }
  console.log(`  Placement problems (hand-written): ${problemIdBySlug.size}`);

  // ---------------------------------------------------------------------
  // Generated practice bank
  //
  // These are held out of the placement pool (isPlacement: false) so students
  // never train on the questions that set their rating. Inserted with
  // createMany rather than upsert — at this volume, per-row round trips to a
  // hosted Postgres take minutes instead of seconds.
  // ---------------------------------------------------------------------
  if (GENERATION_ISSUES.length > 0) {
    const mismatches = GENERATION_ISSUES.filter((i) => i.detail.includes("independent check"));
    if (mismatches.length > 0) {
      throw new Error(
        `Refusing to seed: ${mismatches.length} generated problem(s) disagree with their own verification.`
      );
    }
    console.log(`  (${GENERATION_ISSUES.length} generation notes, no answer mismatches)`);
  }

  const generatedRows = [...GENERATED_PROBLEMS, ...OLYMPIAD_PROBLEMS].map((p) => {
    const topicId = topicIdBySlug.get(p.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${p.topicSlug} (problem ${p.slug})`);
    const [gradeMin, gradeMax] = gradesForDifficulty(p.difficulty);
    return {
      slug: p.slug,
      question: p.question,
      format: p.format,
      choices: p.choices ? JSON.stringify(p.choices) : null,
      answer: p.answer,
      solution: p.solution,
      hints: JSON.stringify(p.hints),
      difficulty: p.difficulty,
      topicId,
      competitionId: p.competitionSlug ? competitionIdBySlug.get(p.competitionSlug) ?? null : null,
      gradeMin,
      gradeMax,
      estimatedTimeSeconds: secondsForDifficulty(p.difficulty),
      tags: JSON.stringify([p.topicSlug, ...(p.competitionSlug ? [p.competitionSlug] : [])]),
      isPlacement: false,
    };
  });

  for (let i = 0; i < generatedRows.length; i += 500) {
    await prisma.problem.createMany({
      data: generatedRows.slice(i, i + 500),
      skipDuplicates: true,
    });
  }
  console.log(`  Practice problems: ${generatedRows.length} (${GENERATED_PROBLEMS.length} generated + ${OLYMPIAD_PROBLEMS.length} hand-written olympiad)`);

  // ---------------------------------------------------------------------
  // Lessons
  // ---------------------------------------------------------------------
  for (const l of LESSONS) {
    const topicId = topicIdBySlug.get(l.topicSlug);
    if (!topicId) throw new Error(`Unknown topic slug: ${l.topicSlug} (lesson ${l.slug})`);

    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        topicId,
        concept: l.concept,
        explanation: l.explanation,
        workedExample: l.workedExample,
        strategy: l.strategy,
        commonMistakes: l.commonMistakes,
        difficulty: l.difficulty,
        isPremium: l.isPremium,
      },
      create: {
        slug: l.slug,
        title: l.title,
        topicId,
        concept: l.concept,
        explanation: l.explanation,
        workedExample: l.workedExample,
        strategy: l.strategy,
        commonMistakes: l.commonMistakes,
        difficulty: l.difficulty,
        isPremium: l.isPremium,
      },
    });

    let order = 0;
    for (const slug of l.practiceProblemSlugs) {
      const problemId = problemIdBySlug.get(slug);
      if (!problemId) continue;
      await prisma.lessonProblem.upsert({
        where: { lessonId_problemId: { lessonId: lesson.id, problemId } },
        update: { role: "PRACTICE", order },
        create: { lessonId: lesson.id, problemId, role: "PRACTICE", order },
      });
      order += 1;
    }
    const challengeId = problemIdBySlug.get(l.challengeProblemSlug);
    if (challengeId) {
      await prisma.lessonProblem.upsert({
        where: { lessonId_problemId: { lessonId: lesson.id, problemId: challengeId } },
        update: { role: "CHALLENGE", order },
        create: { lessonId: lesson.id, problemId: challengeId, role: "CHALLENGE", order },
      });
    }
  }
  console.log(`  Lessons: ${LESSONS.length}`);

  // ---------------------------------------------------------------------
  // Achievements
  // ---------------------------------------------------------------------
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        criteria: JSON.stringify(a.criteria),
        xpReward: a.xpReward,
        order: a.order,
      },
      create: {
        slug: a.slug,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        criteria: JSON.stringify(a.criteria),
        xpReward: a.xpReward,
        order: a.order,
      },
    });
  }
  console.log(`  Achievements: ${ACHIEVEMENTS.length}`);

  // ---------------------------------------------------------------------
  // Daily challenges (today) — one per track
  // ---------------------------------------------------------------------
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tracks: { track: string; slug: string }[] = [
    { track: "ELEMENTARY", slug: "geo-angles-01" },
    { track: "MIDDLE_SCHOOL", slug: "combo-counting-02" },
    { track: "AMC8", slug: "geo-circles-02" },
    { track: "AMC10", slug: "alg-systems-02" },
    { track: "AMC12", slug: "alg-quad-02" },
    { track: "AIME", slug: "nt-divisibility-03" },
    { track: "OLYMPIAD", slug: "adv-inequality-01" },
  ];
  for (const t of tracks) {
    const problemId = problemIdBySlug.get(t.slug);
    if (!problemId) continue;
    await prisma.dailyChallenge.upsert({
      where: { date_track: { date: today, track: t.track } },
      update: { problemId },
      create: { date: today, track: t.track, problemId },
    });
  }
  console.log(`  Daily challenges: ${tracks.length}`);

  // ---------------------------------------------------------------------
  // Admin account
  // ---------------------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@numbersmith.app" },
    update: {},
    create: {
      email: "admin@numbersmith.app",
      name: "NumberSmith Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      stats: { create: {} },
      subscription: { create: { status: "PRO", plan: "YEARLY" } },
      ratings: { create: { category: "OVERALL", value: 2000 } },
      profile: {
        create: {
          grade: 12,
          onboardingStep: "DONE",
          onboardingCompletedAt: new Date(),
        },
      },
    },
  });
  console.log(`  Admin account: ${admin.email} / password123`);

  // ---------------------------------------------------------------------
  // Demo student account (fully onboarded, populated for evaluation)
  // ---------------------------------------------------------------------
  const demoEmail = "demo@numbersmith.app";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    const demoPasswordHash = await bcrypt.hash("password123", 10);
    const demo = await prisma.user.create({
      data: {
        email: demoEmail,
        name: "Jordan Rivera (Demo Student)",
        passwordHash: demoPasswordHash,
        role: "STUDENT",
        profile: {
          create: {
            grade: 8,
            ageRange: "11-13",
            priorExperience: "SOME",
            approxLevel: "INTERMEDIATE",
            dailyPracticeMinutes: 30,
            targetScore: "AMC 8 Distinction",
            onboardingStep: "DONE",
            onboardingCompletedAt: new Date(),
          },
        },
        subscription: { create: { status: "FREE" } },
        stats: {
          create: {
            totalXp: 2340,
            level: 6,
            currentStreak: 12,
            longestStreak: 18,
            lastActiveDate: new Date(),
            problemsSolved: 187,
            problemsCorrect: 149,
          },
        },
      },
    });

    const amc8Id = competitionIdBySlug.get("amc8")!;
    const mathcountsId = competitionIdBySlug.get("mathcounts")!;
    await prisma.userCompetition.createMany({
      data: [
        { userId: demo.id, competitionId: amc8Id, isPrimary: true },
        { userId: demo.id, competitionId: mathcountsId, isPrimary: false },
      ],
    });

    const skillBreakdown: Record<string, number> = {
      arithmetic: 91,
      algebra: 84,
      geometry: 78,
      "number-theory": 72,
      combinatorics: 65,
      probability: 70,
      logic: 88,
    };
    for (const [slug, pct] of Object.entries(skillBreakdown)) {
      const topicId = topicIdBySlug.get(slug)!;
      await prisma.topicMastery.create({
        data: {
          userId: demo.id,
          topicId,
          masteryPercent: pct,
          problemsAttempted: 20,
          problemsCorrect: Math.round(20 * (pct / 100)),
          lastPracticedAt: new Date(),
        },
      });
    }

    await prisma.rating.createMany({
      data: [
        { userId: demo.id, category: "OVERALL", value: 1540 },
        { userId: demo.id, category: "AMC", value: 1560 },
        { userId: demo.id, category: "MATHCOUNTS", value: 1500 },
      ],
    });
    await prisma.ratingHistory.createMany({
      data: [
        { userId: demo.id, category: "OVERALL", value: 1200, delta: 1200, reason: "Placement Test" },
        { userId: demo.id, category: "OVERALL", value: 1340, delta: 140, reason: "Practice session" },
        { userId: demo.id, category: "OVERALL", value: 1420, delta: 80, reason: "AMC 8 Simulation" },
        { userId: demo.id, category: "OVERALL", value: 1480, delta: 60, reason: "Practice session" },
        { userId: demo.id, category: "OVERALL", value: 1540, delta: 60, reason: "MathCounts Simulation" },
      ],
    });

    const placement = await prisma.placementTest.create({
      data: {
        userId: demo.id,
        status: "COMPLETED",
        completedAt: new Date(),
        resultRating: 1540,
        resultLevel: "ADVANCED",
        skillBreakdown: JSON.stringify(skillBreakdown),
        strengthTopicId: topicIdBySlug.get("arithmetic"),
        opportunityTopicId: topicIdBySlug.get("combinatorics"),
        recommendedCompetitionId: amc8Id,
        currentDifficulty: 6,
      },
    });

    const unlockedSlugs = ["first-steps", "placement-complete", "streak-7", "hundred-problems"];
    for (const slug of unlockedSlugs) {
      const achievement = await prisma.achievement.findUnique({ where: { slug } });
      if (!achievement) continue;
      await prisma.userAchievement.create({
        data: { userId: demo.id, achievementId: achievement.id },
      });
    }

    // A handful of real attempts against seeded problems for the mistakes/stats views.
    const sampleAttemptSlugs = [
      { slug: "combo-casework-02", correct: false, mode: "PRACTICE" as const, reason: "INCORRECT" as const },
      { slug: "prob-conditional-01", correct: false, mode: "PRACTICE" as const, reason: "INCORRECT" as const },
      { slug: "geo-similarity-02", correct: false, mode: "PRACTICE" as const, reason: "SLOW" as const },
      { slug: "arith-fractions-01", correct: true, mode: "PRACTICE" as const },
      { slug: "geo-triangles-01", correct: true, mode: "PRACTICE" as const },
      { slug: "nt-primes-01", correct: true, mode: "PRACTICE" as const },
    ];
    for (const s of sampleAttemptSlugs) {
      const problemId = problemIdBySlug.get(s.slug);
      if (!problemId) continue;
      const attempt = await prisma.attempt.create({
        data: {
          userId: demo.id,
          problemId,
          mode: s.mode,
          answerGiven: "—",
          correct: s.correct,
          timeSeconds: s.correct ? 90 : 240,
          hintsUsed: s.correct ? 0 : 2,
        },
      });
      if (!s.correct) {
        await prisma.mistake.create({
          data: {
            userId: demo.id,
            problemId,
            reason: s.reason ?? "INCORRECT",
            nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }
      void attempt;
    }

    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId: demo.id,
        primaryCompetitionId: amc8Id,
        currentRating: 1540,
        targetRating: 1700,
        minutesPerDay: 30,
        active: true,
      },
    });

    const dayPlan: { day: number; taskType: string; topicSlug?: string; lessonSlug?: string; label: string }[] = [
      { day: 1, taskType: "LESSON", topicSlug: "algebra", label: "Algebra lesson + 5 problems" },
      { day: 2, taskType: "PRACTICE", topicSlug: "geometry", label: "Geometry + 5 problems" },
      { day: 3, taskType: "LESSON", topicSlug: "combinatorics", label: "Combinatorics lesson + 5 problems" },
      { day: 4, taskType: "PRACTICE", topicSlug: "number-theory", label: "Number Theory + 5 problems" },
      { day: 5, taskType: "TIMED_SET", label: "Mixed timed set" },
      { day: 6, taskType: "SIMULATION", label: "Competition simulation" },
      { day: 0, taskType: "REVIEW", label: "Mistake review" },
    ];
    for (const d of dayPlan) {
      await prisma.studyPlanDay.create({
        data: {
          studyPlanId: studyPlan.id,
          weekNumber: 1,
          dayOfWeek: d.day,
          taskType: d.taskType,
          topicId: d.topicSlug ? topicIdBySlug.get(d.topicSlug) : null,
          problemCount: 5,
          label: d.label,
        },
      });
    }

    void placement;
    console.log(`  Demo student account: ${demo.email} / password123`);
  } else {
    console.log(`  Demo student account already exists: ${demoEmail}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
