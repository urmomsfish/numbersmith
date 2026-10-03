// Central TypeScript union types mirroring the string-based "enum" fields
// documented in prisma/schema.prisma (SQLite has no native enum type).

/**
 * `TEACHER` and `COACH` carry identical permissions and are deliberately kept
 * apart anyway: a school teacher and a club coach reach this product for
 * different reasons, and collapsing them at signup would throw away the only
 * moment anyone tells us which they are. Nothing branches on the difference
 * today — `canCreateClasses` treats them the same — so anything that cares
 * about *permission* must ask that predicate rather than testing for a role.
 */
export type Role = "STUDENT" | "PARENT" | "TEACHER" | "COACH" | "ADMIN";

/** The roles someone may choose for themselves when signing up.
 *
 * `ADMIN` and `PARENT` are deliberately absent: admin is granted, never
 * claimed, and there is no parent experience to land in yet. */
export const SIGNUP_ROLES = [
  {
    role: "STUDENT" as const,
    label: "I'm a student",
    blurb: "Practise, sit timed papers, and track your own progress.",
  },
  {
    role: "TEACHER" as const,
    label: "I'm a teacher",
    blurb: "Set work for a class and see how everyone is doing.",
  },
  {
    role: "COACH" as const,
    label: "I'm a coach",
    blurb: "Run a math team or club, and track your students' progress.",
  },
];

/** True for the roles that run classes rather than sit in them. */
export function isCoachRole(role: Role | string): boolean {
  return role === "TEACHER" || role === "COACH";
}

/** Roles that never see the student onboarding.
 *
 * Onboarding collects a grade, a placement result and a study plan — a Profile
 * row whose `grade` is required and which has no sensible value for someone
 * who is not the one practising. Rather than storing a fake grade, these roles
 * simply have no profile, and this predicate is what keeps the app layout from
 * sending them to fill one in. */
export function isExemptFromOnboarding(role: Role | string): boolean {
  return role === "ADMIN" || isCoachRole(role);
}

/**
 * Who may start a class.
 *
 * Creating one is restricted to teachers and admins; joining, leaving and
 * sitting assignments are not. The asymmetry is the point — a coach is the
 * account that gets to see other people's progress, so becoming one is the
 * step that needs a gate, while everything a student does affects only
 * themselves.
 *
 * Lives here, beside `Role`, rather than in the coach engine: the engine is
 * `server-only`, and a predicate the UI needs to decide what to render must be
 * importable from a client component too.
 */
export function canCreateClasses(role: Role | string): boolean {
  return isCoachRole(role) || role === "ADMIN";
}

export type PriorExperience = "NONE" | "SOME" | "EXPERIENCED" | "ADVANCED";
export type ApproxLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "NOT_SURE";
export type OnboardingStep =
  | "PROFILE"
  | "PLACEMENT"
  | "RESULTS"
  | "COMPETITIONS"
  | "PLAN"
  | "DONE";

export type CompetitionCategory = "ELEMENTARY_MIDDLE" | "HIGH_SCHOOL" | "OLYMPIAD";
export type CompetitionFormat = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "INTEGER" | "PROOF";
export type IndividualOrTeam = "INDIVIDUAL" | "TEAM" | "BOTH";

export type ProblemFormat = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "INTEGER";

export type PlacementStatus = "IN_PROGRESS" | "COMPLETED";
export type PlacementLevel =
  | "BEGINNER"
  | "DEVELOPING"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT"
  | "MASTER"
  | "ELITE";

export type AttemptMode =
  | "PRACTICE"
  | "DAILY_CHALLENGE"
  | "SIMULATION"
  | "PLACEMENT"
  | "LESSON"
  /** Re-attempting a problem already in the mistake queue. Scored and recorded
   * like any other attempt, but awards no XP and no rating — see
   * submitPracticeAnswerAction. */
  | "MISTAKE_REVIEW"
  /** One question at a time against a per-question clock — the Countdown
   * format. Scored and rated like practice; see engine/countdown.ts. */
  | "COUNTDOWN";

export type MistakeReason = "INCORRECT" | "SKIPPED" | "SLOW" | "MULTI_HINT";

export type CompetitionAttemptMode = "OFFICIAL" | "CUSTOM" | "COUNTDOWN";
export type CompetitionAttemptStatus = "IN_PROGRESS" | "SUBMITTED";

export type RatingCategory = "OVERALL" | "AMC" | "MATHCOUNTS" | "OLYMPIAD" | string;

export type AchievementCategory =
  | "MILESTONE"
  | "ACCURACY"
  | "SPEED"
  | "MASTERY"
  | "STREAK"
  | "COMPETITION";

export type DailyChallengeTrack =
  | "ELEMENTARY"
  | "MIDDLE_SCHOOL"
  | "AMC8"
  | "AMC10"
  | "AMC12"
  | "AIME"
  | "OLYMPIAD";

export type StudyPlanTaskType = "LESSON" | "PRACTICE" | "TIMED_SET" | "SIMULATION" | "REVIEW";

/** TRIAL is retained because it is still a value in the database enum, not
 * because the product can produce one — free trials were removed. Taking it out
 * of the enum would need a migration for no behavioural gain. */
export type SubscriptionStatus = "FREE" | "PRO" | "TRIAL" | "CANCELED";
export type SubscriptionPlan = "MONTHLY" | "YEARLY";

export const RATING_TIERS = [
  { min: 0, max: 999, label: "Novice" },
  { min: 1000, max: 1199, label: "Beginner" },
  { min: 1200, max: 1399, label: "Developing" },
  { min: 1400, max: 1599, label: "Intermediate" },
  { min: 1600, max: 1799, label: "Advanced" },
  { min: 1800, max: 1999, label: "Expert" },
  { min: 2000, max: 2199, label: "Master" },
  { min: 2200, max: Infinity, label: "Elite" },
] as const;

export function ratingTier(value: number) {
  return RATING_TIERS.find((t) => value >= t.min && value <= t.max) ?? RATING_TIERS[0];
}

export function difficultyLabel(difficulty: number) {
  if (difficulty <= 2) return "Beginner";
  if (difficulty <= 4) return "Intermediate";
  if (difficulty <= 6) return "Advanced";
  if (difficulty <= 8) return "Expert";
  return "Olympiad";
}

export const DOMAIN_TOPIC_SLUGS = [
  "arithmetic",
  "algebra",
  "geometry",
  "number-theory",
  "combinatorics",
  "probability",
  "logic",
  "advanced-olympiad",
] as const;
