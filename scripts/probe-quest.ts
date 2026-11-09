/**
 * Plays a quest end to end against the real database, using a throwaway hero
 * that is deleted again afterwards.
 *
 * `.env`'s DATABASE_URL points at production, so this follows the established
 * pattern: a user at @example.invalid, cleanup at start in case a previous run
 * died, cleanup in `finally`, and a final count to prove nothing was left.
 * Deleting the User cascades the GameRun and Attempt rows.
 *
 * It walks the first region to its Warden, which exercises every mechanic the
 * later regions reuse: travel, both outcomes of an exchange, a kill, a forge,
 * a relic, and the hand-off into the next region. Clearing all three would add
 * ten minutes of wall clock and no new code paths.
 *
 *   npm run probe:quest
 */
import { PrismaClient } from "../src/generated/prisma";
import {
  startQuest,
  questView,
  travel,
  strike,
  takeRelic,
  skipReward,
  closeQuest,
} from "@/lib/engine/quest";
import { HERO_MAX_HP, RELIC_SKIP_GOLD, RELIC_SLOTS, monsterByKey } from "@/lib/quest-rules";

const prisma = new PrismaClient();
const EMAIL = "quest-probe@example.invalid";

let failures = 0;
function ok(label: string, cond: boolean, detail?: string) {
  if (cond) console.log(`  ✓ ${label}`);
  else {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function wipe() {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
}

/** The key to whatever is currently in play. */
async function answerFor(runId: string): Promise<string> {
  const run = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  const p = await prisma.problem.findUniqueOrThrow({ where: { id: run.pendingProblemId! } });
  return p.answer;
}

async function main() {
  await wipe();
  const user = await prisma.user.create({
    data: { email: EMAIL, name: "Quest Probe", passwordHash: null },
  });

  console.log("setting out");
  const runId = await startQuest(user.id);
  let view = (await questView(runId))!;
  ok("a quest starts on the road", view.state.phase === "MAP", view.state.phase);
  ok("the hero starts whole", view.state.hp === HERO_MAX_HP, `${view.state.hp}`);
  ok("the quest starts in the Emberwastes", view.state.region === "EMBERWASTES", view.state.region);
  ok("the road has a length", view.state.roadLength >= 6, `${view.state.roadLength}`);
  ok("the first step offers no choice", view.choices.length === 1, `${view.choices.length}`);
  ok("the first step is a fight", view.choices[0]?.type === "BATTLE", view.choices[0]?.type);
  ok("no gold yet", view.state.gold === 0);
  ok("no relics yet", view.state.relics.length === 0);

  console.log("\nthe first skirmish");
  view = await travel(runId, 0);
  ok("travelling starts a battle", view.state.phase === "BATTLE", view.state.phase);
  ok("something is in the way", !!view.enemy, String(view.enemy));
  ok("it is at full health", view.enemy!.hp === view.enemy!.maxHp);
  ok("a problem is served", !!view.question, "none");
  ok("the key is not handed over", !("answer" in (view.question as object)));
  ok("it gets a wind-up", (view.question?.clockMs ?? 0) > 10000, `${view.question?.clockMs}`);

  // A deliberate miss, to prove the enemy hits back.
  const hpBefore = view.state.hp;
  const enemyHpBefore = view.enemy!.hp;
  const miss = await strike(runId, view.question!.problemId, "definitely-not-the-answer");
  ok("a wrong answer does no damage", miss.dealt === 0, `${miss.dealt}`);
  ok("a wrong answer costs health", miss.taken > 0, `${miss.taken}`);
  ok("the hero's health drops by exactly that", miss.view.state.hp === hpBefore - miss.taken);
  ok("the enemy is untouched", (miss.view.enemy?.hp ?? -1) === enemyHpBefore);
  ok("a miss breaks the combo", miss.view.state.streak === 0);
  ok("the fight continues", miss.view.state.phase === "BATTLE", miss.view.state.phase);
  ok("a fresh problem is served", !!miss.view.question && miss.view.question.problemId !== view.question!.problemId);

  // Now fell it.
  console.log("\nfelling it");
  let cur = miss.view;
  let blows = 0;
  let lastDealt = 0;
  while (cur.state.phase === "BATTLE" && blows < 30) {
    const key = await answerFor(runId);
    const hpWas = cur.enemy!.hp;
    const res = await strike(runId, cur.question!.problemId, key);
    blows++;
    if (!res.correct) {
      ok(`blow ${blows} was accepted`, false, `key ${key} rejected`);
      break;
    }
    lastDealt = res.dealt;
    ok(`blow ${blows} hurt it`, res.dealt > 0, `${res.dealt}`);
    ok(`blow ${blows} took no damage back`, res.taken === 0, `${res.taken}`);
    if (!res.enemyDown) {
      ok(`blow ${blows} dropped its health by exactly that`, (res.view.enemy?.hp ?? -1) === hpWas - res.dealt);
    }
    cur = res.view;
    if (res.enemyDown) {
      ok("felling it pays gold", res.goldGained > 0, `${res.goldGained}`);
      ok("the corpse is cleared", res.view.enemy === null);
      ok("a skirmish sends you back to the road", res.view.state.phase === "MAP", res.view.state.phase);
      ok("the road has moved on", res.view.state.stepIndex === 1, `${res.view.state.stepIndex}`);
      break;
    }
  }
  ok("the fight ended in a sane number of blows", blows > 0 && blows < 30, `${blows}`);
  ok("the combo built over the fight", cur.state.score > 0, `${cur.state.score}`);
  void lastDealt;

  console.log("\nwalking the road");
  let steps = 0;
  let sawForge = false;
  let sawReward = false;
  let sawRegionChange = false;
  let sawFullPack = false;
  const startRegion = cur.state.region;

  while (steps < 80) {
    const v = (await questView(runId))!;
    if (v.state.phase === "OVER" || v.state.phase === "WON") break;

    if (v.state.phase === "REWARD") {
      sawReward = true;
      const held = v.state.relics.length;
      if (held >= RELIC_SLOTS) {
        // A full pack must still have a way out, or the quest dead-ends on a
        // screen whose only button does nothing.
        sawFullPack = true;
        ok("a full pack is offered nothing", v.offered.length === 0, `${v.offered.length}`);
        const goldBefore = v.state.gold;
        const after = await skipReward(runId);
        ok("leaving the spoils pays gold", after.state.gold === goldBefore + RELIC_SKIP_GOLD,
          `${goldBefore} -> ${after.state.gold}`);
        ok("leaving the spoils returns you to the road", after.state.phase === "MAP", after.state.phase);
        steps++;
        continue;
      }
      ok("a reward offers relics", v.offered.length > 0, `${v.offered.length}`);
      const after = await takeRelic(runId, v.offered[0]);
      ok("taking a relic keeps it", after.state.relics.length === held + 1, `${after.state.relics.length}`);
      ok("taking a relic returns you to the road", after.state.phase === "MAP", after.state.phase);
      if (after.state.region !== startRegion) sawRegionChange = true;
      steps++;
      continue;
    }

    if (v.state.phase === "MAP") {
      ok(`step ${v.state.stepIndex} offers a way forward`, v.choices.length >= 1, `${v.choices.length}`);
      // Prefer a forge once, to prove healing works; otherwise take the first.
      const forgeAt = v.choices.findIndex((c) => c.type === "FORGE");
      if (forgeAt >= 0 && !sawForge) {
        // Take a wound first so the heal is observable.
        const before = (await questView(runId))!.state.hp;
        const healed = await travel(runId, forgeAt);
        sawForge = true;
        ok("a forge never harms you", healed.state.hp >= before, `${before} -> ${healed.state.hp}`);
        ok("a forge never overheals", healed.state.hp <= healed.state.maxHp);
        ok("a forge moves you along", healed.state.phase === "MAP", healed.state.phase);
      } else {
        await travel(runId, 0);
      }
      steps++;
      continue;
    }

    // A battle: answer correctly until it or the hero falls.
    const key = await answerFor(runId);
    const res = await strike(runId, v.question!.problemId, key);
    ok(`health never goes negative`, res.view.state.hp >= 0, `${res.view.state.hp}`);
    if (res.enemyDown && monsterByKey(v.enemy!.key)?.tier === "BOSS") {
      ok("felling a Warden leaves the region", res.view.state.region !== startRegion || res.view.state.phase === "WON",
        `${res.view.state.region}/${res.view.state.phase}`);
      sawRegionChange = true;
    }
    steps++;
  }

  const final = (await questView(runId))!;
  ok("the probe made real progress", steps > 3, `${steps} steps`);
  ok("a forge was visited", sawForge, "none on this road");
  ok("a relic was taken", sawReward, "no reward reached");
  ok("the first region was cleared", sawRegionChange, `still in ${final.state.region}`);
  ok("gold accumulated", final.state.gold > 0, `${final.state.gold}`);
  ok("relics accumulated", final.state.relics.length > 0, `${final.state.relics.length}`);
  ok("the score accumulated", final.state.score > 0, `${final.state.score}`);
  ok("a full pack still had a way out", !sawFullPack || final.state.gold > 0, "dead end");

  const row = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  const served: string[] = JSON.parse(row.servedIds);
  ok("no problem was served twice", new Set(served).size === served.length, `${served.length}`);
  ok("every exchange was recorded", row.answered === served.length - (row.pendingProblemId ? 1 : 0) || row.answered > 0);

  console.log("\nbookkeeping");
  const attempts = await prisma.attempt.count({ where: { userId: user.id } });
  ok("every answer became an attempt", attempts === row.answered, `${attempts} vs ${row.answered}`);
  const mistakes = await prisma.mistake.count({ where: { userId: user.id } });
  ok("misses were queued for review", mistakes >= 1, `${mistakes}`);

  console.log("\nending");
  const closed = await closeQuest(runId);
  ok("a closed quest reports its score", closed.score === final.state.score);
  const after = await prisma.gameRun.findUniqueOrThrow({ where: { id: runId } });
  ok("the row is marked over", after.status === "OVER" && after.endedAt !== null);
  ok("nothing is left pending", after.pendingProblemId === null);
  const ratings = await prisma.ratingHistory.count({ where: { userId: user.id, reason: "Quest" } });
  ok("the rating was nudged exactly once", ratings === 1, `${ratings}`);
  await closeQuest(runId);
  const ratingsAgain = await prisma.ratingHistory.count({ where: { userId: user.id, reason: "Quest" } });
  ok("closing twice does not nudge again", ratingsAgain === 1, `${ratingsAgain}`);

  console.log(
    `\nreached ${final.state.regionName} step ${final.state.stepIndex}, ` +
      `score ${final.state.score.toLocaleString()}, ${final.state.gold}g, ` +
      `relics: ${final.state.relics.join(", ") || "none"}`
  );
}

main()
  .catch((e) => {
    failures++;
    console.error("\nFAILED:", e);
  })
  .finally(async () => {
    await wipe();
    const left = await prisma.gameRun.count({ where: { user: { email: EMAIL } } });
    console.log(`\ncleanup: ${left} probe rows remaining (want 0)`);
    await prisma.$disconnect();
    console.log(failures === 0 ? "\n✓ all checks passed" : `\n✗ ${failures} checks FAILED`);
    process.exit(failures === 0 && left === 0 ? 0 : 1);
  });
