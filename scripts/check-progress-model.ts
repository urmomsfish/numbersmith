/**
 * Verification for progress reporting and the study plan's shape.
 *
 * The bug this guards against shipped and was visible on the dashboard: a
 * student who had answered a twelve-question placement test and practised
 * nothing saw "86% mastered" on AMC 8, and one account with *zero* practice
 * attempts showed 100% across six domains. Accuracy was being displayed as
 * coverage.
 *
 * Run with: npm run verify:progress
 */
import {
  evidenceWeight,
  topicProgress,
  competitionProgress,
  HALF_EVIDENCE,
} from "../src/lib/engine/progress";
// From plan-schedule, not study-plan: the latter carries the `server-only`
// guard, which refuses to load outside a Next request context.
import {
  PLAN_WEEKS,
  PLAN_PHASES,
  phaseForWeek,
  buildScheduleWeeks,
  phaseForTimeRemaining,
  difficultyBandFor,
  monthGrid,
  planDayForDate,
  planDayForDayIndex,
  type ScheduledCompetition,
} from "../src/lib/engine/plan-schedule";
import { dateKeyIndex, streakDayIndex, streakDayKey } from "../src/lib/streak";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.log(`  ✗ ${label}: got ${String(actual)}, expected ${String(expected)}`);
    failures++;
  }
}
function expect(label: string, condition: boolean) {
  if (!condition) {
    console.log(`  ✗ ${label}`);
    failures++;
  }
}

console.log("1. no practice means no progress");
// The headline case. Perfect accuracy from a placement test alone must not read
// as mastery.
check("100% accuracy, 0 problems => 0%", topicProgress(100, 0), 0);
check("86% accuracy, 0 problems => 0%", topicProgress(86, 0), 0);
check("0 problems has zero evidence weight", evidenceWeight(0), 0);

console.log("2. progress is bounded by accuracy and rises with practice");
expect("progress never exceeds accuracy", [0, 1, 5, 25, 100, 1000].every((n) => topicProgress(80, n) <= 80));
expect(
  "progress is monotonic in practice volume",
  [0, 1, 2, 5, 10, 25, 50, 100, 250, 1000]
    .map((n) => topicProgress(80, n))
    .every((v, i, arr) => i === 0 || v >= arr[i - 1])
);
check(`half evidence at n=${HALF_EVIDENCE} halves the estimate`, topicProgress(80, HALF_EVIDENCE), 40);
expect("100 problems reads about 80% of accuracy", Math.abs(topicProgress(100, 100) - 80) <= 1);
expect("mastery is reachable with sustained work", topicProgress(95, 600) >= 90);

console.log("3. a wrong answer rate cannot be inflated by volume");
expect("50% accuracy stays below 50 however much is practised", [10, 100, 10000].every((n) => topicProgress(50, n) <= 50));

console.log("4. competition progress");
const topics = [
  { topicId: "a", weight: 5 },
  { topicId: "b", weight: 3 },
  { topicId: "c", weight: 2 },
];
check("no mastery rows at all => 0%", competitionProgress(topics, new Map()), 0);
// A topic with no row must contribute 0, not a flattering default. The previous
// implementation substituted 35, so a brand new account showed a third mastered.
// Derived, not hardcoded: evidence weight approaches 1 without reaching it, so
// even 1000 problems at 100% accuracy is 98 rather than 100.
check(
  "unseen topics contribute 0, not a default",
  competitionProgress(topics, new Map([["a", { masteryPercent: 100, problemsAttempted: 1000 }]])),
  Math.round((topicProgress(100, 1000) * 5 + 0 * 3 + 0 * 2) / 10)
);
check("empty topic list => 0%", competitionProgress([], new Map()), 0);
// The exact scenario from the screenshot: placement only, no practice.
check(
  "placement-only student reads 0% on a competition",
  competitionProgress(
    topics,
    new Map([
      ["a", { masteryPercent: 86, problemsAttempted: 0 }],
      ["b", { masteryPercent: 90, problemsAttempted: 0 }],
      ["c", { masteryPercent: 100, problemsAttempted: 0 }],
    ])
  ),
  0
);

