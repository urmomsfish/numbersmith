"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDateOnly } from "@/lib/date-only";
import {
  createClassAction,
  joinClassAction,
  leaveClassAction,
} from "@/lib/actions/coach-actions";

/** Shared input styling, matched to the selects already used across the app. */
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50";

function Notice({ kind, children }: { kind: "error" | "ok"; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={
        kind === "error"
          ? "mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600 dark:bg-red-950 dark:text-red-400"
          : "mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-success-600 dark:bg-emerald-950 dark:text-emerald-400"
      }
    >
      {children}
    </p>
  );
}

export function JoinClassForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);

  return (
    <form
      action={(formData) =>
        start(async () => {
          setError(null);
          setJoined(null);
          const result = await joinClassAction(formData);
          if (result.ok) {
            setJoined(result.className);
            router.refresh();
          } else {
            setError(result.error);
          }
        })
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Join code
        </span>
        <input
          name="code"
          required
          autoComplete="off"
          // Upper-cased on the way in so what the student sees matches the code
          // they were given, and normalised again on the server regardless.
          className={`${inputClass} font-mono uppercase tracking-widest`}
          placeholder="ABCD2345"
        />
      </label>
      <Button type="submit" className="mt-3 w-full" disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </Button>
      {error && <Notice kind="error">{error}</Notice>}
      {joined && <Notice kind="ok">You&rsquo;re in {joined}.</Notice>}
    </form>
  );
}

export function CreateClassForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(formData) =>
        start(async () => {
          setError(null);
          const result = await createClassAction(formData);
          if (result.ok) router.refresh();
          else setError(result.error);
        })
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Class name
        </span>
        <input
          name="name"
          required
          className={inputClass}
          placeholder="Tuesday MATHCOUNTS club"
        />
      </label>
      <Button type="submit" variant="secondary" className="mt-3 w-full" disabled={pending}>
        {pending ? "Creating…" : "Create a class"}
      </Button>
      {error && <Notice kind="error">{error}</Notice>}
    </form>
  );
}

/** Leaving is always available and never asks a coach for permission — that is
 * the point of it. It does confirm, because the membership cannot be restored
 * without the code. */
export function LeaveClassButton({ classId, className }: { classId: string; className: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Leave ${className}? Your coach will stop seeing your progress.`)) return;
          start(async () => {
            const result = await leaveClassAction({ classId });
            if (result.ok) router.refresh();
            else setError(result.error);
          });
        }}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:bg-slate-800"
      >
        {pending ? "Leaving…" : "Leave"}
      </button>
      {error && <Notice kind="error">{error}</Notice>}
    </>
  );
}

/** Shaped by `studentAssignments`, which decides `complete` and `overdue` on
 * the server — a client component must not call Date.now() during render. */
export type StudentAssignment = {
  id: string;
  title: string;
  dueAt: Date | null;
  total: number;
  attempted: number;
  correct: number;
  complete: boolean;
  overdue: boolean;
};

export function AssignmentList({ assignments }: { assignments: StudentAssignment[] }) {
  if (assignments.length === 0) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        No work set yet.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {assignments.map((a) => {
        return (
          <li
            key={a.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                {a.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {a.correct}/{a.total} solved
                {a.dueAt && (
                  <>
                    {" · "}
                    <span
                      className={a.overdue ? "text-danger-600 dark:text-red-400" : undefined}
                    >
                      due {formatDateOnly(a.dueAt)}
                    </span>
                  </>
                )}
              </p>
            </div>
            {a.complete ? (
              <span className="shrink-0 text-xs font-semibold text-success-600 dark:text-emerald-400">
                Done
              </span>
            ) : (
              <Link
                href={`/practice/assignment/${a.id}`}
                className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Start
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
