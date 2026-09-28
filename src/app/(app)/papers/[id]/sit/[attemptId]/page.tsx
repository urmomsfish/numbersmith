import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  secondsRemaining,
  scoreAnswers,
  parseJsonArray,
  parseQuestions,
  isQuizzable,
  parseAnswerSource,
} from "@/lib/papers";
import { PaperSitting } from "./sitting";
import { PaperQuiz } from "./quiz";

/**
 * One sitting of a past paper — and, once it is submitted, its result.
 *
 * Both ids come from the URL, so neither is trusted: the attempt is matched by
 * id *and* `userId` in one query, and the paper is then read through the
 * attempt's own relation rather than from the `[id]` segment. That second part
 * matters — reading the paper from the URL would let someone pair their own
 * attempt id with another account's paper id and be served that paper's key.
 *
 * A submitted attempt renders its marks here rather than redirecting away.
 * Redirecting was the first version and it silently ate the result: submitting
 * revalidates this route, the server re-ran this component, saw SUBMITTED, and
 * bounced the student to the paper page — so the per-question breakdown, which
 * is the entire reason to sit a paper, flashed and vanished. Rendering it means
 * the result has a real URL that survives a reload.
 */
export default async function SitPaperPage({
  params,
}: PageProps<"/papers/[id]/sit/[attemptId]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id, attemptId } = await params;
  const attempt = await prisma.uploadedPaperAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: {
      paper: {
        select: {
          id: true,
          title: true,
          questionCount: true,
          timeLimitMinutes: true,
          answerKey: true,
          answerSource: true,
          questions: true,
        },
      },
    },
  });
  if (!attempt) redirect("/papers");

  // The URL's paper segment must agree with the attempt's actual paper, or the
  // link is malformed; send them to the real one rather than rendering a page
  // whose breadcrumb lies about what they are sitting.
  if (attempt.paper.id !== id) redirect(`/papers/${attempt.paper.id}`);

  const key = parseJsonArray(attempt.paper.answerKey);
  const done = attempt.status === "SUBMITTED";
  const stored = done ? parseJsonArray(attempt.answers) : [];
  const questions = parseQuestions(attempt.paper.questions);

  const result = done
    ? {
        ...scoreAnswers(key, stored),
        questionCount: attempt.paper.questionCount,
        key,
        answers: stored,
        timedOut: false,
      }
    : null;

  // A scanned paper is quizzed; anything else is sat with the PDF on screen.
  // `isQuizzable` requires a question per key slot, so a partial scan falls
  // back rather than quietly asking fewer questions than it marks.
  if (isQuizzable(questions, attempt.paper.questionCount)) {
    return (
      <PaperQuiz
        attemptId={attempt.id}
        paperId={attempt.paper.id}
        title={attempt.paper.title}
        fileUrl={`/api/papers/${attempt.paper.id}/file`}
        questions={questions}
        answerSource={parseAnswerSource(attempt.paper.answerSource)}
        initialSeconds={secondsRemaining(attempt.startedAt, attempt.paper.timeLimitMinutes)}
        initialResult={result}
      />
    );
  }

  return (
    <PaperSitting
      attemptId={attempt.id}
      paperId={attempt.paper.id}
      title={attempt.paper.title}
      fileUrl={`/api/papers/${attempt.paper.id}/file`}
      questionCount={attempt.paper.questionCount}
      initialSeconds={secondsRemaining(attempt.startedAt, attempt.paper.timeLimitMinutes)}
      initialResult={result}
    />
  );
}
