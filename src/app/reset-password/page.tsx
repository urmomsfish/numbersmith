"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  if (!token) {
    return (
      <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600">
        This link is missing its reset token. Request a new one below.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Type it again"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

          <Suspense
            fallback={<p className="mt-6 text-sm text-slate-400">Loading…</p>}
          >
            <ResetForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
              Request a new link
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
