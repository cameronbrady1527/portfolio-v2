/**
 * Tolerance-aware coincidence of shapes — the pure judge behind the
 * SequenceBuilder puzzle and the Symmetry Explorer verdicts.
 *
 * Two shapes coincide when their defining points match as MULTISETS within ε:
 * vertex order and winding are ignored, but every point must be claimed by
 * exactly one partner (greedy one-to-one matching), so collapsed/duplicated
 * vertices can't fake a match.
 *
 * Note: multiset equality of vertices is what "lands on it" means for the
 * convex figures used in puzzles; self-intersecting re-orderings are not
 * distinguished. Substrate-free; runs in the node vitest env.
 */
import type { Pt, Shape } from "./types";

function ptsClose(a: Pt, b: Pt, epsilon: number): boolean {
  return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
}

/** One-to-one multiset match of two point lists within ε. */
export function pointsCoincide(a: Pt[], b: Pt[], epsilon: number): boolean {
  if (a.length !== b.length) return false;
  const unclaimed = [...b];
  for (const p of a) {
    const i = unclaimed.findIndex((q) => ptsClose(p, q, epsilon));
    if (i === -1) return false;
    unclaimed.splice(i, 1);
  }
  return true;
}

function shapePoints(shape: Shape): Pt[] {
  switch (shape.type) {
    case "point":
      return [shape.at];
    case "segment":
      return [shape.from, shape.to];
    case "polygon":
      return shape.vertices;
  }
}

/** Do two shapes of the same type occupy the same spot, within ε? */
export function shapesCoincide(a: Shape, b: Shape, epsilon = 1e-6): boolean {
  if (a.type !== b.type) return false;
  return pointsCoincide(shapePoints(a), shapePoints(b), epsilon);
}
