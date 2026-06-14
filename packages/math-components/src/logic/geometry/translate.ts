/**
 * Pure translation math.
 *
 * A translation slides every point of a figure by the same vector (dx, dy):
 *   (x, y) ↦ (x + dx, y + dy)
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 *
 * NOTE: this is NOT yet wired into the Grapher's `applyTransform` dispatcher
 * (that integration belongs to the lead). This module only exports the pure
 * function + its tests.
 */
import type { Pt, Shape } from "./types";

/** Slide a single point by (dx, dy). */
function translatePt(p: Pt, dx: number, dy: number): Pt {
  return { x: p.x + dx, y: p.y + dy };
}

/**
 * Translate a shape by the vector (dx, dy). Applies vertex-wise to segments
 * and polygons, preserving vertex order and any label.
 */
export function translate(shape: Shape, dx: number, dy: number): Shape {
  switch (shape.type) {
    case "point":
      return {
        type: "point",
        at: translatePt(shape.at, dx, dy),
        label: shape.label,
      };
    case "segment":
      return {
        type: "segment",
        from: translatePt(shape.from, dx, dy),
        to: translatePt(shape.to, dx, dy),
        label: shape.label,
      };
    case "polygon":
      return {
        type: "polygon",
        vertices: shape.vertices.map((v) => translatePt(v, dx, dy)),
        label: shape.label,
      };
  }
}
