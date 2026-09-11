import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel } from "@/lib/types";

export default async function VideoLessonsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isPro = await isProUser(user.id);

  const [domains, lessons, progress] = await Promise.all([
    prisma.topic.findMany({ where: { parentId: null }, orderBy: { order: "asc" } }),
    prisma.videoLesson.findMany({
      include: { topic: { include: { parent: true } } },
      orderBy: [{ difficulty: "asc" }, { order: "asc" }],
    }),
    prisma.videoLessonProgress.findMany({ where: { userId: user.id } }),
  ]);

  const progressByLessonId = new Map(progress.map((p) => [p.videoLessonId, p]));
  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Video Lessons</h1>
            <Badge tone="warning">⭐ Pro</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Animated, narration-free walkthroughs — diagrams and worked examples you step through at your own pace.
          </p>
        </div>
        {isPro && (
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {completedCount} / {lessons.length} completed
            </p>
            <ProgressBar value={completedCount} max={lessons.length} className="mt-1.5 w-32" tone="success" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center dark:border-brand-800 dark:bg-brand-950">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Unlock {lessons.length} Video Lessons with Pro
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Every video lesson below is a Pro-exclusive feature. Upgrade to watch, and to track your progress
            across the full library.
          </p>
          <LinkButton href="/pricing?from=video-lessons" className="mt-4">
            Explore Pro
          </LinkButton>
        </div>
      )}

      {domains.map((domain) => {
        const domainLessons = lessons.filter(
          (l) => l.topic.parent?.id === domain.id || l.topic.id === domain.id
        );
        if (domainLessons.length === 0) return null;

        return (
          <section key={domain.id} className="mt-8">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{domain.name}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {domainLessons.map((lesson) => {
                const p = progressByLessonId.get(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={isPro ? `/video-lessons/${lesson.slug}` : "/pricing?from=video-lessons"}
                    className="flex flex-col rounded-xl border border-slate-200 bg-card p-4 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">{lesson.title}</h3>
                      {!isPro ? (
                        <Badge tone="warning">⭐ Pro</Badge>
                      ) : p?.completed ? (
                        <Badge tone="success">Done</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-400">
                      {lesson.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <Badge tone="slate">{lesson.topic.name}</Badge>
                      <Badge tone="slate">{difficultyLabel(lesson.difficulty)}</Badge>
                      <Badge tone="slate">{lesson.durationMinutes} min</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
