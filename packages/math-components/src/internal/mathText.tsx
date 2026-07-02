/**
 * `<MathText>` — render a proof's display string, in which inline math is set off
 * by `$…$` and everything outside stays prose. Segments read with true overbars,
 * angles/triangles get proper symbols, and `x/5` becomes a real fraction — the
 * Regents-faithful notation the Proofs unit asks for.
 *
 * Math spans render through KaTeX (`htmlAndMathml`, so its MathML carries the
 * accessible reading); prose renders as plain text. A string with no `$` renders
 * entirely as prose, so a statement that never set a `tex` display form falls
 * back to its plain `text` unharmed.
 */
import { Fragment } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const cache = new Map<string, string>();

/** KaTeX HTML+MathML for one inline math span; never throws (renders the source
 *  in error colour instead), and memoised since specs repeat across re-renders. */
function renderMath(tex: string): string {
  let html = cache.get(tex);
  if (html === undefined) {
    html = katex.renderToString(tex, {
      throwOnError: false,
      displayMode: false,
      output: "htmlAndMathml",
    });
    cache.set(tex, html);
  }
  return html;
}

/** Split on `$…$`; even indices are prose, odd indices are the math between a
 *  pair of `$`. A trailing unmatched `$` (odd count) keeps its tail as prose. */
function segments(source: string): { math: boolean; value: string }[] {
  const parts = source.split("$");
  return parts.map((value, i) => ({ math: i % 2 === 1, value }));
}

export interface MathTextProps {
  /** Display string; inline math delimited by `$…$`. */
  source: string;
  /** Hide from the accessibility tree — use inside an element that already
   *  carries an `aria-label` (e.g. a statement tile) to avoid a double reading. */
  ariaHidden?: boolean;
  className?: string;
}

/** Render `source` with its `$…$` spans as KaTeX and the rest as prose. */
export function MathText({ source, ariaHidden, className }: MathTextProps) {
  return (
    <span className={className} aria-hidden={ariaHidden || undefined}>
      {segments(source).map((seg, i) =>
        seg.math ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: renderMath(seg.value) }} />
        ) : (
          <Fragment key={i}>{seg.value}</Fragment>
        ),
      )}
    </span>
  );
}
