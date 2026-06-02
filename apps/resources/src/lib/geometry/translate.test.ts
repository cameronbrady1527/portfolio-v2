import { describe, expect, it } from "vitest";
import { translate } from "./translate";
import type { Shape } from "./types";

describe("translate — point", () => {
  it("translates a point by (dx, dy) (the canonical first red test)", () => {
    expect(translate({ type: "point", at: { x: 1, y: 1 } }, 3, -2)).toEqual({
      type: "point",
      at: { x: 4, y: -1 },
    });
  });

  it("preserves the label", () => {
    expect(
      translate({ type: "point", at: { x: 1, y: 1 }, label: "A" }, 3, -2),
    ).toEqual({ type: "point", at: { x: 4, y: -1 }, label: "A" });
  });

  it("handles negative offsets", () => {
    expect(translate({ type: "point", at: { x: 5, y: -3 } }, -2, -4)).toEqual({
      type: "point",
      at: { x: 3, y: -7 },
    });
  });

  it("is the identity for a zero translation", () => {
    expect(translate({ type: "point", at: { x: 2, y: 7 } }, 0, 0)).toEqual({
      type: "point",
      at: { x: 2, y: 7 },
    });
  });
});

describe("translate — segment", () => {
  it("translates both endpoints preserving order and label", () => {
    expect(
      translate(
        { type: "segment", from: { x: 1, y: 2 }, to: { x: 4, y: 6 }, label: "s" },
        3,
        -2,
      ),
    ).toEqual({
      type: "segment",
      from: { x: 4, y: 0 },
      to: { x: 7, y: 4 },
      label: "s",
    });
  });

  it("is the identity for a zero translation", () => {
    const seg: Shape = {
      type: "segment",
      from: { x: 1, y: 2 },
      to: { x: 4, y: 6 },
    };
    expect(translate(seg, 0, 0)).toEqual(seg);
  });
});

describe("translate — polygon", () => {
  const tri: Shape = {
    type: "polygon",
    vertices: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 3 },
    ],
    label: "ABC",
  };

  it("translates all vertices, preserving order and label", () => {
    expect(translate(tri, 3, -2)).toEqual({
      type: "polygon",
      vertices: [
        { x: 4, y: -1 },
        { x: 6, y: -1 },
        { x: 5, y: 1 },
      ],
      label: "ABC",
    });
  });

  it("handles negative offsets across all vertices", () => {
    expect(translate(tri, -1, -5)).toEqual({
      type: "polygon",
      vertices: [
        { x: 0, y: -4 },
        { x: 2, y: -4 },
        { x: 1, y: -2 },
      ],
      label: "ABC",
    });
  });

  it("is the identity for a zero translation", () => {
    expect(translate(tri, 0, 0)).toEqual(tri);
  });
});
