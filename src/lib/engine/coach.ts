import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { effectiveStreak } from "@/lib/streak";
import { isDayPast } from "@/lib/date-only";

/**
 * Coach mode: a coach makes a class, students join it with a code, and the
 * coach can see how they are getting on and set them work.
 *
 * The tables (ClassRoom, ClassMembership, TeacherAssignment) were in the schema
 * from the start and empty in production, so this needs no migration.
 *
 * The whole design turns on one constraint: this is the only feature where one
 * account can see another account's activity, and the accounts are likely to
 * belong to children. Three rules follow, and they are enforced here rather
 * than left to the UI:
 *
 *   - A coach never adds a student. Students join, by typing a code they were
 *     given. Joining *is* the consent, and it is the only way into a roster —
 *     there is deliberately no "invite by email" path, because that would let a
 *     coach direct a request at a child who never agreed to anything.
 *   - A student can always see which classes they are in, and can always leave.
 *     Visibility a student cannot revoke is surveillance.
 *   - A coach sees progress, never identity beyond the name the student chose
 *     to display. No email addresses: see `ROSTER_SELECT`.
 */

/** Deliberately excludes O/0 and I/1/L — a code is read off a whiteboard and
 * typed by a child, and a confusable pair turns into a support problem. */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

/**
 * A join code is a bearer credential: anyone holding it can attach themselves
 * to the class, and the coach will then see their progress. So it is generated
 * from a CSPRNG and made long enough that guessing is not a strategy —
 * 31^8 is about 8.5 x 10^11. `Math.random()` would have been the natural thing
 * to reach for here and is not suitable for this.
 */
function newCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return out;
}

/** Normalises what a student typed. Codes are displayed uppercase and in one
 * block; people type them lowercase, with spaces, or with dashes. */
export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Reserves an unused code. The unique index on `joinCode` is the real
 * guarantee; this loop only avoids surfacing a collision as an error. */
async function reserveCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = newCode();
    if (!(await prisma.classRoom.findUnique({ where: { joinCode: code }, select: { id: true } }))) {
      return code;
    }
  }
  throw new Error("could not allocate an unused join code");
}

export const MAX_CLASS_NAME = 60;

export async function createClassRoom(teacherId: string, name: string) {
  return prisma.classRoom.create({
    data: { teacherId, name: name.trim().slice(0, MAX_CLASS_NAME), joinCode: await reserveCode() },
  });
}

/** Issues a fresh code and invalidates the old one. The reason this exists: a
 * code written on a shared whiteboard or pasted into a group chat has escaped,
 * and without rotation the coach's only remedy would be deleting the class. */
export async function rotateJoinCode(classId: string) {
  return prisma.classRoom.update({
    where: { id: classId },
    data: { joinCode: await reserveCode() },
  });
}

export type JoinResult =
  | { ok: true; classId: string; className: string }
  | { ok: false; error: string };

/**
 * Attaches a student to a class by code.
 *
 * Note what is *not* reported: a wrong code and a code belonging to a class the
 * student is already in give distinguishable messages, but no message ever
 * confirms that some other code exists. There is no lookup endpoint either, so
 * the code is not usable for enumerating classes.
 */
export async function joinClassByCode(userId: string, rawCode: string): Promise<JoinResult> {
  const code = normalizeCode(rawCode);
  if (code.length !== CODE_LENGTH) return { ok: false, error: "That code doesn't look right." };

  const classRoom = await prisma.classRoom.findUnique({ where: { joinCode: code } });
  if (!classRoom) return { ok: false, error: "No class with that code." };

  if (classRoom.teacherId === userId) {
    return { ok: false, error: "That's your own class — you're already the coach." };
  }

  const existing = await prisma.classMembership.findUnique({
    where: { classId_userId: { classId: classRoom.id, userId } },
  });
  if (existing) {
    return { ok: false, error: `You're already in ${classRoom.name}.` };
  }

  await prisma.classMembership.create({ data: { classId: classRoom.id, userId } });
  return { ok: true, classId: classRoom.id, className: classRoom.name };
}

/**
 * The exact shape of what a coach may read about a student.
 *
 * Written out as a constant, and asserted by `npm run verify:coach-privacy`,
 * because the failure mode is silent: `include: { user: true }` on a roster
 * query reads perfectly naturally, compiles, and quietly publishes every
 * student's email address — and their password hash column — to whoever holds
 * the class. Naming the fields makes adding one a deliberate act.
 */
