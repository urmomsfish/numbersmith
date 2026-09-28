/**
 * Checks the past-paper rules that would otherwise fail silently.
 *
 *   npm run verify:papers
 *
 * Three things here are wrong in ways nobody notices at the time:
 *
 *   - A key whose length disagrees with the question count scores every
 *     subsequent answer against the wrong question, and the total still looks
 *     like a plausible mark.
 *   - Marking by string equality fails a student who wrote `0.5` where the key
 *     says `1/2`. They got the question right; that is the whole thing the
 *     paper was for.
 *   - The clock is the only reason a "75 minute" paper takes 75 minutes.
 *     Nothing on screen tells you it has drifted.
 *
 * Runs against the pure rules in src/lib/papers.ts, so it needs no database,
 * no PDF, and no server-only escape hatch.
 */
import {
  validatePaper,
  scoreAnswers,
  secondsRemaining,
  isPastDeadline,
  parseJsonArray,
  MAX_PAPER_BASE64,
  MAX_QUESTIONS,
  MAX_TIME_LIMIT_MINUTES,
} from "../src/lib/papers";
import { formatDateOnly, formatInstantDay, parseDateOnly } from "../src/lib/date-only";

let fails = 0;
const ok = (cond: boolean, label: string) => {
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) fails++;
};

/** A minimal valid paper, varied per case. */
const base = {
  title: "AMC 10A 2019",
  fileData: "JVBERi0xLjQK",
  questionCount: 3,
  timeLimitMinutes: 75,
  answerKey: ["B", "14", "1/2"],
};
const withPaper = (o: Partial<typeof base>) => validatePaper({ ...base, ...o });

console.log("\n--- validation ---");
ok(withPaper({}).ok, "a well-formed paper is accepted");
ok(!withPaper({ title: "   " }).ok, "a blank title is refused");
ok(!withPaper({ title: "x".repeat(200) }).ok, "an over-long title is refused");
ok(!withPaper({ fileData: "" }).ok, "a missing file is refused");
ok(!withPaper({ fileData: "not base64!!" }).ok, "a non-base64 payload is refused");
ok(!withPaper({ fileData: "A".repeat(MAX_PAPER_BASE64 + 1) }).ok, "an oversized PDF is refused");
ok(!withPaper({ questionCount: 0 }).ok, "zero questions is refused");
ok(!withPaper({ questionCount: MAX_QUESTIONS + 1, answerKey: Array(MAX_QUESTIONS + 1).fill("A") }).ok,
  `more than ${MAX_QUESTIONS} questions is refused`);
ok(!withPaper({ timeLimitMinutes: 0 }).ok, "a zero time limit is refused");
ok(!withPaper({ timeLimitMinutes: MAX_TIME_LIMIT_MINUTES + 1 }).ok, "an absurd time limit is refused");

// The one that matters most: a key that does not line up with the paper.
ok(!withPaper({ answerKey: ["B", "14"] }).ok, "a key shorter than the paper is refused");
ok(!withPaper({ answerKey: ["B", "14", "1/2", "C"] }).ok, "a key longer than the paper is refused");
ok(!withPaper({ answerKey: ["B", "", "1/2"] }).ok, "a key with a blank entry is refused");
{
  const r = withPaper({ answerKey: ["B", "", ""] });
  ok(!r.ok && /question 2, 3/.test(r.error), `the error names the missing questions ("${!r.ok ? r.error : ""}")`);
}
{
  const r = withPaper({ answerKey: [" B ", " 14 ", " 1/2 "] });
  ok(r.ok && r.value.answerKey.join("|") === "B|14|1/2", "key entries are trimmed");
}

console.log("\n--- marking ---");
{
  const key = ["B", "14", "1/2", "7"];
  const s = (given: string[]) => scoreAnswers(key, given).correctCount;
  ok(s(["B", "14", "1/2", "7"]) === 4, "an exact set marks 4/4");
  ok(s(["b", "14", "1/2", "7"]) === 4, "case does not matter");
  ok(s([" B", "14 ", "1/2", "7"]) === 4, "surrounding space does not matter");
  ok(s(["B", "14", "0.5", "7"]) === 4, "0.5 is marked right against a key of 1/2");
  ok(s(["B", "14", "2/4", "7"]) === 4, "an unreduced fraction is marked right");
  ok(s(["C", "15", "1/3", "8"]) === 0, "a wrong set marks 0/4");
  ok(s(["", "", "", ""]) === 0, "blanks are wrong, not right");
  ok(s([]) === 0, "a missing answers array does not crash");
  ok(s(["B"]) === 1, "a short answers array marks what is there");
  ok(scoreAnswers(key, ["B", "x", "1/2", "x"]).correct.join(",") === "true,false,true,false",
    "per-question marks line up with the questions");
}

console.log("\n--- the clock ---");
{
  const started = new Date("2026-09-27T10:00:00Z");
  const at = (iso: string) => new Date(iso).getTime();
  ok(secondsRemaining(started, 75, at("2026-09-27T10:00:00Z")) === 4500, "a fresh 75-minute paper has 4500s");
  ok(secondsRemaining(started, 75, at("2026-09-27T10:30:00Z")) === 2700, "30 minutes in, 2700s remain");
  ok(secondsRemaining(started, 75, at("2026-09-27T11:15:00Z")) === 0, "at the limit, 0s remain");
  ok(secondsRemaining(started, 75, at("2026-09-27T23:00:00Z")) === 0, "long past the limit it floors at 0, never negative");

  ok(!isPastDeadline(started, 75, at("2026-09-27T11:14:59Z")), "not late a second before the limit");
  ok(!isPastDeadline(started, 75, at("2026-09-27T11:15:05Z")), "the grace window covers a slow round trip");
  ok(isPastDeadline(started, 75, at("2026-09-27T11:16:00Z")), "a minute over the limit is late");
}

console.log("\n--- days vs instants ---");
{
  // The bug this guards: a paper uploaded at 6pm Pacific on 27 September was
  // shown as "added Sep 28", because it was rendered with the UTC-forced
  // formatter meant for date-only values. A timestamp names a moment and has
  // to be read in the user's zone; a stored day must not be.
  const evening = new Date("2026-09-28T01:00:00Z"); // 6pm Pacific on the 27th
  ok(formatInstantDay(evening) === "Sep 27, 2026", `an evening-Pacific instant reads as that day (${formatInstantDay(evening)})`);
  ok(formatDateOnly(evening) === "Sep 28, 2026", "the date-only formatter would have said Sep 28 — which is why they are separate");

  const morning = new Date("2026-09-27T16:00:00Z"); // 9am Pacific
  ok(formatInstantDay(morning) === "Sep 27, 2026", "a morning-Pacific instant reads as the same day");

  // And the other direction still holds: a stored day is stable everywhere.
  const day = parseDateOnly("2026-10-09")!;
  ok(formatDateOnly(day) === "Oct 9, 2026", "a stored day still renders as itself");
}

console.log("\n--- stored JSON ---");
ok(parseJsonArray('["A","B"]').join("") === "AB", "a stored array round-trips");
ok(parseJsonArray("not json").length === 0, "malformed JSON yields an empty array, not a crash");
ok(parseJsonArray('{"a":1}').length === 0, "a non-array yields an empty array");
ok(parseJsonArray('["A",3,null]').join("|") === "A||", "non-strings become blanks rather than breaking marking");

console.log(fails === 0 ? "\n✓ past-paper rules hold" : `\n✗ ${fails} failure(s)`);
process.exitCode = fails === 0 ? 0 : 1;
