import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel } from "@/lib/types";

export default async function LessonsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isPro = await isProUser(user.id);

  const [domains, lessons, progress] = await Promise.all([
    prisma.topic.findMany({ where: { parentId: null }, orderBy: { order: "asc" } }),
    prisma.lesson.findMany({
      include: { topic: { include: { parent: true } } },
      orderBy: [{ difficulty: "asc" }, { order: "asc" }],
    }),
    prisma.lessonProgress.findMany({ where: { userId: user.id } }),
  ]);

  const progressByLessonId = new Map(progress.map((p) => [p.lessonId, p]));
  const completedCount = progress.filter((p) => p.completed).length;
  const freeCount = lessons.filter((l) => !l.isPremium).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Lessons</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Structured competition-math lessons: Learn → Example → Practice → Challenge.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {completedCount} / {isPro ? lessons.length : freeCount} completed
          </p>
          <ProgressBar
            value={completedCount}
            max={isPro ? lessons.length : freeCount}
            className="mt-1.5 w-32"
            tone="success"
          />
        </div>
      </div>

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
                const locked = lesson.isPremium && !isPro;
                const p = progressByLessonId.get(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={locked ? "/pricing" : `/lessons/${lesson.slug}`}
                    className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">{lesson.title}</h3>
                      {locked ? (
                        <Badge tone="warning">⭐ Pro</Badge>
                      ) : p?.completed ? (
                        <Badge tone="success">Done</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lesson.concept}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <Badge tone="slate">{lesson.topic.name}</Badge>
                      <Badge tone="slate">{difficultyLabel(lesson.difficulty)}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {!isPro && (
        <div className="mt-10 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Unlock the Full Lesson Library</h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            The free plan includes {freeCount} introductory lessons. Pro unlocks all{" "}
            {lessons.length} lessons, including advanced competition strategy and olympiad technique.
          </p>
          <LinkButton href="/pricing" className="mt-4">
            Explore Pro
          </LinkButton>
        </div>
      )}
    </div>
  );
}
