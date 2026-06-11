import { describe, expect, it } from "vitest";
import { reflect, applyTransform } from "./reflect";
import type { Shape } from "./types";

const approx = (a: number, b: number, eps = 1e-9) =>
  Math.abs(a - b) <= eps;

describe("reflect — point", () => {
  it("reflects a point across the x-axis (the canonical first red test)", () => {
    expect(
      reflect({ type: "point", at: { x: 3, y: 2 } }, { kind: "axis", axis: "x" }),
    ).toEqual({ type: "point", at: { x: 3, y: -2 } });
  });

  it("reflects a point across the y-axis", () => {
    expect(
      reflect({ type: "point", at: { x: 3, y: 2 } }, { kind: "axis", axis: "y" }),
    ).toEqual({ type: "point", at: { x: -3, y: 2 } });
  });

  it("reflects a point across y = x", () => {
    expect(
      reflect(
        { type: "point", at: { x: 3, y: 2 } },
        { kind: "diagonal", slope: 1 },
      ),
    ).toEqual({ type: "point", at: { x: 2, y: 3 } });
  });

  it("reflects a point across y = -x", () => {
    expect(
      reflect(
        { type: "point", at: { x: 3, y: 2 } },
        { kind: "diagonal", slope: -1 },
      ),
    ).toEqual({ type: "point", at: { x: -2, y: -3 } });
  });

  it("reflects a point across a general line y = m·x + b", () => {
    // Reflect (0,0) over y = x + 2  -> (-2, 2)
    const out = reflect(
      { type: "point", at: { x: 0, y: 0 } },
      { kind: "linear", m: 1, b: 2 },
    );
    if (out.type !== "point") throw new Error("expected point");
    expect(approx(out.at.x, -2)).toBe(true);
    expect(approx(out.at.y, 2)).toBe(true);
  });

  it("treats a vertical-looking general line correctly for horizontal line y = b", () => {
    // y = 0·x + 5 (horizontal): (1, 1) -> (1, 9)
    const out = reflect(
      { type: "point", at: { x: 1, y: 1 } },
      { kind: "linear", m: 0, b: 5 },
    );
    if (out.type !== "point") throw new Error("expected point");
    expect(approx(out.at.x, 1)).toBe(true);
    expect(approx(out.at.y, 9)).toBe(true);
  });

  it("preserves the label", () => {
    expect(
      reflect(
        { type: "point", at: { x: 3, y: 2 }, label: "A" },
        { kind: "axis", axis: "x" },
      ),
    ).toEqual({ type: "point", at: { x: 3, y: -2 }, label: "A" });
  });
});

describe("reflect — segment", () => {
  it("reflects endpoints across the x-axis preserving order", () => {
    expect(
      reflect(
        {
          type: "segment",
          from: { x: 1, y: 2 },
          to: { x: 4, y: 6 },
          label: "s",
        },
        { kind: "axis", axis: "x" },
      ),
    ).toEqual({
      type: "segment",
      from: { x: 1, y: -2 },
      to: { x: 4, y: -6 },
      label: "s",
    });
  });
});

describe("reflect — polygon", () => {
  const tri: Shape = {
    type: "polygon",
    vertices: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 4 },
    ],
    label: "T",
  };

  it("reflects all vertices across the y-axis, preserving order", () => {
    expect(reflect(tri, { kind: "axis", axis: "y" })).toEqual({
      type: "polygon",
      vertices: [
        { x: -1, y: 1 },
        { x: -3, y: 1 },
        { x: -2, y: 4 },
      ],
      label: "T",
    });
  });

  it("reflects all vertices across y = x, preserving order", () => {
    expect(reflect(tri, { kind: "diagonal", slope: 1 })).toEqual({
      type: "polygon",
      vertices: [
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 4, y: 2 },
      ],
      label: "T",
    });
  });

  it("reflects all vertices across y = -x, preserving order", () => {
    expect(reflect(tri, { kind: "diagonal", slope: -1 })).toEqual({
      type: "polygon",
      vertices: [
        { x: -1, y: -1 },
        { x: -1, y: -3 },
        { x: -4, y: -2 },
      ],
      label: "T",
    });
  });
});

describe("reflect — involution (reflecting twice returns the original)", () => {
  const lines = [
    { kind: "axis", axis: "x" } as const,
    { kind: "axis", axis: "y" } as const,
    { kind: "diagonal", slope: 1 } as const,
    { kind: "diagonal", slope: -1 } as const,
    { kind: "linear", m: 2, b: -3 } as const,
    { kind: "linear", m: -0.5, b: 4 } as const,
  ];

  const poly: Shape = {
    type: "polygon",
    vertices: [
      { x: -2, y: 3 },
      { x: 5, y: 1 },
      { x: 0, y: -4 },
    ],
  };

  for (const line of lines) {
    it(`is its own inverse for ${JSON.stringify(line)}`, () => {
      const twice = reflect(reflect(poly, line), line);
      if (twice.type !== "polygon") throw new Error("expected polygon");
      twice.vertices.forEach((v, i) => {
        expect(approx(v.x, poly.vertices[i].x)).toBe(true);
        expect(approx(v.y, poly.vertices[i].y)).toBe(true);
      });
    });
  }
});

describe("applyTransform — dispatcher", () => {
  it("dispatches reflection to reflect()", () => {
    expect(
      applyTransform(
        { type: "point", at: { x: 3, y: 2 } },
        "reflection",
        { kind: "axis", axis: "x" },
      ),
    ).toEqual({ type: "point", at: { x: 3, y: -2 } });
  });

  it("dispatches translation to translate()", () => {
    expect(
      applyTransform(
        { type: "point", at: { x: 0, y: 0 } },
        "translation",
        { dx: 1, dy: 1 },
      ),
    ).toEqual({ type: "point", at: { x: 1, y: 1 } });
  });

  it("dispatches rotation to rotate()", () => {
    expect(
      applyTransform(
        { type: "point", at: { x: 1, y: 0 } },
        "rotation",
        { about: { x: 0, y: 0 }, angle: 90 },
      ),
    ).toEqual({ type: "point", at: { x: 0, y: 1 } });
  });
});
