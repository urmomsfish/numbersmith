"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  createAssignmentAction,
  deleteAssignmentAction,
  deleteClassAction,
  removeMemberAction,
  rotateJoinCodeAction,
} from "@/lib/actions/coach-actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ember-600/30 dark:border-slate-600 dark:text-slate-50";

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600 dark:bg-red-950 dark:text-red-400"
    >
      {children}
    </p>
  );
}

const subtleButton =
  "rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800";

export function JoinCodePanel({ classId, joinCode }: { classId: string; joinCode: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-lg tracking-widest text-slate-900 dark:bg-slate-800 dark:text-slate-50">
          {joinCode}
        </code>
        <button
          type="button"
          onClick={() => {
            // navigator.clipboard is unavailable on insecure origins and in some
            // embedded webviews, so a failure has to be survivable — the code is
            // on screen and can be read out either way.
            navigator.clipboard?.writeText(joinCode).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              },
              () => setError("Couldn't copy — read it off the screen instead.")
            );
          }}
          className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (
              !confirm(
                "Issue a new code? The old one stops working, but students already in the class stay in."
              )
            )
              return;
            start(async () => {
              const result = await rotateJoinCodeAction({ classId });
              if (result.ok) router.refresh();
              else setError(result.error);
            });
          }}
          className={subtleButton}
        >
          {pending ? "Issuing…" : "New code"}
        </button>
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
    </div>
  );
}

export function RemoveMemberButton({
  classId,
  userId,
  name,
}: {
  classId: string;
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Remove ${name} from this class? Their own progress is not affected.`)) return;
          start(async () => {
            const result = await removeMemberAction({ classId, userId });
            if (result.ok) router.refresh();
            else setError(result.error);
          });
        }}
        className={subtleButton}
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {error && <ErrorNote>{error}</ErrorNote>}
    </>
  );
}

export function DeleteClassButton({ classId, name }: { classId: string; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !confirm(
              `Delete ${name}? The class, its roster and its assignments go. Your students keep all of their own progress.`
            )
          )
            return;
          start(async () => {
            const result = await deleteClassAction({ classId });
            if (result.ok) router.push("/classes");
            else setError(result.error);
          });
        }}
        className={subtleButton}
      >
        {pending ? "Deleting…" : "Delete class"}
      </button>
      {error && <ErrorNote>{error}</ErrorNote>}
    </>
  );
}

export function DeleteAssignmentButton({
  classId,
  assignmentId,
  title,
}: {
  classId: string;
  assignmentId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete "${title}"?`)) return;
          start(async () => {
            const result = await deleteAssignmentAction({ classId, assignmentId });
            if (result.ok) router.refresh();
            else setError(result.error);
          });
        }}
        className={subtleButton}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <ErrorNote>{error}</ErrorNote>}
    </>
  );
}

/**
 * Sets work by topic, difficulty band and count, rather than by picking
 * problems one at a time out of ~14,800. The server resolves that to a concrete
 * set of ids and stores them, so the assignment means the same thing for every
 * student and still means it next week.
 */
export function CreateAssignmentForm({
  classId,
  topics,
  maxProblems,
}: {
  classId: string;
  topics: { id: string; name: string; group: string }[];
  maxProblems: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Grouped by domain, because a flat list of ~50 subtopics is not scannable.
  const groups = [...new Set(topics.map((t) => t.group))];

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Set an assignment
      </Button>
    );
  }

  return (
    <form
      action={(formData) =>
        start(async () => {
          setError(null);
          const result = await createAssignmentAction(formData);
          if (result.ok) {
            setOpen(false);
            router.refresh();
          } else {
            setError(result.error);
          }
        })
      }
      className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
    >
      <input type="hidden" name="classId" value={classId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Title
          </span>
          <input name="title" required className={inputClass} placeholder="Week 3 — counting" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Topic
          </span>
          <select name="topicId" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Choose a topic
            </option>
            {groups.map((g) => (
              <optgroup key={g} label={g}>
                {topics
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Difficulty from
          </span>
          <input
            name="difficultyMin"
            type="number"
            min={1}
            max={10}
            defaultValue={2}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            to
          </span>
          <input
            name="difficultyMax"
            type="number"
            min={1}
            max={10}
            defaultValue={5}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            How many problems
          </span>
          <input
            name="count"
            type="number"
            min={1}
            max={maxProblems}
            defaultValue={10}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Due (optional)
          </span>
          <input name="dueAt" type="date" className={inputClass} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Setting…" : "Set assignment"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
    </form>
  );
}
