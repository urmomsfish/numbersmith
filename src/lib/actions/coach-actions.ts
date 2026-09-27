"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date-only";
import {
  createClassRoom,
  joinClassByCode,
  rotateJoinCode,
  pickAssignmentProblems,
  MAX_ASSIGNMENT_PROBLEMS,
  MAX_ASSIGNMENT_TITLE,
  MAX_CLASS_NAME,
} from "@/lib/engine/coach";

/**
 * Coach mode actions.
 *
 * Every one of these is reachable by any signed-in account with a crafted POST,
 * and each of the ids below names a row belonging to someone else — a class, a
 * membership, an assignment. So each action re-derives the caller's right to
 * the row from the row itself, never from the id having been rendered on a page
 * they were looking at. `npm run verify:ownership` enforces that mechanically.
 *
 * Errors are returned as values rather than thrown: Next replaces a thrown
 * Server Action message with an opaque digest in production, which surfaces to
 * the student as "Minified React error #441" instead of "No class with that
 * code."
 */

function asValue(err: unknown, message: string) {
  const digest = (err as { digest?: unknown } | null)?.digest;
  // redirect() and notFound() signal through thrown errors; never swallow those.
  if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
  console.error(`${message}:`, err);
  return { ok: false as const, error: message };
}

export type CoachActionResult = { ok: true } | { ok: false; error: string };

/** Anyone may start a class.
 *
 * There is deliberately no TEACHER role gate. `role` exists and defaults to
 * STUDENT, but gating on it would mean an admin has to promote every coach by
 * hand before the feature does anything, and the club coach who wants to try
 * NumberSmith on a Tuesday evening is exactly the person it is for. Being a
 * coach confers nothing except over students who chose to join, so there is no
 * privilege here worth defending with a role. */
export async function createClassAction(formData: FormData): Promise<CoachActionResult> {
  try {
    const user = await requireUser();
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { ok: false, error: "Give the class a name." };
    if (name.length > MAX_CLASS_NAME) {
      return { ok: false, error: `Keep the name under ${MAX_CLASS_NAME} characters.` };
    }
    await createClassRoom(user.id, name);
    revalidatePath("/classes");
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't create that class");
  }
}

export async function joinClassAction(
  formData: FormData
): Promise<{ ok: true; className: string } | { ok: false; error: string }> {
  try {
    const user = await requireUser();
    const result = await joinClassByCode(user.id, String(formData.get("code") ?? ""));
    if (!result.ok) return result;
    revalidatePath("/classes");
    return { ok: true, className: result.className };
  } catch (err) {
    return asValue(err, "Couldn't join that class");
  }
}

/** A student removes themselves. Scoped by `userId` so a membership id from
 * another class is simply not found — a student can only ever delete their own
 * membership, never evict a classmate. */
export async function leaveClassAction(input: { classId: string }): Promise<CoachActionResult> {
  try {
    const user = await requireUser();
    const deleted = await prisma.classMembership.deleteMany({
      where: { classId: input.classId, userId: user.id },
    });
    if (deleted.count === 0) return { ok: false, error: "You're not in that class." };
    revalidatePath("/classes");
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't leave that class");
  }
}

/**
 * Returns this class only if the caller coaches it, else null. Every coach-side
 * action funnels through here so the check cannot be forgotten in one of them.
 *
 * It resolves the caller itself rather than taking a user id, and that is
 * deliberate. Written as `requireOwnedClass(classId, user.id)` the guard inside
 * reads `teacherId: userId` — a parameter, which no static check can know is
 * the caller, and `verify:ownership` rejected all five actions that used it.
 * That rejection was correct: a helper taking an id on trust is one careless
 * call site away from being handed the wrong one. Resolving the session here
 * makes that impossible to get wrong and makes the guard legible to the check.
 */
async function requireOwnedClass(classId: string) {
  const user = await requireUser();
  return prisma.classRoom.findFirst({ where: { id: classId, teacherId: user.id } });
}

