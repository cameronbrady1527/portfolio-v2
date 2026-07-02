/**
 * Machine-drawn geometry for a {@link ProofFigure}. Pure and presentational —
 * it turns the spec's figure descriptor into the wedges, arcs, and line segments
 * a component renders, keyed so the builder can glow one angle region by its
 * number. Mirrors how the angle/triangle tools derive their figures from
 * `internal/geometry.ts`; the numbers a statement cites are the same numbers the
 * regions carry, so the figure and the proof text can never disagree.
 */
import type { Pt } from "../logic";
import type { ProofFigure } from "../logic";
import { triangleFromSSS } from "../logic";
import {
  angleArcs,
  arcLabel,
  arcPoints,
  rightAngleSquare,
  sideTicks,
  vertexArc,
  wedge,
} from "./geometry";

/** One of the four angle regions at the crossing. `label` is the angle number
 *  (the same "∠1" the statements name), so highlighting is a simple key match. */
export interface FigureRegion {
  label: string;
  /** Wedge bounds in degrees (a0 ≤ a1). */
  a0: number;
  a1: number;
  /** Bisector direction (degrees) — handy for aria copy. */
  mid: number;
  /** The filled wedge (centre + bounding arc). */
  wedge: [number, number][];
  /** A thin marking arc inside the region. */
  arc: [number, number][];
  /** Where to drop the region's number label. */
  labelPos: [number, number];
}

/** Everything a component needs to draw the intersecting-lines figure. */
export interface IntersectingLinesFigure {
  center: Pt;
  /** The two crossing lines, each a [start, end] segment. */
  lines: [[number, number], [number, number]][];
  regions: FigureRegion[];
  /** Half-width of the square viewBox. */
  view: number;
}

const ORIGIN: Pt = { x: 0, y: 0 };
const VIEW = 5;
const FILL_R = 1.45; // wedge fill radius
const ARC_R = 0.95; // marking-arc radius
const LABEL_R = 1.95; // number-label radius
const DEG = Math.PI / 180;

/**
 * Build the render data for a `kind:"intersecting-lines"` figure. The four rays
 * (the two lines and their opposites) bound four regions; consecutive regions
 * form linear pairs and opposite regions are the vertical pair, so assigning the
 * four `rayLabels` in angular order automatically makes ∠label[0] and ∠label[2]
 * vertical — no relationship is asserted, it falls out of the geometry.
 */
export function buildIntersectingLines(
  fig: Extract<ProofFigure, { kind: "intersecting-lines" }>,
): IntersectingLinesFigure {
  const { line1Deg, line2Deg, rayLabels } = fig;

  // Four rays in increasing angular order (line2 is 60–120° past line1, so this
  // array is already sorted and spans 180°, wrapping the last region round).
  const raw = [line1Deg, line2Deg, line1Deg + 180, line2Deg + 180];

  const regions: FigureRegion[] = raw.map((a0, k) => {
    const a1 = k < 3 ? raw[k + 1] : raw[0] + 360;
    return {
      label: rayLabels[k],
      a0,
      a1,
      mid: (a0 + a1) / 2,
      wedge: wedge(ORIGIN, a0, a1, FILL_R),
      arc: arcPoints(ORIGIN, a0, a1, ARC_R),
      labelPos: arcLabel(ORIGIN, a0, a1, LABEL_R),
    };
  });

  const L = VIEW * 2;
  const seg = (dir: number): [[number, number], [number, number]] => {
    const u = { x: Math.cos(dir * DEG), y: Math.sin(dir * DEG) };
    return [
      [ORIGIN.x - L * u.x, ORIGIN.y - L * u.y],
      [ORIGIN.x + L * u.x, ORIGIN.y + L * u.y],
    ];
  };

  return {
    center: ORIGIN,
    lines: [seg(line1Deg), seg(line2Deg)],
    regions,
    view: VIEW,
  };
}


// ─── points-on-line & rays-from-point figures ───────────────────────────────
// Added ADDITIVELY beside `buildIntersectingLines` for the addition-postulate
// families. `buildIntersectingLines` is untouched. The canonical keys below let
// a statement's cited part ("AB", "∠ABD") match a figure part regardless of
// letter order, so the two-column table and the figure coordinate-highlight.

/** Canonical key for the segment between two point labels — order-independent
 *  ("AB" and "BA" ⇒ "AB"), matching what `ProofBuilder` extracts from text. */
export function segmentKey(a: string, b: string): string {
  return a <= b ? `${a}${b}` : `${b}${a}`;
}

/** Canonical key for the angle at vertex `v` bounded by rays to `x` and `y` —
 *  the vertex stays in the middle, the outer labels are sorted ("∠ABD" and
 *  "∠DBA" ⇒ "ABD"). */
export function angleKey(x: string, v: string, y: string): string {
  return x <= y ? `${x}${v}${y}` : `${y}${v}${x}`;
}

