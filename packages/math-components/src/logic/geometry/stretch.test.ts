import { describe, expect, it } from "vitest";
import { stretch } from "./stretch";
import type { Shape } from "./types";

describe("stretch", () => {
  it("a horizontal stretch scales x only, fixing points on the y-axis", () => {
    const seg: Shape = {
      type: "segment",
      from: { x: 0, y: 2 }, // on the y-axis: fixed
      to: { x: 3, y: 2 },
    };
    expect(stretch(seg, { axis: "x", factor: 2 })).toEqual({
      type: "segment",
      from: { x: 0, y: 2 },
      to: { x: 6, y: 2 },
    });
  });

  it("is not a rigid motion: a unit square's diagonal changes length", () => {
    const square: Shape = {
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
    };
    const image = stretch(square, { axis: "x", factor: 3 });
    if (image.type !== "polygon") throw new Error("expected polygon");
    // Bottom side tripled (1 → 3) while the left side is unchanged (1 → 1).
    expect(image.vertices[1]).toEqual({ x: 3, y: 0 });
    expect(image.vertices[3]).toEqual({ x: 0, y: 1 });
  });
});
