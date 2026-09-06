import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import {
  FORMAT_LABEL,
  TEAM_LABEL,
  CATEGORY_LABEL,
  gradeRangeLabel,
  difficultyRangeLabel,
} from "@/lib/competition-meta";

export default async function CompetitionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [competitions, userCompetitions] = await Promise.all([
    prisma.competition.findMany({
      orderBy: { order: "asc" },
      include: { topics: { include: { topic: true }, orderBy: { weight: "desc" } } },
    }),
    prisma.userCompetition.findMany({ where: { userId: user.id } }),
  ]);

  const selectedIds = new Set(userCompetitions.map((uc) => uc.competitionId));
  const primaryId = userCompetitions.find((uc) => uc.isPrimary)?.competitionId;

  const categories = ["ELEMENTARY_MIDDLE", "HIGH_SCHOOL", "OLYMPIAD"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Competition Directory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {competitions.length} supported competitions with dedicated training tracks.
          </p>
        </div>
        <LinkButton href="/settings/competitions" variant="outline">
          Edit My Competitions
        </LinkButton>
      </div>

      {categories.map((category) => {
        const items = competitions.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-8">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/competitions/${c.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-colors hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {c.shortName}
                    </h3>
                    {selectedIds.has(c.id) && (
                      <Badge tone={c.id === primaryId ? "brand" : "success"}>
                        {c.id === primaryId ? "Primary" : "Training"}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{c.name}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone="slate">{gradeRangeLabel(c.gradeMin, c.gradeMax)}</Badge>
                    <Badge tone="slate">{FORMAT_LABEL[c.format]}</Badge>
                    <Badge tone="slate">{TEAM_LABEL[c.individualOrTeam]}</Badge>
                  </div>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {c.description}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                    <div>
                      <dt className="text-slate-400 dark:text-slate-500">Difficulty</dt>
                      <dd className="font-semibold text-slate-700 dark:text-slate-200">
                        {difficultyRangeLabel(c.difficultyMin, c.difficultyMax)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 dark:text-slate-500">Questions</dt>
                      <dd className="font-semibold text-slate-700 dark:text-slate-200">{c.numQuestions ?? "Varies"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 dark:text-slate-500">Time limit</dt>
                      <dd className="font-semibold text-slate-700 dark:text-slate-200">
                        {c.timeLimitMinutes ? `${c.timeLimitMinutes} min` : "Untimed"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 dark:text-slate-500">Region</dt>
                      <dd className="font-semibold text-slate-700 dark:text-slate-200">{c.region}</dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.topics.slice(0, 3).map((ct) => (
                      <span key={ct.id} className="text-[11px] text-slate-400 dark:text-slate-500">
                        {ct.topic.name}
                        {ct !== c.topics.slice(0, 3).at(-1) && " ·"}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        NumberSmith provides independent practice tracks modeled on the published formats of these
        competitions. All problems on NumberSmith are original content written by the NumberSmith team.
        NumberSmith is not affiliated with, endorsed by, or sponsored by any of the organizations that
        run these competitions.
      </p>
    </div>
  );
}
