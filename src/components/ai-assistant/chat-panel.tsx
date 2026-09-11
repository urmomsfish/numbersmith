"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { sendAiMessageAction, clearAiChatAction } from "@/lib/actions/ai-actions";

type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "I don't understand why we flip the inequality sign when dividing by a negative number.",
  "Walk me through how to approach a stuck combinatorics counting problem.",
  "I got this wrong — can you show me where my reasoning broke down?",
];

export function ChatPanel({
  initialMessages,
  configured,
}: {
  initialMessages: Message[];
  configured: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function send(content: string) {
    const text = content.trim();
    if (!text || pending) return;
    setError(null);
    const optimisticUser: Message = { id: `local-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, optimisticUser]);
    setInput("");

    startTransition(async () => {
      try {
        const { reply } = await sendAiMessageAction({ content: text });
        setMessages((prev) => [...prev, { id: `local-${Date.now()}-a`, role: "assistant", content: reply }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function clear() {
    setMessages([]);
    setError(null);
    startTransition(async () => {
      await clearAiChatAction();
    });
  }

  if (!configured) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-card p-8 text-center dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          SmithAI isn&apos;t configured yet.
        </p>
        <p className="mt-1.5 max-w-sm text-xs text-slate-700 dark:text-slate-400">
          This deployment is missing an ANTHROPIC_API_KEY. Once one is added, this page starts working
          immediately — no other changes needed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-card dark:border-slate-700">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-400">Try asking something like:</p>
            <div className="mt-2 flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-slate-200 bg-background px-3 py-2 text-left text-xs text-slate-600 transition-colors hover:border-brand-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:text-slate-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-background text-slate-800 dark:border-slate-700 dark:text-slate-100"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-background px-4 py-2.5 dark:border-slate-700">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-slate-200 p-3 dark:border-slate-700"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask about a problem or concept…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 dark:border-slate-700 dark:text-slate-50"
        />
        <Button type="submit" disabled={pending || !input.trim()}>
          Send
        </Button>
        {messages.length > 0 && (
          <Button type="button" variant="ghost" onClick={clear} disabled={pending}>
            Clear
          </Button>
        )}
      </form>
    </div>
  );
}
