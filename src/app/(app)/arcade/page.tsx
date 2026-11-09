import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startQuestAction } from "@/lib/actions/quest-actions";
import { questRecord } from "@/lib/engine/quest";
import {
  HERO_MAX_HP,
  REGIONS,
  REGION_SPECS,
  RELIC_SLOTS,
  type Region,
} from "@/lib/quest-rules";

export const metadata = { title: "The Forgelands" };

export default async function ArcadePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { best, runs } = await questRecord(user.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-card p-8 dark:border-slate-700">
        <div className="text-center">
          <Badge tone="ember" className="mb-3">
            Quest
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            The Forgelands
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Three regions stand between you and the way out, and something is on the road in each of
            them. Your hammer is the problem in front of you: solve it and you strike, miss it and
            they do.
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Best run", best ? best.toLocaleString() : "—"],
            ["Health", String(HERO_MAX_HP)],
            ["Relic slots", String(RELIC_SLOTS)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="text-[11px] uppercase tracking-wide text-slate-700 dark:text-slate-500">
                {k}
              </dt>
              <dd className="text-lg font-bold tabular-nums text-slate-900 dark:text-slate-50">{v}</dd>
            </div>
          ))}
        </dl>

        {/* The journey, stated up front. A quest whose shape is a surprise is
            just a corridor you cannot see the end of. */}
        <ol className="mt-6 space-y-2">
          {REGIONS.map((r, i) => {
            const spec = REGION_SPECS[r as Region];
            return (
              <li
                key={r}
                className="flex items-start gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 dark:border-slate-700"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {spec.name}
                  </span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">
                    {spec.subtitle}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <ul className="mt-6 space-y-1.5 text-left text-sm text-slate-700 dark:text-slate-400">
          <li>• At every step you choose your road — a fight, a cache, or a forge to mend at.</li>
          <li>• A right answer is a blow; a wrong one or a slow one is theirs.</li>
          <li>• Champions and Wardens drop relics, and relics rewrite the rules.</li>
          <li>• Run out of health and the quest ends. Your score stands.</li>
        </ul>

        <form action={startQuestAction} className="mt-7">
          <Button type="submit" size="lg" className="w-full">
            Set out
          </Button>
        </form>
      </div>

      {runs.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-card p-5 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Past quests</h2>
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {runs.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="font-bold tabular-nums text-slate-900 dark:text-slate-50">
                  {r.score.toLocaleString()}
                  {r.phase === "WON" && (
                    <span className="ml-2 text-[11px] font-semibold uppercase text-ember-600 dark:text-ember-500">
                      Cleared
                    </span>
                  )}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {REGION_SPECS[r.region as Region]?.name ?? r.region} · {r.correct}/{r.answered}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