export const ROSTER_SELECT = { id: true, name: true } as const;

export type RosterEntry = {
  userId: string;
  membershipId: string;
  name: string;
  joinedAt: Date;
  rating: number | null;
  streak: number;
  problemsSolved: number;
  accuracy: number | null;
  lastActive: Date | null;
  /** Whole days since the student last practised, null if they never have.
   * Computed here against one request-wide clock so the roster cannot call
   * Date.now() per row during render. */
  daysSinceActive: number | null;
};

/** Everyone in a class, with the progress a coach is there to look at. */
export async function classRoster(classId: string): Promise<RosterEntry[]> {
  const now = Date.now();
  const members = await prisma.classMembership.findMany({
    where: { classId },
    orderBy: { joinedAt: "asc" },
    select: { id: true, userId: true, joinedAt: true, user: { select: ROSTER_SELECT } },
  });
  if (members.length === 0) return [];

  const userIds = members.map((m) => m.userId);
  const [stats, ratings] = await Promise.all([
    prisma.userStats.findMany({ where: { userId: { in: userIds } } }),
    prisma.rating.findMany({ where: { userId: { in: userIds }, category: "OVERALL" } }),
  ]);
  const statsBy = new Map(stats.map((s) => [s.userId, s]));
  const ratingBy = new Map(ratings.map((r) => [r.userId, r.value]));

  return members.map((m) => {
    const s = statsBy.get(m.userId);
    return {
      userId: m.userId,
      membershipId: m.id,
      name: m.user.name,
      joinedAt: m.joinedAt,
      rating: ratingBy.get(m.userId) ?? null,
      // The stored streak is only correct as of the last active day, so it goes
      // through the same decay the student's own dashboard uses. Otherwise a
      // roster would show a coach a "12 day streak" for someone who stopped
      // two weeks ago, which is precisely the student a coach needs to spot.
      streak: s ? effectiveStreak(s.currentStreak, s.lastActiveDate) : 0,
      problemsSolved: s?.problemsSolved ?? 0,
      accuracy:
        s && s.problemsSolved > 0 ? Math.round((s.problemsCorrect / s.problemsSolved) * 100) : null,
      lastActive: s?.lastActiveDate ?? null,
      daysSinceActive: s?.lastActiveDate
        ? Math.floor((now - s.lastActiveDate.getTime()) / 86_400_000)
        : null,
    };
  });
}

