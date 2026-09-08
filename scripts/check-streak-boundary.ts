// Asserts the streak day boundary sits at midnight US Pacific, tracking daylight
// saving, and that continuation and breaking behave correctly across it.
//
//   npm run verify:streak
//
// Imports the real implementation so a change to src/lib/streak.ts is actually
// caught, and checks it against an independently-derived oracle so the two would
// have to be wrong in the same way to pass.
//
// The whole suite runs under several process timezones because one of the bugs
// this replaced was exactly that class: logic that read correctly on a developer
// machine and silently rolled over at midnight UTC on Vercel.
//
// The DST sections are the point of this file. Following Pacific clock time means
// living with a 23-hour and a 25-hour day each year, and the failure that has to
// be ruled out is two calendar dates collapsing onto one index — which would
// silently eat a streak the user had earned.

import {
  streakDayIndex,
  streakDayKey,
  streakDayStart,
  effectiveStreak,
  streakWeekday,
  isSameStreakDay,
  STREAK_TIME_ZONE,
} from "../src/lib/streak";

const DAY_MS = 86_400_000;

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.log(`   ✗ ${label}: got ${String(actual)}, expected ${String(expected)}`);
    failures++;
  }
}

const D = (iso: string) => new Date(iso);

/** Oracle: the Pacific calendar date for an instant, obtained a different way
 * from the implementation — via en-CA's ISO-shaped output and string parsing,
 * rather than numeric parts assembled with Date.UTC. */
const ORACLE_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: STREAK_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
function oracleDate(at: Date): string {
  return ORACLE_FMT.format(at); // "YYYY-MM-DD"
}
function oracleIndex(at: Date): number {
  return Date.parse(`${oracleDate(at)}T00:00:00.000Z`) / DAY_MS;
}

/** US DST transitions: 2nd Sunday of March, 1st Sunday of November. */
function nthSunday(year: number, month: number, n: number): number {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offsetToSunday = (7 - first.getUTCDay()) % 7;
  return 1 + offsetToSunday + (n - 1) * 7;
}
function transitionsFor(year: number) {
  return [
    { label: `${year} spring forward`, date: `${year}-03-${String(nthSunday(year, 3, 2)).padStart(2, "0")}` },
    { label: `${year} fall back`, date: `${year}-11-${String(nthSunday(year, 11, 1)).padStart(2, "0")}` },
  ];
}

