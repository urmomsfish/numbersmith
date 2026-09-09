import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/cn";
import { ProgressBar } from "@/components/ui/progress";

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [achievements, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    prisma.userAchievement.findMany({ where: { userId: user.id } }),
  ]);

  const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Achievements</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {unlocked.length} of {achievements.length} unlocked. Every achievement is earned through
        practice — never purchased.
      </p>
      <ProgressBar
        value={unlocked.length}
        max={achievements.length}
        tone="ember"
        className="mt-3 max-w-sm"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => {
          const unlockedAt = unlockedMap.get(a.id);
          return (
            <div
              key={a.id}
              className={cn(
                "rounded-xl border p-4",
                unlockedAt ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950" : "border-slate-200 bg-card dark:border-slate-700"
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn("text-2xl", !unlockedAt && "opacity-30 grayscale")}>{a.icon}</span>
                <div className="min-w-0">
                  <p className={cn("text-sm font-bold", unlockedAt ? "text-amber-900" : "text-slate-800")}>
                    {a.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{a.description}</p>
                  <p className="mt-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {unlockedAt ? `Unlocked ${unlockedAt.toLocaleDateString()}` : `+${a.xpReward} XP`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
