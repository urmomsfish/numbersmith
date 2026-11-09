import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { checkAnswer, CHOICE_LETTERS } from "@/lib/engine/scoring";
import { updateTopicAndDomainMastery } from "@/lib/engine/mastery";
import { setRating, ratingDelta, clampRating } from "@/lib/engine/rating";
import { touchDailyActivity, awardXp, recordProblemOutcome } from "@/lib/engine/xp";
import { checkAndUnlockAchievements } from "@/lib/engine/achievements";
import { earnsReward } from "@/lib/engine/reward";
import {
  FORGE_HEAL,
  RELIC_SKIP_GOLD,
  packIsFull,
  bandFor,
  centreForRating,
  HERO_MAX_HP,
  RELIC_SLOTS,
  blowDamage,
  buildRoad,
  comboFor,
  goldFor,
  hasRelic,
  isLastRegion,
  monsterByKey,
  monsterFor,
  nextRegion,
  regionSpec,
  relicChoices,
  scoreFor,
  strikeDamage,
  windupMsFor,
  windupWithRelics,
  type NodeType,
  type QuestStep,
  type Region,
  type Relic,
} from "@/lib/quest-rules";

export * from "@/lib/quest-rules";

/**
 * The Forgelands — the quest engine.
 *
 * WHERE THE RULES LIVE: the server, for the same reason they did in the
 * arcade. Health, gold, relics, enemy health and the wind-up clock are all
 * computed here from the GameRun row; the browser is told what it needs to
 * draw and nothing else. In particular it is never told the answer key until
 * the exchange has been resolved.
 *
 * The problem bank is unchanged and so is everything that hangs off it — an
 * answer here is an Attempt row, updates mastery, feeds the mistake queue and
 * pays XP under the same per-problem rule as practice. What changed is only
 * what the answer *means*: it is a blow struck, not a tick scored.
 */

// ---------------------------------------------------------------------------
// Shapes handed to the client
// ---------------------------------------------------------------------------

export type QuestQuestion = {
  problemId: string;
  question: string;
  diagram: string | null;
  format: string;
  choices: string[];
  difficulty: number;
  topicName: string;
  clockMs: number;
  elapsedMs: number;
  /** Letters a Jeweller's Loupe has already struck out. */
  struck: string[];
};

export type QuestEnemy = {
  key: string;
  name: string;
  art: string;
  tier: "COMMON" | "ELITE" | "BOSS";
  hp: number;
  maxHp: number;
  attack: number;
  taunt: string;
};

export type QuestState = {
  runId: string;
  phase: "MAP" | "BATTLE" | "REWARD" | "FORGE" | "WON" | "OVER";
  region: Region;
  regionName: string;
  regionIndex: number;
  stepIndex: number;
  roadLength: number;
  hp: number;
  maxHp: number;
  gold: number;
  relics: string[];
  score: number;
  streak: number;
  combo: number;
  answered: number;
  correct: number;
};

export type QuestView = {
  state: QuestState;
  enemy: QuestEnemy | null;
  question: QuestQuestion | null;
  /** The two ways forward, when standing on the map. */
  choices: { type: NodeType; monsterName: string | null }[];
  /** Relics on offer, when standing in a reward. */
  offered: Relic[];
};

export type StrikeResult = {
  correct: boolean;
  timedOut: boolean;
  correctAnswer: string;
  solution: string;
  /** Damage you dealt, and damage you took. */
  dealt: number;
  taken: number;
  blocked: boolean;
  enemyDown: boolean;
  heroDown: boolean;
  goldGained: number;
  view: QuestView;
};

type Row = Prisma.GameRunGetPayload<object>;

// ---------------------------------------------------------------------------
// Reading the row
// ---------------------------------------------------------------------------

