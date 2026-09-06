import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { CompetitionsForm } from "./competitions-form";

export default async function OnboardingCompetitionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [competitions, existing] = await Promise.all([
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
    prisma.userCompetition.findMany({ where: { userId: user.id } }),
  ]);

  const selectedSlugs = new Set(
    existing.map((e) => competitions.find((c) => c.id === e.competitionId)?.slug).filter(Boolean) as string[]
  );
  const primarySlug = competitions.find((c) => c.id === existing.find((e) => e.isPrimary)?.competitionId)?.slug;

  return (
    <OnboardingShell activeStep="COMPETITIONS">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">What are you training for?</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Select every competition you want to prepare for — you can change this anytime.
        </p>

        <div className="mt-8">
          <CompetitionsForm
            competitions={competitions}
            initialSelected={Array.from(selectedSlugs)}
            initialPrimary={primarySlug}
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
