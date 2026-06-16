import { describe, expect, it } from "vitest";
import {
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
} from "./triangle";

const DEG = Math.PI / 180;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(b.x - a.x, b.y - a.y);

describe("triangleFromSAS", () => {
  it("recovers the two given side lengths and the included angle", () => {
    // A right isosceles SAS: sides 3 and 3 with a 90° included angle.
    const [a, b, c] = triangleFromSAS(3, 3, 90);
    // The included angle sits at the first vertex (A), between AB and AC.
    expect(dist(a, b)).toBeCloseTo(3, 9);
    expect(dist(a, c)).toBeCloseTo(3, 9);

    // Angle at A recovered from the two side rays.
    const ux = (b.x - a.x) / dist(a, b);
    const uy = (b.y - a.y) / dist(a, b);
    const vx = (c.x - a.x) / dist(a, c);
    const vy = (c.y - a.y) / dist(a, c);
    const includedDeg = Math.acos(ux * vx + uy * vy) / DEG;
    expect(includedDeg).toBeCloseTo(90, 9);
  });

  it("over many random valid SAS inputs: recovers sides + included angle, never degenerate", () => {
    let seed = 1234567;
    const rng = () => {
      // Deterministic LCG so the property test is reproducible.
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      const sideB = 0.5 + rng() * 9.5; // (0.5, 10)
      const sideC = 0.5 + rng() * 9.5;
      const includedDeg = 1 + rng() * 178; // (1, 179) — strictly valid
      const [a, b, c] = triangleFromSAS(sideB, sideC, includedDeg);

      expect(dist(a, b)).toBeCloseTo(sideB, 9);
      expect(dist(a, c)).toBeCloseTo(sideC, 9);

      const ab = dist(a, b);
      const ac = dist(a, c);
      const ux = (b.x - a.x) / ab;
      const uy = (b.y - a.y) / ab;
      const vx = (c.x - a.x) / ac;
      const vy = (c.y - a.y) / ac;
      const recovered = Math.acos(ux * vx + uy * vy) / DEG;
      expect(recovered).toBeCloseTo(includedDeg, 6);

      // Non-degenerate: the three vertices span a positive area.
      const area2 = Math.abs(
        (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y),
      );
      expect(area2).toBeGreaterThan(1e-9);
    }
  });
});

describe("triangleAngles", () => {
  it("reads the three interior angles of a known triangle (3-4-5 right triangle)", () => {
    // Legs 3 and 4 along the axes, right angle at the origin.
    const angles = triangleAngles([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ]);
    const sorted = [...angles].sort((p, q) => p - q);
    // 3-4-5: angles ≈ 36.87°, 53.13°, 90°.
    expect(sorted[0]).toBeCloseTo(36.8699, 3);
    expect(sorted[1]).toBeCloseTo(53.1301, 3);
    expect(sorted[2]).toBeCloseTo(90, 9);
  });

  it("returns the angle AT each vertex, positionally (∠A first)", () => {
    // SAS with a known included angle at A.
    const tri = triangleFromSAS(5, 7, 40);
    const [angA] = triangleAngles(tri);
    expect(angA).toBeCloseTo(40, 6);
  });

  it("ALWAYS sums to 180° over many random valid triangles (property)", () => {
    let seed = 987654321;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      const tri = triangleFromSAS(
        0.5 + rng() * 9.5,
        0.5 + rng() * 9.5,
        1 + rng() * 178,
      );
      const [a, b, c] = triangleAngles(tri);
      expect(a + b + c).toBeCloseTo(180, 6);
      // Each interior angle is strictly within (0, 180).
      for (const ang of [a, b, c]) {
        expect(ang).toBeGreaterThan(0);
        expect(ang).toBeLessThan(180);
      }
    }
  });
});

describe("roundAnglesToSum", () => {
  it("rounds each angle to an integer whose parts sum EXACTLY to 180", () => {
    let seed = 555;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 1000; i++) {
      const tri = triangleFromSAS(
        0.5 + rng() * 9.5,
        0.5 + rng() * 9.5,
        1 + rng() * 178,
      );
      const exact = triangleAngles(tri);
      const rounded = roundAnglesToSum(exact);
      // Parts sum exactly to the rounded total (180 for a valid triangle).
      expect(rounded[0] + rounded[1] + rounded[2]).toBe(180);
      // Every part is integer and within 1 of its exact value.
      for (let k = 0; k < 3; k++) {
        expect(Number.isInteger(rounded[k])).toBe(true);
        expect(Math.abs(rounded[k] - exact[k])).toBeLessThan(1);
      }
    }
  });
});