const LINE_HALF = 3.2; // half the drawn line's width (plane units)
const POINT_VIEW = 4;
const LABEL_DROP = -0.62; // y for the point labels, just below the line

/** A labelled point on the collinear figure. */
export interface LinePoint {
  label: string;
  pt: [number, number];
  labelPt: [number, number];
}
/** Everything a component needs to draw the points-on-line figure. */
export interface PointsOnLineFigure {
  line: [[number, number], [number, number]];
  points: LinePoint[];
  /** Congruence ticks, grouped by the segment they mark (`key` for highlight). */
  ticks: { key: string; a: string; b: string; segs: [number, number][][] }[];
  /** Label → plane coordinate, so the builder can glow an arbitrary sub-segment. */
  coordOf: Record<string, [number, number]>;
  view: number;
}

/** Build the render data for a `kind:"points-on-line"` figure: collinear points
 *  laid out left→right by their fractional position, with congruence ticks. */
export function buildPointsOnLine(
  fig: Extract<ProofFigure, { kind: "points-on-line" }>,
): PointsOnLineFigure {
  const xOf = (at: number) => -LINE_HALF + at * 2 * LINE_HALF;
  const coordOf: Record<string, [number, number]> = {};
  const points: LinePoint[] = fig.points.map((p) => {
    const pt: [number, number] = [xOf(p.at), 0];
    coordOf[p.label] = pt;
    return { label: p.label, pt, labelPt: [pt[0], LABEL_DROP] };
  });
  const ticks = (fig.ticks ?? []).map((t) => {
    const a = coordOf[t.a];
    const b = coordOf[t.b];
    return {
      key: segmentKey(t.a, t.b),
      a: t.a,
      b: t.b,
      segs: sideTicks({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }, t.count, 0.22, 0.16),
    };
  });
  return {
    line: [
      [xOf(0) - 0.4, 0],
      [xOf(1) + 0.4, 0],
    ],
    points,
    ticks,
    coordOf,
    view: POINT_VIEW,
  };
}

const RAY_VERTEX: Pt = { x: 0, y: -1.5 };
const RAY_LEN = 3.5;
const RAY_LABEL_LEN = RAY_LEN + 0.5;
const RAY_VIEW = 4;
const ARC_R0 = 0.72;

/** A ray drawn from the shared vertex. */
export interface FigureRay {
  label: string;
  pt: [number, number];
  labelPt: [number, number];
  deg: number;
}
/** Everything a component needs to draw the rays-from-point figure. */
export interface RaysFromPointFigure {
  vertex: [number, number];
  vertexLabel: string;
  rays: FigureRay[];
  /** Congruence arcs, grouped by the angle they mark (`key` for highlight). */
  arcs: { key: string; polylines: [number, number][][] }[];
  /** Right-angle squares, grouped by the angle they mark. */
  rightAngles: { key: string; square: [number, number][] }[];
  /** Label → ray direction (degrees), so the builder can glow an angle wedge. */
  dirOf: Record<string, number>;
  view: number;
}

/** Build the render data for a `kind:"rays-from-point"` figure: rays fanning
 *  from a shared vertex, with congruence arcs and/or right-angle squares. */
export function buildRaysFromPoint(
  fig: Extract<ProofFigure, { kind: "rays-from-point" }>,
): RaysFromPointFigure {
  const dirOf: Record<string, number> = {};
  const ptOf: Record<string, Pt> = {};
  const rays: FigureRay[] = fig.rays.map((r) => {
    const a = r.deg * DEG;
    const pt: [number, number] = [RAY_VERTEX.x + RAY_LEN * Math.cos(a), RAY_VERTEX.y + RAY_LEN * Math.sin(a)];
    dirOf[r.label] = r.deg;
    ptOf[r.label] = { x: pt[0], y: pt[1] };
    return {
      label: r.label,
      pt,
      labelPt: [RAY_VERTEX.x + RAY_LABEL_LEN * Math.cos(a), RAY_VERTEX.y + RAY_LABEL_LEN * Math.sin(a)],
      deg: r.deg,
    };
  });
  const arcs = (fig.arcs ?? []).map((m) => ({
    key: angleKey(m.a, fig.vertex, m.b),
    polylines: angleArcs(RAY_VERTEX, ptOf[m.a], ptOf[m.b], m.count, ARC_R0, 0.16),
  }));
  const rightAngles = (fig.rightAngles ?? []).map((m) => ({
    key: angleKey(m.a, fig.vertex, m.b),
    square: rightAngleSquare(RAY_VERTEX, ptOf[m.a], ptOf[m.b], 0.5),
  }));
  return {
    vertex: [RAY_VERTEX.x, RAY_VERTEX.y],
    vertexLabel: fig.vertex,
    rays,
    arcs,
    rightAngles,
    dirOf,
    view: RAY_VIEW,
  };
}


// --- triangle-pair figure (congruence-cpctc) ---

/** A resolved congruent side: its two endpoints, the tick polylines, and the
 *  vertex letters it annotates (so the builder's caller can glow it by letter). */
