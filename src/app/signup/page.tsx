"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth-actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-xl font-bold text-slate-900">Create your free account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start with a free placement test — no credit card required.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Alex Chen"
              />
            </div>
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
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
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

            <div className="flex items-start gap-2.5">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="termsAccepted" className="text-sm leading-relaxed text-slate-600">
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="font-semibold text-brand-600 hover:text-brand-700">
                  Terms of Service
                </Link>{" "}
                (including the limitation of liability in Section 11) and{" "}
                <Link href="/legal/privacy" target="_blank" className="font-semibold text-brand-600 hover:text-brand-700">
                  Privacy Policy
                </Link>
                . If I am under 18, a parent or guardian has reviewed this with me.
              </label>
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger-600">
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creating account…" : "Create free account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
