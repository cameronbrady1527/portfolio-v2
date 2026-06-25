import { describe, expect, it } from "vitest";
import { figureToSvg, type Figure } from "./figure";

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

describe("figureToSvg — plot", () => {
  it("produces a self-contained, accessible SVG", () => {
    const svg = figureToSvg(fig);
    expect(svg).toContain("<svg");
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="test caption"');
    expect(svg).toContain("</svg>");
  });

  it("draws one path per curve and a labelled point", () => {
    const svg = figureToSvg(fig);
    expect((svg.match(/<path /g) ?? []).length).toBe(2); // parabola + line
    expect(svg).toContain("(5, 4)"); // point label text
  });

  it("escapes markup in captions/labels", () => {
    const svg = figureToSvg({ kind: "plot", caption: "<script>" });
    expect(svg).toContain("&lt;script&gt;");
    expect(svg).not.toContain("<script>");
  });
});