console.log("5. study plan spans a real training arc");
expect("plan is longer than one week", PLAN_WEEKS > 1);
check("plan is 12 weeks", PLAN_WEEKS, 12);
check("first week is Foundations", phaseForWeek(1).name, "Foundations");
check("last week is Competition prep", phaseForWeek(PLAN_WEEKS).name, "Competition prep");
expect("every week maps to a phase", Array.from({ length: PLAN_WEEKS }, (_, i) => phaseForWeek(i + 1)).every(Boolean));
expect(
  "phases are ordered and start within the plan",
  PLAN_PHASES.every((p, i) => p.startWeek >= 1 && p.startWeek <= PLAN_WEEKS && (i === 0 || p.startWeek > PLAN_PHASES[i - 1].startWeek))
);
expect(
  "phase assignment never goes backwards",
  Array.from({ length: PLAN_WEEKS }, (_, i) => PLAN_PHASES.indexOf(phaseForWeek(i + 1))).every(
    (v, i, arr) => i === 0 || v >= arr[i - 1]
  )
);

console.log("6. the plan is built around the student's real contest dates");
const NOW = new Date("2026-09-08T18:00:00.000Z");
const at = (days: number) => new Date(NOW.getTime() + days * 86_400_000);
const comp = (
  shortName: string,
  targetDate: Date | null,
  difficultyMin = 3,
  difficultyMax = 7
): ScheduledCompetition => ({
  competitionId: shortName,
  shortName,
  targetDate,
  isPrimary: false,
  difficultyMin,
  difficultyMax,
  format: "SHORT_ANSWER",
  numQuestions: 25,
  timeLimitMinutes: 40,
});

// With nothing dated, fall back to the generic arc rather than producing nothing.
const noDates = buildScheduleWeeks([comp("AMC 8", null)], NOW);
check("no dated contest falls back to the generic plan", noDates.length, PLAN_WEEKS);
expect("fallback weeks have no target", noDates.every((w) => w.target === null));

// A single contest: the plan runs to it and tapers on the contest week.
const single = buildScheduleWeeks([comp("AMC 8", at(35))], NOW);
check("plan runs to the contest week", single.length, 6);
expect("every week targets the contest", single.every((w) => w.target?.shortName === "AMC 8"));
check("only the final week tapers", single.filter((w) => w.isTaper).length, 1);
check("the taper is the last week", single[single.length - 1].isTaper, true);
expect(
  "weeks until the contest count down",
  single.every((w, i) => i === 0 || (w.weeksUntilTarget ?? 0) <= (single[i - 1].weeksUntilTarget ?? 0))
);

// Two contests: train for the nearer one, switch once it is behind you.
const two = buildScheduleWeeks([comp("AMC 10", at(70)), comp("MATHCOUNTS", at(21))], NOW);
check("first week targets the sooner contest", two[0].target?.shortName, "MATHCOUNTS");
check("last week targets the later contest", two[two.length - 1].target?.shortName, "AMC 10");
expect(
  "the switch happens after the first contest, not before",
  two.findIndex((w) => w.target?.shortName === "AMC 10") > two.findIndex((w) => w.isTaper)
);
check("each contest gets its own taper week", two.filter((w) => w.isTaper).length, 2);

// A contest already past must not steer anything.
const past = buildScheduleWeeks([comp("Old", at(-30)), comp("Next", at(28))], NOW);
expect("past contests are ignored", past.every((w) => w.target?.shortName === "Next"));

// Phase follows time remaining, not position in the plan. Someone signing up two
// weeks out should not be starting on foundations.
check("2 weeks out is competition prep", phaseForTimeRemaining(2).name, "Competition prep");
check("6 weeks out is build", phaseForTimeRemaining(6).name, "Build");
check("20 weeks out is foundations", phaseForTimeRemaining(20).name, "Foundations");
const shortRunway = buildScheduleWeeks([comp("Soon", at(10))], NOW);
expect(
  "a short runway is all competition prep",
  shortRunway.every((w) => w.phase.name === "Competition prep")
);

// A date years out must not generate an unbounded plan.
const farOff = buildScheduleWeeks([comp("Far", at(365 * 3))], NOW);
expect("the horizon is capped", farOff.length <= 52);

console.log("7. difficulty tracks the contest's own range");
const amc8 = comp("AMC 8", at(84), 2, 6);
const aime = comp("AIME", at(84), 7, 10);
expect("far out starts near the bottom of the range", difficultyBandFor(amc8, 12).min <= 3);
expect("the ceiling is always the contest's own max", difficultyBandFor(amc8, 0).max === 6);
expect("an AMC 8 student is never sent AIME-level work", difficultyBandFor(amc8, 0).max < aime.difficultyMin);
expect("an AIME student is never sent arithmetic drills", difficultyBandFor(aime, 12).min >= 7);
expect(
  "the floor rises as the contest approaches",
  difficultyBandFor(aime, 0).min >= difficultyBandFor(aime, 12).min
);
expect("no contest gives a sane default", difficultyBandFor(null, null).min >= 1);

