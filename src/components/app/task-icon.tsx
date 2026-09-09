import { IconBook, IconRefresh, IconTarget, IconTimer, IconTrophy } from "@/components/app/icons";

/** Icon per study-plan task type.
 *
 * Shared so the weekly table and the month calendar cannot drift into showing
 * different marks for the same task. Uses the app's existing icon set rather
 * than emoji — emoji render differently per platform, do not inherit text
 * colour, and sit oddly beside the line icons used everywhere else in the app.
 */
export const TASK_ICON: Record<string, (props: { className?: string }) => React.ReactElement> = {
  LESSON: IconBook,
  PRACTICE: IconTarget,
  TIMED_SET: IconTimer,
  SIMULATION: IconTrophy,
  REVIEW: IconRefresh,
};

/** Human label for a task type — "TIMED_SET" reads badly in a sentence. */
export const TASK_LABEL: Record<string, string> = {
  LESSON: "Lesson",
  PRACTICE: "Practice",
  TIMED_SET: "Timed set",
  SIMULATION: "Simulation",
  REVIEW: "Review",
};
