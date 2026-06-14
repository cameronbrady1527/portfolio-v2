/**
 * Pure rotation math for quarter-turns about an arbitrary center.
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 *
 * Rotations are counter-clockwise positive (standard math convention) and use
 * exact integer arithmetic for the quarter-turn formulas — no Math.sin/cos —
 * so there is no floating-point drift and four 90° turns are exactly the
 * identity.
 */
import type { Pt, Shape } from "./types";

/** Supported quarter-turn angles, in degrees, CCW positive. */
type QuarterTurn = 90 | 180 | 270 | -90;

/**
 * Rotate a single point about the origin by a quarter turn (CCW positive):
 *   90°  : (x, y) -> (-y,  x)
 *   180° : (x, y) -> (-x, -y)
 *   270° : (x, y) -> ( y, -x)
 *   -90° == 270°
 */
function rotatePtAboutOrigin(p: Pt, degrees: QuarterTurn): Pt {
  // Normalise -90 to its positive equivalent (270) for a single switch.
  const d = ((degrees % 360) + 360) % 360;
  switch (d) {
    case 90:
      return { x: -p.y, y: p.x };
    case 180:
      return { x: -p.x, y: -p.y };
    case 270:
      return { x: p.y, y: -p.x };
    default:
      // Unreachable for QuarterTurn inputs; keeps the switch total.
      return { x: p.x, y: p.y };
  }
}

/**
 * Rotate a point about an arbitrary center: translate to the origin, rotate,
 * translate back.
 */
function rotatePt(p: Pt, degrees: QuarterTurn, about: Pt): Pt {
  const local = rotatePtAboutOrigin(
    { x: p.x - about.x, y: p.y - about.y },
    degrees,
  );
  return { x: local.x + about.x, y: local.y + about.y };
}

/**
 * Rotate a shape about `about` by a quarter turn, CCW positive. Applies
 * vertex-wise to segments and polygons, preserving vertex order and any label.
 */
export function rotate(
  shape: Shape,
  degrees: 90 | 180 | 270 | -90,
  about: Pt,
): Shape {
  switch (shape.type) {
    case "point":
      return {
        type: "point",
        at: rotatePt(shape.at, degrees, about),
        label: shape.label,
      };
    case "segment":
      return {
        type: "segment",
        from: rotatePt(shape.from, degrees, about),
        to: rotatePt(shape.to, degrees, about),
        label: shape.label,
      };
    case "polygon":
      return {
        type: "polygon",
        vertices: shape.vertices.map((v) => rotatePt(v, degrees, about)),
        label: shape.label,
      };
  }
}