console.log("8. date-only values are not confused with instants");
// Contest dates and calendar cells are stored as that day's UTC midnight, which
// is 5pm the *previous* day in Pacific. Running one through streakDayIndex
// therefore lands it a day early — which showed up as a countdown one day short
// and a calendar highlighting tomorrow as today.
const oct13 = new Date(Date.UTC(2026, 9, 13));
check(
  "a date key and an instant during that Pacific day agree",
  dateKeyIndex(oct13),
  streakDayIndex(new Date("2026-10-13T18:00:00.000Z")) // 11am Pacific on Oct 13
);
expect(
  "streakDayIndex on a date key would be a day early",
  streakDayIndex(oct13) === dateKeyIndex(oct13) - 1
);
check(
  "streakDayKey round-trips through dateKeyIndex",
  dateKeyIndex(streakDayKey(new Date("2026-10-13T18:00:00.000Z"))),
  streakDayIndex(new Date("2026-10-13T18:00:00.000Z"))
);
// The countdown the study plan page shows.
const sep8 = new Date("2026-09-08T18:00:00.000Z");
check("Sep 8 to Oct 13 is 35 days", dateKeyIndex(oct13) - streakDayIndex(sep8), 35);
// And the plan built from it must span the right number of weeks.
const fiveWeeks = buildScheduleWeeks([comp("MATHCOUNTS", oct13)], sep8);
check("that runway is 5 plan weeks", fiveWeeks.length, 6);
check("the contest week is the last one", fiveWeeks[fiveWeeks.length - 1].isTaper, true);

console.log("9. the month grid lines up with the weekly view");
// Every calendar cell must resolve to the same task the weekly view shows for
// that date, or the two views of one plan would disagree.
const planStart = new Date("2026-09-08T18:00:00.000Z");
const fakePlan = {
  generatedAt: planStart,
  days: Array.from({ length: 5 * 7 }, (_, i) => ({
    weekNumber: Math.floor(i / 7) + 1,
    dayOfWeek: i % 7,
    id: String(i),
  })),
};
const grid = monthGrid(2026, 9);
expect("the grid is whole weeks", grid.length % 7 === 0);
expect("the grid starts on a Sunday", grid[0].getUTCDay() === 0);
expect("the grid covers the whole month", grid.some((d) => d.getUTCDate() === 30 && d.getUTCMonth() === 8));
// No trailing row that belongs entirely to the next month.
for (const [y, m] of [[2026, 9], [2026, 10], [2026, 2], [2027, 5], [2026, 8]] as const) {
  const g = monthGrid(y, m);
  const lastRow = g.slice(-7);
  expect(
    `${y}-${m}: the final row contains a day of the month`,
    lastRow.some((d) => d.getUTCMonth() + 1 === m && d.getUTCFullYear() === y)
  );
  expect(`${y}-${m}: grid is whole weeks`, g.length % 7 === 0);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  expect(
    `${y}-${m}: every day of the month is present`,
    Array.from({ length: daysInMonth }, (_, i) => i + 1).every((day) =>
      g.some((d) => d.getUTCDate() === day && d.getUTCMonth() + 1 === m && d.getUTCFullYear() === y)
    )
  );
}
let mismatches = 0;
for (const cell of grid) {
  const viaIndex = planDayForDayIndex(fakePlan, dateKeyIndex(cell), cell.getUTCDay());
  // The equivalent instant: midday Pacific on that same calendar date.
  const instant = new Date(cell.getTime() + 19 * 3_600_000);
  const viaInstant = planDayForDate(fakePlan, instant);
  if (viaIndex?.id !== viaInstant?.id) mismatches++;
}
check("calendar cells and instants resolve to the same task", mismatches, 0);
expect("dates before the plan started have no task", planDayForDayIndex(fakePlan, dateKeyIndex(new Date(Date.UTC(2026, 8, 1))), 2) === null);
expect(
  "dates past the end of the plan have no task",
  planDayForDayIndex(fakePlan, dateKeyIndex(new Date(Date.UTC(2026, 10, 30))), 1) === null
);

console.log(failures === 0 ? "\nProgress model OK.\n" : `\n${failures} failure(s).\n`);
process.exit(failures === 0 ? 0 : 1);
