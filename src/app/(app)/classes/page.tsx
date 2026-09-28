import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentAssignments } from "@/lib/engine/coach";
import { canCreateClasses } from "@/lib/types";
import {
  CreateClassForm,
  JoinClassForm,
  LeaveClassButton,
  AssignmentList,
} from "./student-panels";

/**
 * One page for both sides of coach mode.
 *
 * A coach and a student are not different account types here — a teacher can
 * also be in someone else's class — so the page shows whichever sections apply
 * rather than splitting into two routes.
 *
 * Starting a class needs the TEACHER or ADMIN role, so the card that does it is
 * only rendered for those accounts. That is presentation, not enforcement:
 * `createClassAction` checks the role itself, because a Server Action is a
 * public endpoint and a hidden button stops nobody.
 */
export default async function ClassesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const mayCoach = canCreateClasses(user.role);

  const [taught, memberships] = await Promise.all([
    prisma.classRoom.findMany({
      where: { teacherId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true, assignments: true } } },
    }),
    studentAssignments(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Classes</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {mayCoach
          ? "Start a class and share the code, or join one with a code you were given."
          : "Join a class with the code your coach gave you."}
      </p>

      {/* ---------------------------- coaching ---------------------------- */}
      {taught.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Classes you coach
          </h2>
          <div className="mt-3 space-y-2">
            {taught.map((c) => (
              <Link
                key={c.id}
                href={`/classes/${c.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-card px-4 py-3 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {c._count.members} {c._count.members === 1 ? "student" : "students"} ·{" "}
                    {c._count.assignments}{" "}
                    {c._count.assignments === 1 ? "assignment" : "assignments"}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm tracking-widest text-slate-700 dark:text-slate-300">
                  {c.joinCode}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------- attending ---------------------------- */}
      {memberships.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Your classes
          </h2>
          <div className="mt-3 space-y-3">
            {memberships.map((m) => (
              <Card key={m.classId}>
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
                        {m.className}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Coached by {m.coachName}
                      </p>
                    </div>
                    <LeaveClassButton classId={m.classId} className={m.className} />
                  </div>
                  <div className="mt-3">
                    <AssignmentList assignments={m.assignments} />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          {/* Said plainly rather than buried in a policy page: a student should
              know what joining a class actually exposed, and that it is
              reversible. */}
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            Your coach can see your name, rating, streak, accuracy and how far
            you&rsquo;ve got with their assignments. They can&rsquo;t see your
            email, your Smith AI chats, or anything from your other classes.
            Leave a class and they stop seeing you.
          </p>
        </section>
      )}

      {/* ---------------------------- get started ---------------------------- */}
      <section className={mayCoach ? "mt-8 grid gap-4 sm:grid-cols-2" : "mt-8 max-w-sm"}>
        <Card>
          <CardBody>
            <Badge tone="brand" className="mb-2">
              Student
            </Badge>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Join a class
            </h2>
            <p className="mb-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
              Your coach will give you an eight-character code.
            </p>
            <JoinClassForm />
          </CardBody>
        </Card>
        {mayCoach && (
          <Card>
            <CardBody>
              <Badge tone="ember" className="mb-2">
                Coach
              </Badge>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Start a class
              </h2>
              <p className="mb-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
                You&rsquo;ll get a code to share. Students join themselves.
              </p>
              <CreateClassForm />
            </CardBody>
          </Card>
        )}
      </section>

      {/* Told rather than hidden. A student who was expecting to start a class
          should learn why they cannot, not just fail to find the button. */}
      {!mayCoach && (
        <p className="mt-3 max-w-sm text-xs text-slate-600 dark:text-slate-400">
          Running a club? Classes are created by teacher accounts. Ask an admin
          to set yours up.
        </p>
      )}
    </div>
  );
}
