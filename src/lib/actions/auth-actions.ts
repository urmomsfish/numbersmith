"use server";

import { randomInt, createHash } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { LEGAL } from "@/lib/legal";
import { sendPasswordResetCodeEmail } from "@/lib/email";

const RESET_CODE_TTL_MS = 15 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;
const hashCode = (code: string) => createHash("sha256").update(code).digest("hex");

export type AuthFormState = { error?: string } | undefined;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // A checkbox only submits a value when checked, so its mere presence in the
  // form data is the signal — there's nothing to coerce from "on" vs missing.
  termsAccepted: z.literal("on", {
    message: "You must agree to the Terms of Service and Privacy Policy to create an account.",
  }),
});

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    termsAccepted: formData.get("termsAccepted"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "STUDENT",
      termsAcceptedAt: new Date(),
      termsAcceptedVersion: LEGAL.lastUpdated,
      stats: { create: {} },
      subscription: { create: { status: "FREE" } },
      ratings: { create: { category: "OVERALL", value: 1000 } },
    },
  });

  await createSession(user.id);
  redirect("/onboarding");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
  if (!user?.passwordHash) {
    return { error: "Incorrect email or password" };
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect email or password" };
  }

  await createSession(user.id);

  if (user.role === "ADMIN") redirect("/admin");
  if (!user.profile?.onboardingCompletedAt) redirect("/onboarding");
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export type RequestResetState = { message?: string; error?: string; email?: string } | undefined;

const requestResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

// Same wording whether or not the email exists — a different message here
// would let anyone probe which addresses have accounts.
const GENERIC_RESET_MESSAGE = "If an account exists for that email, we've sent a code to reset the password.";

export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // No account — still say we sent a code, but skip generating one, and
    // return the email anyway so the client moves to the code-entry step
    // regardless. Otherwise the response timing/shape would itself leak
    // whether the address is registered.
    return { message: GENERIC_RESET_MESSAGE, email };
  }

  // One live code per account. A stale unexpired one from a prior request is
  // superseded rather than left valid alongside a new one.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
    },
  });

  await sendPasswordResetCodeEmail(email, code);

  return { message: GENERIC_RESET_MESSAGE, email };
}

const resetPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Same message for "wrong code", "expired code", and "no account" — telling
// them apart would let an attacker learn which email addresses are
// registered, or narrow down a code by trial and error more easily.
const GENERIC_CODE_ERROR = "That code is incorrect or has expired. Request a new one.";

export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email, code, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: GENERIC_CODE_ERROR };
  }

  const record = await prisma.passwordResetToken.findFirst({
    where: { userId: user.id, usedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.expiresAt < new Date()) {
    return { error: GENERIC_CODE_ERROR };
  }
  if (record.attempts >= MAX_RESET_ATTEMPTS) {
    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
    return { error: "Too many incorrect attempts. Request a new code." };
  }

  if (hashCode(code) !== record.codeHash) {
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { error: GENERIC_CODE_ERROR };
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login?reset=success");
}
