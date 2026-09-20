"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MessageContent } from "@/components/ai-assistant/message-content";
import { sendAiMessageAction, clearAiChatAction } from "@/lib/actions/ai-actions";
import {
  prepareAttachment,
  isAttachableFile,
  ACCEPTED_UPLOAD_TYPES,
  type PreparedAttachment,
} from "@/lib/prepare-attachment";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** data: URL for a screenshot attached to this message, if any. */
  imageUrl?: string | null;
  /** A PDF was attached. No filename: storing one would mean another column
   * for a label, and the conversation around the bubble already says which
   * paper it is. */
  hasPdf?: boolean;
};

const SUGGESTIONS: Array<{ label: string; prompt: string }> = [
  {
    label: "Explain a concept",
    prompt: "I don't understand why we flip the inequality sign when dividing by a negative number.",
  },
  {
    label: "Get unstuck",
    prompt: "Walk me through how to approach a stuck combinatorics counting problem.",
  },
  {
    label: "Review a mistake",
    prompt: "I got this wrong — can you show me where my reasoning broke down?",
  },
  {
    label: "Competition strategy",
    prompt: "How should I pace myself through an AMC 10 paper when I'm short on time?",
  },
];

function SmithMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-[11px] font-bold text-white",
        className
      )}
      aria-hidden
    >
      S
    </span>
  );
}

