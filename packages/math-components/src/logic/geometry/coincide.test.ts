import { describe, expect, it } from "vitest";
import { shapesCoincide } from "./coincide";
import type { Shape } from "./types";

describe("shapesCoincide", () => {
  it("matches polygons regardless of vertex order, within tolerance", () => {
    const a: Shape = {
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 3 },
      ],
    };
    const reordered: Shape = {
      type: "polygon",
      vertices: [
        { x: 0, y: 3 },
        { x: 0, y: 0 },
        { x: 2.0000000001, y: 0 },
      ],
    };
    expect(shapesCoincide(a, reordered, 1e-6)).toBe(true);
  });

  it("rejects a near miss outside tolerance and mismatched types", () => {
    const a: Shape = { type: "point", at: { x: 1, y: 1 } };
    expect(shapesCoincide(a, { type: "point", at: { x: 1.1, y: 1 } }, 1e-6)).toBe(
      false,
    );
    expect(
      shapesCoincide(a, { type: "segment", from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }, 1e-6),
    ).toBe(false);
  });

  it("never double-counts: two preimage points may not map to one target point", () => {
    const a: Shape = {
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    };
    const b: Shape = {
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
    };
    expect(shapesCoincide(a, b, 1e-6)).toBe(false);
  });
});
