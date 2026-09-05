"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

const REASONS = ["ANSWER_WRONG", "SOLUTION_UNCLEAR", "AMBIGUOUS_WORDING", "OTHER"] as const;

const disputeSchema = z.object({
  problemId: z.string().min(1),
  theirAnswer: z.string().trim().min(1),
  storedAnswer: z.string().trim().min(1),
  reason: z.enum(REASONS),
  message: z.string().trim().max(2000).optional().default(""),
});

export type DisputeFormState = { error?: string; success?: boolean } | undefined;

export async function submitDisputeAction(
  input: z.infer<typeof disputeSchema>
): Promise<DisputeFormState> {
  const user = await requireUser();
  const parsed = disputeSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid report" };
  }
  const { problemId, theirAnswer, storedAnswer, reason, message } = parsed.data;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) return { error: "Problem not found" };

  // One open report per student per problem — a second click updates nothing
  // useful and just adds noise to the admin queue, so point them at the
  // existing one instead of creating a duplicate.
  const existingOpen = await prisma.problemDispute.findFirst({
    where: { problemId, userId: user.id, status: "OPEN" },
  });
  if (existingOpen) {
    return { error: "You already have an open report for this problem. We'll follow up by email." };
  }

  await prisma.problemDispute.create({
    data: {
      problemId,
      userId: user.id,
      theirAnswer,
      storedAnswer,
      reason,
      message,
    },
  });

  revalidatePath("/admin/disputes");
  return { success: true };
}

const resolveSchema = z.object({
  disputeId: z.string().min(1),
  status: z.enum(["UPHELD", "REJECTED"]),
  adminResponse: z.string().trim().max(2000).optional().default(""),
});

export async function resolveDisputeAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = resolveSchema.safeParse({
    disputeId: formData.get("disputeId"),
    status: formData.get("status"),
    adminResponse: formData.get("adminResponse"),
  });
  if (!parsed.success) return;
  const { disputeId, status, adminResponse } = parsed.data;

  await prisma.problemDispute.update({
    where: { id: disputeId },
    data: {
      status,
      adminResponse: adminResponse || null,
      resolvedById: admin.id,
      resolvedAt: new Date(),
    },
  });

  revalidatePath("/admin/disputes");
}
