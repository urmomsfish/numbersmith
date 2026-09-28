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
  parseQuestions,
  isQuizzable,
  hasHitScanCap,
  MAX_PAPER_BASE64,
  MAX_QUESTIONS,
  MAX_TIME_LIMIT_MINUTES,
  MAX_SCANS_PER_DAY,
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

console.log("\n--- scanned questions ---");
{
  // Extraction output is model-generated and reaches this parser as stored
  // JSON, so it is untrusted twice over: malformed shapes must degrade to a
  // hand-entered paper, never crash a sitting or half-populate one.
  const good = JSON.stringify([
    { text: "What is 2+2?", choices: ["3", "4"], confidence: "high", note: "" },
    { text: "Name a prime.", choices: [], confidence: "low", note: "blurry" },
  ]);
  const parsed = parseQuestions(good);
  ok(parsed.length === 2, "a well-formed question array round-trips");
  ok(parsed[0].choices.length === 2 && parsed[1].choices.length === 0, "choices survive per question");
  ok(parsed[1].confidence === "low" && parsed[1].note === "blurry", "the low-confidence flag and note survive");

  ok(parseQuestions("not json").length === 0, "malformed JSON yields no questions");
  ok(parseQuestions('{"a":1}').length === 0, "a non-array yields no questions");
  ok(parseQuestions("[]").length === 0, "an empty array yields no questions");
  ok(parseQuestions('[null, 3, "x"]').length === 0, "non-objects are dropped, not crashed on");
  ok(parseQuestions('[{"text":""}]').length === 0, "a question with no text is dropped");
  {
    const loose = parseQuestions('[{"text":"Q","choices":"nope","confidence":"bogus"}]');
    ok(loose.length === 1 && loose[0].choices.length === 0, "a non-array choices field becomes empty");
    ok(loose[0].confidence === "high", "an unrecognised confidence defaults to high, not low");
  }

  // The gate that decides quiz vs PDF-on-screen. A partial scan must fall back.
  const q = (n: number) =>
    Array.from({ length: n }, () => ({ text: "Q", choices: [], confidence: "high" as const, note: "" }));
  ok(isQuizzable(q(5), 5), "5 questions and 5 answers is quizzable");
  ok(!isQuizzable(q(4), 5), "a scan short by one falls back to the PDF");
  ok(!isQuizzable(q(6), 5), "a scan long by one falls back to the PDF");
  ok(!isQuizzable([], 5), "a hand-entered paper is not quizzable");
  ok(!isQuizzable(q(0), 0), "a paper with no questions at all is not quizzable");
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

console.log("\n--- daily scan cap ---");
{
  // Off-by-one here is the whole rule: `>` instead of `>=` gives away one free
  // scan a day per account, and a `>` on the wrong side gives away the cap.
  ok(!hasHitScanCap(0), "a fresh day allows a scan");
  ok(!hasHitScanCap(MAX_SCANS_PER_DAY - 1), `${MAX_SCANS_PER_DAY - 1} scans still allows one more`);
  ok(hasHitScanCap(MAX_SCANS_PER_DAY), `the ${MAX_SCANS_PER_DAY}th scan is the last one`);
  ok(hasHitScanCap(MAX_SCANS_PER_DAY + 5), "a count past the cap stays capped");

  // The cap has to bound spend, so it must be a real number, not 0 (nobody can
  // scan) and not something that makes the backstop meaningless.
  ok(MAX_SCANS_PER_DAY > 0, "the cap allows at least one scan");
  ok(MAX_SCANS_PER_DAY <= 50, "the cap is low enough to actually bound a day's spend");
}

console.log(fails === 0 ? "\n✓ past-paper rules hold" : `\n✗ ${fails} failure(s)`);
process.exitCode = fails === 0 ? 0 : 1;
