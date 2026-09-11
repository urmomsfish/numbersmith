"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/actions/auth-actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.email) {
      router.push(`/reset-password?email=${encodeURIComponent(state.email)}`);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Enter your account email and we&apos;ll send a 6-digit code to reset it.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
                placeholder="you@example.com"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Sending…" : "Send reset code"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-700 dark:text-slate-400">
            <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