export function parseProblemIds(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export const MAX_ASSIGNMENT_PROBLEMS = 25;
export const MAX_ASSIGNMENT_TITLE = 80;

/**
 * Chooses the problems for an assignment from a topic and difficulty band.
 *
 * A coach picking 10 problems by hand out of ~14,800 is not a feature, it is a
 * chore, so the assignment is specified the way a coach actually thinks about
 * it — this topic, about this hard, this many. The chosen ids are then stored,
 * not the criteria: an assignment has to mean the same thing for every student
 * and still mean it next week, which a stored query would not.
 */
export async function pickAssignmentProblems(opts: {
  topicId: string;
  difficultyMin: number;
  difficultyMax: number;
  count: number;
}): Promise<string[]> {
  const pool = await prisma.problem.findMany({
    where: {
      isPublished: true,
      isPlacement: false,
      topicId: opts.topicId,
      difficulty: { gte: opts.difficultyMin, lte: opts.difficultyMax },
    },
    select: { id: true },
    take: 500,
  });

  const want = Math.min(opts.count, MAX_ASSIGNMENT_PROBLEMS, pool.length);
  const picked: string[] = [];
  const seen = new Set<number>();
  while (picked.length < want) {
    const i = randomInt(pool.length);
    if (seen.has(i)) continue;
    seen.add(i);
    picked.push(pool[i].id);
  }
  return picked;
}

export type AssignmentRow = {
  id: string;
  title: string;
  taskType: string;
  dueAt: Date | null;
  createdAt: Date;
  problemCount: number;
  /** Computed here rather than in a component: "now" belongs to the request,
   * and a page that calls Date.now() once per row during render can straddle a
   * midnight and disagree with itself. */
  overdue: boolean;
  /** Per-student completion, keyed by user id. */
  completion: Map<string, { attempted: number; correct: number }>;
};

/**
 * Assignments for a class, each with how far every student has got.
 *
 * Completion is read from the ordinary `Attempt` table rather than from
 * anything assignment-specific, so a student who happened to solve an assigned
 * problem in normal practice gets credit for it. The alternative — only
 * counting work done through an assignment link — would mean a coach could set
 * work a student had already done and see it reported as untouched.
 */
export async function classAssignments(
  classId: string,
  memberIds: string[]
): Promise<AssignmentRow[]> {
  const now = Date.now();
  const assignments = await prisma.teacherAssignment.findMany({
    where: { classId },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });
  if (assignments.length === 0) return [];

  const allProblemIds = [...new Set(assignments.flatMap((a) => parseProblemIds(a.problemIds)))];
  const attempts =
    memberIds.length > 0 && allProblemIds.length > 0
      ? await prisma.attempt.findMany({
          where: { userId: { in: memberIds }, problemId: { in: allProblemIds } },
          select: { userId: true, problemId: true, correct: true },
        })
      : [];

  // One pass into a lookup, rather than a query per assignment per student.
  const byUser = new Map<string, Map<string, boolean>>();
  for (const a of attempts) {
    let inner = byUser.get(a.userId);
    if (!inner) byUser.set(a.userId, (inner = new Map()));
    // A later correct answer supersedes an earlier wrong one — a student who
    // came back and got it right has done the work.
    inner.set(a.problemId, (inner.get(a.problemId) ?? false) || a.correct);
  }

  return assignments.map((a) => {
    const ids = parseProblemIds(a.problemIds);
    const completion = new Map<string, { attempted: number; correct: number }>();
    for (const userId of memberIds) {
      const inner = byUser.get(userId);
      let attempted = 0;
      let correct = 0;
      for (const pid of ids) {
        if (inner?.has(pid)) {
          attempted++;
          if (inner.get(pid)) correct++;
        }
      }
      completion.set(userId, { attempted, correct });
    }
    return {
      id: a.id,
      title: a.title,
      taskType: a.taskType,
      dueAt: a.dueAt,
      createdAt: a.createdAt,
      problemCount: ids.length,
      overdue: a.dueAt !== null && isDayPast(a.dueAt, now),
      completion,
    };
  });
}

/** What one student sees: the classes they are in, and the work set for them.
 * Mirrors `classAssignments` but scoped to a single student, so a student can
 * never read another student's completion. */
export async function studentAssignments(userId: string) {
  const now = Date.now();
  const memberships = await prisma.classMembership.findMany({
    where: { userId },
    orderBy: { joinedAt: "asc" },
    include: { classRoom: { select: { id: true, name: true, teacher: { select: { name: true } } } } },
  });
  if (memberships.length === 0) return [];

  const classIds = memberships.map((m) => m.classId);
  const assignments = await prisma.teacherAssignment.findMany({
    where: { classId: { in: classIds } },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });

  const allProblemIds = [...new Set(assignments.flatMap((a) => parseProblemIds(a.problemIds)))];
  const attempts =
    allProblemIds.length > 0
      ? await prisma.attempt.findMany({
          where: { userId, problemId: { in: allProblemIds } },
          select: { problemId: true, correct: true },
        })
      : [];
  const done = new Map<string, boolean>();
  for (const a of attempts) done.set(a.problemId, (done.get(a.problemId) ?? false) || a.correct);

  return memberships.map((m) => ({
    membershipId: m.id,
    classId: m.classId,
    className: m.classRoom.name,
    coachName: m.classRoom.teacher.name,
    joinedAt: m.joinedAt,
    assignments: assignments
      .filter((a) => a.classId === m.classId)
      .map((a) => {
        const ids = parseProblemIds(a.problemIds);
        const correct = ids.filter((id) => done.get(id)).length;
        const complete = ids.length > 0 && correct >= ids.length;
        return {
          id: a.id,
          title: a.title,
          dueAt: a.dueAt,
          total: ids.length,
          attempted: ids.filter((id) => done.has(id)).length,
          correct,
          complete,
          overdue: a.dueAt !== null && !complete && isDayPast(a.dueAt, now),
        };
      }),
  }));
}