function IconPaperclip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconPdf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard access can be denied; the message is still on screen.
        }
      }}
      aria-label="Copy this answer"
      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-slate-500 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
    >
      <IconCopy className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

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
  const [confirmClear, setConfirmClear] = useState(false);
  const [pending, startTransition] = useTransition();
  // The file staged in the composer but not yet sent.
  const [attachment, setAttachment] = useState<PreparedAttachment | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localMessageId = useRef(0);
  // Only pin to the bottom when the reader is already there. Auto-scrolling a
  // student who has deliberately scrolled up to re-read step 2 yanks the text
  // out from under them exactly when a new answer lands.
  const stickToBottom = useRef(true);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  // Grow the composer with its content, up to a cap, so a pasted problem is
  // visible while being typed instead of scrolling inside one line. When the
  // box is empty we clear the inline height rather than measure: a mount-time
  // scrollHeight read happens before the stylesheet settles and locks in a
  // too-tall box that nothing later corrects, whereas rows={1} is already the
  // right empty size.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = input ? `${Math.min(el.scrollHeight, 180)}px` : "";
  }, [input]);

  /** Prepares and stages a file. Replaces whatever was staged — one attachment
   * per message keeps the model's attention on the thing just asked about, and
   * makes "remove it" a single obvious control rather than a list. */
  const attach = useCallback(async (file: File) => {
    if (!isAttachableFile(file)) {
      setError("You can attach an image or a PDF.");
      return;
    }
    setError(null);
    setPreparing(true);
    try {
      const prepared = await prepareAttachment(file);
      setAttachment((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return prepared;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read that file.");
    } finally {
      setPreparing(false);
    }
  }, []);

  const clearAttachment = useCallback(() => {
    setAttachment((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, []);

  // Release the staged preview if the page unmounts with one pending. PDFs have
  // no object URL to release.
  useEffect(
    () => () => { if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl); },
    [attachment]
  );

  function send(content: string) {
    const text = content.trim();
    const file = attachment;
    // An attachment on its own is a complete question, so an empty box is fine
    // as long as something is staged. Don't send while one is still being
    // prepared, or it would silently go without the file.
    if ((!text && !file) || pending || preparing) return;
    setError(null);
    setConfirmClear(false);
    stickToBottom.current = true;
    localMessageId.current += 1;
    const optimisticUser: Message = {
      id: `local-${localMessageId.current}`,
      role: "user",
      content: text,
      imageUrl: file?.kind === "image" ? `data:${file.type};base64,${file.data}` : null,
      hasPdf: file?.kind === "pdf",
    };
    setMessages((prev) => [...prev, optimisticUser]);
    setInput("");
    // Unstage immediately — but from the composer only. The bubble above
    // carries its own copy, so the thread still shows what was sent.
    clearAttachment();

    startTransition(async () => {
      try {
        const res = await sendAiMessageAction({
          content: text,
          attachment: file ? { data: file.data, type: file.type } : null,
        });
        // The server fills in a sentence when a file was sent with no text,
        // so adopt what it stored rather than leaving the bubble empty.
        if (res.content !== text) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticUser.id ? { ...m, content: res.content } : m))
          );
        }
        localMessageId.current += 1;
        setMessages((prev) => [...prev, { id: `local-${localMessageId.current}`, role: "assistant", content: res.reply }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function clear() {
    setMessages([]);
    setError(null);
    setConfirmClear(false);
    startTransition(async () => {
      try {
        await clearAiChatAction();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't clear the thread.");
      }
    });
  }

  if (!configured) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-card p-8 text-center dark:border-slate-700">
        <SmithMark className="h-9 w-9 text-sm" />
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Smith AI isn&apos;t configured yet.
        </p>
        <p className="mt-1.5 max-w-sm text-xs text-slate-700 dark:text-slate-400">
          This deployment is missing an ANTHROPIC_API_KEY. Once one is added, this page starts working
          immediately — no other changes needed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-card dark:border-slate-700">
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <SmithMark className="h-10 w-10 rounded-xl text-base" />
            <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-50">
              What are you working on?
            </p>
            <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Smith AI walks you through the reasoning step by step instead of handing over answers.
            </p>
            <div className="mt-5 grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  className="rounded-xl border border-slate-200 bg-background p-3 text-left transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-slate-800/60"
                >
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {s.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex flex-col items-end gap-1.5">
                  {m.imageUrl && (
                    // A plain <img>: these are data: URLs built from a column,
                    // with no intrinsic size known at render time and nothing
                    // for next/image to optimise — it would only add a proxy
                    // hop to bytes that are already in the payload.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.imageUrl}
                      alt="Screenshot you attached"
                      className="max-h-72 max-w-[85%] rounded-2xl rounded-br-md border border-slate-200 object-contain dark:border-slate-700"
                    />
                  )}
                  {m.hasPdf && (
                    // A chip, not a preview. Rendering page one would mean a
                    // PDF library in the bundle, and shipping the file's bytes
                    // down to draw it — megabytes for a thumbnail too small to
                    // read.
                    <div className="flex items-center gap-2 rounded-2xl rounded-br-md border border-slate-200 bg-background px-3.5 py-2.5 dark:border-slate-700">
                      <IconPdf className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        PDF attached
                      </span>
                    </div>
                  )}
                  {m.content && (
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white">
                      {m.content}
                    </div>
                  )}
                </div>
              ) : (
                <div key={m.id} className="group flex gap-3">
                  <SmithMark />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-800 dark:text-slate-100">
                      <MessageContent content={m.content} />
                    </div>
                    <div className="mt-1 flex">
                      <CopyButton text={m.content} />
                    </div>
                  </div>
                </div>
              )
            )}

            {pending && (
              <div className="flex gap-3">
                <SmithMark />
                <div className="flex items-center gap-1.5 pt-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                  <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">Thinking…</span>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {error && (
        <p className="mx-3 mb-1 rounded-lg border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-xs font-medium text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}

      <div
        className={cn(
          "border-t border-slate-200 p-3 transition dark:border-slate-700",
          dragging && "bg-ember-500/10"
        )}
        // Drop anywhere on the composer, not just on the button. dragenter/over
        // must both preventDefault or the browser navigates to the file.
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          // Fires when crossing onto a child too, which would flicker the
          // highlight; ignore those by checking the pointer actually left.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void attach(file);
        }}
      >
        {(attachment || preparing) && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-background p-2 dark:border-slate-700">
            {attachment ? (
              <>
                {attachment.previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={attachment.previewUrl}
                    alt="Screenshot ready to send"
                    className="h-14 w-14 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
                    <IconPdf className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </span>
                )}
                <span className="min-w-0 flex-1 text-xs text-slate-600 dark:text-slate-400">
                  {attachment.kind === "pdf" ? (
                    <>
                      {/* The filename is the only thing identifying which paper
                          this is, so it gets to be the prominent part. */}
                      <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                        {attachment.name}
                      </span>
                      <span className="block">Ask about a problem in it — say which number.</span>
                    </>
                  ) : (
                    "Screenshot attached. Add a question, or send it on its own."
                  )}
                </span>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Remove
                </button>
              </>
            ) : (
              <span className="px-1 py-3 text-xs text-slate-600 dark:text-slate-400">
                Preparing file…
              </span>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_UPLOAD_TYPES}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void attach(file);
              // Reset so picking the same file twice in a row still fires.
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={pending || preparing}
            aria-label="Attach a screenshot or PDF"
            title="Attach a screenshot or PDF"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <IconPaperclip className="h-5 w-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // Pasting is the real path here: on both macOS and Windows a
            // screenshot lands on the clipboard, and making someone save it to
            // disk first just to re-pick it is the kind of friction that stops
            // the feature being used at all.
            onPaste={(e) => {
              const file = Array.from(e.clipboardData.files).find(isAttachableFile);
              if (file) {
                e.preventDefault();
                void attach(file);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask a math question, or attach a screenshot or PDF…"
            rows={1}
            className="max-h-[180px] flex-1 resize-none rounded-xl border border-slate-200 bg-background px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-foreground focus:ring-2 focus:ring-ember-600/30 dark:border-slate-700 dark:text-slate-50"
          />
          <Button type="submit" disabled={pending || preparing || (!input.trim() && !attachment)}>
            Send
          </Button>
        </form>

        <div className="mt-2 flex items-center justify-end gap-3 px-1">
          {/* Hidden on phones, where the on-screen keyboard has its own return
              key and the hint would only crowd the composer. */}
          <p className="mr-auto hidden text-[11px] text-slate-500 sm:block dark:text-slate-500">
            <kbd className="font-sans font-medium">Enter</kbd> to send ·{" "}
            <kbd className="font-sans font-medium">Shift+Enter</kbd> for a new line · paste or drop
            an image or PDF to attach it
          </p>
          {messages.length > 0 &&
            (confirmClear ? (
              <span className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                Delete this whole thread?
                <button
                  onClick={clear}
                  disabled={pending}
                  className="font-semibold text-danger-600 hover:underline dark:text-danger-400"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="font-medium text-slate-600 hover:underline dark:text-slate-400"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={pending}
                className="text-[11px] font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Clear chat
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
