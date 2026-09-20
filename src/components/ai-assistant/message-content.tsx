import { Fragment } from "react";
import { MathText } from "@/components/math-text";

// Smith AI answers in prose: short paragraphs, numbered steps, the occasional
// bolded term, and math written the same ASCII way the lessons author it. The
// panel used to print all of that as one pre-wrapped blob, which buried the
// structure the system prompt works hard to produce.
//
// This is deliberately a *small* formatter, not a Markdown engine. It covers
// what the assistant actually emits — paragraphs, ordered and unordered lists,
// bold, inline code — and passes everything else through as text, so an
// unexpected construct degrades to plain prose instead of rendering wrong.

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

const ORDERED = /^\s*(\d{1,2})[.)]\s+(.*)$/;
const BULLET = /^\s*[-*•]\s+(.*)$/;

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;

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
