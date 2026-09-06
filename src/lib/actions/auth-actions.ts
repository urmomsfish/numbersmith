"use server";

import { randomBytes, createHash } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { LEGAL } from "@/lib/legal";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

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
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
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

export type RequestResetState = { message?: string; error?: string } | undefined;

const requestResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

// Same wording whether or not the email exists — a different message here
// would let anyone probe which addresses have accounts.
const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, we've sent a link to reset the password.";

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
    return { message: GENERIC_RESET_MESSAGE };
  }

  // One live token per account. A stale unexpired one from a prior click is
  // superseded rather than left valid alongside a new one.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const rawToken = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(email, resetUrl);

  return { message: GENERIC_RESET_MESSAGE };
}

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login?reset=success");
}
