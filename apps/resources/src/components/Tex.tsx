"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@repo/ui";

// Inline math for CLIENT components (the MDX pipeline's remark-math/rehype-katex
// only covers authored .mdx prose). Author strings the same way as content —
// `$...$` for inline, `$$...$$` for display — and this renders the math via
// KaTeX while leaving prose untouched. The KaTeX stylesheet is already loaded by
// the topic route, so rendered math inherits the page's math styling.

// Capture both display ($$…$$) and inline ($…$) spans; ordered so $$ wins.
const TOKEN = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;

function render(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    throwOnError: false,
    displayMode,
    output: "htmlAndMathml",
  });
}

export interface MathTextProps {
  children: string;
  className?: string;
}

/** Render a string of prose with inline/display `$…$` math segments. */
export function MathText({ children, className }: MathTextProps) {
  const segments = useMemo(() => children.split(TOKEN), [children]);
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.startsWith("$$") && seg.endsWith("$$")) {
          return (
            <span
              key={i}
              className="my-1 block overflow-x-auto"
              // KaTeX output is trusted (authored content, not user input).
              dangerouslySetInnerHTML={{ __html: render(seg.slice(2, -2), true) }}
            />
          );
        }
        if (seg.length > 1 && seg.startsWith("$") && seg.endsWith("$")) {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: render(seg.slice(1, -1), false) }}
            />
          );
        }
        return <span key={i}>{seg}</span>;
      })}
    </span>
  );
}

/** Render a single pure-LaTeX string (no `$` delimiters needed). */
export function Tex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(display && "block overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: render(tex, display) }}
    />
  );
}
