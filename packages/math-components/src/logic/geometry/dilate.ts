/**
 * Pure dilation math.
 *
 * A dilation about a center C with scale factor k sends every point P to
 *   C + k · (P − C)
 * so the center is fixed and every distance from the center scales by |k|.
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 */
import type { Pt, Shape } from "./types";

export type DilateParams = { about: Pt; factor: number };

function dilatePt(p: Pt, about: Pt, k: number): Pt {
  return {
    x: about.x + k * (p.x - about.x),
    y: about.y + k * (p.y - about.y),
  };
}

/** Dilate a shape about a center by a scale factor, vertex-wise. */
export function dilate(shape: Shape, params: DilateParams): Shape {
  const { about, factor } = params;
  switch (shape.type) {
    case "point":
      return {
        type: "point",
        at: dilatePt(shape.at, about, factor),
        label: shape.label,
      };
    case "segment":
      return {
        type: "segment",
        from: dilatePt(shape.from, about, factor),
        to: dilatePt(shape.to, about, factor),
        label: shape.label,
      };
    case "polygon":
      return {
        type: "polygon",
        vertices: shape.vertices.map((v) => dilatePt(v, about, factor)),
        label: shape.label,
      };
  }
}