export async function rotateJoinCodeAction(input: { classId: string }): Promise<CoachActionResult> {
  try {
    const owned = await requireOwnedClass(input.classId);
    if (!owned) return { ok: false, error: "Not your class." };
    await rotateJoinCode(input.classId);
    revalidatePath(`/classes/${input.classId}`);
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't issue a new code");
  }
}

/** Removes a student from a class the caller coaches.
 *
 * Takes the student's user id rather than the membership id, and pairs it with
 * the class in a single `where`. Deleting by membership id alone would have let
 * a coach pass any membership id at all and evict a student from someone else's
 * class. */
export async function removeMemberAction(input: {
  classId: string;
  userId: string;
}): Promise<CoachActionResult> {
  try {
    const owned = await requireOwnedClass(input.classId);
    if (!owned) return { ok: false, error: "Not your class." };
    await prisma.classMembership.deleteMany({
      where: { classId: input.classId, userId: input.userId },
    });
    revalidatePath(`/classes/${input.classId}`);
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't remove that student");
  }
}

export async function deleteClassAction(input: { classId: string }): Promise<CoachActionResult> {
  try {
    const owned = await requireOwnedClass(input.classId);
    if (!owned) return { ok: false, error: "Not your class." };
    // Memberships and assignments cascade; the students' own attempts, ratings
    // and history are untouched, because they were never the class's to hold.
    await prisma.classRoom.delete({ where: { id: input.classId } });
    revalidatePath("/classes");
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't delete that class");
  }
}

export async function createAssignmentAction(formData: FormData): Promise<CoachActionResult> {
  try {
    const classId = String(formData.get("classId") ?? "");
    const owned = await requireOwnedClass(classId);
    if (!owned) return { ok: false, error: "Not your class." };

    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { ok: false, error: "Give the assignment a title." };
    if (title.length > MAX_ASSIGNMENT_TITLE) {
      return { ok: false, error: `Keep the title under ${MAX_ASSIGNMENT_TITLE} characters.` };
    }

    const topicId = String(formData.get("topicId") ?? "");
    const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true } });
    if (!topic) return { ok: false, error: "Pick a topic." };

    const clamp = (v: unknown, lo: number, hi: number, fallback: number) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : fallback;
    };
    const difficultyMin = clamp(formData.get("difficultyMin"), 1, 10, 2);
    const difficultyMax = Math.max(difficultyMin, clamp(formData.get("difficultyMax"), 1, 10, 5));
    const count = clamp(formData.get("count"), 1, MAX_ASSIGNMENT_PROBLEMS, 10);

    const problemIds = await pickAssignmentProblems({
      topicId,
      difficultyMin,
      difficultyMax,
      count,
    });
    if (problemIds.length === 0) {
      return { ok: false, error: "No problems match that topic and difficulty. Widen the range." };
    }

    // Stored as that day's UTC midnight, the convention the rest of the app
    // uses for dates that name a day. `isDayPast` supplies the "still on time
    // until the end of the day" half; see src/lib/date-only.ts.
    const dueRaw = String(formData.get("dueAt") ?? "").trim();
    const dueAt = dueRaw ? parseDateOnly(dueRaw) : null;
    if (dueRaw && !dueAt) return { ok: false, error: "That due date isn't a real day." };

    await prisma.teacherAssignment.create({
      data: {
        classId,
        title,
        taskType: "PROBLEM_SET",
        problemIds: JSON.stringify(problemIds),
        dueAt,
      },
    });
    revalidatePath(`/classes/${classId}`);
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't create that assignment");
  }
}

/** Deletes an assignment. The assignment id is paired with a class the caller
 * owns in one `where`, so an id belonging to another coach's class does not
 * match. */
export async function deleteAssignmentAction(input: {
  classId: string;
  assignmentId: string;
}): Promise<CoachActionResult> {
  try {
    const owned = await requireOwnedClass(input.classId);
    if (!owned) return { ok: false, error: "Not your class." };
    await prisma.teacherAssignment.deleteMany({
      where: { id: input.assignmentId, classId: input.classId },
    });
    revalidatePath(`/classes/${input.classId}`);
    return { ok: true };
  } catch (err) {
    return asValue(err, "Couldn't delete that assignment");
  }
}
