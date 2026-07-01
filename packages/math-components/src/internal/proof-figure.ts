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
import { arcLabel, arcPoints, wedge } from "./geometry";

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
