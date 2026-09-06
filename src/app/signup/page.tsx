"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth-actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GoogleButton, googleErrorMessage } from "@/components/auth/google-button";

function GoogleErrorBanner() {
  const searchParams = useSearchParams();
  const message = googleErrorMessage(searchParams.get("error"));
  if (!message) return null;
  return (
    <p className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">
      {message}
    </p>
  );
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Create your free account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start with a free placement test — no credit card required.
          </p>

          <Suspense fallback={null}>
            <GoogleErrorBanner />
          </Suspense>

          <div className="mt-6">
            <GoogleButton />
          </div>
          <p className="mt-2.5 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            By continuing with Google, you agree to the{" "}
            <Link href="/legal/terms" target="_blank" className="font-medium underline hover:text-slate-600 dark:hover:text-slate-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" target="_blank" className="font-medium underline hover:text-slate-600 dark:hover:text-slate-300">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
                placeholder="Alex Chen"
              />
            </div>
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
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="flex items-start gap-2.5">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 dark:border-slate-600 text-brand-600 dark:text-brand-400 focus:ring-brand-500"
              />
              <label htmlFor="termsAccepted" className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  Terms of Service
                </Link>{" "}
                (including the limitation of liability in Section 11) and{" "}
                <Link href="/legal/privacy" target="_blank" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  Privacy Policy
                </Link>
                . If I am under 18, a parent or guardian has reviewed this with me.
              </label>
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-danger-600 dark:text-red-400">
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creating account…" : "Create free account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
