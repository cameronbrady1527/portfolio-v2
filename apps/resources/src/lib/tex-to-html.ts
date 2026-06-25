import katex from "katex";

// SERVER/build-time only: render a prose string containing `$…$` (inline) and
// `$$…$$` (display) math to a trusted HTML string via KaTeX. Keeping this off
// the client means KaTeX (~260 KB) never ships in any browser bundle — math is
// baked into the static HTML, exactly like the .mdx content's rehype-katex pass.
// Do NOT import this from a "use client" module.

const TOKEN = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE[c]);
}

function math(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    throwOnError: false,
    displayMode,
    output: "htmlAndMathml",
  });
}

/** Prose + `$…$`/`$$…$$` math → trusted HTML (prose escaped, math via KaTeX). */
export function texToHtml(text: string): string {
  return text
    .split(TOKEN)
    .map((seg) => {
      if (seg.startsWith("$$") && seg.endsWith("$$")) {
        return math(seg.slice(2, -2), true);
      }
      if (seg.length > 1 && seg.startsWith("$") && seg.endsWith("$")) {
        return math(seg.slice(1, -1), false);
      }
      return escapeHtml(seg);
    })
    .join("");
}
