import "server-only";
import { prisma } from "@/lib/prisma";
import { difficultyRamp } from "@/lib/engine/simulation";
import { SCORING, expectedCorrect } from "@/lib/score-model";

/** Database half of the contest-score predictor. The arithmetic it relies on
 * lives in src/lib/score-model.ts, which is pure so it can be tested. */

export type Prediction = {
  slug: string;
  name: string;
  rating: number;
  expected: number;
  display: string;
  /** Questions on the paper. Carried through because a benchmark has to be
   * quoted against its own contest — MATHCOUNTS Sprint is out of 30, not 25,
   * and hardcoding a denominator in the view got that wrong. */
  questions: number;
  /** Benchmarks with the gap in questions, negative once already cleared. */
  targets: { label: string; raw: number; gap: number; note?: string }[];
};

/** Which rating category drives a given contest. Mirrors
 * ratingCategoryForCompetition so the predictor and the rating agree. */
function categoryFor(slug: string): string {
  if (slug.startsWith("amc") || slug === "aime") return "AMC";
  if (slug === "mathcounts") return "MATHCOUNTS";
  return "OVERALL";
}

/**
 * Predictions for the contests this student has actually chosen, so the page
 * does not list twenty-one scores nobody asked about.
 *
 * The difficulty multiset comes from the same ramp the simulator builds a paper
 * from, which means the prediction is for the paper the product would actually
 * hand them rather than an idealised one.
 */
export async function predictionsFor(userId: string): Promise<Prediction[]> {
  const chosen = await prisma.userCompetition.findMany({
    where: { userId },
    include: { competition: true },
    orderBy: { isPrimary: "desc" },
  });
  if (chosen.length === 0) return [];

  const ratings = await prisma.rating.findMany({ where: { userId } });
  const ratingBy = new Map(ratings.map((r) => [r.category, r.value]));
  const overall = ratingBy.get("OVERALL") ?? 1000;

  const out: Prediction[] = [];
  for (const uc of chosen) {
    const c = uc.competition;
    const model = SCORING[c.slug];
    if (!model) continue; // only contests with a scoring convention worth quoting

    const rating = ratingBy.get(categoryFor(c.slug)) ?? overall;
    const difficulties = difficultyRamp(c.difficultyMin, c.difficultyMax, model.questions);
    const expected = expectedCorrect(rating, difficulties);

    out.push({
      slug: c.slug,
      name: c.name,
      rating,
      expected,
      display: model.display(expected),
      questions: model.questions,
      targets: model.benchmarks.map((b) => ({
        label: b.label,
        raw: b.raw,
        gap: b.raw - expected,
        note: b.note,
      })),
    });
  }
  return out;
}