function parseJsonArray(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * A stable pseudo-random number in [0, 1) derived from the run.
 *
 * Used for the relic offer. Rolling it fresh would mean a reload reshuffled
 * what is on the table, which is both a reroll exploit and simply confusing;
 * deriving it from the run id and the hero's position makes the offer a fact
 * about where you are standing rather than about when you last loaded.
 */
function seededRoll(...parts: (string | number)[]): number {
  const s = parts.join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function parseRoad(json: string): QuestStep[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? (v as QuestStep[]) : [];
  } catch {
    return [];
  }
}

function stateOf(run: Row): QuestState {
  const relics = parseJsonArray(run.relics);
  const region = run.region as Region;
  return {
    runId: run.id,
    phase: run.status === "OVER" ? "OVER" : (run.phase as QuestState["phase"]),
    region,
    regionName: regionSpec(region).name,
    regionIndex: regionSpec(region).index,
    stepIndex: run.stepIndex,
    roadLength: parseRoad(run.road).length,
    hp: run.hp,
    maxHp: run.maxHp,
    gold: run.gold,
    relics,
    score: run.score,
    streak: run.streak,
    combo: comboFor(run.streak, relics),
    answered: run.answered,
    correct: run.correct,
  };
}

function enemyOf(run: Row): QuestEnemy | null {
  if (!run.enemyKey) return null;
  const m = monsterByKey(run.enemyKey);
  if (!m) return null;
  return {
    key: m.key,
    name: m.name,
    art: m.art,
    tier: m.tier,
    hp: run.enemyHp,
    maxHp: run.enemyMaxHp,
    attack: m.attack,
    taunt: m.taunt,
  };
}

/** The choices on offer at the hero's current position on the road. */
function choicesOf(run: Row) {
  const road = parseRoad(run.road);
  const step = road[run.stepIndex];
  if (!step) return [];
  return step.map((n) => ({
    type: n.type,
    monsterName: n.monster ? (monsterByKey(n.monster)?.name ?? null) : null,
  }));
}

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

type PickedRow = {
  id: string;
  question: string;
  diagram: string | null;
  format: string;
  choices: string | null;
  answer: string;
  difficulty: number;
  topicName: string;
};

/** The student's difficulty centre, read from their OVERALL rating. */
async function difficultyCentre(userId: string): Promise<number> {
  const rating = await prisma.rating.findUnique({
    where: { userId_category: { userId, category: "OVERALL" } },
  });
  return centreForRating(rating?.value ?? 1000);
}

/**
 * Picks the next problem.
 *
 * Difficulty is anchored on the player, lifted by the region and by how deep
 * into the road they are — so the Sunken Vault genuinely asks harder questions
 * than the Emberwastes did, without ever leaving the band the player can
 * actually fight in. Raw SQL for the same reason as before: this is the hot
 * path of a game and `ORDER BY random()` over fifteen thousand rows is one
 * round trip where Prisma needs two.
 */
async function pickProblem(
  centre: number,
  region: Region,
  stepIndex: number,
  servedIds: string[]
): Promise<PickedRow | null> {
  const lift = regionSpec(region).difficultyLift + Math.floor(stepIndex / 3);
  const { floor, ceiling } = bandFor(centre + lift);

  const stages = [
    Prisma.sql`p.difficulty BETWEEN ${floor} AND ${ceiling} AND p."estimatedTimeSeconds" <= 120`,
    Prisma.sql`p.difficulty BETWEEN ${Math.max(1, floor - 1)} AND ${Math.min(10, ceiling + 1)}`,
    Prisma.sql`TRUE`,
  ];

  for (const stage of stages) {
    const rows = await prisma.$queryRaw<PickedRow[]>(Prisma.sql`
      SELECT p.id, p.question, p.diagram, p.format, p.choices, p.answer, p.difficulty,
             t.name AS "topicName"
      FROM "Problem" p
      JOIN "Topic" t ON t.id = p."topicId"
      WHERE p."isPublished" AND NOT p."isPlacement"
        AND NOT (p.id = ANY(${servedIds}::text[]))
        AND (${stage})
      ORDER BY random()
      LIMIT 1
    `);
    if (rows[0]) return rows[0];
  }
  return null;
}

/** Letters a Loupe strikes out — never the right one. */
function struckLetters(p: PickedRow, relics: string[]): string[] {
  if (!hasRelic(relics, "loupe")) return [];
  const choices = p.choices ? (JSON.parse(p.choices) as string[]) : [];
  if (choices.length < 3) return [];
  const wrong = CHOICE_LETTERS.slice(0, choices.length).filter((l) => l !== p.answer);
  return wrong.length ? [wrong[Math.floor(Math.random() * wrong.length)]] : [];
}

function toQuestion(p: PickedRow, clockMs: number, struck: string[]): QuestQuestion {
  return {
    problemId: p.id,
    question: p.question,
    diagram: p.diagram,
    format: p.format,
    choices: p.choices ? (JSON.parse(p.choices) as string[]) : [],
    difficulty: p.difficulty,
    topicName: p.topicName,
    clockMs,
    elapsedMs: 0,
    struck,
  };
}

// ---------------------------------------------------------------------------
// Starting and viewing
// ---------------------------------------------------------------------------

function rolls(n: number): number[] {
  return Array.from({ length: n }, () => Math.random());
}

export async function startQuest(userId: string) {
  await prisma.gameRun.updateMany({
    where: { userId, status: "IN_PROGRESS" },
    data: { status: "OVER", endedAt: new Date(), pendingProblemId: null, pendingServedAt: null },
  });

  const region: Region = "EMBERWASTES";
  const road = buildRoad(region, rolls(40));

  const run = await prisma.gameRun.create({
    data: {
      userId,
      mode: "QUEST",
      status: "IN_PROGRESS",
      phase: "MAP",
      region,
      road: JSON.stringify(road),
      stepIndex: 0,
      hp: HERO_MAX_HP,
      maxHp: HERO_MAX_HP,
      lives: 1,
    },
  });
  return run.id;
}

export async function questView(runId: string): Promise<QuestView | null> {
  const run = await prisma.gameRun.findUnique({ where: { id: runId } });
  if (!run) return null;

  let question: QuestQuestion | null = null;
  if (run.phase === "BATTLE" && run.pendingProblemId) {
    const p = await prisma.problem.findUnique({
      where: { id: run.pendingProblemId },
      include: { topic: { select: { name: true } } },
    });
    if (p) {
      // Re-stamp on load. A reload restarts the current wind-up, which is a
      // mercy rather than an exploit: the enemy's health is unchanged and the
      // problem cannot be re-scored.
      await prisma.gameRun.update({
        where: { id: runId },
        data: { pendingServedAt: new Date() },
      });
      question = toQuestion(
        {
          id: p.id,
          question: p.question,
          diagram: p.diagram,
          format: p.format,
          choices: p.choices,
          answer: p.answer,
          difficulty: p.difficulty,
          topicName: p.topic.name,
        },
        run.pendingClockMs,
        struckLetters(
          {
            id: p.id,
            question: p.question,
            diagram: p.diagram,
            format: p.format,
            choices: p.choices,
            answer: p.answer,
            difficulty: p.difficulty,
            topicName: p.topic.name,
          },
          parseJsonArray(run.relics)
        )
      );
    }
  }

  return {
    state: stateOf(run),
    enemy: enemyOf(run),
    question,
    choices: run.phase === "MAP" ? choicesOf(run) : [],
    offered:
      run.phase === "REWARD" && !packIsFull(parseJsonArray(run.relics))
        ? relicChoices(
            parseJsonArray(run.relics),
            seededRoll(run.id, run.region, run.stepIndex, parseJsonArray(run.relics).length)
          )
        : [],
  };
}

// ---------------------------------------------------------------------------
// Travelling
// ---------------------------------------------------------------------------

/**
 * Takes the chosen road and resolves whatever is standing on it.
 *
 * A fight puts an enemy up and serves the first problem; a cache or a forge
 * resolves immediately and moves the hero on. Everything is written in one
 * update so a dropped connection cannot leave a run half-moved.
 */
export async function travel(runId: string, option: number): Promise<QuestView> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  if (run.status !== "IN_PROGRESS") throw new Error("This quest is already over.");
  if (run.phase !== "MAP") throw new Error("You are not on the road.");

  const road = parseRoad(run.road);
  const step = road[run.stepIndex];
  if (!step) throw new Error("The road ends here.");
  const node = step[Math.max(0, Math.min(step.length - 1, option))];
  const region = run.region as Region;
  const relics = parseJsonArray(run.relics);

  if (node.type === "FORGE") {
    const healed = Math.min(run.maxHp, run.hp + FORGE_HEAL);
    await prisma.gameRun.update({
      where: { id: runId },
      data: { hp: healed, stepIndex: run.stepIndex + 1, phase: "MAP" },
    });
    return (await questView(runId))!;
  }

  if (node.type === "TREASURE") {
    await prisma.gameRun.update({
      where: { id: runId },
      data: { phase: "REWARD", stepIndex: run.stepIndex + 1 },
    });
    return (await questView(runId))!;
  }

  // A fight. Stand the monster up and serve the first exchange.
  const m = node.monster ? monsterByKey(node.monster) : null;
  const monster = m ?? monsterFor(region, node.type, Math.random());
  const centre = await difficultyCentre(run.userId);
  const served = parseJsonArray(run.servedIds);
  const p = await pickProblem(centre, region, run.stepIndex, served);
  if (!p) throw new Error("The bank has no more problems for this quest.");

  const clockMs = windupWithRelics(windupMsFor(region, monster), relics);
  await prisma.gameRun.update({
    where: { id: runId },
    data: {
      phase: "BATTLE",
      enemyKey: monster.key,
      enemyHp: monster.hp,
      enemyMaxHp: monster.hp,
      wardSpent: false,
      pendingProblemId: p.id,
      pendingServedAt: new Date(),
      pendingClockMs: clockMs,
      servedIds: JSON.stringify([...served, p.id]),
    },
  });
  return (await questView(runId))!;
}

