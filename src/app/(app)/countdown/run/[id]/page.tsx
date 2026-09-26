import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countdownQuestions, SECONDS_PER_QUESTION } from "@/lib/engine/countdown";
import { CountdownRunner } from "./runner";

export default async function CountdownRunPage(props: PageProps<"/countdown/run/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await props.params;
  const attempt = await prisma.competitionAttempt.findUnique({ where: { id } });
  // Same ownership rule the action enforces — the page hands down the questions.
  if (!attempt || attempt.userId !== user.id || attempt.mode !== "COUNTDOWN") redirect("/countdown");
  if (attempt.status === "SUBMITTED") redirect("/countdown");

  const questions = await countdownQuestions(attempt.id);

  return (
    <CountdownRunner
      attemptId={attempt.id}
      questions={questions}
      secondsPerQuestion={SECONDS_PER_QUESTION}
    />
  );
}
