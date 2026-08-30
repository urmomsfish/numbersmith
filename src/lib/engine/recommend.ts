import "server-only";
import { prisma } from "@/lib/prisma";

/** Recommends a starting competition track from grade + placement rating.
 * Returns both a primary competition slug (used as a real FK) and a
 * human-readable label that may combine two tracks, matching the product
 * spec's "AMC 8 Advanced / MathCounts Advanced" style recommendations. */
export function recommendCompetitionSlug(grade: number, rating: number): { slug: string; label: string } {
  if (grade <= 4) {
    return rating >= 1300
      ? { slug: "math-kangaroo", label: "Math Kangaroo Advanced / MOEMS" }
      : { slug: "math-kangaroo", label: "Math Kangaroo" };
  }
  if (grade <= 5) {
    return rating >= 1400
      ? { slug: "moems", label: "MOEMS Advanced / Math Kangaroo" }
      : { slug: "moems", label: "MOEMS" };
  }
  if (grade <= 8) {
    return rating >= 1500
      ? { slug: "amc8", label: "AMC 8 Advanced / MathCounts Advanced" }
      : { slug: "mathcounts", label: "MathCounts / AMC 8 Foundations" };
  }
  if (grade <= 10) {
    return rating >= 1800
      ? { slug: "aime", label: "AMC 10 Advanced / AIME Prep" }
      : { slug: "amc10", label: "AMC 10" };
  }
  return rating >= 2000
    ? { slug: "usamo", label: "AIME Advanced / Olympiad Prep" }
    : { slug: "amc12", label: "AMC 12 / AIME" };
}

export async function recommendCompetition(grade: number, rating: number) {
  const { slug, label } = recommendCompetitionSlug(grade, rating);
  const competition = await prisma.competition.findUnique({ where: { slug } });
  return { competition, label };
}
