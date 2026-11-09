/**
 * Exhaustive check of the quest's rules.
 *
 * Everything in src/lib/quest-rules.ts is pure, so the design can be checked
 * over its whole useful domain rather than spot-tested: every region, every
 * monster, every relic combination that matters, and ten thousand generated
 * roads.
 *
 * The roads are the part most worth checking. A road is generated once and
 * then walked for ten minutes, so a generator that can emit a dead end, a
 * choice between two identical things, or a region with no way to heal is a
 * bug the player meets only after investing the time — exactly the kind that
 * never shows up in casual testing.
 *
 *   npm run verify:quest
 */
import {
  HERO_MAX_HP,
  MONSTERS,
  NODE_TYPES,
  REGIONS,
  RELICS,
  RELIC_SLOTS,
  RELIC_SPECS,
  MAX_COMBO,
  blowDamage,
  buildRoad,
  bandFor,
  centreForRating,
  comboFor,
  goldFor,
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
  type Region,
} from "../src/lib/quest-rules";

let failures = 0;
let checks = 0;

function ok(label: string, condition: boolean, detail?: string) {
  checks++;
  if (!condition) {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}
function eq(label: string, actual: unknown, expected: unknown) {
  ok(label, actual === expected, `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

console.log("The Forgelands\n");

// --- regions ------------------------------------------------------------
console.log("regions");
for (const r of REGIONS) {
  const spec = regionSpec(r as Region);
  ok("every region has a spec", spec?.region === r, r);
  ok("a region is long enough to be a journey", spec.length >= 6, `${r} ${spec.length}`);
  ok("a wind-up is long enough to think in", spec.windupSeconds >= 30, `${r}`);
  for (const key of ["skyTop", "skyBottom", "ground", "rock", "accent"] as const) {
    ok(`${r} palette has ${key}`, /^#[0-9a-f]{6}$/i.test(spec.palette[key]), spec.palette[key]);
  }
}
ok("regions get harder", regionSpec("SUNKEN_VAULT").difficultyLift > regionSpec("EMBERWASTES").difficultyLift);
ok("regions get faster", regionSpec("SUNKEN_VAULT").windupSeconds < regionSpec("EMBERWASTES").windupSeconds);
ok("regions get longer", regionSpec("SUNKEN_VAULT").length > regionSpec("EMBERWASTES").length);
eq("the last region is last", isLastRegion("SUNKEN_VAULT"), true);
eq("the first region is not", isLastRegion("EMBERWASTES"), false);
eq("regions chain", nextRegion("EMBERWASTES"), "GLASS_REACH");
eq("the chain ends", nextRegion("SUNKEN_VAULT"), null);

// --- monsters -----------------------------------------------------------
console.log("monsters");
const keys = new Set<string>();
for (const m of MONSTERS) {
  ok("monster keys are unique", !keys.has(m.key), m.key);
  keys.add(m.key);
  ok("a monster can be looked up", monsterByKey(m.key)?.key === m.key, m.key);
  ok("it has health worth chipping at", m.hp >= 20, `${m.key} ${m.hp}`);
  ok("it hits for something", m.attack > 0, m.key);
  // Nothing may one-shot a healthy hero, or a single slip ends a ten-minute
  // run with no chance to react.
  ok("nothing one-shots a full-health hero", m.attack < HERO_MAX_HP / 2, `${m.key} hits ${m.attack}`);
  ok("it has a taunt", m.taunt.length > 10, m.key);
  ok("it has art", m.art.length > 0, m.key);
}
for (const r of REGIONS) {
  for (const tier of ["COMMON", "ELITE", "BOSS"] as const) {
    const pool = MONSTERS.filter((m) => m.region === r && m.tier === tier);
    ok(`${r} has a ${tier}`, pool.length > 0, `${pool.length}`);
  }
  // Every roll must land on something from that region, at the right tier.
  for (const type of NODE_TYPES) {
    if (type === "TREASURE" || type === "FORGE") continue;
    for (let i = 0; i < 100; i++) {
      const m = monsterFor(r as Region, type, i / 100);
      const wantTier = type === "BOSS" ? "BOSS" : type === "ELITE" ? "ELITE" : "COMMON";
      ok("a roll lands on the right tier", m.tier === wantTier, `${r}/${type} -> ${m.key}`);
      ok("a roll stays in the region", m.region === r, `${r}/${type} -> ${m.key}`);
    }
  }
}
// Bosses must actually be a step up, or the climax is an anticlimax.
for (const r of REGIONS) {
  const boss = MONSTERS.find((m) => m.region === r && m.tier === "BOSS")!;
  const commons = MONSTERS.filter((m) => m.region === r && m.tier === "COMMON");
  ok("a boss outlasts every common", commons.every((c) => boss.hp > c.hp * 2), r);
  ok("a boss hits harder than every common", commons.every((c) => boss.attack > c.attack), r);
}

console.log("wind-ups");
for (const r of REGIONS) {
  for (const m of MONSTERS.filter((x) => x.region === r)) {
    const ms = windupMsFor(r as Region, m);
    ok("a wind-up is a real amount of time", ms >= 20000, `${m.key} ${ms}ms`);
    ok("a wind-up is not forever", ms <= 90000, `${m.key} ${ms}ms`);
    ok(
      "an hourglass always helps",
      windupWithRelics(ms, ["hourglass"]) > ms,
      m.key
    );
  }
}

// --- combat -------------------------------------------------------------
console.log("combat");
for (let streak = 0; streak <= 30; streak++) {
  const plain = comboFor(streak, []);
  const focused = comboFor(streak, ["focus"]);
  ok("combo is at least 1", plain >= 1, `${streak}`);
  ok("combo is capped", plain <= MAX_COMBO, `${streak} -> ${plain}`);
  ok("focus is never worse", focused >= plain, `${streak}`);
  ok("combo never falls as a streak grows", comboFor(streak + 1, []) >= plain);
}
ok("focus really does build faster", comboFor(2, ["focus"]) > comboFor(2, []));

for (let d = 1; d <= 10; d++) {
  for (const combo of [1, 2, 3, 4]) {
    for (const f of [0, 0.5, 1]) {
      const dmg = strikeDamage({ difficulty: d, combo, fractionLeft: f, relics: [] });
      ok("a strike always lands for something", dmg >= 1, `d${d} c${combo} f${f}`);
      ok("damage is a whole number", Number.isInteger(dmg));
      if (d > 1) {
        ok(
          "harder problems hit harder",
          dmg > strikeDamage({ difficulty: d - 1, combo, fractionLeft: f, relics: [] }),
          `d${d} c${combo}`
        );
      }
      if (combo > 1) {
        ok(
          "a bigger combo hits harder",
          dmg > strikeDamage({ difficulty: d, combo: combo - 1, fractionLeft: f, relics: [] })
        );
      }
      ok(
        "a whetstone always helps",
        strikeDamage({ difficulty: d, combo, fractionLeft: f, relics: ["whetstone"] }) >= dmg
      );
    }
  }
}
ok(
  "answering faster hits harder",
  strikeDamage({ difficulty: 5, combo: 1, fractionLeft: 1, relics: [] }) >
    strikeDamage({ difficulty: 5, combo: 1, fractionLeft: 0, relics: [] })
);

for (const m of MONSTERS) {
  const plain = blowDamage(m.attack, []);
  const warded = blowDamage(m.attack, ["bulwark"]);
  ok("a blow always hurts a little", plain >= 1, m.key);
  ok("a bulwark always helps", warded <= plain, m.key);
  ok("a bulwark never heals you", warded >= 1, m.key);
}

// The fight has to be winnable and losable. A hero at full health answering
// everything right must be able to fell a Warden; one answering everything
// wrong must die, and neither should take absurdly long.
console.log("balance");
for (const r of REGIONS) {
  const boss = MONSTERS.find((m) => m.region === r && m.tier === "BOSS")!;
  const typical = strikeDamage({ difficulty: 5, combo: 2, fractionLeft: 0.5, relics: [] });
  const blows = Math.ceil(boss.hp / typical);
  ok("a Warden falls in a sane number of blows", blows >= 4 && blows <= 20, `${r}: ${blows}`);
  const survives = Math.ceil(HERO_MAX_HP / blowDamage(boss.attack, []));
  ok("a hero survives a few mistakes", survives >= 3, `${r}: ${survives} blows to kill you`);
}

console.log("rewards");
for (const m of MONSTERS) {
  const g = goldFor(m, []);
  ok("every kill pays gold", g > 0, m.key);
  ok("a ledger always pays more", goldFor(m, ["ledger"]) > g, m.key);
  ok("a boss pays best", m.tier !== "BOSS" || g >= 100, `${m.key} ${g}`);
  const s = scoreFor({ damage: 20, tier: m.tier });
  ok("every blow scores", s > 0, m.key);
}

// --- relics -------------------------------------------------------------
console.log("relics");
for (const r of RELICS) {
  const spec = RELIC_SPECS[r];
  ok("every relic has a spec", spec?.relic === r, r);
  ok("it has a name", spec.name.length > 2, r);
  ok("it explains itself", spec.blurb.length > 10, r);
  ok("it has a glyph", spec.glyph.length >= 1, r);
}
ok("there are more relics than slots", RELICS.length > RELIC_SLOTS, `${RELICS.length} vs ${RELIC_SLOTS}`);

for (let i = 0; i < 200; i++) {
  const roll = i / 200;
  const offer = relicChoices([], roll);
  ok("an offer is made", offer.length === 3, `${offer.length}`);
  ok("an offer never repeats itself", new Set(offer).size === offer.length, offer.join(","));
  const held = [...RELICS].slice(0, 5);
  const second = relicChoices(held, roll);
  ok("an offer never includes what you carry", second.every((x) => !held.includes(x)), second.join(","));
}
eq("nothing is offered when you hold everything", relicChoices([...RELICS], 0.5).length, 0);

// --- the road -----------------------------------------------------------
console.log("roads");
for (const r of REGIONS) {
  const spec = regionSpec(r as Region);
  for (let seed = 0; seed < 400; seed++) {
    const rolls = Array.from({ length: 40 }, (_, i) => ((seed * 37 + i * 13) % 100) / 100);
    const road = buildRoad(r as Region, rolls);

    ok("the road is the region's length", road.length === spec.length, `${r} ${road.length}`);
    ok("the road opens on a fight", road[0][0].type === "BATTLE", `${r} ${road[0][0].type}`);
    ok("the road opens without a choice", road[0].length === 1, `${r}`);
    ok("the road ends at the Warden", road[road.length - 1][0].type === "BOSS", r);
    ok("the Warden has no alternative", road[road.length - 1].length === 1, r);

    for (let i = 1; i < road.length - 1; i++) {
      const step = road[i];
      ok("a middle step is a real choice", step.length === 2, `${r} step ${i}: ${step.length}`);
      ok(
        "a choice is between different things",
        step[0].type !== step[1].type,
        `${r} step ${i}: ${step.map((s) => s.type).join("/")}`
      );
    }

    for (const step of road) {
      for (const node of step) {
        ok("every node has a known type", NODE_TYPES.includes(node.type), String(node.type));
        if (node.type === "BATTLE" || node.type === "ELITE" || node.type === "BOSS") {
          ok("every fight names its monster", !!node.monster, `${r} ${node.type}`);
          const m = node.monster ? monsterByKey(node.monster) : null;
          ok("the named monster exists", !!m, String(node.monster));
          ok("the monster belongs to this region", m?.region === r, `${m?.key} in ${r}`);
        }
      }
    }

    // A road with no way to heal is a road that kills a wounded hero for
    // reasons outside their control.
    const hasForge = road.some((s) => s.some((n) => n.type === "FORGE"));
    ok("there is always somewhere to mend", hasForge, `${r} seed ${seed}`);
    const hasElite = road.some((s) => s.some((n) => n.type === "ELITE"));
    ok("there is always a relic to be won", hasElite, `${r} seed ${seed}`);
  }
}

// --- levelling ----------------------------------------------------------
console.log("levelling");
eq("the rating scale's anchor maps cleanly", centreForRating(900 + 120 * 5), 5);
for (let rating = 600; rating <= 2400; rating += 10) {
  ok("centre rises with rating", centreForRating(rating + 10) >= centreForRating(rating), `${rating}`);
}
for (let c = -4; c <= 14; c++) {
  const { floor, ceiling } = bandFor(c);
  ok("a band is inside the scale", floor >= 1 && ceiling <= 10, `c${c} ${floor}..${ceiling}`);
  ok("a band is never inverted", floor <= ceiling, `c${c}`);
}

console.log(
  `\n${failures === 0 ? "✓" : "✗"} ${checks - failures}/${checks} checks passed` +
    (failures ? ` — ${failures} FAILED` : "")
);
process.exit(failures === 0 ? 0 : 1);