// ---------------------------------------------------------------------------
// Fighting
// ---------------------------------------------------------------------------

/**
 * Resolves one exchange: your answer, then the enemy's reply.
 *
 * `answerGiven` empty means the wind-up completed — the client's clock is
 * believed about *whether* it ran out, because lying about that only hurts the
 * player, but never about *when*, which is recomputed from `pendingServedAt`.
 */
export async function strike(
  runId: string,
  problemId: string,
  answerGiven: string
): Promise<StrikeResult> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  if (run.status !== "IN_PROGRESS") throw new Error("This quest is already over.");
  if (run.phase !== "BATTLE") throw new Error("There is nothing to fight.");
  // Guards a double submit and a forged id at once: the only answerable
  // problem is the one the server last served.
  if (run.pendingProblemId !== problemId) throw new Error("That problem is not in play.");

  const monster = run.enemyKey ? monsterByKey(run.enemyKey) : null;
  if (!monster) throw new Error("Your opponent has gone.");

  const relics = parseJsonArray(run.relics);
  const region = run.region as Region;
  const clockMs = run.pendingClockMs;
  const servedAt = run.pendingServedAt ?? new Date();
  const elapsedMs = Date.now() - servedAt.getTime();
  const fractionLeft = Math.max(0, Math.min(1, (clockMs - elapsedMs) / clockMs));

  const [problem, prior] = await Promise.all([
    prisma.problem.findUniqueOrThrow({ where: { id: problemId } }),
    prisma.attempt.findMany({
      where: { userId: run.userId, problemId },
      select: { correct: true },
    }),
  ]);

  // Two seconds of slack for the round trip, so an answer sent in time is not
  // killed by latency.
  const timedOut = !answerGiven || elapsedMs > clockMs + 2000;
  const correct = !timedOut && checkAnswer(problem, answerGiven);
  const combo = comboFor(run.streak, relics);

  const dealt = correct
    ? strikeDamage({ difficulty: problem.difficulty, combo, fractionLeft, relics })
    : 0;

  // A Wardstone eats the first blow of each fight, once.
  const wardAvailable = hasRelic(relics, "wardstone") && !run.wardSpent;
  const blocked = !correct && wardAvailable;
  const taken = correct ? 0 : blocked ? 0 : blowDamage(monster.attack, relics);

  const enemyHp = Math.max(0, run.enemyHp - dealt);
  const heroHp = Math.max(0, run.hp - taken);
  const enemyDown = enemyHp === 0;
  const heroDown = heroHp === 0;
  const goldGained = enemyDown ? goldFor(monster, relics) : 0;
  const healed = enemyDown && hasRelic(relics, "emberheart") ? 5 : 0;

  const nextStreak = correct ? run.streak + 1 : 0;
  const gainedScore = correct ? scoreFor({ damage: dealt, tier: monster.tier }) : 0;

  const paysXp = earnsReward({
    mode: "GAUNTLET",
    correct,
    attemptedBefore: prior.length > 0,
    solvedBefore: prior.some((a) => a.correct),
  });

  const served = parseJsonArray(run.servedIds);
  const centre = await difficultyCentre(run.userId);

  // The next exchange is only needed if the fight continues. Picking it runs
  // alongside the bookkeeping rather than in front of it.
  const [nextProblem] = await Promise.all([
    enemyDown || heroDown ? null : pickProblem(centre, region, run.stepIndex, served),
    prisma.attempt.create({
      data: {
        userId: run.userId,
        problemId,
        mode: "GAUNTLET",
        answerGiven: answerGiven || null,
        correct,
        timeSeconds: Math.round(Math.min(elapsedMs / 1000, clockMs / 1000)),
      },
    }),
    updateTopicAndDomainMastery(run.userId, problem.topicId, correct),
    // A miss goes to the mistake queue exactly as it would in practice — the
    // whole argument for building this on the real bank is that what you drop
    // here comes back to you later.
    correct
      ? Promise.resolve()
      : prisma.mistake.upsert({
          where: { userId_problemId: { userId: run.userId, problemId } },
          update: {
            reason: timedOut ? "SKIPPED" : "INCORRECT",
            resolved: false,
            nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
          create: {
            userId: run.userId,
            problemId,
            reason: timedOut ? "SKIPPED" : "INCORRECT",
            nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
        }),
    (async () => {
      await recordProblemOutcome(run.userId, correct);
      if (paysXp) await awardXp(run.userId, correct ? 6 + problem.difficulty * 2 : 2);
    })(),
  ]);

  // Where the run stands after the exchange.
  const road = parseRoad(run.road);
  const clearedRegion = enemyDown && monster.tier === "BOSS";
  const wonQuest = clearedRegion && isLastRegion(region);

  let phase: string = run.phase;
  let newRegion = region;
  let newRoad = run.road;
  let newStep = run.stepIndex;

  if (heroDown) {
    phase = "OVER";
  } else if (wonQuest) {
    phase = "WON";
  } else if (clearedRegion) {
    // A new region: fresh road, back to its start.
    newRegion = nextRegion(region)!;
    newRoad = JSON.stringify(buildRoad(newRegion, rolls(40)));
    newStep = 0;
    phase = "REWARD";
  } else if (enemyDown) {
    // Champions and Wardens pay a relic; ordinary things pay gold and the road.
    phase = monster.tier === "ELITE" ? "REWARD" : "MAP";
    newStep = run.stepIndex + 1;
  }

  void road;
  const updated = await prisma.gameRun.update({
    where: { id: runId },
    data: {
      phase,
      region: newRegion,
      road: newRoad,
      stepIndex: newStep,
      hp: Math.min(run.maxHp, heroHp + healed),
      gold: run.gold + goldGained,
      score: run.score + gainedScore,
      streak: nextStreak,
      bestStreak: Math.max(run.bestStreak, nextStreak),
      answered: run.answered + 1,
      correct: run.correct + (correct ? 1 : 0),
      enemyHp,
      wardSpent: run.wardSpent || blocked,
      ...(enemyDown || heroDown
        ? { enemyKey: enemyDown ? null : run.enemyKey, pendingProblemId: null, pendingServedAt: null }
        : nextProblem
          ? {
              pendingProblemId: nextProblem.id,
              pendingServedAt: new Date(),
              servedIds: JSON.stringify([...served, nextProblem.id]),
            }
          : {}),
    },
  });

  if (heroDown) await closeQuest(runId, false);

  return {
    correct,
    timedOut,
    correctAnswer: problem.answer,
    solution: problem.solution,
    dealt,
    taken,
    blocked,
    enemyDown,
    heroDown,
    goldGained,
    view: {
      state: stateOf(updated),
      enemy: enemyDown ? null : enemyOf(updated),
      question:
        !enemyDown && !heroDown && nextProblem
          ? toQuestion(nextProblem, clockMs, struckLetters(nextProblem, relics))
          : null,
      choices: updated.phase === "MAP" ? choicesOf(updated) : [],
      offered: [],
    },
  };
}

// ---------------------------------------------------------------------------
// Rewards
// ---------------------------------------------------------------------------

export async function takeRelic(runId: string, relic: string): Promise<QuestView> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  if (run.status !== "IN_PROGRESS") throw new Error("This quest is already over.");
  if (run.phase !== "REWARD") throw new Error("There is nothing to take.");

  const held = parseJsonArray(run.relics);
  if (held.length >= RELIC_SLOTS) {
    throw new Error("Your pack is full — leave it and take the gold instead.");
  }
  const next = held.includes(relic) ? held : [...held, relic];

  await prisma.gameRun.update({
    where: { id: runId },
    data: { relics: JSON.stringify(next), phase: "MAP" },
  });
  return (await questView(runId))!;
}

