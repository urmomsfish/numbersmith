"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startPaperAction, deletePaperAction } from "@/lib/actions/paper-actions";

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

/** Starts a sitting, or picks up the one already open — the server decides
 * which, so a half-finished paper is never silently replaced by a fresh clock. */
export function StartPaperButton({ paperId, resuming }: { paperId: string; resuming: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button
        size="lg"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await startPaperAction({ paperId });
            if (result.ok) router.push(`/papers/${paperId}/sit/${result.attemptId}`);
            else setError(result.error);
          })
        }
      >
        {pending ? "Opening…" : resuming ? "Resume sitting" : "Sit this paper"}
      </Button>
      {error && <ErrorNote>{error}</ErrorNote>}
    </>
  );
}

export function DeletePaperButton({ paperId, title }: { paperId: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete ${title}? The PDF, its key and every sitting go with it.`)) return;
          start(async () => {
            const result = await deletePaperAction({ paperId });
            if (result.ok) router.push("/papers");
            else setError(result.error);
          });
        }}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        {pending ? "Deleting…" : "Delete paper"}
      </button>
      {error && <ErrorNote>{error}</ErrorNote>}
    </>
  );
}
