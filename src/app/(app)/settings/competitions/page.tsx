import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditCompetitionsForm } from "./edit-form";

export default async function EditCompetitionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [competitions, existing] = await Promise.all([
    prisma.competition.findMany({ orderBy: { order: "asc" } }),
    prisma.userCompetition.findMany({ where: { userId: user.id } }),
  ]);

  const byId = new Map(competitions.map((c) => [c.id, c]));
  const selected = existing.map((e) => byId.get(e.competitionId)?.slug).filter(Boolean) as string[];
  const primary = byId.get(existing.find((e) => e.isPrimary)?.competitionId ?? "")?.slug;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/settings" className="text-sm font-medium text-slate-700 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        ← Settings
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-50">Edit My Competitions</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Changing your competitions rebuilds your training plan and dashboard recommendations.
      </p>

      <div className="mt-6">
        <EditCompetitionsForm
          competitions={competitions}
          initialSelected={selected}
          initialPrimary={primary}
        />
      </div>
    </div>
  );
}