export interface TriangleSideMark {
  tri: 0 | 1;
  letters: [string, string];
  seg: [Pt, Pt];
  ticks: [number, number][][];
}
/** A resolved congruent angle: its fillable wedge, the arc polylines, and its
 *  vertex letter. */
export interface TriangleAngleMark {
  tri: 0 | 1;
  letter: string;
  wedge: [number, number][];
  arcs: [number, number][][];
}
/** A resolved right-angle square at a vertex. */
export interface TriangleRightMark {
  tri: 0 | 1;
  letter: string;
  square: [number, number][];
}

/** One drawn triangle: its vertices (in [0,1,2] order) and their letters. */
export interface DrawnTriangle {
  verts: [Pt, Pt, Pt];
  labels: [string, string, string];
}

/** Everything a component needs to draw the triangle-pair figure. */
export interface TrianglePairFigure {
  triangles: [DrawnTriangle, DrawnTriangle];
  sideMarks: TriangleSideMark[];
  angleMarks: TriangleAngleMark[];
  rightMarks: TriangleRightMark[];
  bounds: { x: [number, number]; y: [number, number] };
}

const TRI_GAP = 1.4; // clearance between the two triangles' bounding boxes
const TRI_PAD = 1.3; // viewBox padding around everything

/**
 * Build the render data for a `kind:"triangle-pair"` figure. Both triangles are
 * the SAME congruent shape (built once from `sides` via {@link triangleFromSSS}),
 * centred and set side by side in the SAME orientation so the positional
 * correspondence i ↔ i reads directly. Every mark is resolved against the shape
 * with the shared marking primitives (`sideTicks`, `angleArcs`,
 * `rightAngleSquare`), and each resolved mark keeps the vertex letters it sits on
 * so the builder can coordinate figure ↔ table highlighting by letter.
 */
export function buildTrianglePair(
  fig: Extract<ProofFigure, { kind: "triangle-pair" }>,
): TrianglePairFigure {
  const { labels, sides, marks } = fig;
  const raw = triangleFromSSS(sides[0], sides[1], sides[2]).vertices as [Pt, Pt, Pt];
  const cx = (raw[0].x + raw[1].x + raw[2].x) / 3;
  const cy = (raw[0].y + raw[1].y + raw[2].y) / 3;
  const centred = raw.map((p) => ({ x: p.x - cx, y: p.y - cy })) as [Pt, Pt, Pt];
  const xs = centred.map((p) => p.x);
  const shift = (Math.max(...xs) - Math.min(...xs)) / 2 + TRI_GAP;
  const place = (dx: number): [Pt, Pt, Pt] =>
    centred.map((p) => ({ x: p.x + dx, y: p.y })) as [Pt, Pt, Pt];

  const verts: [[Pt, Pt, Pt], [Pt, Pt, Pt]] = [place(-shift), place(+shift)];
  const triangles: [DrawnTriangle, DrawnTriangle] = [
    { verts: verts[0], labels: labels[0] },
    { verts: verts[1], labels: labels[1] },
  ];

  const idxOf = (tri: 0 | 1, letter: string) => labels[tri].indexOf(letter);
  const others = (i: number): [number, number] =>
    [0, 1, 2].filter((k) => k !== i) as [number, number];

  const sideMarks: TriangleSideMark[] = [];
  const angleMarks: TriangleAngleMark[] = [];
  const rightMarks: TriangleRightMark[] = [];

  for (const m of marks) {
    const V = verts[m.tri];
    if (m.kind === "side") {
      const a = idxOf(m.tri, m.at[0]);
      const b = idxOf(m.tri, m.at[1]);
      sideMarks.push({
        tri: m.tri,
        letters: [m.at[0], m.at[1]],
        seg: [V[a], V[b]],
        ticks: sideTicks(V[a], V[b], m.count),
      });
    } else if (m.kind === "angle") {
      const i = idxOf(m.tri, m.at);
      const [p, q] = others(i);
      angleMarks.push({
        tri: m.tri,
        letter: m.at,
        wedge: vertexArc(V[i], V[p], V[q]).wedge,
        arcs: angleArcs(V[i], V[p], V[q], m.count),
      });
    } else {
      const i = idxOf(m.tri, m.at);
      const [p, q] = others(i);
      rightMarks.push({
        tri: m.tri,
        letter: m.at,
        square: rightAngleSquare(V[i], V[p], V[q]),
      });
    }
  }

  const allX = [...verts[0], ...verts[1]].map((p) => p.x);
  const allY = [...verts[0], ...verts[1]].map((p) => p.y);
  const bounds = {
    x: [Math.min(...allX) - TRI_PAD, Math.max(...allX) + TRI_PAD] as [number, number],
    y: [Math.min(...allY) - TRI_PAD, Math.max(...allY) + TRI_PAD] as [number, number],
  };

  return { triangles, sideMarks, angleMarks, rightMarks, bounds };
}
