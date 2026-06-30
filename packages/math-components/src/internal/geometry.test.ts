import { describe, expect, it } from "vitest";
import { angleArcs, congruenceTickCounts, rightAngleSquare, sideTicks } from "./geometry";

const dist = (a: [number, number], b: [number, number]) =>
  Math.hypot(b[0] - a[0], b[1] - a[1]);

describe("congruenceTickCounts (hatch marks for equal sides)", () => {
  it("marks nothing on a scalene triangle", () => {
    expect(congruenceTickCounts([5, 6, 7])).toEqual([0, 0, 0]);
  });

  it("single-ticks the two equal sides of an isosceles triangle, in place", () => {
    expect(congruenceTickCounts([6, 6, 9])).toEqual([1, 1, 0]);
    expect(congruenceTickCounts([9, 6, 6])).toEqual([0, 1, 1]);
    expect(congruenceTickCounts([6, 9, 6])).toEqual([1, 0, 1]);
  });

  it("single-ticks all three sides of an equilateral triangle", () => {
    expect(congruenceTickCounts([6, 6, 6])).toEqual([1, 1, 1]);
  });

  it("treats near-equal lengths as congruent within tolerance", () => {
    // 6.05 vs 6 is ~0.8% — inside the default ~1.2% tolerance.
    expect(congruenceTickCounts([6, 6.05, 9])).toEqual([1, 1, 0]);
  });

  it("does not mark lengths that differ beyond the tolerance", () => {
    // 6.3 vs 6 is 5% — clearly distinct.
    expect(congruenceTickCounts([6, 6.3, 9])).toEqual([0, 0, 0]);
  });

  it("uses distinct tick counts for two separate congruence classes", () => {
    // Four sides (e.g. a quadrilateral): two pairs → single then double ticks.
    expect(congruenceTickCounts([5, 5, 8, 8])).toEqual([1, 1, 2, 2]);
  });
});

describe("sideTicks (perpendicular marks at a side's midpoint)", () => {
  it("draws one tick at the midpoint, perpendicular to the side", () => {
    const segs = sideTicks({ x: 0, y: 0 }, { x: 4, y: 0 }, 1, 0.2);
    expect(segs).toHaveLength(1);
    const [[x0, y0], [x1, y1]] = segs[0];
    // Centred on the midpoint (2,0); the stroke runs vertically (normal to +x).
    expect((x0 + x1) / 2).toBeCloseTo(2);
    expect((y0 + y1) / 2).toBeCloseTo(0);
    expect(x0).toBeCloseTo(2);
    expect(x1).toBeCloseTo(2);
    expect(y0).toBeCloseTo(-0.2);
    expect(y1).toBeCloseTo(0.2);
  });

  it("draws `count` parallel ticks spaced along the side", () => {
    const segs = sideTicks({ x: 0, y: 0 }, { x: 4, y: 0 }, 2);
    expect(segs).toHaveLength(2);
    // The two ticks straddle the midpoint along the side direction (x).
    const midX0 = (segs[0][0][0] + segs[0][1][0]) / 2;
    const midX1 = (segs[1][0][0] + segs[1][1][0]) / 2;
    expect(midX0).not.toBeCloseTo(midX1);
    expect((midX0 + midX1) / 2).toBeCloseTo(2);
  });
});

describe("angleArcs (concentric arcs marking equal angles)", () => {
  const V: { x: number; y: number } = { x: 0, y: 0 };
  const P: { x: number; y: number } = { x: 1, y: 0 }; // along +x
  const Q: { x: number; y: number } = { x: 0, y: 1 }; // along +y (90°)

  it("returns one arc polyline per requested mark", () => {
    expect(angleArcs(V, P, Q, 1)).toHaveLength(1);
    expect(angleArcs(V, P, Q, 3)).toHaveLength(3);
  });

  it("draws concentric arcs at increasing radii, each spanning the angle", () => {
    const arcs = angleArcs(V, P, Q, 2, 0.3, 0.12);
    // Each point on an arc sits at that arc's radius from the vertex.
    const radiusOf = (arc: [number, number][]) => dist([V.x, V.y], arc[0]);
    expect(radiusOf(arcs[0])).toBeCloseTo(0.3, 9);
    expect(radiusOf(arcs[1])).toBeCloseTo(0.42, 9);
    // Each arc starts on ray VP and ends on ray VQ (90° apart).
    for (const arc of arcs) {
      const r = radiusOf(arc);
      expect(arc[0]).toEqual([expect.closeTo(r, 9), expect.closeTo(0, 9)]);
      const last = arc[arc.length - 1];
      expect(last).toEqual([expect.closeTo(0, 9), expect.closeTo(r, 9)]);
    }
  });
});

describe("rightAngleSquare (the right-angle marker)", () => {
  it("traces the little square corner along both rays of a right angle", () => {
    const V = { x: 0, y: 0 };
    const P = { x: 1, y: 0 }; // +x
    const Q = { x: 0, y: 1 }; // +y
    const sq = rightAngleSquare(V, P, Q, 0.3);
    // Three points: foot on VP, the outer corner, foot on VQ.
    expect(sq).toHaveLength(3);
    expect(sq[0]).toEqual([expect.closeTo(0.3, 9), expect.closeTo(0, 9)]);
    expect(sq[1]).toEqual([expect.closeTo(0.3, 9), expect.closeTo(0.3, 9)]);
    expect(sq[2]).toEqual([expect.closeTo(0, 9), expect.closeTo(0.3, 9)]);
  });
});
