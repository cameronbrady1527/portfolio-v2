import { describe, expect, it } from "vitest";
import { congruenceCheck, solutionCount, solveTriangles } from "./congruence";

const DEG = Math.PI / 180;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(b.x - a.x, b.y - a.y);

describe("solutionCount", () => {
  it("reports a valid SSS part-set as determining a unique triangle", () => {
    expect(solutionCount("SSS", { sides: [3, 4, 5] }).kind).toBe("unique");
  });

  it("reports AAA as continuous — three angles fix only the shape, not the size", () => {
    expect(solutionCount("AAA", { angles: [60, 60, 60] }).kind).toBe("continuous");
  });

  it("reports an SSS triple that breaks the triangle inequality as impossible", () => {
    expect(solutionCount("SSS", { sides: [1, 1, 5] }).kind).toBe("impossible");
  });

  it("reports each valid shortcut (SAS/ASA/AAS/HL) as unique, and degenerate inputs as impossible", () => {
    expect(solutionCount("SAS", { sides: [5, 7], includedAngle: 40 }).kind).toBe("unique");
    expect(solutionCount("SAS", { sides: [5, 7], includedAngle: 180 }).kind).toBe("impossible");

    expect(solutionCount("ASA", { angles: [50, 60], includedSide: 8 }).kind).toBe("unique");
    expect(solutionCount("ASA", { angles: [120, 60], includedSide: 8 }).kind).toBe("impossible");

    expect(solutionCount("AAS", { angles: [50, 60], side: 8 }).kind).toBe("unique");
    expect(solutionCount("AAS", { angles: [120, 70], side: 8 }).kind).toBe("impossible");

    expect(solutionCount("HL", { hypotenuse: 10, leg: 6 }).kind).toBe("unique");
    expect(solutionCount("HL", { hypotenuse: 6, leg: 10 }).kind).toBe("impossible");
  });

  it("reads SSA's verdict off the triangle count — ambiguous / unique / impossible", () => {
    const altitude = 10 * Math.sin(30 * DEG); // ≈ 5
    expect(solutionCount("SSA", { angle: 30, adjacent: 10, opposite: 6 }).kind)
      .toBe("ambiguous"); // altitude < 6 < 10 → two triangles
    expect(solutionCount("SSA", { angle: 30, adjacent: 10, opposite: altitude }).kind)
      .toBe("unique"); // right-angle boundary → one
    expect(solutionCount("SSA", { angle: 30, adjacent: 10, opposite: 3 }).kind)
      .toBe("impossible"); // below the altitude → none
  });
});

describe("solveTriangles — SSA regime", () => {
  it("yields TWO triangles when the opposite side lands in the ambiguous range", () => {
    // angle 30°, adjacent 10 → altitude = 10·sin30° = 5; opposite 6 ∈ (5, 10).
    const tris = solveTriangles("SSA", { angle: 30, adjacent: 10, opposite: 6 });
    expect(tris).toHaveLength(2);
    // Each is a genuine triangle that honours the given parts (angle at A,
    // adjacent AB, opposite BC).
    for (const [A, B, C] of tris) {
      expect(dist(A, B)).toBeCloseTo(10, 9); // adjacent
      expect(dist(B, C)).toBeCloseTo(6, 9); // opposite
      const ux = (B.x - A.x) / dist(A, B);
      const uy = (B.y - A.y) / dist(A, B);
      const vx = (C.x - A.x) / dist(A, C);
      const vy = (C.y - A.y) / dist(A, C);
      expect(Math.acos(ux * vx + uy * vy) / DEG).toBeCloseTo(30, 6);
    }
    // The two triangles are genuinely different (distinct C).
    expect(dist(tris[0][2], tris[1][2])).toBeGreaterThan(1e-6);
  });

  it("walks the 0 → 1 → 2 → 1 regime as the opposite side grows (property)", () => {
    let seed = 99173;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      const angle = 15 + rng() * 60; // acute (15°, 75°)
      const adjacent = 2 + rng() * 8; // (2, 10)
      const altitude = adjacent * Math.sin(angle * DEG);

      // Below the altitude: the swinging side can't reach → no triangle.
      expect(solveTriangles("SSA", { angle, adjacent, opposite: altitude * 0.5 }))
        .toHaveLength(0);

      // Exactly at the altitude: a single right-angled triangle (the boundary).
      const boundary = solveTriangles("SSA", { angle, adjacent, opposite: altitude });
      expect(boundary).toHaveLength(1);
      const [A, B, C] = boundary[0];
      // Right angle at C: CB ⟂ CA (CA lies along the base).
      const cb = { x: B.x - C.x, y: B.y - C.y };
      const ca = { x: A.x - C.x, y: A.y - C.y };
      expect(cb.x * ca.x + cb.y * ca.y).toBeCloseTo(0, 6);

      // Between altitude and the adjacent side: ambiguous, two triangles.
      const mid = (altitude + adjacent) / 2;
      expect(solveTriangles("SSA", { angle, adjacent, opposite: mid }))
        .toHaveLength(2);

      // At or beyond the adjacent side: only one triangle survives on the ray.
      expect(solveTriangles("SSA", { angle, adjacent, opposite: adjacent * 1.5 }))
        .toHaveLength(1);
    }
  });
});

