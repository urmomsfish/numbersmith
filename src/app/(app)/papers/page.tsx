import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/subscription";
import { Card, CardBody } from "@/components/ui/card";
import { UploadPaperForm } from "./upload-form";

/**
 * A student's own past papers.
 *
 * Every paper here was uploaded by this account and is visible to no other, so
 * the list is scoped by `userId` and there is no browse or share surface at
 * all — deliberately, since these are files the student owns and we do not.
 */
export default async function PapersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const mayScan = await isProUser(user.id);

  const papers = await prisma.uploadedPaper.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      questionCount: true,
      timeLimitMinutes: true,
      createdAt: true,
      attempts: {
        where: { status: "SUBMITTED" },
        orderBy: { submittedAt: "desc" },
        select: { correctCount: true, submittedAt: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Past Papers</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {mayScan
          ? "Upload a paper you already have. NumberSmith reads the questions, works out the answers, and quizzes you on them against the clock."
          : "Upload a paper you already have, type in its answer key once, then sit it against the clock and get scored."}
      </p>

      {papers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Your papers</h2>
          <div className="mt-3 space-y-2">
            {papers.map((p) => {
              const best = p.attempts.reduce((m, a) => Math.max(m, a.correctCount), 0);
              return (
                <Link
                  key={p.id}
                  href={`/papers/${p.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-card px-4 py-3 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {p.questionCount} questions · {p.timeLimitMinutes} min
                      {p.attempts.length > 0 && ` · sat ${p.attempts.length}×`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                    {p.attempts.length > 0 ? `${best}/${p.questionCount}` : "—"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {papers.length > 0 ? "Add another" : "Add your first paper"}
        </h2>
        <Card className="mt-3">
          <CardBody>
            {/* Decides which upload path to offer, not whether scanning is
                allowed — `scanPaperAction` checks the role itself. */}
            <UploadPaperForm canScan={mayScan} />
          </CardBody>
        </Card>
      </section>

      {/* Said plainly and near the upload control, not buried in a policy
          page: the student is handing over a file, and should know what
          happens to it. */}
      <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
        Papers you upload are stored privately against your account. They are
        never shown to other students, never added to the NumberSmith problem
        bank, and never used to train anything. Delete a paper and the file goes
        with it. Only upload papers you are allowed to have.
      </p>
    </div>
  );
}
