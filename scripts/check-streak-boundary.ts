// Asserts the streak day boundary sits at 00:00 UTC-7, and that continuation
// and breaking behave correctly across it.
//
//   npm run verify:streak
//
// Imports the real implementation so a change to src/lib/streak.ts is actually
// caught, and checks it against an independently-derived oracle so the two
// would have to be wrong in the same way to pass.
//
// The whole suite runs under several process timezones because the bug this
// replaced was exactly that class: logic that read correctly on a developer
// machine and silently rolled over at midnight UTC on Vercel.

import {
  streakDayIndex,
  effectiveStreak,
  streakWeekday,
  STREAK_UTC_OFFSET_HOURS,
} from "../src/lib/streak";

const DAY_MS = 86_400_000;

/** Oracle: "which UTC-7 calendar day is this?", derived separately from the
 * implementation under test. */
function oracleIndex(iso: string): number {
  return Math.floor((Date.parse(iso) + STREAK_UTC_OFFSET_HOURS * 3_600_000) / DAY_MS);
}

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.log(`   ✗ ${label}: got ${String(actual)}, expected ${String(expected)}`);
    failures++;
  }
}

const D = (iso: string) => new Date(iso);

function runSuite(tz: string) {
  console.log(`\n── process TZ: ${tz} ──`);

  check("offset is UTC-7", STREAK_UTC_OFFSET_HOURS, -7);

  // 07:00Z is exactly 00:00 UTC-7.
  const lastSecondOfDay = "2026-09-07T06:59:59.000Z"; // 23:59:59 UTC-7, Sep 6
  const firstSecondOfDay = "2026-09-07T07:00:00.000Z"; // 00:00:00 UTC-7, Sep 7

  // Implementation must agree with the oracle, not just with itself.
  for (const iso of [lastSecondOfDay, firstSecondOfDay, "2026-01-15T12:00:00.000Z"]) {
    check(`matches oracle at ${iso}`, streakDayIndex(D(iso)), oracleIndex(iso));
  }

  check(
    "rolls over exactly at 07:00Z",
    streakDayIndex(D(firstSecondOfDay)) - streakDayIndex(D(lastSecondOfDay)),
    1
  );
  check(
    "23:00 and 06:00 UTC-7 are the same day",
    streakDayIndex(D("2026-09-07T13:00:00.000Z")) - streakDayIndex(D("2026-09-07T07:30:00.000Z")),
    0
  );
  // The old behaviour rolled over here; it must not any more.
  check(
    "midnight UTC is mid-day, not a rollover",
    streakDayIndex(D("2026-09-07T00:30:00.000Z")) - streakDayIndex(D("2026-09-06T23:30:00.000Z")),
    0
  );

  // touchDailyActivity's arithmetic: gap of 1 continues, 0 is a no-op, 2+ resets.
  const gap = (last: string, now: string) => streakDayIndex(D(now)) - streakDayIndex(D(last));
  check("same day => no change", gap(lastSecondOfDay, "2026-09-07T06:00:00.000Z"), 0);
  check("next day => continues", gap(lastSecondOfDay, firstSecondOfDay), 1);
  check("a full day missed => breaks", gap("2026-09-05T08:00:00.000Z", "2026-09-07T08:00:00.000Z"), 2);
  // The case users actually hit: practising just before the rollover and again
  // two minutes later must be +1, never a reset.
  check(
    "23:59 then 00:01 next day => +1",
    gap("2026-09-07T06:59:00.000Z", "2026-09-07T07:01:00.000Z"),
    1
  );

  // effectiveStreak: alive if last active today or yesterday, else 0.
  const now = D("2026-09-07T12:00:00.000Z");
  for (const [days, expected] of [[0, 12], [1, 12], [2, 0], [9, 0]] as const) {
    const last = new Date(now.getTime() - days * DAY_MS);
    check(`effectiveStreak after ${days} day gap`, effectiveStreak(12, last, now), expected);
  }
  check("no lastActiveDate => 0", effectiveStreak(12, null, now), 0);

  // Weekday must use the same boundary, or "today's plan" disagrees with the
  // streak sitting next to it. 2026-09-07 is a Monday (1).
  check("noon UTC-7 on Mon => Monday", streakWeekday(D("2026-09-07T12:00:00.000Z")), 1);
  // 06:00Z is 23:00 UTC-7 the previous day — still Sunday, not yet Monday.
  check("23:00 UTC-7 Sun => still Sunday", streakWeekday(D("2026-09-07T06:00:00.000Z")), 0);
  check("00:00 UTC-7 Mon => Monday", streakWeekday(D("2026-09-07T07:00:00.000Z")), 1);
  // Clock skew must not punish the user.
  check(
    "future lastActiveDate => preserved",
    effectiveStreak(12, new Date(now.getTime() + DAY_MS), now),
    12
  );
}

for (const tz of ["UTC", "America/Los_Angeles", "Pacific/Auckland", "Asia/Kolkata"]) {
  process.env.TZ = tz;
  runSuite(tz);
}

console.log(
  `\n${failures === 0 ? "✓ streak boundary holds at 00:00 UTC-7 in every timezone" : `✗ ${failures} FAILURE(S)`}`
);
if (failures > 0) process.exitCode = 1;