/**
 * Leaves the spoils and takes gold instead.
 *
 * The only way out of a reward when the pack is full, and a legitimate choice
 * even when it is not — a relic you do not want is worth less than the coin.
 */
export async function skipReward(runId: string): Promise<QuestView> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  if (run.status !== "IN_PROGRESS") throw new Error("This quest is already over.");
  if (run.phase !== "REWARD") throw new Error("There is nothing to leave.");

  await prisma.gameRun.update({
    where: { id: runId },
    data: { gold: run.gold + RELIC_SKIP_GOLD, phase: "MAP" },
  });
  return (await questView(runId))!;
}

// ---------------------------------------------------------------------------
// Ending
// ---------------------------------------------------------------------------

export async function closeQuest(runId: string, byChoice = true): Promise<QuestState> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  if (run.status === "IN_PROGRESS") {
    await prisma.gameRun.update({
      where: { id: runId },
      data: {
        status: "OVER",
        endedAt: new Date(),
        phase: run.phase === "WON" ? "WON" : "OVER",
        pendingProblemId: null,
        pendingServedAt: null,
      },
    });

    // The rating nudge, scaled down hard and capped: a quest is a speed test
    // on problems chosen to be inside the player's reach, so it is weaker
    // evidence than a paper, and a long run must not be able to rewrite a
    // rating just by being long.
    if (run.answered > 0) {
      const accuracy = run.correct / run.answered;
      const existing = await prisma.rating.upsert({
        where: { userId_category: { userId: run.userId, category: "OVERALL" } },
        update: {},
        create: { userId: run.userId, category: "OVERALL", value: 1000 },
      });
      const centre = centreForRating(existing.value);
      const per = ratingDelta(existing.value, Math.max(1, centre), accuracy >= 0.6);
      const scaled = Math.round(per * Math.min(1.5, run.answered / 10));
      if (scaled !== 0) {
        await setRating(run.userId, "OVERALL", clampRating(existing.value + scaled), "Quest");
      }
      await touchDailyActivity(run.userId);
      await checkAndUnlockAchievements(run.userId);
    }
  }
  void byChoice;
  const fresh = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  return stateOf(fresh);
}

/** Furthest region reached across finished quests, for the lobby. */
export async function questRecord(userId: string) {
  const [best, runs] = await Promise.all([
    prisma.gameRun.findFirst({
      where: { userId, mode: "QUEST", status: "OVER" },
      orderBy: { score: "desc" },
      select: { score: true },
    }),
    prisma.gameRun.findMany({
      where: { userId, mode: "QUEST", status: "OVER", answered: { gt: 0 } },
      orderBy: { endedAt: "desc" },
      take: 5,
      select: { id: true, score: true, region: true, phase: true, correct: true, answered: true },
    }),
  ]);
  return { best: best?.score ?? 0, runs };
}
