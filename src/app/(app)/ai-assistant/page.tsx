import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { isProUser } from "@/lib/subscription";
import { aiIsConfigured } from "@/lib/ai";
import { ChatPanel } from "@/components/ai-assistant/chat-panel";

export default async function AiAssistantPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!(await isProUser(user.id))) redirect("/pricing?from=ai-assistant");

  const messages = await prisma.aiChatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto flex h-[calc(100vh-0px)] max-w-3xl flex-col px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">AI Math Assistant</h1>
        <Badge tone="warning">⭐ Pro</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Explain a concept, walk through a problem step by step, or dig into a mistake — ask a follow-up any time.
      </p>

      <div className="mt-6 flex-1 overflow-hidden">
        <ChatPanel
          initialMessages={messages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content }))}
          configured={aiIsConfigured()}
        />
      </div>
    </div>
  );
}
