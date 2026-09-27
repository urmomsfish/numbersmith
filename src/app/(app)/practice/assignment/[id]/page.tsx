import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChoices, parseHints } from "@/lib/engine/scoring";
import { parseProblemIds } from "@/lib/engine/coach";
import { isProUser } from "@/lib/subscription";
import { hasReachedFreeDailyLimit } from "@/lib/actions/practice-actions";
import { DailyCapUpsell } from "@/components/practice/problem-solver";
import { SessionRunner } from "../../session/session-runner";

/**
 * Sits an assignment set by a coach.
 *
 * The problems are the stored ids, in the stored order, so every student in the
 * class gets the same set — which is the difference between an assignment and a
 * practice session.
 *
 * The assignment id here arrives from the URL, so membership is re-checked
 * against the database rather than assumed from having the link. Without that,
 * the link would be an unguarded read of any coach's assignment, which is not
 * catastrophic on its own but is exactly the habit that produces the
 * catastrophic version later. The coach may also open it, to see what they set.
 */
export default async function AssignmentPage({ params }: PageProps<"/practice/assignment/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const assignment = await prisma.teacherAssignment.findUnique({
    where: { id },
    include: { classRoom: { select: { id: true, name: true, teacherId: true } } },
  });
  if (!assignment) redirect("/classes");

  const isCoach = assignment.classRoom.teacherId === user.id;
  const isMember = isCoach
    ? true
    : (await prisma.classMembership.findUnique({
        where: { classId_userId: { classId: assignment.classId, userId: user.id } },
        select: { id: true },
      })) !== null;
  if (!isMember) redirect("/classes");

  if (await hasReachedFreeDailyLimit(user.id)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <DailyCapUpsell />
      </div>
    );
  }

  const ids = parseProblemIds(assignment.problemIds);
  const found = await prisma.problem.findMany({
    where: { id: { in: ids } },
    include: { topic: true },
  });
  // findMany returns rows in whatever order it likes; the assignment's order is
  // the stored one, so restore it rather than letting it vary per student.
  const byId = new Map(found.map((p) => [p.id, p]));
  const problems = ids.map((pid) => byId.get(pid)).filter((p): p is (typeof found)[number] => !!p);

  if (problems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          This assignment has no problems left.
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
          Ask your coach to set it again.
        </p>
      </div>
    );
  }

  const isPro = await isProUser(user.id);

  return (
    <SessionRunner
      topicName={assignment.title}
      focusMessage={`Set by your coach in ${assignment.classRoom.name}.`}
      isPro={isPro}
      problems={problems.map((p) => ({
        id: p.id,
        question: p.question,
        diagram: p.diagram,
        format: p.format,
        choices: parseChoices(p.choices),
        hints: parseHints(p.hints),
        difficulty: p.difficulty,
        topicName: p.topic.name,
      }))}
    />
  );
}
