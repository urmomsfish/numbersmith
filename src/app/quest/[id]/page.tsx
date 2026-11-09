import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { questView } from "@/lib/engine/quest";
import { QuestScreen } from "./quest-screen";

export const metadata = { title: "The Forgelands" };

/**
 * The quest lives outside the app shell on purpose.
 *
 * Under `(app)` it inherited the sidebar and the topbar, which left the game
 * itself a strip in the middle of a dashboard. A game is the thing you are
 * looking at; this route gets the whole viewport and draws its own way out.
 */
export default async function QuestPage(props: PageProps<"/quest/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await props.params;
  const run = await prisma.gameRun.findUnique({ where: { id }, select: { userId: true } });
  // The same ownership rule the actions enforce — this page hands down a
  // problem, and resolving it returns the answer key.
  if (!run || run.userId !== user.id) redirect("/arcade");

  // A reload rehydrates rather than restarts: the road, the hero's health,
  // the relics and whatever is in the way all come back as they were.
  const view = await questView(id);
  if (!view) redirect("/arcade");

  return <QuestScreen initial={view} />;
}