function runSuite(tz: string) {
  console.log(`\n── process TZ: ${tz} ──`);

  check("timezone is US Pacific", STREAK_TIME_ZONE, "America/Los_Angeles");

  // --- boundary lands on midnight Pacific in BOTH offsets -------------------
  // Summer (PDT, UTC-7): 07:00Z is midnight.
  check(
    "PDT: 06:59:59Z is still the previous day",
    streakDayKey(D("2026-09-07T06:59:59.000Z")).toISOString(),
    "2026-09-06T00:00:00.000Z"
  );
  check(
    "PDT: 07:00:00Z starts the new day",
    streakDayKey(D("2026-09-07T07:00:00.000Z")).toISOString(),
    "2026-09-07T00:00:00.000Z"
  );
  // Winter (PST, UTC-8): 08:00Z is midnight. This is the case the old
  // fixed-offset implementation got wrong — it rolled over at 07:00Z all year,
  // i.e. 11pm Pacific in winter.
  check(
    "PST: 07:59:59Z is still the previous day",
    streakDayKey(D("2026-01-15T07:59:59.000Z")).toISOString(),
    "2026-01-14T00:00:00.000Z"
  );
  check(
    "PST: 08:00:00Z starts the new day",
    streakDayKey(D("2026-01-15T08:00:00.000Z")).toISOString(),
    "2026-01-15T00:00:00.000Z"
  );

  // --- agreement with the independent oracle -------------------------------
  const samples = [
    "2026-01-15T07:59:59.000Z",
    "2026-01-15T08:00:00.000Z",
    "2026-03-08T09:30:00.000Z",
    "2026-06-30T23:59:59.000Z",
    "2026-09-07T07:00:00.000Z",
    "2026-11-01T08:30:00.000Z",
    "2026-12-31T23:00:00.000Z",
    "2027-07-04T12:00:00.000Z",
  ];
  for (const iso of samples) {
    check(`matches oracle at ${iso}`, streakDayIndex(D(iso)), oracleIndex(D(iso)));
  }

  // --- THE DST PROPERTY: consecutive dates always differ by exactly 1 -------
  // Walked hour by hour across every transition for seven years. A 23-hour day
  // collapsing two dates onto one index, or a 25-hour day splitting one date
  // across two, would both show up here.
  for (let year = 2024; year <= 2030; year++) {
    for (const t of transitionsFor(year)) {
      let previousIndex: number | null = null;
      let previousDate: string | null = null;
      const start = Date.parse(`${t.date}T00:00:00.000Z`) - DAY_MS; // day before
      for (let h = 0; h <= 72; h++) {
        const at = new Date(start + h * 3_600_000);
        const index = streakDayIndex(at);
        const date = oracleDate(at);
        if (previousIndex !== null && previousDate !== null) {
          if (date === previousDate) {
            check(`${t.label}: same date keeps one index (+${h}h)`, index, previousIndex);
          } else {
            // Date advanced — the index must advance by exactly as much.
            const expected = previousIndex + (Date.parse(`${date}T00:00:00.000Z`) - Date.parse(`${previousDate}T00:00:00.000Z`)) / DAY_MS;
            check(`${t.label}: index tracks the date (+${h}h)`, index, expected);
          }
        }
        previousIndex = index;
        previousDate = date;
      }
    }
  }

  // --- streakDayStart is the true first instant of its day ------------------
  // Checked at every hour of every transition day: midnight Pacific is 07:00Z in
  // PDT and 08:00Z in PST, and the two-pass offset resolution has to find the
  // right one even when sampled from the other side of the change.
  for (let year = 2024; year <= 2030; year++) {
    for (const t of transitionsFor(year)) {
      const dayStart = Date.parse(`${t.date}T00:00:00.000Z`) - DAY_MS;
      for (let h = 0; h <= 72; h++) {
        const at = new Date(dayStart + h * 3_600_000);
        const begin = streakDayStart(at);
        check(`${t.label}: start is in the same day (+${h}h)`, streakDayIndex(begin), streakDayIndex(at));
        check(
          `${t.label}: one ms earlier is the previous day (+${h}h)`,
          streakDayIndex(new Date(begin.getTime() - 1)),
          streakDayIndex(at) - 1
        );
      }
    }
  }

  // A concrete pair, so the intent is legible without running the loops.
  check("summer day starts 07:00Z", streakDayStart(D("2026-09-07T18:00:00.000Z")).toISOString(), "2026-09-07T07:00:00.000Z");
  check("winter day starts 08:00Z", streakDayStart(D("2026-01-15T18:00:00.000Z")).toISOString(), "2026-01-15T08:00:00.000Z");

  // --- a streak survives both transitions ----------------------------------
  // The regression that the fixed offset was originally chosen to avoid. Practise
  // late on the day before a transition, practise again the next day, and the
  // streak must still be alive.
  for (let year = 2024; year <= 2030; year++) {
    for (const t of transitionsFor(year)) {
      const transitionMidnightUTC = Date.parse(`${t.date}T00:00:00.000Z`);
      // 23:00 Pacific the evening before the transition day.
      const eveningBefore = new Date(transitionMidnightUTC + 6 * 3_600_000);
      // 23:00 Pacific on the transition day itself.
      const eveningOf = new Date(transitionMidnightUTC + 30 * 3_600_000);
      check(`${t.label}: consecutive evenings are different days`, isSameStreakDay(eveningBefore, eveningOf), false);
      check(`${t.label}: streak survives the transition`, effectiveStreak(12, eveningBefore, eveningOf), 12);
      // And a genuine two-day gap across the transition still breaks it.
      const twoDaysLater = new Date(transitionMidnightUTC + 54 * 3_600_000);
      check(`${t.label}: two-day gap still breaks`, effectiveStreak(12, eveningBefore, twoDaysLater), 0);
    }
  }

  // --- continuation / breaking on ordinary days ----------------------------
  const gap = (last: string, now: string) => streakDayIndex(D(now)) - streakDayIndex(D(last));
  check("same day", gap("2026-09-07T08:00:00.000Z", "2026-09-07T20:00:00.000Z"), 0);
  check("next day", gap("2026-09-07T08:00:00.000Z", "2026-09-08T08:00:00.000Z"), 1);
  check("two days", gap("2026-09-07T08:00:00.000Z", "2026-09-09T08:00:00.000Z"), 2);

  const now = D("2026-09-07T20:00:00.000Z");
  for (const [days, expected] of [[0, 12], [1, 12], [2, 0], [5, 0]] as const) {
    const last = new Date(now.getTime() - days * DAY_MS);
    check(`effectiveStreak after ${days} day gap`, effectiveStreak(12, last, now), expected);
  }
  check("no lastActiveDate => 0", effectiveStreak(12, null, now), 0);
  check(
    "future lastActiveDate does not break the streak",
    effectiveStreak(12, new Date(now.getTime() + DAY_MS), now),
    12
  );

  // --- weekday agrees with the same boundary -------------------------------
  check("noon Pacific Mon => Monday", streakWeekday(D("2026-09-07T19:00:00.000Z")), 1);
  check("23:00 Pacific Sun => still Sunday", streakWeekday(D("2026-09-07T06:00:00.000Z")), 0);
  check("00:00 Pacific Mon => Monday", streakWeekday(D("2026-09-07T07:00:00.000Z")), 1);

  // --- the invariant tying the daily challenge to the streak ---------------
  // getOrCreateDailyChallenge keys rows off streakDayKey and picks the problem
  // from the epoch-day number. If these ever disagree, the challenge and the
  // streak are on different calendars.
  for (const iso of [...samples, "2026-03-08T10:00:00.000Z", "2026-11-01T09:00:00.000Z"]) {
    check(`key/index invariant at ${iso}`, streakDayKey(D(iso)).getTime() / DAY_MS, streakDayIndex(D(iso)));
  }

  // --- no remap of existing rows in the current season ---------------------
  // Pacific is UTC-7 while DST is in effect, so switching from the old fixed -7
  // offset changes nothing for any instant in the summer half of the year. This
  // is why the change needed no data migration.
  const oldFixedIndex = (at: Date) => Math.floor((at.getTime() - 7 * 3_600_000) / DAY_MS);
  for (const iso of ["2026-06-01T12:00:00.000Z", "2026-09-07T07:00:00.000Z", "2026-09-07T06:59:59.000Z", "2026-10-31T12:00:00.000Z"]) {
    check(`PDT matches the previous fixed -7 behaviour at ${iso}`, streakDayIndex(D(iso)), oldFixedIndex(D(iso)));
  }
  // And in winter it deliberately differs, by exactly the hour DST accounts for.
  check(
    "PST deliberately differs from the old fixed offset",
    streakDayIndex(D("2026-01-15T07:30:00.000Z")) === oldFixedIndex(D("2026-01-15T07:30:00.000Z")),
    false
  );
}

for (const tz of ["UTC", "America/Los_Angeles", "Pacific/Auckland", "Asia/Kolkata"]) {
  process.env.TZ = tz;
  runSuite(tz);
}

console.log(
  failures === 0
    ? "\n✓ streak boundary holds at midnight US Pacific, across both DST transitions\n"
    : `\n${failures} streak boundary failure(s)\n`
);
process.exit(failures === 0 ? 0 : 1);
