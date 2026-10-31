/**
 * Authors advanced "part two" video lessons for topics whose only lesson is an
 * introduction.
 *
 * The gap is measurable rather than assumed: every leaf topic already has a
 * video, but only 11 of 60 sit above difficulty 6, and nine topics carry 15 or
 * more difficulty-6+ problems while their lesson stops at d6 or below. Modular
 * arithmetic is the extreme case — 407 hard problems behind a lesson that ends
 * at difficulty 5.
 *
 * Everything the model returns is validated against the Scene union before it
 * is written. That is not defensive habit: `scenes` is JSON in the database and
 * ScenePlayer switches on `type` without a fallback, so one scene with a
 * mistyped kind or a missing field is a lesson that throws on the slide it
 * reaches rather than a lesson that looks slightly wrong. Anything that fails
 * validation is dropped and reported, never written.
 *
 *   npx tsx scripts/author-video-lessons.ts [--limit N] [--out FILE]
 */
import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "../src/generated/prisma";
import type { Scene, VideoLessonSeed } from "../src/lib/video-lessons/types";

const prisma = new PrismaClient();
const MODEL = "claude-opus-5";
const OUT = "scratch/video-lessons-advanced.json";

/** The topics to write for, chosen by the query described above. */
const TARGETS: Array<{ topicSlug: string; title: string; focus: string }> = [
  {
    topicSlug: "modular-arithmetic",
    title: "Modular Arithmetic II: Orders and Theorems",
    focus:
      "Fermat's little theorem, Euler's theorem, the order of an element, and using CRT to split a modulus. Show how to find the last digits of a large power.",
  },
  {
    topicSlug: "sequences",
    title: "Sequences II: Recursions and Telescoping",
    focus:
      "Linear recurrences, finding a closed form, telescoping sums and products, and recognising when a sequence is secretly geometric.",
  },
  {
    topicSlug: "factoring",
    title: "Factoring II: Clever Manipulations",
    focus:
      "Simon's Favourite Factoring Trick, difference of squares in disguise, factoring to solve Diophantine equations, and symmetric-polynomial substitutions.",
  },
  {
    topicSlug: "counting-probability",
    title: "Probability II: Complements and Symmetry",
    focus:
      "Complementary counting, symmetry arguments, conditional probability, and why 'at least one' almost always means subtract from 1.",
  },
  {
    topicSlug: "games-strategies",
    title: "Games II: Invariants and Winning Positions",
    focus:
      "P-positions and N-positions, invariants and monovariants, parity arguments, and working backwards from terminal states.",
  },
  {
    topicSlug: "expected-value",
    title: "Expected Value II: Linearity and Recursion",
    focus:
      "Linearity of expectation (including when events are dependent), indicator variables, and setting up expectation recursions for processes that repeat.",
  },
  {
    topicSlug: "diophantine-equations",
    title: "Diophantine Equations II: Bounding and Descent",
    focus:
      "Bounding a variable to a finite search, modular obstructions that rule out solutions, and factoring into a product of integers.",
  },
  {
    topicSlug: "counting-principles",
    title: "Counting II: Stars, Bars and Overcounting",
    focus:
      "Stars and bars with and without restrictions, counting with repetition, and the discipline of deciding what an arrangement is before counting it.",
  },
  {
    topicSlug: "inclusion-exclusion",
    title: "Inclusion-Exclusion II: Three Sets and Beyond",
    focus:
      "Three-set inclusion-exclusion, counting surjections, derangements, and spotting when complementary counting is the shorter route.",
  },
];

