import katex from "katex";

// SERVER/build-time only: render a prose string containing `$…$` (inline) and
// `$$…$$` (display) math to a trusted HTML string via KaTeX. Keeping this off
// the client means KaTeX (~260 KB) never ships in any browser bundle — math is
// baked into the static HTML, exactly like the .mdx content's rehype-katex pass.
// Do NOT import this from a "use client" module.
//
// Authoring: `$` always opens/closes math. For a LITERAL dollar sign (currency
// in a word problem), write `\$`. An odd/unbalanced `$` is an authoring mistake
// and throws at build — never a silent mis-render.

const TOKEN = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
// `\$` is protected as this private-use sentinel while we tokenize on `$`, then
// restored — chosen so it never collides with authored content.
const LITERAL_DOLLAR = String.fromCharCode(0xf8ff);

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
  const restore = (s: string) => s.split(LITERAL_DOLLAR).join("$");
  return text
    .replace(/\\\$/g, LITERAL_DOLLAR) // protect literal \$ before tokenizing
    .split(TOKEN)
    .map((seg) => {
      if (seg.startsWith("$$") && seg.endsWith("$$")) {
        return math(restore(seg.slice(2, -2)), true);
      }
      if (seg.length > 1 && seg.startsWith("$") && seg.endsWith("$")) {
        return math(restore(seg.slice(1, -1)), false);
      }
      // A `$` left in a prose segment means an unbalanced delimiter.
      if (seg.includes("$")) {
        throw new Error(
          `texToHtml: unbalanced '$' in ${JSON.stringify(text)} — ` +
            `use \\$ for a literal dollar sign.`,
        );
      }
      return escapeHtml(restore(seg));
    })
    .join("");
}
