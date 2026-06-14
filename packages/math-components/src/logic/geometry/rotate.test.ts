import { describe, expect, it } from "vitest";
import { rotate } from "./rotate";
import type { Shape } from "./types";

const origin = { x: 0, y: 0 } as const;

describe("rotate — point about the origin", () => {
  it("rotates (1,0) by 90° CCW to (0,1) (the canonical first red test)", () => {
    expect(rotate({ type: "point", at: { x: 1, y: 0 } }, 90, origin)).toEqual({
      type: "point",
      at: { x: 0, y: 1 },
    });
  });

  it("rotates 90° CCW: (x,y) -> (-y,x)", () => {
    expect(rotate({ type: "point", at: { x: 3, y: 2 } }, 90, origin)).toEqual({
      type: "point",
      at: { x: -2, y: 3 },
    });
  });

  it("rotates 180°: (x,y) -> (-x,-y)", () => {
    expect(rotate({ type: "point", at: { x: 3, y: 2 } }, 180, origin)).toEqual({
      type: "point",
      at: { x: -3, y: -2 },
    });
  });

  it("rotates 270° CCW: (x,y) -> (y,-x)", () => {
    expect(rotate({ type: "point", at: { x: 3, y: 2 } }, 270, origin)).toEqual({
      type: "point",
      at: { x: 2, y: -3 },
    });
  });

  it("rotates -90° (== 270°): (x,y) -> (y,-x)", () => {
    expect(rotate({ type: "point", at: { x: 3, y: 2 } }, -90, origin)).toEqual({
      type: "point",
      at: { x: 2, y: -3 },
    });
  });

  it("preserves the label", () => {
    expect(
      rotate({ type: "point", at: { x: 1, y: 0 }, label: "A" }, 90, origin),
    ).toEqual({ type: "point", at: { x: 0, y: 1 }, label: "A" });
  });
});

describe("rotate — point about an arbitrary center {x:2,y:1}", () => {
  const c = { x: 2, y: 1 } as const;

  it("rotates 90° CCW about (2,1)", () => {
    // translate (4,1)->(2,0), rotate 90° -> (0,2), translate back -> (2,3)
    expect(rotate({ type: "point", at: { x: 4, y: 1 } }, 90, c)).toEqual({
      type: "point",
      at: { x: 2, y: 3 },
    });
  });

  it("rotates 180° about (2,1)", () => {
    // (4,1) -> reflected through center -> (0,1)
    expect(rotate({ type: "point", at: { x: 4, y: 1 } }, 180, c)).toEqual({
      type: "point",
      at: { x: 0, y: 1 },
    });
  });

  it("rotates 270° about (2,1)", () => {
    // translate (4,1)->(2,0), rotate 270° -> (0,-2), translate back -> (2,-1)
    expect(rotate({ type: "point", at: { x: 4, y: 1 } }, 270, c)).toEqual({
      type: "point",
      at: { x: 2, y: -1 },
    });
  });

  it("fixes the center point itself", () => {
    expect(rotate({ type: "point", at: { ...c } }, 90, c)).toEqual({
      type: "point",
      at: { x: 2, y: 1 },
    });
  });
});

describe("rotate — segment", () => {
  it("rotates endpoints 90° CCW about the origin, preserving order and label", () => {
    expect(
      rotate(
        { type: "segment", from: { x: 1, y: 0 }, to: { x: 0, y: 1 }, label: "s" },
        90,
        origin,
      ),
    ).toEqual({
      type: "segment",
      from: { x: 0, y: 1 },
      to: { x: -1, y: 0 },
      label: "s",
    });
  });
});

describe("rotate — polygon", () => {
  const tri: Shape = {
    type: "polygon",
    vertices: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
    ],
    label: "ABC",
  };

  it("rotates all vertices 90° CCW about the origin, preserving order and label", () => {
    expect(rotate(tri, 90, origin)).toEqual({
      type: "polygon",
      vertices: [
        { x: -1, y: 1 },
        { x: -1, y: 3 },
        { x: -2, y: 1 },
      ],
      label: "ABC",
    });
  });
});

describe("rotate — 360-equivalence (four 90° turns == identity)", () => {
  const poly: Shape = {
    type: "polygon",
    vertices: [
      { x: -2, y: 3 },
      { x: 5, y: 1 },
      { x: 0, y: -4 },
    ],
  };
  const center = { x: 2, y: 1 } as const;

  it("returns the original shape exactly after four 90° rotations about an arbitrary center", () => {
    let out: Shape = poly;
    for (let i = 0; i < 4; i++) out = rotate(out, 90, center);
    expect(out).toEqual(poly);
  });

  it("two 180° rotations are the identity", () => {
    expect(rotate(rotate(poly, 180, center), 180, center)).toEqual(poly);
  });

  it("90° then 270° about the same center is the identity", () => {
    expect(rotate(rotate(poly, 90, center), 270, center)).toEqual(poly);
  });
});
