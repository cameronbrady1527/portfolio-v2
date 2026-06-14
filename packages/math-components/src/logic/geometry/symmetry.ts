/**
 * Polygon symmetry — the pure verdicts behind the Symmetry Explorer
 * (GEO-G.CO.3, regular AND irregular polygons).
 *
 * A symmetry proposal is a rotation about the polygon's vertex centroid or a
 * reflection across a line through it (the centroid is the only candidate
 * fixed point: any vertex-permuting isometry fixes the vertex centroid).
 * Verdicts use the tolerance-aware multiset coincidence from coincide.ts —
 * vertex order and winding never matter, floating-point noise never lies.
 *
 * Completeness note: candidate reflection axes through a vertex or an edge
 * midpoint cover all reflection symmetries of simple polygons as used in the
 * hub's figures.
 *
 * Substrate-free; runs in the node vitest env.
 */
import type { Pt, Shape } from "./types";
import { pointsCoincide } from "./coincide";

export type PolygonShape = Extract<Shape, { type: "polygon" }>;

/** A proposed symmetry: rotation about the centroid, or an axis through it. */
export type SymmetryProposal =
  | { kind: "rotation"; angleDeg: number } // 0 < angle < 360, about the centroid
  | { kind: "reflection"; angleDeg: number }; // axis direction, mod 180

const DEG = Math.PI / 180;

/** The centroid (mean) of the polygon's vertices. */
export function vertexCentroid(polygon: PolygonShape): Pt {
  const n = polygon.vertices.length;
  let x = 0;
  let y = 0;
  for (const v of polygon.vertices) {
    x += v.x;
    y += v.y;
  }
  return { x: x / n, y: y / n };
}

/** Rotate a point by an arbitrary angle (degrees, CCW) about a center. */
export function rotatePtBy(p: Pt, angleDeg: number, about: Pt): Pt {
  const a = angleDeg * DEG;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = p.x - about.x;
  const dy = p.y - about.y;
  return {
    x: about.x + cos * dx - sin * dy,
    y: about.y + sin * dx + cos * dy,
  };
}

/** Reflect a point across the line through `through` at `angleDeg`. */
export function reflectPtAcross(p: Pt, through: Pt, angleDeg: number): Pt {
  const a = angleDeg * DEG;
  const cos = Math.cos(2 * a);
  const sin = Math.sin(2 * a);
  const dx = p.x - through.x;
  const dy = p.y - through.y;
  // Reflection matrix across a line at angle a: [cos2a sin2a; sin2a −cos2a].
  return {
    x: through.x + cos * dx + sin * dy,
    y: through.y + sin * dx - cos * dy,
  };
}

/** Apply a proposal to the polygon's vertices (about/through the centroid). */
export function applyProposal(
  polygon: PolygonShape,
  proposal: SymmetryProposal,
): Pt[] {
  const c = vertexCentroid(polygon);
  return polygon.vertices.map((v) =>
    proposal.kind === "rotation"
      ? rotatePtBy(v, proposal.angleDeg, c)
      : reflectPtAcross(v, c, proposal.angleDeg),
  );
}

/** Does the proposal carry the polygon exactly onto itself (within ε)? */
export function checkSymmetry(
  polygon: PolygonShape,
  proposal: SymmetryProposal,
  epsilon = 1e-6,
): boolean {
  return pointsCoincide(applyProposal(polygon, proposal), polygon.vertices, epsilon);
}

/**
 * Every non-identity symmetry of the polygon: rotation angles (degrees,
 * ascending, about the centroid) and reflection-axis angles (degrees mod 180,
 * ascending, through the centroid).
 *
 * Rotation candidates are the multiples of 360/n — any vertex-permuting
 * rotation partitions the n vertices into equal-size orbits, so its order
 * divides n. Reflection candidates are the axes through a vertex or an edge
 * midpoint.
 */
export function allSymmetries(
  polygon: PolygonShape,
  epsilon = 1e-6,
): { rotations: number[]; reflections: number[] } {
  const n = polygon.vertices.length;

  const rotations: number[] = [];
  for (let k = 1; k < n; k++) {
    const angleDeg = (360 * k) / n;
    if (checkSymmetry(polygon, { kind: "rotation", angleDeg }, epsilon)) {
      rotations.push(angleDeg);
    }
  }

  const c = vertexCentroid(polygon);
  const candidates: number[] = [];
  const addCandidate = (p: Pt) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    if (Math.hypot(dx, dy) <= epsilon) return; // the centroid spans no axis
    const a = (((Math.atan2(dy, dx) / DEG) % 180) + 180) % 180;
    if (
      !candidates.some(
        (b) => Math.abs(b - a) <= 1e-7 || Math.abs(Math.abs(b - a) - 180) <= 1e-7,
      )
    ) {
      candidates.push(a);
    }
  };
  for (const v of polygon.vertices) addCandidate(v);
  for (let i = 0; i < n; i++) {
    const a = polygon.vertices[i];
    const b = polygon.vertices[(i + 1) % n];
    addCandidate({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  }

  const reflections = candidates
    .filter((angleDeg) =>
      checkSymmetry(polygon, { kind: "reflection", angleDeg }, epsilon),
    )
    .sort((x, y) => x - y);

  return { rotations, reflections };
}
