import { describe, expect, it } from "vitest";
import {
  computeImage,
  initialParams,
  stepCaption,
} from "./grapherLogic";
import type { GrapherSpec } from "./GrapherTypes";

const spec: GrapherSpec = {
  preimage: { type: "point", at: { x: 1, y: 2 }, label: "P" },
  transform: [
    { kind: "translation", by: { dx: 2, dy: 0 } },
    { kind: "rotation", about: { x: 0, y: 0 }, angle: 90 },
  ],
};

describe("Grapher spec: sequence", () => {
  it("treats an array transform as a fixed sequence: no controls, final image computed", () => {
    expect(initialParams(spec.transform)).toEqual({});
    expect(computeImage(spec, {})).toMatchObject({ at: { x: -2, y: 3 } });
  });

  it("captions each step of the sequence, including the start state", () => {
    expect(stepCaption(spec, 0)).toBe(
      "A P point (1, 2) before any of the 2 steps.",
    );
    expect(stepCaption(spec, 1)).toBe(
      "Step 1 of 2: translated by the vector (2, 0).",
    );
    expect(stepCaption(spec, 2)).toBe(
      "Step 2 of 2: rotated 90° about (0, 0).",
    );
  });
});
