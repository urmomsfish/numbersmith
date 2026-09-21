import { Fragment } from "react";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";

// Smith AI answers in prose: short paragraphs, numbered steps, the occasional
// bolded term, and math written the same ASCII way the lessons author it. The
// panel used to print all of that as one pre-wrapped blob, which buried the
// structure the system prompt works hard to produce.
//
// This is deliberately a *small* formatter, not a Markdown engine. It covers
// what the assistant actually emits — paragraphs, ordered and unordered lists,
// section headings, horizontal rules, bold, inline code — and passes everything
// else through as text, so an unexpected construct degrades to plain prose
// instead of rendering wrong.

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "h"; level: number; text: string }
  | { kind: "hr" };

const ORDERED = /^\s*(\d{1,2})[.)]\s+(.*)$/;
const BULLET = /^\s*[-*•]\s+(.*)$/;
// The assistant reaches for "## Step 3: …" and a "---" rule between sections
// whenever an answer runs long. Both used to print literally, so a worked
// solution arrived with `##` and `–––` sitting in the middle of the prose.
const HEADING = /^\s*(#{1,6})\s+(.*)$/;
const RULE = /^\s*([-*_])(?:\s*\1){2,}\s*$/;

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;

    // Before the bullet check: "---" also matches a dash bullet, and a rule is
    // the more specific reading of a line that is nothing but dashes.
    if (RULE.test(line)) {
      // Collapse a rule that lands straight after another, and drop a leading
      // one — a divider needs something above it to divide.
      if (blocks.length && blocks[blocks.length - 1].kind !== "hr") blocks.push({ kind: "hr" });
      continue;
    }

    const h = HEADING.exec(line);
    if (h && h[2].trim()) {
      blocks.push({ kind: "h", level: h[1].length, text: h[2].trim() });
      continue;
    }

    const ol = ORDERED.exec(line);
    if (ol) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "ol") last.items.push(ol[2]);
      else blocks.push({ kind: "ol", items: [ol[2]] });
      continue;
    }

    const ul = BULLET.exec(line);
    if (ul) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "ul") last.items.push(ul[1]);
      else blocks.push({ kind: "ul", items: [ul[1]] });
      continue;
    }

    const last = blocks[blocks.length - 1];
    if (last?.kind === "p") last.lines.push(line);
    else blocks.push({ kind: "p", lines: [line] });
  }
  // A rule with nothing under it is a line across the bottom of the bubble.
  if (blocks[blocks.length - 1]?.kind === "hr") blocks.pop();
  return blocks;
}

/** Renders **bold** and `code` spans; everything else goes through MathText. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-slate-900 dark:text-slate-50">
              <MathText>{part.slice(2, -2)}</MathText>
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.9em] dark:bg-slate-700/70"
            >
              <MathText>{part.slice(1, -1)}</MathText>
            </code>
          );
        }
        return <MathText key={i}>{part}</MathText>;
      })}
    </>
  );
}

export function MessageContent({ content }: { content: string }) {
  const blocks = toBlocks(content);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.kind === "hr") {
          return <hr key={i} className="border-slate-200 dark:border-slate-700" />;
        }
        if (block.kind === "h") {
          // Two sizes, not six. The body here is text-sm, so an h1 scale would
          // shout; what a section header needs is to read as a break in the
          // answer, which weight and spacing do on their own.
          const Tag = block.level <= 2 ? "h3" : "h4";
          return (
            <Tag
              key={i}
              className={cn(
                "font-semibold text-slate-900 dark:text-slate-50",
                // No top margin on the first block — it would push the heading
                // off the avatar it lines up with.
                i > 0 && "pt-1.5",
                block.level <= 2 ? "text-[0.95rem]" : "text-sm"
              )}
            >
              <Inline text={block.text} />
            </Tag>
          );
        }
        if (block.kind === "p") {
          return (
            <p key={i} className="leading-relaxed">
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  <Inline text={line} />
                </Fragment>
              ))}
            </p>
          );
        }
        if (block.kind === "ul") {
          return (
            <ul key={i} className="space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5 leading-relaxed">
                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={i} className="space-y-1.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2.5 leading-relaxed">
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                  {j + 1}
                </span>
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
