import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveDisputeAction } from "@/lib/actions/dispute-actions";

const REASON_LABELS: Record<string, string> = {
  ANSWER_WRONG: "Answer key looks wrong",
  SOLUTION_UNCLEAR: "Solution doesn't make sense",
  AMBIGUOUS_WORDING: "Question is ambiguous",
  OTHER: "Other",
};

export default async function AdminDisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status === "resolved" ? { status: { not: "OPEN" } } : { status: "OPEN" };

  const [disputes, openCount] = await Promise.all([
    prisma.problemDispute.findMany({
      where: filter,
      include: {
        problem: { select: { id: true, slug: true, question: true, answer: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: status === "resolved" ? "desc" : "asc" },
      take: 100,
    }),
    prisma.problemDispute.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Problem Disputes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Students flagging a problem they believe is wrong. Resolving one does not edit the
            problem — jump to its edit page to actually make a fix, then come back and resolve.
          </p>
        </div>
        <div className="flex gap-2 text-sm font-medium">
          <Link
            href="/admin/disputes"
            className={!status || status !== "resolved" ? "text-brand-600" : "text-slate-400 hover:text-slate-600"}
          >
            Open{openCount > 0 ? ` (${openCount})` : ""}
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href="/admin/disputes?status=resolved"
            className={status === "resolved" ? "text-brand-600" : "text-slate-400 hover:text-slate-600"}
          >
            Resolved
          </Link>
        </div>
      </div>

      {disputes.length === 0 ? (
        <p className="mt-10 text-sm text-slate-400">
          {status === "resolved" ? "No resolved disputes yet." : "No open disputes. Nothing to review."}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="warning">{REASON_LABELS[d.reason] ?? d.reason}</Badge>
                    {status === "resolved" && (
                      <Badge tone={d.status === "UPHELD" ? "success" : "slate"}>{d.status}</Badge>
                    )}
                    <span className="text-xs text-slate-400">
                      {d.createdAt.toLocaleDateString()} · {d.user.name} ({d.user.email})
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-800">{d.problem.question}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      Student answered: <span className="font-mono text-slate-700">{d.theirAnswer}</span>
                    </span>
                    <span>
                      Key said (at report time):{" "}
                      <span className="font-mono text-slate-700">{d.storedAnswer}</span>
                    </span>
                    <span>
                      Key says now:{" "}
                      <span className="font-mono text-slate-700">{d.problem.answer}</span>
                    </span>
                  </div>
                  {d.message && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      &ldquo;{d.message}&rdquo;
                    </p>
                  )}
                  {d.adminResponse && (
                    <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
                      Response: {d.adminResponse}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/problems/${d.problem.id}`}
                  className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Edit problem →
                </Link>
              </div>

              {d.status === "OPEN" && (
                <form action={resolveDisputeAction} className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
                  <input type="hidden" name="disputeId" value={d.id} />
                  <div className="flex-1 min-w-[200px]">
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Response to student (optional)
                    </label>
                    <input
                      type="text"
                      name="adminResponse"
                      placeholder="e.g. Fixed — thanks for catching this."
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <Button type="submit" name="status" value="UPHELD" size="sm">
                    Uphold — they&apos;re right
                  </Button>
                  <Button type="submit" name="status" value="REJECTED" variant="outline" size="sm">
                    Reject — key is correct
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
