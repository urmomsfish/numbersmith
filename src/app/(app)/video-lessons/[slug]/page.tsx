import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel } from "@/lib/types";
import { ScenePlayer } from "@/components/video-lessons/scene-player";
import type { Scene } from "@/lib/video-lessons/types";

export default async function VideoLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!(await isProUser(user.id))) redirect("/pricing?from=video-lesson");

  const { slug } = await params;
  const lesson = await prisma.videoLesson.findUnique({
    where: { slug },
    include: { topic: true },
  });
  if (!lesson) notFound();

  const progress = await prisma.videoLessonProgress.findUnique({
    where: { userId_videoLessonId: { userId: user.id, videoLessonId: lesson.id } },
  });

  const scenes = JSON.parse(lesson.scenes) as Scene[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/video-lessons"
        className="text-sm font-medium text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
      >
        ← Video Lessons
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="brand">{lesson.topic.name}</Badge>
        <Badge tone="slate">{difficultyLabel(lesson.difficulty)}</Badge>
        <Badge tone="slate">{lesson.durationMinutes} min</Badge>
        <Badge tone="warning">⭐ Pro</Badge>
      </div>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">{lesson.title}</h1>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>

      <div className="mt-6">
        <ScenePlayer videoLessonId={lesson.id} scenes={scenes} alreadyCompleted={progress?.completed ?? false} />
      </div>
    </div>
  );
}