const SYSTEM = `You write scripted "video" lessons for a competition mathematics training app.
They are not films: each lesson is an array of scenes rendered on screen, so
every word must earn its place on a slide.

Return STRICT JSON only, matching exactly this shape:

{
  "durationMinutes": <integer 6-11>,
  "summary": "<one sentence, concrete, no marketing language>",
  "scenes": [ <8 to 10 scenes> ]
}

A scene is exactly one of these shapes — no other "type" value is legal:

{"type":"title","heading":string,"sub":string}
{"type":"text","heading":string,"bullets":[string,...],"diagram"?:Diagram}
{"type":"example","heading":string,"prompt":string,"bullets":[string,...],"diagram"?:Diagram}
{"type":"strategy","heading":string,"bullets":[string,...]}
{"type":"pitfall","heading":string,"bullets":[string,...]}
{"type":"practice","heading":string,"prompt":string,"answer":string}
{"type":"summary","heading":string,"bullets":[string,...]}

A Diagram is exactly one of — omit it entirely rather than inventing a kind:

{"kind":"numberline","min":number,"max":number,"points":[{"value":number,"label":string,"tone"?:"brand"|"success"|"warning"}],"note"?:string}
{"kind":"bars","total":number,"segments":[{"label":string,"value":number,"tone"?:"brand"|"success"|"warning"|"slate"}],"note"?:string}
{"kind":"equationSteps","lines":[{"expr":string,"note"?:string}]}
{"kind":"triangleAngles","angles":[number,number,number],"labels":[string,string,string]}
{"kind":"circle","radius":number,"showRadius"?:boolean}
{"kind":"vennTwo","left":{"label":string,"onlyCount":number},"right":{"label":string,"onlyCount":number},"both":number,"universe"?:number}
{"kind":"modularClock","modulus":number,"highlight":[number,...],"note"?:string}
{"kind":"countingTree","root":string,"branches":[{"label":string,"children"?:[...]}]}

Rules:
- Open with exactly one "title" scene and close with exactly one "summary".
- Include at least one "example", one "pitfall", and one "practice".
- The "practice" answer must be a short final value, not a worked solution.
- Write maths in plain ASCII: x^2, a^(m+n), 3/4, sqrt(5), >=, mod. The renderer
  typesets it. Never use LaTeX or backslashes.
- Bullets are single sentences. Three to five per scene.
- This is the SECOND lesson on its topic, aimed at AMC 10 / AIME level. Assume
  the basics are known and teach the move a competitor actually needs; do not
  re-explain the definition.
- Every worked claim must be arithmetically correct. A wrong number on a slide
  is worse than a slide that does not exist.`;

type Authored = { durationMinutes: number; summary: string; scenes: Scene[] };

const TONES = new Set(["brand", "success", "warning", "slate"]);
const isStr = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const isBullets = (v: unknown) =>
  Array.isArray(v) && v.length > 0 && v.every(isStr);

/** Rejects anything ScenePlayer could not render. */
function diagramIsValid(d: unknown): boolean {
  if (d === undefined) return true;
  if (typeof d !== "object" || d === null) return false;
  const k = (d as { kind?: unknown }).kind;
  const o = d as Record<string, unknown>;
  switch (k) {
    case "numberline":
      return (
        typeof o.min === "number" &&
        typeof o.max === "number" &&
        Array.isArray(o.points) &&
        o.points.every(
          (p) =>
            typeof (p as { value?: unknown }).value === "number" &&
            isStr((p as { label?: unknown }).label) &&
            ((p as { tone?: unknown }).tone === undefined ||
              TONES.has(String((p as { tone?: unknown }).tone)))
        )
      );
    case "bars":
      return (
        typeof o.total === "number" &&
        Array.isArray(o.segments) &&
        o.segments.every(
          (s) =>
            typeof (s as { value?: unknown }).value === "number" &&
            typeof (s as { label?: unknown }).label === "string"
        )
      );
    case "equationSteps":
      return (
        Array.isArray(o.lines) &&
        o.lines.length > 0 &&
        o.lines.every((l) => isStr((l as { expr?: unknown }).expr))
      );
    case "triangleAngles":
      return (
        Array.isArray(o.angles) &&
        o.angles.length === 3 &&
        o.angles.every((a) => typeof a === "number") &&
        Array.isArray(o.labels) &&
        o.labels.length === 3 &&
        o.labels.every(isStr)
      );
    case "circle":
      return typeof o.radius === "number";
    case "vennTwo":
      return (
        typeof o.both === "number" &&
        typeof (o.left as { onlyCount?: unknown })?.onlyCount === "number" &&
        typeof (o.right as { onlyCount?: unknown })?.onlyCount === "number"
      );
    case "modularClock":
      return (
        typeof o.modulus === "number" &&
        Array.isArray(o.highlight) &&
        o.highlight.every((h) => typeof h === "number")
      );
    case "countingTree":
      return isStr(o.root) && Array.isArray(o.branches);
    default:
      return false;
  }
}

