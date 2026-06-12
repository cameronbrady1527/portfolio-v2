import { describe, expect, it } from "vitest";
import { dilate } from "./dilate";
import { applyTransform } from "./index";
import type { Shape } from "./types";

const triangle: Shape = {
  type: "polygon",
  vertices: [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
  ],
  label: "ABC",
};

describe("dilate", () => {
  it("scales distances from the center by the factor, leaving the center fixed", () => {
    // About the origin with k = 2: (x, y) ↦ (2x, 2y).
    const image = dilate(triangle, { about: { x: 0, y: 0 }, factor: 2 });
    expect(image).toEqual({
      type: "polygon",
      vertices: [
        { x: 2, y: 2 },
        { x: 6, y: 2 },
        { x: 2, y: 4 },
      ],
      label: "ABC",
    });

    // A point AT the center does not move, for any factor.
    const atCenter: Shape = { type: "point", at: { x: 5, y: -3 } };
    expect(dilate(atCenter, { about: { x: 5, y: -3 }, factor: 7 })).toEqual(
      atCenter,
    );
  });

  it("k = 1 is the identity; a negative factor maps through the center", () => {
    expect(dilate(triangle, { about: { x: 2, y: -1 }, factor: 1 })).toEqual(
      triangle,
    );

    // k = −1 about the origin is the same as a 180° rotation: (x,y) ↦ (−x,−y).
    const flipped = dilate(triangle, { about: { x: 0, y: 0 }, factor: -1 });
    expect(flipped).toEqual({
      type: "polygon",
      vertices: [
        { x: -1, y: -1 },
        { x: -3, y: -1 },
        { x: -1, y: -2 },
      ],
      label: "ABC",
    });
  });

  it("scales segment lengths in the ratio given by the factor (G.SRT.1b), about any center", () => {
    const seg: Shape = {
      type: "segment",
      from: { x: 2, y: 3 },
      to: { x: 5, y: 7 },
    }; // length 5 (3-4-5 triangle)
    const image = dilate(seg, { about: { x: -1, y: 4 }, factor: 2.5 });
    if (image.type !== "segment") throw new Error("expected segment");
    const len = Math.hypot(image.to.x - image.from.x, image.to.y - image.from.y);
    expect(len).toBeCloseTo(2.5 * 5, 10);
  });

  it("is reachable through the applyTransform dispatcher, alongside stretch", () => {
    const p: Shape = { type: "point", at: { x: 2, y: 3 } };
    expect(
      applyTransform(p, "dilation", { about: { x: 0, y: 0 }, factor: 3 }),
    ).toEqual({ type: "point", at: { x: 6, y: 9 }, label: undefined });
    expect(applyTransform(p, "stretch", { axis: "y", factor: 2 })).toEqual({
      type: "point",
      at: { x: 2, y: 6 },
      label: undefined,
    });
  });
});
