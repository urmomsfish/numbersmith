// Central TypeScript union types mirroring the string-based "enum" fields
// documented in prisma/schema.prisma (SQLite has no native enum type).

export type Role = "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";

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

export type AttemptMode = "PRACTICE" | "DAILY_CHALLENGE" | "SIMULATION" | "PLACEMENT" | "LESSON";

export type MistakeReason = "INCORRECT" | "SKIPPED" | "SLOW" | "MULTI_HINT";

export type CompetitionAttemptMode = "OFFICIAL" | "CUSTOM";
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
