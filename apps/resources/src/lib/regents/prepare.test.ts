import { describe, expect, it } from "vitest";
import { prepareBank } from "./prepare";
import { texToHtml } from "../tex-to-html";

describe("texToHtml", () => {
  it("renders $…$ math as KaTeX and HTML-escapes the surrounding prose", () => {
    const html = texToHtml("Solve $x^2$ now <oops>");
    expect(html).toContain("katex");
    expect(html).toContain("Solve ");
    expect(html).toContain("&lt;oops&gt;"); // prose is escaped, not raw markup
  });

  it("leaves prose-only strings as escaped text (no KaTeX)", () => {
    expect(texToHtml("addition property of equality")).toBe(
      "addition property of equality",
    );
  });
});

describe("prepareBank", () => {
  const items = prepareBank("solving-quadratics");

  it("prepares all 12 items with their prompt math pre-rendered", () => {
    expect(items).toHaveLength(12);
    for (const it of items) {
      expect(it.promptHtml, it.id).toContain("katex");
    }
  });

  it("self-score items carry rendered model solution + rubric criteria", () => {
    const selfScore = items.filter((i) => i.mode === "self-score");
    expect(selfScore.length).toBeGreaterThan(0);
    for (const it of selfScore) {
      if (it.mode !== "self-score") continue;
      expect(it.modelSolutionHtml, it.id).toContain("katex");
      expect(it.rubric[0].criteriaHtml.length, it.id).toBeGreaterThan(0);
    }
  });
});
