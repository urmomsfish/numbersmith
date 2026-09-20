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
        // A typographic inline fraction: raised numerator, fraction slash,
        // lowered denominator. Keeps the line height of surrounding prose,
        // unlike a stacked (vertical) fraction.
        return (
          <span key={key} className="whitespace-nowrap">
            <sup className="text-[0.72em] leading-none">{node.num}</sup>
            <span aria-hidden>⁄</span>
            <sub className="text-[0.72em] leading-none">{node.den}</sub>
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
