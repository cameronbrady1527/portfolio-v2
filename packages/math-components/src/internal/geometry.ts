/**
 * Presentational geometry helpers shared by the interactive figures (angle &
 * triangle tools). These work in mafs plane coordinates and are about DRAWING —
 * distinct from the substrate-free, machine-checked math in `../logic`, which
 * the UI reads its quantities from. Keep these pure and dependency-free so every
 * component arcs, wedges, and rotates the same way.
 */
import type { Pt } from "../logic";

export const D = Math.PI / 180;

/** Ease-out so an animated motion decelerates gently into its landing. */
export const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Sample an arc (radius r) from angle a0 to a1 (degrees) about c. */
export function arcPoints(
  c: Pt,
  a0: number,
  a1: number,
  r: number,
  n = 24,
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D;
    pts.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
  }
  return pts;
}

/** A filled wedge: the center, then the bounding arc. */
export function wedge(c: Pt, a0: number, a1: number, r: number): [number, number][] {
  return [[c.x, c.y], ...arcPoints(c, a0, a1, r)];
}

/** Label position out along a wedge's bisector. */
export function arcLabel(c: Pt, a0: number, a1: number, r: number): [number, number] {
  const mid = ((a0 + a1) / 2) * D;
  return [c.x + r * Math.cos(mid), c.y + r * Math.sin(mid)];
}

/** Rotate a [x, y] point `deg` degrees about center c. */
export function rotPt([x, y]: [number, number], deg: number, c: Pt): [number, number] {
  const a = deg * D;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = x - c.x;
  const dy = y - c.y;
  return [c.x + cos * dx - sin * dy, c.y + sin * dx + cos * dy];
}

/** A coarse compass word for a direction (degrees) — for angle aria-labels. */
export function dirWord(deg: number): string {
  const a = ((deg % 360) + 360) % 360;
  const words = [
    "right",
    "upper-right",
    "top",
    "upper-left",
    "left",
    "lower-left",
    "bottom",
    "lower-right",
  ];
  return words[Math.round(a / 45) % 8];
}

/** Intersection of the line through p1 at dir1 with the line through p2 at dir2
 *  (degrees). Rendering only — never affects the math. Near-parallel ⇒ p1. */
export function lineIntersect(p1: Pt, dir1: number, p2: Pt, dir2: number): Pt {
  const u = { x: Math.cos(dir1 * D), y: Math.sin(dir1 * D) };
  const v = { x: Math.cos(dir2 * D), y: Math.sin(dir2 * D) };
  const det = u.x * -v.y - u.y * -v.x;
  if (Math.abs(det) < 1e-9) return p1;
  const rx = p2.x - p1.x;
  const ry = p2.y - p1.y;
  const s = (rx * -v.y - ry * -v.x) / det;
  return { x: p1.x + s * u.x, y: p1.y + s * u.y };
}

/** The adaptive arc radius at a triangle corner: a fraction of the shorter
 *  adjacent edge, capped, so the arc always sits inside even a small/thin one. */
export function vertexArcRadius(v: Pt, p: Pt, q: Pt): number {
  const lp = Math.hypot(p.x - v.x, p.y - v.y);
  const lq = Math.hypot(q.x - v.x, q.y - v.y);
  return Math.min(0.7, 0.32 * Math.min(lp, lq));
}

/**
 * The interior angle arc at vertex `v` whose adjacent vertices are `p` and `q`:
 * the polyline tracing the arc, a fillable wedge closed to the vertex, and the
 * bisector point to drop the measure on. Sweeps the MINOR angle between the two
 * edges — which, since every interior angle of a triangle is < 180°, is exactly
 * the interior.
 */
export function vertexArc(
  v: Pt,
  p: Pt,
  q: Pt,
  rOverride?: number,
): { arc: [number, number][]; wedge: [number, number][]; label: [number, number] } {
  const angP = Math.atan2(p.y - v.y, p.x - v.x) / D;
  const angQ = Math.atan2(q.y - v.y, q.x - v.x) / D;
  // Signed sweep normalized to (-180, 180]; |delta| is the interior angle.
  const delta = ((angQ - angP + 540) % 360) - 180;
  const r = rOverride ?? vertexArcRadius(v, p, q);
  const arc = arcPoints(v, angP, angP + delta, r);
  const mid = (angP + delta / 2) * D;
  const labelR = r + 0.5;
  return {
    arc,
    wedge: [[v.x, v.y], ...arc],
    label: [v.x + labelR * Math.cos(mid), v.y + labelR * Math.sin(mid)],
  };
}

/**
 * Congruence (hatch) marks: how many tick marks each side carries so that sides
 * of equal length read as congruent. Group the `sides` lengths into classes —
 * two lengths are equal within `relTol` (relative), so an isosceles/equilateral
 * configuration reads cleanly even when one side is a computed (irrational)
 * length. Each class of two or more equal sides gets a tick count (1 for the
 * first such class, 2 for the next, …, the standard single/double/triple
 * convention); sides whose length is unique get 0. Returned in input order.
 */
export function congruenceTickCounts(sides: number[], relTol = 0.012): number[] {
  const cls = sides.map(() => -1);
  const classLen: number[] = [];
  sides.forEach((len, i) => {
    for (let c = 0; c < classLen.length; c++) {
      if (Math.abs(len - classLen[c]) <= relTol * Math.max(len, classLen[c])) {
        cls[i] = c;
        return;
      }
    }
    cls[i] = classLen.length;
    classLen.push(len);
  });
  const size = classLen.map(() => 0);
  cls.forEach((c) => (size[c] += 1));
  // Number only the classes with a congruent partner, in order of appearance.
  let next = 1;
  const tickOfClass = classLen.map((_, c) => (size[c] >= 2 ? next++ : 0));
  return cls.map((c) => tickOfClass[c]);
}

/**
 * `count` short congruence ticks centred on segment p→q's midpoint, each drawn
 * perpendicular to the side. Returns one [start, end] segment per tick (render
 * each as a Polyline). `len` is half a tick's length and `gap` the spacing
 * between adjacent ticks, both in plane units.
 */
export function sideTicks(
  p: Pt,
  q: Pt,
  count: number,
  len = 0.16,
  gap = 0.16,
): [number, number][][] {
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L; // unit along the side
  const uy = dy / L;
  const nx = -dy / L; // unit normal
  const ny = dx / L;
  const segs: [number, number][][] = [];
  for (let i = 0; i < count; i++) {
    const off = (i - (count - 1) / 2) * gap;
    const cx = mx + ux * off;
    const cy = my + uy * off;
    segs.push([
      [cx - nx * len, cy - ny * len],
      [cx + nx * len, cy + ny * len],
    ]);
  }
  return segs;
}
