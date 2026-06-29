import { describe, expect, it } from "vitest";
import { prepareBank } from "./prepare";
import { bankSlugs } from "./bank";
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

  it("renders a literal dollar sign written as \\$ (currency, not math)", () => {
    const html = texToHtml(String.raw`It costs \$5 to enter.`);
    expect(html).toBe("It costs $5 to enter.");
    expect(html).not.toContain("katex");
  });

  it("throws (fails loud) on an unbalanced $ rather than mis-rendering", () => {
    expect(() => texToHtml("cost is $5 and rising")).toThrowError(/unbalanced/);
  });
});

describe("prepareBank", () => {
  const items = prepareBank("solving-quadratics");

  it("prepares every item with its prompt math pre-rendered", () => {
    expect(items.length).toBeGreaterThanOrEqual(21);
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

describe("prepareBank — every bank renders cleanly", () => {
  // Guards all banks (not just the few spot-checked above): every authored math
  // field must pre-render without an unbalanced `$` (which throws) and without a
  // silent KaTeX error node (class "katex-error" / a "ParseError" title).
  for (const slug of bankSlugs) {
    it(`prepares "${slug}" with no KaTeX error nodes`, () => {
      const items = prepareBank(slug);
      expect(items.length, slug).toBeGreaterThan(0);
      const htmlOf = (i: (typeof items)[number]): string =>
        [
          i.promptHtml,
          i.figureHtml ?? "",
          i.solutionFigureHtml ?? "",
          i.mode === "mc"
            ? [...i.choicesHtml, i.explanationHtml].join(" ")
            : [
                i.answerSummaryHtml,
                i.modelSolutionHtml,
                ...i.rubric.map((r) => r.criteriaHtml),
              ].join(" "),
        ].join(" ");
      for (const item of items) {
        const html = htmlOf(item);
        expect(item.promptHtml.length, item.id).toBeGreaterThan(0);
        expect(html, item.id).not.toContain("katex-error");
        expect(html, item.id).not.toContain("ParseError");
      }
    });
  }
});

describe("prepareBank — figures", () => {
  it("renders an answer figure (the system's solution graph) to inline SVG", () => {
    const graphed = prepareBank("systems-of-equations").find(
      (i) => i.solutionFigureHtml,
    );
    expect(graphed, "expected a systems item with an answer graph").toBeDefined();
    expect(graphed?.solutionFigureHtml).toContain("<svg");
    expect(graphed?.solutionFigureHtml).toContain("<path");
  });

  it("renders a given table and an answer scatter for a statistics item", () => {
    const reg = prepareBank("statistics")[0];
    expect(reg.figureHtml).toContain("<table"); // the given data table
    expect(reg.solutionFigureHtml).toContain("<svg"); // the scatter plot
    expect(reg.solutionFigureHtml).toContain("<circle"); // plotted data points
  });

  it("renders one figure per choice for a figure-choice MC item", () => {
    const item = prepareBank("linear-vs-exponential")[0];
    expect(item.mode).toBe("mc");
    if (item.mode !== "mc") return;
    expect(item.choiceFiguresHtml).toHaveLength(item.choicesHtml.length);
    expect(item.choiceFiguresHtml?.every((h) => h.includes("<table"))).toBe(true);
  });
});
