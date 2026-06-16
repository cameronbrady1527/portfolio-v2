import { describe, expect, it } from "vitest";
import {
  angleSumAssembly,
  midsegment,
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
} from "./triangle";

const DEG = Math.PI / 180;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(b.x - a.x, b.y - a.y);
const cross = (
  o: { x: number; y: number },
  p: { x: number; y: number },
  q: { x: number; y: number },
) => (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);

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

describe("angleSumAssembly", () => {
  it("places the rotation centers at the side midpoints and the apex at C", () => {
    const tri = triangleFromSAS(5, 7, 40);
    const [A, B, C] = tri;
    const asm = angleSumAssembly(tri);
    expect(dist(asm.apex, C)).toBeCloseTo(0, 9);
    expect(asm.midCA.x).toBeCloseTo((C.x + A.x) / 2, 9);
    expect(asm.midCA.y).toBeCloseTo((C.y + A.y) / 2, 9);
    expect(asm.midCB.x).toBeCloseTo((C.x + B.x) / 2, 9);
    expect(asm.midCB.y).toBeCloseTo((C.y + B.y) / 2, 9);
  });

  it("the corner images are the vertices half-turned about the side midpoints", () => {
    const tri = triangleFromSAS(5, 7, 40);
    const [A, B, C] = tri;
    const asm = angleSumAssembly(tri);
    // imageOfB = B rotated 180° about midpoint of CA (= 2·mid − B), and likewise.
    expect(asm.imageOfB.x).toBeCloseTo(C.x + A.x - B.x, 9);
    expect(asm.imageOfB.y).toBeCloseTo(C.y + A.y - B.y, 9);
    expect(asm.imageOfA.x).toBeCloseTo(C.x + B.x - A.x, 9);
    expect(asm.imageOfA.y).toBeCloseTo(C.y + B.y - A.y, 9);
  });

  it("assembles a straight angle at the apex over many random triangles (property)", () => {
    let seed = 24681357;
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
      const [A, B] = tri;
      const { apex: C, imageOfA, imageOfB } = angleSumAssembly(tri);

      // The two corner images and the apex are collinear — the assembly line.
      expect(cross(C, imageOfB, imageOfA)).toBeCloseTo(0, 6);
      // The apex sits strictly BETWEEN them, so the three angles tile a straight
      // angle (opposite rays ⇒ negative dot product).
      const dot =
        (imageOfB.x - C.x) * (imageOfA.x - C.x) +
        (imageOfB.y - C.y) * (imageOfA.y - C.y);
      expect(dot).toBeLessThan(0);
      // The assembly line through the apex is parallel to AB.
      const ab = { x: B.x - A.x, y: B.y - A.y };
      const line = { x: imageOfA.x - imageOfB.x, y: imageOfA.y - imageOfB.y };
      expect(ab.x * line.y - ab.y * line.x).toBeCloseTo(0, 6);
    }
  });
});

describe("midsegment", () => {
  it("connects the midpoints of the two sides adjacent to the named side", () => {
    // Right triangle: A=(0,0), B=(4,0), C=(0,3). The midsegment parallel to AB
    // joins the midpoints of CA and CB.
    const tri = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ];
    const ms = midsegment(tri, "AB");
    // Midpoint of CA = (0, 1.5); midpoint of CB = (2, 1.5).
    const got = [ms.start, ms.end].sort((p, q) => p.x - q.x);
    expect(got[0].x).toBeCloseTo(0, 9);
    expect(got[0].y).toBeCloseTo(1.5, 9);
    expect(got[1].x).toBeCloseTo(2, 9);
    expect(got[1].y).toBeCloseTo(1.5, 9);
  });

  it("reports it is parallel to the named side and exactly half its length", () => {
    const tri = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ];
    const ms = midsegment(tri, "AB");
    expect(ms.parallelTo).toBe("AB");
    expect(ms.isParallel).toBe(true);
    // |AB| = 4, so the midsegment length is 2.
    expect(ms.length).toBeCloseTo(2, 9);
    expect(dist(ms.start, ms.end)).toBeCloseTo(2, 9);
  });

  it("over many random valid triangles, for every side: exactly parallel and exactly half-length (property)", () => {
    let seed = 1357924680;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const ends = (
      tri: { x: number; y: number }[],
      side: "AB" | "BC" | "CA",
    ) => {
      const [A, B, C] = tri;
      return side === "AB" ? [A, B] : side === "BC" ? [B, C] : [C, A];
    };

    for (let i = 0; i < 500; i++) {
      const tri = triangleFromSAS(
        0.5 + rng() * 9.5,
        0.5 + rng() * 9.5,
        1 + rng() * 178,
      );
      for (const side of ["AB", "BC", "CA"] as const) {
        const ms = midsegment(tri, side);
        const [p, q] = ends(tri, side);
        const sideVec = { x: q.x - p.x, y: q.y - p.y };
        // Exactly parallel: the midsegment vector is collinear with the side.
        const segVec = { x: ms.end.x - ms.start.x, y: ms.end.y - ms.start.y };
        expect(cross({ x: 0, y: 0 }, sideVec, segVec)).toBeCloseTo(0, 6);
        expect(ms.isParallel).toBe(true);
        expect(ms.parallelTo).toBe(side);
        // Exactly half the side length.
        const half = dist(p, q) / 2;
        expect(ms.length).toBeCloseTo(half, 9);
        expect(dist(ms.start, ms.end)).toBeCloseTo(half, 9);
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
