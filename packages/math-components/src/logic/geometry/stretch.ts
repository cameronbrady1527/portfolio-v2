/**
 * Pure one-axis stretch math — the canonical NON-rigid transform used to
 * contrast with translations/reflections/rotations (GEO-G.CO.2).
 *
 * A stretch along an axis scales that coordinate by k and leaves the other
 * unchanged:
 *   axis "x": (x, y) ↦ (k·x, y)   — points on the y-axis are fixed
 *   axis "y": (x, y) ↦ (x, k·y)   — points on the x-axis are fixed
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 */
import type { Pt, Shape } from "./types";

export type StretchParams = { axis: "x" | "y"; factor: number };

function stretchPt(p: Pt, { axis, factor }: StretchParams): Pt {
  return axis === "x"
    ? { x: factor * p.x, y: p.y }
    : { x: p.x, y: factor * p.y };
}

/** Stretch a shape along one axis by a factor, vertex-wise. */
export function stretch(shape: Shape, params: StretchParams): Shape {
  switch (shape.type) {
    case "point":
      return { type: "point", at: stretchPt(shape.at, params), label: shape.label };
    case "segment":
      return {
        type: "segment",
        from: stretchPt(shape.from, params),
        to: stretchPt(shape.to, params),
        label: shape.label,
      };
    case "polygon":
      return {
        type: "polygon",
        vertices: shape.vertices.map((v) => stretchPt(v, params)),
        label: shape.label,
      };
  }
}
