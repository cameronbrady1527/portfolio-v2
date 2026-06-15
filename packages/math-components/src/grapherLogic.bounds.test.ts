import { describe, expect, it } from "vitest";
import { stableBounds } from "./grapherLogic";
import { slider, type GrapherSpec } from "./GrapherTypes";

describe("stableBounds — a fixed viewport that holds still under control changes", () => {
  it("captures a rotation's full swept arc, not just the slider endpoints", () => {
    // A point 3 units from the origin, rotated through a full turn. Angle 0° and
    // 360° both land back at (3, 0), so endpoint-only fitting would miss the
    // circle entirely. Sampling across the range must capture the whole disc.
    const spec: GrapherSpec = {
      preimage: { type: "point", at: { x: 3, y: 0 } },
      transform: {
        kind: "rotation",
        about: { x: 0, y: 0 },
        angle: slider(0, 0, 360, { label: "Angle" }),
      },
    };
    // Samples hit 0/90/180/270/360 → (±3, 0) and (0, ±3); box is the radius-3
    // disc, padded by 1.
    expect(stableBounds(spec)).toEqual({ x: [-4, 4], y: [-4, 4] });
  });

  it("holds the frame wide enough for a translation's extreme positions", () => {
    const square: GrapherSpec["preimage"] = {
      type: "polygon",
      vertices: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
    };
    const spec: GrapherSpec = {
      preimage: square,
      transform: {
        kind: "translation",
        by: {
          dx: slider(3, -8, 8, { label: "Shift x" }),
          dy: slider(-2, -8, 8, { label: "Shift y" }),
        },
      },
    };
    // dx/dy reach ±8: maxX = 2 + 8 = 10, minX = 1 − 8 = −7; padded + origin.
    expect(stableBounds(spec)).toEqual({ x: [-8, 11], y: [-8, 11] });
  });

  it("honors an explicit bounds override verbatim", () => {
    const spec: GrapherSpec = {
      preimage: { type: "point", at: { x: 0, y: 0 } },
      transform: {
        kind: "dilation",
        about: { x: 0, y: 0 },
        factor: slider(2, 0.5, 4, { label: "Scale" }),
      },
      bounds: { x: [-2, 2], y: [-3, 3] },
    };
    expect(stableBounds(spec)).toEqual({ x: [-2, 2], y: [-3, 3] });
  });
});
