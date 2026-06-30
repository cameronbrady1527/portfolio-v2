/**
 * Triangle congruence — the pure core behind the C5 unit.
 *
 * Everything the congruence tools display (rigid vs. ambiguous vs. continuous;
 * congruent vs. not; which criterion) is read from here, never hardcoded in a
 * component. Pure and free of any rendering/client dependency so it stays
 * statically renderable and property-testable in a plain node environment.
 */
import type { Pt } from "./types";
import { triangleFromSAS, triangleFromSSS } from "./triangle";

/** A congruence shortcut, or one of the two famous non-criteria (SSA, AAA). */
export type Criterion = "SSS" | "SAS" | "ASA" | "AAS" | "HL" | "SSA" | "AAA";

/** The measured parts handed to a criterion. Only the fields a given criterion
 *  needs are populated. */
export interface Parts {
  /** SSS: [a, b, c]. */
  sides?: number[];
  /** AAA / ASA / AAS angle measures (degrees). */
  angles?: number[];
  /** SSA: the given angle at A (degrees). */
  angle?: number;
  /** SSA: the side adjacent to the given angle (AB). */
  adjacent?: number;
  /** SSA: the side opposite the given angle (BC) — the one that "swings". */
  opposite?: number;
  /** SAS: the angle (degrees) between the two given sides. */
  includedAngle?: number;
  /** ASA: the side (degrees) between the two given angles. */
  includedSide?: number;
  /** AAS: a side not between the two given angles. */
  side?: number;
  /** HL: the hypotenuse of the right triangle. */
  hypotenuse?: number;
  /** HL: a leg of the right triangle. */
  leg?: number;
}

const DEG = Math.PI / 180;

/** How much freedom a part-set leaves — the heart of the unit. */
export type Determinacy =
  | { kind: "unique" } // one triangle up to congruence → valid criterion
  | { kind: "ambiguous" } // exactly two (the SSA case)
  | { kind: "impossible" } // zero (parts can't close)
  | { kind: "continuous" }; // a scale family (AAA — similar, not congruent)

/** How many incongruent triangles are consistent with the given parts. */
export function solutionCount(criterion: Criterion, parts: Parts): Determinacy {
  // Three angles fix the shape but anchor no length — an unbounded scale family.
  if (criterion === "AAA") return { kind: "continuous" };
  // Every other criterion's verdict is just how many triangles it constructs:
  // 0 → impossible, 1 → unique (rigid → valid), 2 → ambiguous (the SSA case).
  const n = solveTriangles(criterion, parts).length;
  if (n === 0) return { kind: "impossible" };
  if (n === 2) return { kind: "ambiguous" };
  return { kind: "unique" };
}

/**
 * The concrete triangle(s) a discrete part-set produces — 0, 1, or 2 — as
 * `[A, B, C]` vertex lists. For SSA this is the whole story: as the opposite
 * ("swinging") side grows the count walks 0 → 1 → 2, the lone "1" landing
 * exactly at the right-angle boundary (which is why HL always locks).
 */
export function solveTriangles(criterion: Criterion, parts: Parts): Pt[][] {
  if (criterion === "SSS") {
    const [a, b, c] = parts.sides ?? [];
    const t = triangleFromSSS(a, b, c);
    return t.valid ? [t.vertices] : [];
  }
  if (criterion === "SAS") {
    const [b, c] = parts.sides ?? [];
    const ang = parts.includedAngle ?? 0;
    if (!(b > 0 && c > 0 && ang > 0 && ang < 180)) return [];
    return [triangleFromSAS(b, c, ang)];
  }
  if (criterion === "HL") {
    const h = parts.hypotenuse ?? 0;
    const l = parts.leg ?? 0;
    if (!(l > 0 && l < h)) return [];
    const other = Math.sqrt(h * h - l * l);
    // Right angle at C (origin); legs along the axes, hypotenuse AB.
    return [[{ x: l, y: 0 }, { x: 0, y: other }, { x: 0, y: 0 }]];
  }
  if (criterion === "ASA" || criterion === "AAS") {
    const [a, b] = parts.angles ?? [];
    if (!(a > 0 && b > 0 && a + b < 180)) return [];
    // Reduce both to "two angles around side AB". For AAS the given side is
    // opposite angle A (BC), so AB follows from the law of sines.
    let s: number;
    if (criterion === "ASA") {
      s = parts.includedSide ?? 0;
    } else {
      const bc = parts.side ?? 0;
      const c = 180 - a - b;
      s = (bc * Math.sin(c * DEG)) / Math.sin(a * DEG);
    }
    if (!(s > 0)) return [];
    const A: Pt = { x: 0, y: 0 };
    const B: Pt = { x: s, y: 0 };
    const t = (s * Math.sin(b * DEG)) / Math.sin((a + b) * DEG); // |AC|
    const C: Pt = { x: t * Math.cos(a * DEG), y: t * Math.sin(a * DEG) };
    return [[A, B, C]];
  }
  if (criterion === "SSA") {
    const { angle = 0, adjacent = 0, opposite = 0 } = parts;
    const A: Pt = { x: 0, y: 0 };
    // AC runs along the +x axis; AB opens at `angle` above it.
    const B: Pt = {
      x: adjacent * Math.cos(angle * DEG),
      y: adjacent * Math.sin(angle * DEG),
    };
    const altitude = adjacent * Math.sin(angle * DEG); // B's height over the base
    const disc = opposite * opposite - altitude * altitude;
    if (disc < -1e-12) return []; // swinging side can't reach the base
    const root = Math.sqrt(Math.max(0, disc));
    // C is where a circle of radius `opposite` about B meets the +x ray.
    const xs = root < 1e-9 ? [B.x] : [B.x + root, B.x - root];
    return xs
      .filter((x) => x > 1e-9)
      .map((x) => [A, B, { x, y: 0 }] as Pt[]);
  }
  return [];
}

/** The outcome of comparing two triangles for congruence. */
export interface CongruenceResult {
  /** Are the two triangles congruent? */
  congruent: boolean;
  /** Vertex map t1[k] ↔ t2[correspondence[k]], or null if not congruent. */
  correspondence: [number, number, number] | null;
  /** The criterion that certifies congruence from full coordinates, or null. */
  criterion: Exclude<Criterion, "SSA" | "AAA"> | null;
}

/** The six ways to line t2's vertices up against t1's. */
const PERMS: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

const len = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);

/**
 * Are two triangles congruent, and under which vertex correspondence? Tries all
 * six pairings and accepts the first whose three edge lengths match (SSS — the
 * certificate available from full coordinates). A general-purpose helper: the
 * tools read both the verdict and the correspondence from here.
 */
export function congruenceCheck(t1: Pt[], t2: Pt[], tol = 1e-6): CongruenceResult {
  const e1 = [len(t1[0], t1[1]), len(t1[1], t1[2]), len(t1[2], t1[0])];
  for (const σ of PERMS) {
    const e2 = [
      len(t2[σ[0]], t2[σ[1]]),
      len(t2[σ[1]], t2[σ[2]]),
      len(t2[σ[2]], t2[σ[0]]),
    ];
    if (e1.every((l, i) => Math.abs(l - e2[i]) <= tol * Math.max(1, l))) {
      return { congruent: true, correspondence: σ, criterion: "SSS" };
    }
  }
  return { congruent: false, correspondence: null, criterion: null };
}
