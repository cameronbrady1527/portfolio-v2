/**
 * Pure triangle geometry — the machine-checked substrate behind the Triangle
 * Lab (GEO triangle reasoning: angle sum, and later congruence/similarity/trig).
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 *
 * Angles are in degrees throughout. A triangle is three vertices `Pt[]` in
 * order [A, B, C]. The SAS constructor places the figure canonically so the
 * two given sides and their included angle are exactly recoverable; the angle
 * reader uses vector dot products (no eyeballing, tolerance-aware by nature of
 * the math). This module is the keystone C5 (congruence), C9 (similarity), and
 * C10 (trig) will build on, so its surface is kept small and deep.
 */
import type { Pt } from "./types";
import { rotate } from "./rotate";

const DEG = Math.PI / 180;

/**
 * Construct a triangle [A, B, C] from two sides and their included angle (SAS).
 *
 * - `sideB` is |AB| — the side from A to B, laid along the +x axis.
 * - `sideC` is |AC| — the side from A to C.
 * - `includedAngleDeg` is the angle ∠BAC between them; valid for 0 < θ < 180,
 *   for which the triangle is always non-degenerate.
 *
 * Canonical placement: A at the origin, B at (sideB, 0), and C swept counter-
 * clockwise from the +x axis by the included angle at radius sideC. This makes
 * |AB|, |AC|, and ∠A exactly the inputs.
 */
export function triangleFromSAS(
  sideB: number,
  sideC: number,
  includedAngleDeg: number,
): Pt[] {
  const a = includedAngleDeg * DEG;
  return [
    { x: 0, y: 0 },
    { x: sideB, y: 0 },
    { x: sideC * Math.cos(a), y: sideC * Math.sin(a) },
  ];
}

/** The interior angle (degrees) at the corner `at`, between rays to `p` and `q`. */
function angleAt(at: Pt, p: Pt, q: Pt): number {
  const ux = p.x - at.x;
  const uy = p.y - at.y;
  const vx = q.x - at.x;
  const vy = q.y - at.y;
  const lu = Math.hypot(ux, uy);
  const lv = Math.hypot(vx, vy);
  // Clamp against floating-point overshoot so acos never returns NaN.
  const cos = Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (lu * lv)));
  return Math.acos(cos) / DEG;
}

/**
 * The three interior angles (degrees) of a triangle, positionally: the angle at
 * vertex A (`vertices[0]`), then B, then C. Computed from vector dot products at
 * each corner — never eyeballed — so a non-degenerate triangle's angles always
 * sum to 180° within floating-point tolerance.
 */
export function triangleAngles(vertices: Pt[]): [number, number, number] {
  const [a, b, c] = vertices;
  return [angleAt(a, b, c), angleAt(b, a, c), angleAt(c, a, b)];
}

/**
 * Round three angles to integers that still sum EXACTLY to their rounded total
 * (180° for a valid triangle), via largest-remainder apportionment. Naively
 * rounding each angle independently lets the displayed sum read 179° or 181°
 * ~25% of the time — which would make an angle-sum invariance readout lie. This
 * gives the nearest-integer display for each part while preserving the invariant
 * the lens exists to show. Each result stays within 1° of its exact value.
 */
/** Midpoint of segment PQ. */
function midpoint(p: Pt, q: Pt): Pt {
  return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
}

/** 180° half-turn of a point about a center, via the shipped (tested) rotate(). */
function halfTurn(p: Pt, about: Pt): Pt {
  const out = rotate({ type: "point", at: p }, 180, about);
  // rotate() preserves the shape kind; a point rotates to a point.
  return (out as { type: "point"; at: Pt }).at;
}

/** The construction behind the transformational angle-sum proof. */
export interface AngleSumAssembly {
  /** The apex C — where the three angles are brought together. */
  apex: Pt;
  /** Rotation center for the A-corner: the midpoint of side CA. */
  midCA: Pt;
  /** Rotation center for the B-corner: the midpoint of side CB. */
  midCB: Pt;
  /** B half-turned about midCA — one end of the straight angle at the apex. */
  imageOfB: Pt;
  /** A half-turned about midCB — the other end of the straight angle. */
  imageOfA: Pt;
}

/**
 * The rigid-motion construction for the angle-sum proof (∠A + ∠B + ∠C = 180°).
 *
 * A 180° rotation about the midpoint of CA carries the whole triangle to a copy
 * that swaps A and C, landing ∠A at the apex C as the alternate-interior angle
 * (the half-turn sends line AB to a parallel line through C). A 180° rotation
 * about the midpoint of CB does the same for ∠B. The two images of A and B land
 * on a single line through C parallel to AB, with C strictly between them — so
 * ∠A, ∠C, ∠B tile that straight angle and sum to 180°. The half-turns reuse the
 * shipped, exact `rotate()`, so the construction is machine-checked, not
 * eyeballed. Inputs are [A, B, C]; the apex is C.
 */