describe("solveTriangles — unique criteria recover their inputs", () => {
  const angleAt = (
    v: { x: number; y: number },
    p: { x: number; y: number },
    q: { x: number; y: number },
  ) => {
    const ux = (p.x - v.x) / dist(v, p);
    const uy = (p.y - v.y) / dist(v, p);
    const vx = (q.x - v.x) / dist(v, q);
    const vy = (q.y - v.y) / dist(v, q);
    return Math.acos(Math.max(-1, Math.min(1, ux * vx + uy * vy))) / DEG;
  };

  it("SAS builds one triangle with the two given sides and the included angle", () => {
    const tris = solveTriangles("SAS", { sides: [5, 7], includedAngle: 40 });
    expect(tris).toHaveLength(1);
    const [A, B, C] = tris[0];
    expect(dist(A, B)).toBeCloseTo(5, 9);
    expect(dist(A, C)).toBeCloseTo(7, 9);
    expect(angleAt(A, B, C)).toBeCloseTo(40, 6);
  });

  it("HL builds one right triangle with the given hypotenuse and leg", () => {
    const tris = solveTriangles("HL", { hypotenuse: 10, leg: 6 });
    expect(tris).toHaveLength(1);
    const [A, B, C] = tris[0];
    const sides = [dist(A, B), dist(B, C), dist(C, A)].sort((x, y) => x - y);
    expect(sides[0]).toBeCloseTo(6, 6); // leg
    expect(sides[1]).toBeCloseTo(8, 6); // other leg, by Pythagoras
    expect(sides[2]).toBeCloseTo(10, 6); // hypotenuse
    // A genuine right angle is present.
    const angles = [angleAt(A, B, C), angleAt(B, C, A), angleAt(C, A, B)];
    expect(angles.some((a) => Math.abs(a - 90) < 1e-6)).toBe(true);
  });

  it("ASA builds one triangle with the two given angles around the included side", () => {
    const tris = solveTriangles("ASA", { angles: [50, 60], includedSide: 8 });
    expect(tris).toHaveLength(1);
    const [A, B, C] = tris[0];
    expect(dist(A, B)).toBeCloseTo(8, 9); // included side
    expect(angleAt(A, B, C)).toBeCloseTo(50, 6);
    expect(angleAt(B, A, C)).toBeCloseTo(60, 6);
  });

  it("AAS builds one triangle honouring the two angles and the non-included side", () => {
    const tris = solveTriangles("AAS", { angles: [50, 60], side: 8 });
    expect(tris).toHaveLength(1);
    const [A, B, C] = tris[0];
    expect(angleAt(A, B, C)).toBeCloseTo(50, 6);
    expect(angleAt(B, A, C)).toBeCloseTo(60, 6);
    expect(dist(B, C)).toBeCloseTo(8, 6); // the side opposite angle A
  });

  it("returns no triangle when the parts can't close", () => {
    expect(solveTriangles("SAS", { sides: [5, 7], includedAngle: 180 })).toHaveLength(0);
    expect(solveTriangles("HL", { hypotenuse: 6, leg: 10 })).toHaveLength(0);
    expect(solveTriangles("ASA", { angles: [120, 60], includedSide: 8 })).toHaveLength(0);
  });
});

describe("congruenceCheck", () => {
  // A random rigid motion: rotate by θ about the origin, optionally reflect
  // across the x-axis, then translate. Preserves all distances → congruent.
  const rigid = (p: { x: number; y: number }, θ: number, flip: boolean, tx: number, ty: number) => {
    const y = flip ? -p.y : p.y;
    return {
      x: p.x * Math.cos(θ) - y * Math.sin(θ) + tx,
      y: p.x * Math.sin(θ) + y * Math.cos(θ) + ty,
    };
  };

  it("recognises a triangle carried onto itself by a random rigid motion (property)", () => {
    let seed = 424242;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      // A non-degenerate triangle (reject near-collinear).
      let t1: { x: number; y: number }[];
      do {
        t1 = Array.from({ length: 3 }, () => ({ x: rng() * 20 - 10, y: rng() * 20 - 10 }));
      } while (
        Math.abs(
          (t1[1].x - t1[0].x) * (t1[2].y - t1[0].y) -
            (t1[2].x - t1[0].x) * (t1[1].y - t1[0].y),
        ) < 1
      );
      const θ = rng() * 2 * Math.PI;
      const flip = rng() < 0.5;
      const tx = rng() * 40 - 20;
      const ty = rng() * 40 - 20;
      const t2 = t1.map((p) => rigid(p, θ, flip, tx, ty));

      const res = congruenceCheck(t1, t2);
      expect(res.congruent).toBe(true);
      expect(res.criterion).not.toBeNull();
      // The reported correspondence really maps t1's edges onto equal t2 edges.
      const σ = res.correspondence!;
      const edges: [number, number][] = [[0, 1], [1, 2], [2, 0]];
      for (const [a, b] of edges) {
        expect(dist(t2[σ[a]], t2[σ[b]])).toBeCloseTo(dist(t1[a], t1[b]), 6);
      }
    }
  });

  it("rejects a scaled copy — similar is not congruent (property)", () => {
    let seed = 7777;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      let t1: { x: number; y: number }[];
      do {
        t1 = Array.from({ length: 3 }, () => ({ x: rng() * 20 - 10, y: rng() * 20 - 10 }));
      } while (
        Math.abs(
          (t1[1].x - t1[0].x) * (t1[2].y - t1[0].y) -
            (t1[2].x - t1[0].x) * (t1[1].y - t1[0].y),
        ) < 1
      );
      const k = 1.3 + rng() * 0.5; // scale ≠ 1 → genuinely different size
      const t2 = t1.map((p) => ({ x: p.x * k, y: p.y * k }));

      const res = congruenceCheck(t1, t2);
      expect(res.congruent).toBe(false);
      expect(res.correspondence).toBeNull();
      expect(res.criterion).toBeNull();
    }
  });
});
