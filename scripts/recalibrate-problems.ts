/**
 * Re-scores competition problems against the difficulty rubric.
 *
 * The bank's hard labels were not earned. An audit found 677 competition
 * problems whose entire solution is shorter than the rubric's floor for the
 * difficulty they claim — "a regular octagon has side 6, find its area" sat at
 * 9, "1/x + 1/y = 1/12, count the ordered pairs" at 10. Because a simulation
 * draws one problem per target difficulty, those labels decide what a student
 * meets at question 23 of a mock contest.
 *
 * This pass only *scores*. It never edits a problem, and its output is a JSON
 * report that a human (or the rewrite pass) acts on. That separation is
 * deliberate: relabelling is reversible and cheap to review, whereas a script
 * that rewrote 677 problems in place on its first run would be neither.
 *
 * Resumable by design — results are flushed after every batch, so a run that
 * dies at problem 500 does not re-spend on the first 499.
 *
 *   npx tsx scripts/recalibrate-problems.ts [--limit N] [--competition slug]
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { ALL_PROBLEMS } from "../prisma/seed-data/all-problems";
import { DIFFICULTY_RUBRIC, COMPETITION_TIERS, MIN_SOLUTION_CHARS } from "./problem-rubric";

const OUT = "scratch/recalibration.json";
const MODEL = "claude-opus-5";
const BATCH = 6;

type Verdict = {
  slug: string;
  currentDifficulty: number;
  rubricDifficulty: number;
  steps: number;
  isLookup: boolean;
  isStock: boolean;
  reason: string;
  action: "keep" | "relabel" | "rewrite";
};

const SYSTEM = `You calibrate competition mathematics problems for a training app.

You are given a problem and the contest it is filed under. Score its difficulty
against this rubric, which is the ONLY definition of difficulty that matters here:

${Object.entries(DIFFICULTY_RUBRIC).map(([n, d]) => `${n}. ${d}`).join("\n")}

The single rule that governs everything: ADVANCED IS NOT THE SAME AS HARD.
A named theorem applied to the textbook setup it was stated for is difficulty 3,
however advanced the theorem. Recognising that 12! mod 13 is Wilson's theorem,
or that a regular octagon has a known area formula, is recall, not problem
solving. Difficulty measures what the solver must FIND, not what they must KNOW.

Report, as strict JSON and nothing else:
{
  "steps": <number of distinct mathematical moves a competent solver makes>,
  "isLookup": <true if the problem is one named formula or theorem applied directly>,
  "isStock": <true if this is a famous standard exercise a prepared competitor has already seen>,
  "rubricDifficulty": <1-10 per the rubric above>,
  "reason": "<one sentence, naming the actual work the problem requires>"
}`;

function prompt(p: { question: string; solution: string; difficulty: number; comp: string; tail?: [number, number] }) {
  return `Contest: ${p.comp}${p.tail ? ` (its hard tail should sit at difficulty ${p.tail[0]}-${p.tail[1]})` : ""}
Currently labelled: difficulty ${p.difficulty}

PROBLEM
${p.question}

PUBLISHED SOLUTION
${p.solution}`;
}

async function main() {
  const args = process.argv.slice(2);
  const limit = Number(args[args.indexOf("--limit") + 1]) || Infinity;
  const only = args.includes("--competition") ? args[args.indexOf("--competition") + 1] : null;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Run with:  set -a && . ./.env && set +a");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const done: Record<string, Verdict> = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, "utf8"))
    : {};

  // Only problems that could plausibly be mislabelled: anything whose solution
  // is thinner than its band allows, plus everything claiming 8+. Scoring the
  // easy end would cost as much and change nothing — a difficulty-2 arithmetic
  // question cannot be secretly hard.
  const candidates = ALL_PROBLEMS.filter(({ seed }) => {
    if (!seed.competitionSlug) return false;
    if (only && seed.competitionSlug !== only) return false;
    if (done[seed.slug]) return false;
    const thin = seed.solution.length < (MIN_SOLUTION_CHARS[seed.difficulty] ?? 0);
    return thin || seed.difficulty >= 8;
  })
    .slice(0, limit)
    .map(({ seed }) => seed);

  console.log(`${Object.keys(done).length} already scored; ${candidates.length} to score.`);
  if (!candidates.length) return;

  const tierFor = (slug: string) =>
    Object.entries(COMPETITION_TIERS).find(([name]) =>
      slug.includes(name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 6))
    )?.[1].tail;

  let scored = 0;
  for (let i = 0; i < candidates.length; i += BATCH) {
    const batch = candidates.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (p) => {
        try {
          const res = await client.messages.create({
            model: MODEL,
            max_tokens: 600,
            system: SYSTEM,
            messages: [
              {
                role: "user",
                content: prompt({
                  question: p.question,
                  solution: p.solution,
                  difficulty: p.difficulty,
                  comp: p.competitionSlug!,
                  tail: tierFor(p.competitionSlug!),
                }),
              },
            ],
          });
          const text = res.content.find((b) => b.type === "text");
          const raw = text?.type === "text" ? text.text : "";
          const json = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
          const rubricDifficulty = Number(json.rubricDifficulty);
          const drop = p.difficulty - rubricDifficulty;
          const v: Verdict = {
            slug: p.slug,
            currentDifficulty: p.difficulty,
            rubricDifficulty,
            steps: Number(json.steps),
            isLookup: Boolean(json.isLookup),
            isStock: Boolean(json.isStock),
            reason: String(json.reason ?? ""),
            // A formula lookup is not a bad problem — "how many diagonals does
            // a decagon have" is a perfectly good difficulty-1 question. It is
            // only bad at difficulty 9, where a simulation puts it at the end
            // of the paper. So the default remedy is to relabel it down, not
            // to delete it; the bank keeps a legitimate easy problem.
            //
            // Rewriting is reserved for stock exercises, which are the wrong
            // question at ANY label: a famous problem tests whether the student
            // has met it before, which is not a thing worth measuring.
            action: json.isStock ? "rewrite" : drop >= 1 ? "relabel" : "keep",
          };
          return v;
        } catch (e) {
          console.error(`  ! ${p.slug}: ${(e as Error).message.slice(0, 90)}`);
          return null;
        }
      })
    );

    for (const v of results) if (v) done[v.slug] = v;
    scored += results.filter(Boolean).length;

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(done, null, 2));
    process.stdout.write(`\r  scored ${scored}/${candidates.length}`);
  }

  console.log("\n");
  const all = Object.values(done);
  const counts = { keep: 0, relabel: 0, rewrite: 0 } as Record<Verdict["action"], number>;
  for (const v of all) counts[v.action]++;
  console.log(`keep ${counts.keep}   relabel ${counts.relabel}   rewrite ${counts.rewrite}`);
  const bigDrops = all
    .filter((v) => v.currentDifficulty - v.rubricDifficulty >= 4)
    .sort((a, b) => b.currentDifficulty - b.rubricDifficulty - (a.currentDifficulty - a.rubricDifficulty));
  console.log(`\n${bigDrops.length} problems overstated by 4+ difficulty points:`);
  for (const v of bigDrops.slice(0, 20)) {
    console.log(`  ${v.slug}: ${v.currentDifficulty} → ${v.rubricDifficulty}  (${v.steps} steps) ${v.reason.slice(0, 80)}`);
  }
  // Relabelling shrinks the hard tail — that is the point, but it makes the
  // simulation-repetition problem worse before it makes it better, so the
  // authoring pass needs to know exactly how big the hole is per contest.
  const tail = new Map<string, { before: number; after: number }>();
  for (const { seed } of ALL_PROBLEMS) {
    if (!seed.competitionSlug) continue;
    const v = done[seed.slug];
    const now = v ? v.rubricDifficulty : seed.difficulty;
    const t = tail.get(seed.competitionSlug) ?? { before: 0, after: 0 };
    if (seed.difficulty >= 9) t.before++;
    if (now >= 9) t.after++;
    tail.set(seed.competitionSlug, t);
  }
  console.log(`\nHard tail (difficulty 9+) before → after relabelling:`);
  for (const [slug, t] of [...tail].sort((a, b) => b[1].before - b[1].after - (a[1].before - a[1].after))) {
    if (t.before === 0 && t.after === 0) continue;
    console.log(`  ${slug.padEnd(30)} ${String(t.before).padStart(3)} → ${String(t.after).padStart(3)}   (need ${Math.max(0, 25 - t.after)} more for a non-repetitive tail)`);
  }

  console.log(`\nWritten to ${OUT}`);
}

main();
