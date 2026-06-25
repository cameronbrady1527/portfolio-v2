import { describe, expect, it } from "vitest";
import { figureToHtml, type Figure } from "./figure";

describe("figureToHtml — plot", () => {
  const fig: Figure = {
    kind: "plot",
    range: 10,
    curves: [
      { kind: "parabola", a: 1, b: -3, c: -6 },
      { kind: "line", m: 1, b: -1 },
    ],
    points: [{ x: 5, y: 4, label: "(5, 4)" }],
    caption: "test caption",
  };

  it("produces a self-contained, accessible SVG", () => {
    const svg = figureToHtml(fig);
    expect(svg).toContain("<svg");
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="test caption"');
  });

  it("draws one path per curve and a labelled point", () => {
    const svg = figureToHtml(fig);
    expect((svg.match(/<path /g) ?? []).length).toBe(2);
    expect(svg).toContain("(5, 4)");
  });
});

describe("figureToHtml — scatter", () => {
  const fig: Figure = {
    kind: "scatter",
    points: [
      [1, 185],
      [6, 5],
    ],
    xRange: [0, 7],
    yRange: [0, 220],
    fit: { m: -37.57, b: 215.67 },
    xLabel: "Week",
    caption: "scatter caption",
  };

  it("plots a dot per point plus a best-fit path", () => {
    const svg = figureToHtml(fig);
    expect((svg.match(/<circle /g) ?? []).length).toBe(2); // two data points
    expect((svg.match(/<path /g) ?? []).length).toBe(1); // the fit line
    expect(svg).toContain("Week"); // axis label
  });
});

describe("figureToHtml — table", () => {
  it("renders an HTML table with escaped cells", () => {
    const html = figureToHtml({
      kind: "table",
      headers: ["Week", 1, 2],
      rows: [["Earned <m>", 185, 150]],
    });
    expect(html).toContain("<table");
    expect(html).toContain("<th");
    expect(html).toContain("185");
    expect(html).toContain("Earned &lt;m&gt;"); // escaped
  });
});

describe("figureToHtml — escaping", () => {
  it("escapes markup in captions", () => {
    const svg = figureToHtml({ kind: "plot", caption: "<script>" });
    expect(svg).toContain("&lt;script&gt;");
    expect(svg).not.toContain("<script>");
  });
});