export function angleSumAssembly(vertices: Pt[]): AngleSumAssembly {
  const [A, B, C] = vertices;
  const midCA = midpoint(C, A);
  const midCB = midpoint(C, B);
  return {
    apex: C,
    midCA,
    midCB,
    imageOfB: halfTurn(B, midCA),
    imageOfA: halfTurn(A, midCB),
  };
}

/** The three sides of triangle [A, B, C], named by their endpoints. */
export type TriangleSide = "AB" | "BC" | "CA";

/** A triangle's midsegment for a chosen side — the keystone of the midsegment lens. */
export interface Midsegment {
  /** One endpoint: the midpoint of an adjacent side. */
  start: Pt;
  /** The other endpoint: the midpoint of the other adjacent side. */
  end: Pt;
  /** The side this midsegment is parallel to (the one it does NOT touch). */
  parallelTo: TriangleSide;
  /** Always true — the midsegment is, by construction, parallel to that side. */
  isParallel: true;
  /** Its length, which is exactly half the length of `parallelTo`. */
  length: number;
}

/**
 * The midsegment parallel to the named `side` of triangle [A, B, C]: the segment
 * joining the midpoints of the OTHER two sides. By the Midsegment (Midline)
 * Theorem it is exactly parallel to `side` and exactly half its length — both
 * fall straight out of the midpoint construction (the two adjacent half-sides
 * scale the third by ½ about the shared vertex), so this is exact, not
 * eyeballed. The substrate behind the Triangle Lab's midsegment lens.
 */
export function midsegment(vertices: Pt[], side: TriangleSide): Midsegment {
  const [A, B, C] = vertices;
  // Endpoints of the chosen side, and the apex opposite it (the shared vertex of
  // the two sides whose midpoints we join).
  const [p, q, apex] =
    side === "AB" ? [A, B, C] : side === "BC" ? [B, C, A] : [C, A, B];
  const start = midpoint(apex, p);
  const end = midpoint(apex, q);
  return {
    start,
    end,
    parallelTo: side,
    isParallel: true,
    length: Math.hypot(end.x - start.x, end.y - start.y),
  };
}

/** A triangle built from three side lengths (SSS), with a validity verdict. */
export interface SSSTriangle {
  /** [A, B, C]; A at the origin, B at (sideAB, 0), C swept above. Degenerate
   *  triples collapse C onto the x-axis (y = 0) so the figure shows it fail to close. */
  vertices: Pt[];
  /** True iff the three sides satisfy the STRICT triangle inequality. */
  valid: boolean;
}

/**
 * Construct a triangle from its three side lengths (SSS), and report whether the
 * sides can actually close into a triangle. `valid` encodes the triangle
 * inequality (each side strictly less than the sum of the other two) — the whole
 * point of the Triangle Inequality tool is to watch the figure FAIL to close
 * when it doesn't hold, so a degenerate or impossible triple returns
 * `valid: false` (with C placed on the base, y = 0, for the flat/open figure).
 *
 * Placement: A at the origin, B at (sideAB, 0), and C is the upper intersection
 * of the circles |CA| = sideCA and |CB| = sideBC. For a valid triple the three
 * side lengths are then exactly the inputs.
 */
export function triangleFromSSS(
  sideAB: number,
  sideBC: number,
  sideCA: number,
): SSSTriangle {
  const valid =
    sideAB + sideBC > sideCA &&
    sideBC + sideCA > sideAB &&
    sideCA + sideAB > sideBC;
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: sideAB, y: 0 };
  // x from |CA|² − |CB|² along the base; y from |CA|² − x² (clamped at 0).
  const x = sideAB === 0 ? 0 : (sideCA * sideCA - sideBC * sideBC + sideAB * sideAB) / (2 * sideAB);
  const y2 = sideCA * sideCA - x * x;
  const C: Pt = { x, y: y2 > 0 ? Math.sqrt(y2) : 0 };
  return { vertices: [A, B, C], valid };
}

export function roundAnglesToSum(
  angles: [number, number, number],
): [number, number, number] {
  const target = Math.round(angles[0] + angles[1] + angles[2]);
  const floors = angles.map((a) => Math.floor(a));
  let deficit = target - (floors[0] + floors[1] + floors[2]);
  // Hand the remaining whole degrees to the largest fractional remainders.
  const order = [0, 1, 2].sort(
    (i, j) => angles[j] - floors[j] - (angles[i] - floors[i]),
  );
  const out = [...floors] as [number, number, number];
  for (let k = 0; k < order.length && deficit > 0; k++) {
    out[order[k]] += 1;
    deficit -= 1;
  }
  return out;
}
