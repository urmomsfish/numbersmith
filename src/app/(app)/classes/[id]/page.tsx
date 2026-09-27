import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { ratingTier } from "@/lib/types";
import { formatDateOnly } from "@/lib/date-only";
import {
  classRoster,
  classAssignments,
  MAX_ASSIGNMENT_PROBLEMS,
} from "@/lib/engine/coach";
import {
  CreateAssignmentForm,
  DeleteAssignmentButton,
  DeleteClassButton,
  JoinCodePanel,
  RemoveMemberButton,
} from "./coach-panels";

/** How many days without practice before a student is worth flagging to the
 * coach. Four rather than one: a student who trains on weekends is not lapsing,
 * and a warning that fires on everybody every Tuesday is a warning nobody
 * reads. */
const STALE_DAYS = 4;

/** Reads `daysSinceActive`, which the engine computed against a single
 * request-wide clock. Deriving it here would mean calling Date.now() once per
 * row mid-render — impure, and able to disagree with itself across a midnight. */
function lastActiveLabel(days: number | null): string {
  if (days === null) return "never";
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

/**
 * The coach's view of one class.
 *
 * Reachable only by the account that owns the class — and the check is a
 * `findFirst` pairing the id with `teacherId`, not a fetch-then-compare, so
 * there is no window in which the row is in hand before the decision is made.
 *
 * What the roster shows is bounded on purpose. A coach gets progress: rating,
 * streak, volume, accuracy, and how far each student has got with the work they
 * themselves set. Not email addresses, not Smith AI conversations, not the other
 * classes a student belongs to. `npm run verify:coach-privacy` enforces the
 * field list against the User model so a column added later cannot leak through
 * this page by default.
 */
export default async function ClassDetailPage({ params }: PageProps<"/classes/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const classRoom = await prisma.classRoom.findFirst({
    where: { id, teacherId: user.id },
  });
  // Deliberately the same outcome as a class that does not exist: a coach
  // probing ids learns nothing about which ones are real.
  if (!classRoom) redirect("/classes");

  const roster = await classRoster(classRoom.id);
  const assignments = await classAssignments(
    classRoom.id,
    roster.map((r) => r.userId)
  );
  const topics = await prisma.topic.findMany({
    where: { parentId: { not: null } },
    orderBy: { order: "asc" },
    include: { parent: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/classes"
        className="text-xs font-medium text-slate-600 hover:text-foreground dark:text-slate-400"
      >
        ← All classes
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {classRoom.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {roster.length} {roster.length === 1 ? "student" : "students"}
          </p>
        </div>
        <DeleteClassButton classId={classRoom.id} name={classRoom.name} />
      </div>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Join code</h2>
          <p className="mb-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
            Share this with your students. Anyone with the code can join and you
            will then see their progress, so treat it like a key — issue a new
            one if it gets out.
          </p>
          <JoinCodePanel classId={classRoom.id} joinCode={classRoom.joinCode} />
        </CardBody>
      </Card>

      {/* ------------------------------ roster ------------------------------ */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Roster</h2>
        {roster.length === 0 ? (
          <Card className="mt-3">
            <CardBody>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Nobody has joined yet. Give your students the code above — they
                join themselves, so there is nothing for you to send.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-[34rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-semibold">Student</th>
                  <th className="px-4 py-2 font-semibold">Rating</th>
                  <th className="px-4 py-2 font-semibold">Streak</th>
                  <th className="px-4 py-2 font-semibold">Solved</th>
                  <th className="px-4 py-2 font-semibold">Accuracy</th>
                  <th className="px-4 py-2 font-semibold">Last active</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {roster.map((r) => {
                  const stale = (r.daysSinceActive ?? Infinity) >= STALE_DAYS;
                  return (
                    <tr key={r.userId}>
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-50">
                        {r.name}
                      </td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                        {r.rating !== null ? (
                          <>
                            {r.rating}{" "}
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {ratingTier(r.rating).label}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                        {r.streak > 0 ? `${r.streak}d` : "—"}
                      </td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                        {r.problemsSolved}
                      </td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                        {r.accuracy !== null ? `${r.accuracy}%` : "—"}
                      </td>
                      <td
                        className={
                          stale
                            ? "px-4 py-2 font-medium text-amber-700 dark:text-amber-400"
                            : "px-4 py-2 text-slate-700 dark:text-slate-300"
                        }
                      >
                        {lastActiveLabel(r.daysSinceActive)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <RemoveMemberButton
                          classId={classRoom.id}
                          userId={r.userId}
                          name={r.name}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------------------- assignments ---------------------------- */}
      <section className="mt-8">
        {/* The heading is passed in rather than rendered here, because the
            component has to own the row: the trigger sits on the right of the
            heading, but the form it opens needs the full width. Rendered as a
            sibling inside a `justify-between` row, the open form was squeezed
            into the right-hand half. */}
        <CreateAssignmentForm
          heading={
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Assignments</h2>
          }
          classId={classRoom.id}
          maxProblems={MAX_ASSIGNMENT_PROBLEMS}
          topics={topics.map((t) => ({
            id: t.id,
            name: t.name,
            group: t.parent?.name ?? "Other",
          }))}
        />

        {assignments.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Nothing set yet. An assignment is a fixed set of problems — the same
            ones for everyone, so the results are comparable.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {assignments.map((a) => (
                <Card key={a.id}>
                  <CardBody>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{a.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {a.problemCount} problems
                          {a.dueAt && (
                            <>
                              {" · "}
                              <span
                                className={
                                  a.overdue ? "text-danger-600 dark:text-red-400" : undefined
                                }
                              >
                                due {formatDateOnly(a.dueAt)}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/practice/assignment/${a.id}`}
                          className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          Preview
                        </Link>
                        <DeleteAssignmentButton
                          classId={classRoom.id}
                          assignmentId={a.id}
                          title={a.title}
                        />
                      </div>
                    </div>

                    {roster.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {roster.map((r) => {
                          const c = a.completion.get(r.userId) ?? { attempted: 0, correct: 0 };
                          const pct =
                            a.problemCount > 0
                              ? Math.round((c.correct / a.problemCount) * 100)
                              : 0;
                          return (
                            <li key={r.userId} className="flex items-center gap-3 text-xs">
                              <span className="w-28 shrink-0 truncate text-slate-700 dark:text-slate-300">
                                {r.name}
                              </span>
                              <span
                                className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                                role="img"
                                aria-label={`${r.name}: ${c.correct} of ${a.problemCount} solved`}
                              >
                                <span
                                  className="block h-full rounded-full bg-brand-600"
                                  style={{ width: `${pct}%` }}
                                />
                              </span>
                              <span className="w-12 shrink-0 text-right tabular-nums text-slate-700 dark:text-slate-300">
                                {c.correct}/{a.problemCount}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </CardBody>
                </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
