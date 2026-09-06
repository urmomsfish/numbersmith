"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth-actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

function ResetSuccessBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("reset") !== "success") return null;
  return (
    <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-success-600">
      Password updated. Log in with your new password.
    </p>
  );
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to continue your training.</p>

          <Suspense fallback={null}>
            <ResetSuccessBanner />
          </Suspense>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600">
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to NumberSmith?{" "}
            <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
