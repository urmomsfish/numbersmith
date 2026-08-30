"use client";

import { useRouter } from "next/navigation";
import { ProblemSolver, type SolverProblem } from "@/components/practice/problem-solver";

export function SolverPageClient({
  problem,
  nextSlug,
}: {
  problem: SolverProblem;
  nextSlug?: string;
}) {
  const router = useRouter();

  return (
    <ProblemSolver
      problem={problem}
      continueLabel={nextSlug ? "Next Problem →" : "Back to Database →"}
      onContinue={() => {
        router.push(nextSlug ? `/practice/${nextSlug}` : "/practice");
        router.refresh();
      }}
    />
  );
}
