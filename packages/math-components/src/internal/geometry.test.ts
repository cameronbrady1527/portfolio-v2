import { describe, expect, it } from "vitest";
import { congruenceTickCounts, sideTicks } from "./geometry";

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
