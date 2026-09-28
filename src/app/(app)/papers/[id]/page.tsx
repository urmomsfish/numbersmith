import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { formatInstantDay } from "@/lib/date-only";
import { StartPaperButton, DeletePaperButton } from "./paper-panels";

/** One paper: sit it, or look at how previous sittings went.
 *
 * Matched by id *and* `userId` in a single query, so another account's paper id
 * is indistinguishable from one that does not exist. */
export default async function PaperPage({ params }: PageProps<"/papers/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const paper = await prisma.uploadedPaper.findFirst({
    where: { id, userId: user.id },
    include: { attempts: { orderBy: { startedAt: "desc" } } },
  });
  if (!paper) redirect("/papers");

  const submitted = paper.attempts.filter((a) => a.status === "SUBMITTED");
  const open = paper.attempts.find((a) => a.status === "IN_PROGRESS");
  const best = submitted.reduce((m, a) => Math.max(m, a.correctCount), 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/papers"
        className="text-xs font-medium text-slate-600 hover:text-foreground dark:text-slate-400"
      >
        ← All papers
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{paper.title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {paper.questionCount} questions · {paper.timeLimitMinutes} minutes · added{" "}
            {formatInstantDay(paper.createdAt)}
          </p>
        </div>
        <DeletePaperButton paperId={paper.id} title={paper.title} />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Sittings</dt>
          <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">{submitted.length}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <dt className="text-[11px] uppercase text-slate-700 dark:text-slate-500">Best</dt>
          <dd className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {submitted.length > 0 ? `${best}/${paper.questionCount}` : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <StartPaperButton paperId={paper.id} resuming={!!open} />
        {open && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            You have a sitting already open — resuming keeps its clock, so the
            time you have used still counts.
          </p>
        )}
      </div>

      {submitted.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Previous sittings
          </h2>
          <div className="mt-3 space-y-2">
            {submitted.map((a) => (
              <Card key={a.id}>
                <CardBody className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {a.correctCount}/{paper.questionCount}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {a.submittedAt ? formatInstantDay(a.submittedAt) : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {Math.round((a.correctCount / Math.max(1, paper.questionCount)) * 100)}%
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-xs text-slate-600 dark:text-slate-400">
        Papers are marked against the key you typed in, and deliberately don&rsquo;t
        touch your rating, XP or streak — those come from the NumberSmith problem
        bank, where the answers are ours and verified.
      </p>
    </div>
  );
}