function sceneIsValid(s: unknown): s is Scene {
  if (typeof s !== "object" || s === null) return false;
  const o = s as Record<string, unknown>;
  switch (o.type) {
    case "title":
      return isStr(o.heading) && isStr(o.sub);
    case "text":
      return isStr(o.heading) && isBullets(o.bullets) && diagramIsValid(o.diagram);
    case "example":
      return (
        isStr(o.heading) && isStr(o.prompt) && isBullets(o.bullets) && diagramIsValid(o.diagram)
      );
    case "strategy":
    case "pitfall":
    case "summary":
      return isStr(o.heading) && isBullets(o.bullets);
    case "practice":
      return isStr(o.heading) && isStr(o.prompt) && isStr(o.answer);
    default:
      return false;
  }
}

/** Shape rules the schema cannot express — a lesson that opens mid-thought or
 * never asks the learner to do anything is valid JSON and a bad lesson. */
function lessonProblems(a: Authored): string[] {
  const out: string[] = [];
  const kinds = a.scenes.map((s) => s.type);
  if (kinds[0] !== "title") out.push("does not open with a title scene");
  if (kinds[kinds.length - 1] !== "summary") out.push("does not close with a summary");
  for (const required of ["example", "pitfall", "practice"] as const) {
    if (!kinds.includes(required)) out.push(`has no ${required} scene`);
  }
  if (a.scenes.length < 8 || a.scenes.length > 11) {
    out.push(`has ${a.scenes.length} scenes (want 8-11)`);
  }
  if (/\\[a-z]/.test(JSON.stringify(a.scenes))) out.push("contains LaTeX escapes");
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const limit = Number(args[args.indexOf("--limit") + 1]) || Infinity;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Run with:  set -a && . ./.env && set +a");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const done: Record<string, VideoLessonSeed> = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, "utf8"))
    : {};

  const todo = TARGETS.filter((t) => !done[t.topicSlug]).slice(0, limit);
  console.log(`${Object.keys(done).length} already authored; ${todo.length} to write.\n`);

  for (const target of todo) {
    const topic = await prisma.topic.findUnique({
      where: { slug: target.topicSlug },
      select: { name: true, parent: { select: { name: true } } },
    });
    if (!topic) {
      console.log(`  ! ${target.topicSlug}: no such topic, skipped`);
      continue;
    }

    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 8000,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `Topic: ${topic.name} (${topic.parent?.name ?? "—"})
Lesson title: ${target.title}
Difficulty: 8 of 10 — AMC 10 / AIME level.

What this lesson must cover:
${target.focus}`,
          },
        ],
      });
      const block = res.content.find((b) => b.type === "text");
      const raw = block?.type === "text" ? block.text : "";
      const parsed = JSON.parse(
        raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
      ) as Authored;

      const bad = parsed.scenes.filter((s) => !sceneIsValid(s));
      const problems = lessonProblems(parsed);
      if (bad.length || problems.length) {
        console.log(`  ! ${target.topicSlug}: rejected`);
        for (const p of problems) console.log(`      ${p}`);
        for (const b of bad.slice(0, 3)) {
          console.log(`      invalid scene: ${JSON.stringify(b).slice(0, 110)}`);
        }
        continue;
      }

      done[target.topicSlug] = {
        slug: `${target.topicSlug}-advanced`,
        title: target.title,
        topicSlug: target.topicSlug,
        difficulty: 8,
        durationMinutes: parsed.durationMinutes,
        summary: parsed.summary,
        scenes: parsed.scenes,
      };
      mkdirSync(dirname(OUT), { recursive: true });
      writeFileSync(OUT, JSON.stringify(done, null, 2));
      console.log(
        `  ✓ ${target.topicSlug.padEnd(24)} ${parsed.scenes.length} scenes, ${parsed.durationMinutes} min`
      );
    } catch (e) {
      console.log(`  ! ${target.topicSlug}: ${(e as Error).message.slice(0, 110)}`);
    }
  }

  console.log(`\n${Object.keys(done).length} lessons in ${OUT}`);
}

main().finally(() => prisma.$disconnect());
