import { Fragment } from "react";
import { parseMath, mathToPlainText, type MathNode } from "@/lib/math-notation";

// Renders authored math-in-prose with real typography. Superscripts and
// subscripts are actual <sup>/<sub> elements rather than Unicode lookalikes,
// because the Unicode superscript block has no coverage for most letters —
// "a^(m+n)" simply cannot be written with precomposed characters.

function renderNodes(nodes: MathNode[], keyPrefix = ""): React.ReactNode {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}${i}`;
    switch (node.t) {
      case "text":
        return <Fragment key={key}>{node.v}</Fragment>;
      case "sup":
        return (
          <sup key={key} className="text-[0.72em] leading-none">
            {renderNodes(node.v, key + "-")}
          </sup>
        );
      case "sub":
        return (
          <sub key={key} className="text-[0.72em] leading-none">
            {renderNodes(node.v, key + "-")}
          </sub>
        );
      case "frac":
        // A stacked fraction: numerator over denominator, separated by a
        // vinculum, the way it is written by hand and printed on a contest.
        //
        // This was a raised-numerator/fraction-slash form, which costs no line
        // height — but it is read as division rather than seen as one object,
        // and at small sizes the U+2044 slash flattens until "(4⁄3)" starts to
        // look like "(4−3)".
        //
        // The height is bought back rather than ignored: 0.78em type on a
        // 1.08 leading keeps the whole stack near a single line box, so prose
        // containing a fraction does not open up a visible gap above it. The
        // border is the vinculum, so it inherits the surrounding colour for
        // free and needs no separate dark-mode rule.
        return (
          <span
            key={key}
            className="inline-flex flex-col items-center whitespace-nowrap align-middle text-[0.78em] leading-[1.08]"
          >
            <span className="px-[0.18em]">{node.num}</span>
            <span className="w-full border-t border-current px-[0.18em] text-center">
              {node.den}
            </span>
          </span>
        );
      case "sqrt":
        return (
          <span key={key} className="whitespace-nowrap">
            <span aria-hidden>√</span>
            <span className="border-t border-current pt-px">{renderNodes(node.v, key + "-")}</span>
          </span>
        );
    }
  });
}

/** Inline math-aware text. Drop-in replacement for rendering a raw string. */
export function MathText({ children, className }: { children: string; className?: string }) {
  const nodes = parseMath(children);
  // The flattened source is kept as the accessible label so screen readers and
  // copy-paste get "a^(m+n)" rather than the visually-reordered glyph run.
  const plain = mathToPlainText(nodes);
  if (className) {
    return (
      <span className={className} aria-label={plain}>
        {renderNodes(nodes)}
      </span>
    );
  }
  return <span aria-label={plain}>{renderNodes(nodes)}</span>;
}
