import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { isProUser } from "@/lib/subscription";
import { difficultyLabel } from "@/lib/types";
import { LessonPractice } from "./lesson-practice";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: {
      topic: true,
      practiceProblems: {
        include: { problem: { include: { topic: true } } },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!lesson) notFound();

  if (lesson.isPremium && !(await isProUser(user.id))) redirect("/pricing?from=lesson");

  const practice = lesson.practiceProblems.filter((lp) => lp.role === "PRACTICE");
  const challenge = lesson.practiceProblems.find((lp) => lp.role === "CHALLENGE");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/lessons" className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        ← Lessons
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="brand">{lesson.topic.name}</Badge>
        <Badge tone="slate">{difficultyLabel(lesson.difficulty)}</Badge>
        {lesson.isPremium && <Badge tone="warning">⭐ Pro</Badge>}
      </div>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">{lesson.title}</h1>

      <div className="mt-6 space-y-4">
        <Section step={1} title="Concept">
          {lesson.concept}
        </Section>
        <Section step={2} title="Explanation">
          {lesson.explanation}
        </Section>
        <Section step={3} title="Worked Example">
          {lesson.workedExample}
        </Section>
        <Section step={4} title="Competition Strategy" tone="brand">
          {lesson.strategy}
        </Section>
        <Section step={5} title="Common Mistakes" tone="warning">
          {lesson.commonMistakes}
        </Section>
      </div>

      {practice.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              6
            </span>
            Practice
          </h2>
          <div className="mt-3">
            <LessonPractice
              lessonId={lesson.id}
              problems={practice.map((lp) => ({
                id: lp.problem.id,
                question: lp.problem.question,
                format: lp.problem.format,
                choices: parseChoices(lp.problem.choices),
                hints: parseHints(lp.problem.hints),
                difficulty: lp.problem.difficulty,
                topicName: lp.problem.topic.name,
              }))}
              challenge={
                challenge
                  ? {
                      id: challenge.problem.id,
                      question: challenge.problem.question,
                      format: challenge.problem.format,
                      choices: parseChoices(challenge.problem.choices),
                      hints: parseHints(challenge.problem.hints),
                      difficulty: challenge.problem.difficulty,
                      topicName: challenge.problem.topic.name,
                    }
                  : null
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  step,
  title,
  children,
  tone = "slate",
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  tone?: "slate" | "brand" | "warning";
}) {
  const toneClass = {
    slate: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
    brand: "border-brand-200 bg-brand-50/60 dark:border-brand-800 dark:bg-brand-950/40",
    warning: "border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/40",
  }[tone];

  return (
    <Card className={toneClass}>
      <CardBody>
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            {step}
          </span>
          {title}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{children}</p>
      </CardBody>
    </Card>
  );
}
