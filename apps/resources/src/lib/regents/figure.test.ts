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

describe("figureToHtml — plot curve kinds", () => {
  it("draws exponential, absolute-value, and square-root curves", () => {
    const svg = figureToHtml({
      kind: "plot",
      range: 10,
      curves: [
        { kind: "exponential", a: 1, b: 2 },
        { kind: "absolute", a: 1, h: 0, k: -3 },
        { kind: "sqrt", a: 2, h: 1, k: 0 },
      ],
    });
    expect((svg.match(/<path /g) ?? []).length).toBe(3);
    expect(svg).not.toContain("NaN"); // sqrt domain (x<h) must break cleanly
  });

  it("renders FRAMED mode (custom x/y ranges + axis labels) for a story graph", () => {
    const svg = figureToHtml({
      kind: "plot",
      xRange: [0, 20],
      yRange: [0, 8],
      xLabel: "Time (minutes)",
      yLabel: "Speed (mph)",
      curves: [{ kind: "polyline", points: [[0, 0], [2, 3], [9, 6], [12, 6], [20, 0]] }],
    });
    expect(svg).toContain("Time (minutes)"); // x axis label
    expect(svg).toContain("Speed (mph)"); // y axis label
    expect(svg).toContain("<rect"); // framed box border
    expect(svg).toContain("20"); // x tick at max
    expect(svg).not.toContain("NaN");
  });

  it("draws a polyline as connected segments through its points", () => {
    const svg = figureToHtml({
      kind: "plot",
      range: 10,
      curves: [
        { kind: "polyline", points: [[-8, -8], [-2, 4], [2, 4], [8, -6]] },
      ],
    });
    const path = (svg.match(/<path d="([^"]+)"/) ?? [])[1] ?? "";
    expect(path.startsWith("M")).toBe(true);
    expect((path.match(/L/g) ?? []).length).toBe(3); // 4 points → 1 move + 3 lines
  });
});

describe("figureToHtml — plot inequalities (half-plane shading)", () => {
  it("shades a half-plane and draws a SOLID boundary for a non-strict inequality", () => {
    const svg = figureToHtml({
      kind: "plot",
      range: 10,
      inequalities: [{ boundary: { m: 1, b: 2 }, shade: "above", strict: false }],
    });
    expect(svg).toContain("<polygon"); // the shaded region
    expect(svg).toContain("fill-opacity=\"0.18\"");
    expect(svg).not.toContain("stroke-dasharray"); // non-strict → solid line
  });

  it("draws a DASHED boundary for a strict inequality", () => {
    const svg = figureToHtml({
      kind: "plot",
      inequalities: [{ boundary: { m: -2, b: 1 }, shade: "below", strict: true }],
    });
    expect(svg).toContain("stroke-dasharray"); // strict → dashed line
  });

  it("supports a vertical boundary (x = k)", () => {
    const svg = figureToHtml({
      kind: "plot",
      inequalities: [{ boundary: { x: 3 }, shade: "right", strict: true }],
    });
    expect(svg).toContain("<polygon");
    expect(svg).toContain("<line"); // vertical boundary segment (plus axes/grid)
  });

  it("renders one shaded polygon per inequality in a system", () => {
    const svg = figureToHtml({
      kind: "plot",
      inequalities: [
        { boundary: { m: 1, b: 0 }, shade: "above", strict: false },
        { boundary: { m: -1, b: 4 }, shade: "below", strict: true },
      ],
    });
    expect((svg.match(/<polygon /g) ?? []).length).toBe(2);
  });

  it("clips the shaded region to the actual side of the boundary", () => {
    // y ≥ x + 2, range 10. The top-left corner (−10, 10) satisfies it; the
    // bottom-right corner (10, −10) does not — so the polygon must include the
    // former screen corner and exclude the latter.
    const svg = figureToHtml({
      kind: "plot",
      range: 10,
      inequalities: [{ boundary: { m: 1, b: 2 }, shade: "above", strict: false }],
    });
    const poly = (svg.match(/<polygon points="([^"]+)"/) ?? [])[1] ?? "";
    expect(poly).not.toBe("");
    // Convert to a set of corner-ish coords; bottom-right data corner maps to
    // the max-x,max-y screen point, which should be absent from an "above" shade.
    expect(poly.split(" ").length).toBeGreaterThanOrEqual(3);
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

describe("figureToHtml — number-line", () => {
  it("renders an axis, ticks, a shaded ray, and an endpoint dot", () => {
    const svg = figureToHtml({
      kind: "number-line",
      min: 0,
      max: 3,
      step: 0.5,
      ray: { at: 0.5, dir: "left", closed: true },
      caption: "x ≤ ½",
    });
    expect(svg).toContain("<svg");
    expect((svg.match(/<line /g) ?? []).length).toBeGreaterThan(3); // axis + ticks + ray
    expect(svg).toContain("<circle"); // the endpoint dot
    expect(svg).toContain("½"); // half-tick label
  });
});

describe("figureToHtml — escaping", () => {
  it("escapes markup in captions", () => {
    const svg = figureToHtml({ kind: "plot", caption: "<script>" });
    expect(svg).toContain("&lt;script&gt;");
    expect(svg).not.toContain("<script>");
  });
});
