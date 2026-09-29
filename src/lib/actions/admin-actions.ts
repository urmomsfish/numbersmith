"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setRating, MIN_RATING, MAX_RATING } from "@/lib/engine/rating";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

const problemSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  question: z.string().trim().min(10),
  format: z.enum(["MULTIPLE_CHOICE", "SHORT_ANSWER", "INTEGER"]),
  choices: z.string().optional(),
  answer: z.string().trim().min(1),
  solution: z.string().trim().min(5),
  hints: z.string().optional(),
  difficulty: z.coerce.number().int().min(1).max(10),
  topicSlug: z.string().min(1),
  competitionSlug: z.string().optional(),
  gradeMin: z.coerce.number().int().min(0).max(12),
  gradeMax: z.coerce.number().int().min(0).max(12),
  estimatedTimeSeconds: z.coerce.number().int().min(15).max(1800),
  tags: z.string().optional(),
  source: z.string().trim().min(1),
  license: z.string().trim().min(1),
  year: z.coerce.number().int().min(1900).max(2200).optional(),
  author: z.string().trim().min(1),
  isPublished: z.coerce.boolean().optional(),
  isPlacement: z.coerce.boolean().optional(),
});

function splitLines(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseFormData(formData: FormData) {
  return problemSchema.safeParse({
    slug: formData.get("slug"),
    question: formData.get("question"),
    format: formData.get("format"),
    choices: formData.get("choices") ?? undefined,
    answer: formData.get("answer"),
    solution: formData.get("solution"),
    hints: formData.get("hints") ?? undefined,
    difficulty: formData.get("difficulty"),
    topicSlug: formData.get("topicSlug"),
    competitionSlug: formData.get("competitionSlug") || undefined,
    gradeMin: formData.get("gradeMin"),
    gradeMax: formData.get("gradeMax"),
    estimatedTimeSeconds: formData.get("estimatedTimeSeconds"),
    tags: formData.get("tags") ?? undefined,
    source: formData.get("source"),
    license: formData.get("license"),
    year: formData.get("year") || undefined,
    author: formData.get("author"),
    isPublished: formData.get("isPublished") === "on",
    isPlacement: formData.get("isPlacement") === "on",
  });
}

async function buildData(input: z.infer<typeof problemSchema>) {
  const topic = await prisma.topic.findUnique({ where: { slug: input.topicSlug } });
  if (!topic) throw new Error("Unknown topic");

  const competition = input.competitionSlug
    ? await prisma.competition.findUnique({ where: { slug: input.competitionSlug } })
    : null;

  const choices = splitLines(input.choices);

  return {
    slug: input.slug,
    question: input.question,
    format: input.format,
    choices: input.format === "MULTIPLE_CHOICE" && choices.length ? JSON.stringify(choices) : null,
    answer: input.answer,
    solution: input.solution,
    hints: JSON.stringify(splitLines(input.hints)),
    difficulty: input.difficulty,
    topicId: topic.id,
    competitionId: competition?.id ?? null,
    gradeMin: Math.min(input.gradeMin, input.gradeMax),
    gradeMax: Math.max(input.gradeMin, input.gradeMax),
    estimatedTimeSeconds: input.estimatedTimeSeconds,
    tags: JSON.stringify(
      splitLines(input.tags).length ? splitLines(input.tags) : [input.topicSlug]
    ),
    source: input.source,
    license: input.license,
    year: input.year ?? null,
    author: input.author,
    isPublished: input.isPublished ?? false,
    isPlacement: input.isPlacement ?? false,
  };
}

export async function createProblemAction(formData: FormData) {
  await requireAdmin();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    redirect(`/admin/problems/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const existing = await prisma.problem.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    redirect(`/admin/problems/new?error=${encodeURIComponent("That slug is already in use")}`);
  }

  const problem = await prisma.problem.create({ data: await buildData(parsed.data) });
  revalidatePath("/admin/problems");
  redirect(`/admin/problems/${problem.id}?saved=1`);
}

export async function updateProblemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/problems");

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    redirect(`/admin/problems/${id}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const clash = await prisma.problem.findUnique({ where: { slug: parsed.data.slug } });
  if (clash && clash.id !== id) {
    redirect(`/admin/problems/${id}?error=${encodeURIComponent("That slug is already in use")}`);
  }

  await prisma.problem.update({ where: { id }, data: await buildData(parsed.data) });
  revalidatePath("/admin/problems");
  revalidatePath(`/admin/problems/${id}`);
  redirect(`/admin/problems/${id}?saved=1`);
}

export async function deleteProblemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/problems");

  // Remove dependent rows first; SQLite has no cascade on these relations.
  await prisma.$transaction([
    prisma.attempt.deleteMany({ where: { problemId: id } }),
    prisma.mistake.deleteMany({ where: { problemId: id } }),
    prisma.bookmark.deleteMany({ where: { problemId: id } }),
    prisma.lessonProblem.deleteMany({ where: { problemId: id } }),
    prisma.placementAttempt.deleteMany({ where: { problemId: id } }),
    prisma.competitionAttemptItem.deleteMany({ where: { problemId: id } }),
    prisma.dailyChallengeAttempt.deleteMany({
      where: { dailyChallenge: { problemId: id } },
    }),
    prisma.dailyChallenge.deleteMany({ where: { problemId: id } }),
    prisma.problem.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/problems");
  redirect("/admin/problems?deleted=1");
}

export async function togglePublishAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const problem = await prisma.problem.findUnique({ where: { id } });
  if (!problem) redirect("/admin/problems");

  await prisma.problem.update({
    where: { id },
    data: { isPublished: !problem.isPublished },
  });
  revalidatePath("/admin/problems");
}

const roleSchema = z.enum(["STUDENT", "PARENT", "TEACHER", "ADMIN"]);
const subStatusSchema = z.enum(["FREE", "PRO", "CANCELED"]);

/** The date fields that have to move with a status when an admin sets one by
 * hand. Writing `status` alone leaves the row describing two different things
 * at once — which is how one account ended up FREE with a trial window still
 * open: no Pro access, and no way back to the trial it had just been given.
 *
 * FREE therefore clears everything, including `trialEndsAt`. That column is
 * vestigial now that trials are gone, but a stale date left behind would still
 * misreport when the account last changed hands.
 *
 * PRO deliberately keeps a null `renewalDate`: that open-ended grant is the
 * documented way to comp an account, and is the one case where null means
 * "never lapses" on purpose. */
function subscriptionDatesFor(status: z.infer<typeof subStatusSchema>, now: Date) {
  switch (status) {
    case "FREE":
      return { plan: null, trialEndsAt: null, canceledAt: null };
    case "CANCELED":
      return { canceledAt: now };
    case "PRO":
      return { canceledAt: null };
  }
}

export async function updateUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = roleSchema.safeParse(formData.get("role"));
  const status = subStatusSchema.safeParse(formData.get("subscriptionStatus"));

  if (!userId || !role.success || !status.success) redirect("/admin/users");
  if (userId === admin.id && role.data !== "ADMIN") {
    redirect("/admin/users?error=cannot-demote-self");
  }

  await prisma.user.update({ where: { id: userId }, data: { role: role.data } });
  const dates = subscriptionDatesFor(status.data, new Date());
  await prisma.subscription.upsert({
    where: { userId },
    update: { status: status.data, ...dates },
    create: { userId, status: status.data, ...dates },
  });

  revalidatePath("/admin/users");
}

const ratingSchema = z.coerce.number().int().min(MIN_RATING).max(MAX_RATING);

/**
 * Sets a student's overall rating by hand.
 *
 * Goes through `setRating` rather than writing the row directly, which buys
 * three things that a direct update would quietly skip: the value is clamped
 * to the same bounds practice uses, a RatingHistory entry is written, and the
 * admin-pinning rule is respected.
 *
 * The history entry is the reason this is worth doing properly. A rating that
 * changes with no record looks, on the student's own progress chart, exactly
 * like a bug — and support has no way to answer "why did my rating drop 300
 * overnight?" without one. The reason names the admin who made the change.
 *
 * Note that setting the rating of an ADMIN account does nothing: `setRating`
 * writes the pinned 2200 for any admin regardless of the value asked for. The
 * table disables the field for those rows and says so, rather than accepting a
 * number and silently discarding it.
 */
export async function setUserRatingAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const rating = ratingSchema.safeParse(formData.get("rating"));

  if (!userId) redirect("/admin/users");
  if (!rating.success) redirect("/admin/users?error=rating-out-of-range");

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) redirect("/admin/users");
  if (target.role === "ADMIN") redirect("/admin/users?error=rating-pinned");

  await setRating(userId, "OVERALL", rating.data, `Set by admin (${admin.email})`);
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) redirect("/admin/users");

  if (userId === admin.id) {
    redirect("/admin/users?error=cannot-delete-self");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/admin/users");

  // Every relation to User is onDelete: Cascade, so this also removes their
  // profile, attempts, mistakes, ratings, study plans, and everything else.
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
  redirect("/admin/users?deleted=1");
}
