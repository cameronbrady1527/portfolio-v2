import { describe, expect, it } from "vitest";
import {
  autoCaption,
  computeImage,
  edgeMeasurements,
  initialParams,
} from "./grapherLogic";
import { slider, choose, type GrapherSpec } from "./GrapherTypes";

const square: GrapherSpec["preimage"] = {
  type: "polygon",
  vertices: [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    { x: 1, y: 2 },
  ],
  label: "ABCD",
};

describe("Grapher spec: dilation", () => {
  const spec: GrapherSpec = {
    preimage: square,
    transform: {
      kind: "dilation",
      about: { x: 0, y: 0 },
      factor: slider(2, 0.5, 4, { step: 0.5, label: "Scale factor" }),
    },
  };

  it("computes the dilated image from the live factor param", () => {
    const params = initialParams(spec.transform);
    expect(params["Scale factor"]).toBe(2);

    const image = computeImage(spec, { "Scale factor": 3 });
    expect(image).toEqual({
      type: "polygon",
      vertices: [
        { x: 3, y: 3 },
        { x: 6, y: 3 },
        { x: 6, y: 6 },
        { x: 3, y: 6 },
      ],
      label: "ABCD",
    });
  });

  it("captions the dilation with center and factor", () => {
    expect(autoCaption(spec, { "Scale factor": 2 })).toBe(
      "A quadrilateral ABCD dilated about (0, 0) by a scale factor of 2 → quadrilateral A′B′C′D′.",
    );
  });
});

describe("Grapher spec: stretch", () => {
  const spec: GrapherSpec = {
    preimage: square,
    transform: {
      kind: "stretch",
      axis: choose("x", ["x", "y"], "Stretch direction"),
      factor: slider(2, 1, 4, { label: "Stretch factor" }),
    },
  };

  it("computes the stretched image and captions the non-rigid move", () => {
    const image = computeImage(spec, {
      "Stretch direction": "x",
      "Stretch factor": 3,
    });
    expect(image).toMatchObject({
      vertices: [
        { x: 3, y: 1 },
        { x: 6, y: 1 },
        { x: 6, y: 2 },
        { x: 3, y: 2 },
      ],
    });
    expect(
      autoCaption(spec, { "Stretch direction": "x", "Stretch factor": 3 }),
    ).toBe(
      "A quadrilateral ABCD stretched horizontally by a factor of 3 → quadrilateral A′B′C′D′.",
    );
  });
});

describe("edgeMeasurements", () => {
  it("labels each edge with its length at the edge midpoint", () => {
    const m = edgeMeasurements({
      type: "polygon",
      vertices: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 3, y: 4 },
      ],
    });
    // Closed loop: 3 edges of a 3-4-5 right triangle.
    expect(m).toEqual([
      { at: { x: 1.5, y: 0 }, length: 3, text: "3" },
      { at: { x: 3, y: 2 }, length: 4, text: "4" },
      { at: { x: 1.5, y: 2 }, length: 5, text: "5" },
    ]);

    // Non-integer lengths round to 2 decimals.
    const seg = edgeMeasurements({
      type: "segment",
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 },
    });
    expect(seg).toEqual([{ at: { x: 0.5, y: 0.5 }, length: Math.SQRT2, text: "1.41" }]);

    // Points have no edges.
    expect(edgeMeasurements({ type: "point", at: { x: 1, y: 1 } })).toEqual([]);
  });
});
