import { describe, expect, it } from "vitest";
import { allSymmetries, checkSymmetry } from "./symmetry";
import type { Shape } from "./types";

const round4 = (xs: number[]) => xs.map((x) => Math.round(x * 1e4) / 1e4);

const square: Extract<Shape, { type: "polygon" }> = {
  type: "polygon",
  vertices: [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 1, y: 3 },
  ],
};

const scalene: Extract<Shape, { type: "polygon" }> = {
  type: "polygon",
  vertices: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 1, y: 2 },
  ],
};

describe("checkSymmetry", () => {
  it("a square maps onto itself under a 90° rotation about its center, but not 45°", () => {
    expect(checkSymmetry(square, { kind: "rotation", angleDeg: 90 })).toBe(true);
    expect(checkSymmetry(square, { kind: "rotation", angleDeg: 45 })).toBe(false);
  });

  it("a square maps onto itself across its vertical axis and its diagonal", () => {
    // Axis angles are measured from the positive x-axis; the square's center
    // is (2, 2): vertical axis = 90°, main diagonal = 45°.
    expect(checkSymmetry(square, { kind: "reflection", angleDeg: 90 })).toBe(true);
    expect(checkSymmetry(square, { kind: "reflection", angleDeg: 45 })).toBe(true);
    expect(checkSymmetry(square, { kind: "reflection", angleDeg: 30 })).toBe(false);
  });

  it("a scalene triangle has no non-identity symmetry", () => {
    for (const angleDeg of [60, 90, 120, 180]) {
      expect(checkSymmetry(scalene, { kind: "rotation", angleDeg })).toBe(false);
    }
    for (const angleDeg of [0, 45, 90, 135]) {
      expect(checkSymmetry(scalene, { kind: "reflection", angleDeg })).toBe(false);
    }
  });
});

describe("allSymmetries", () => {
  it("finds the full symmetry set of a square: 3 rotations + 4 reflections", () => {
    const s = allSymmetries(square);
    expect(round4(s.rotations)).toEqual([90, 180, 270]);
    expect(round4(s.reflections)).toEqual([0, 45, 90, 135]);
  });

  it("equilateral triangle: 2 rotations + 3 axes; vertex order is irrelevant", () => {
    const eq: Shape = {
      type: "polygon",
      vertices: [
        { x: 1, y: Math.sqrt(3) },
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ],
    };
    const s = allSymmetries(eq as Extract<Shape, { type: "polygon" }>);
    expect(round4(s.rotations)).toEqual([120, 240]);
    expect(round4(s.reflections)).toEqual([30, 90, 150]);
  });

  it("rectangle vs scalene: 180° + two midpoint axes vs nothing at all", () => {
    const rect: Extract<Shape, { type: "polygon" }> = {
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 4, y: 2 },
        { x: 0, y: 2 },
      ],
    };
    const r = allSymmetries(rect);
    expect(round4(r.rotations)).toEqual([180]);
    expect(round4(r.reflections)).toEqual([0, 90]);

    const none = allSymmetries(scalene);
    expect(none.rotations).toEqual([]);
    expect(none.reflections).toEqual([]);
  });
});
