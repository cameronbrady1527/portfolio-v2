import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { pointsAndQuadrants } from "./points-quadrants";

function quadrant(x: number, y: number): number {
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4; // x > 0 && y < 0
}

// Re-derive the expected quadrant from the prompt independently.
function recompute(prompt: string): number {
  const pt = prompt.match(/\((-?\d+),\s*(-?\d+)\)/);
  if (!pt) throw new Error(`unparseable prompt: ${prompt}`);
  let x = Number(pt[1]);
  let y = Number(pt[2]);
  const refl = prompt.match(/reflected over the ([xy])-axis/);
  if (refl) {
    if (refl[1] === "x") y = -y; // reflection over x-axis negates y
    else x = -x; // over y-axis negates x
  }
  return quadrant(x, y);
}

describe("pointsAndQuadrants generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => pointsAndQuadrants(3, a));
    const seqB = Array.from({ length: 12 }, () => pointsAndQuadrants(3, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("pointsAndQuadrants generator — math correctness", () => {
  it("the stated quadrant (1–4) matches the point's signs", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = pointsAndQuadrants(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(q.answer).toBe(recompute(q.prompt));
        expect(q.answer).toBeGreaterThanOrEqual(1);
        expect(q.answer).toBeLessThanOrEqual(4);
      }
    }
  });

  it("never places a point on an axis (both coordinates non-zero)", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const pt = pointsAndQuadrants(2, rng).prompt.match(/\((-?\d+),\s*(-?\d+)\)/)!;
      expect(Number(pt[1])).not.toBe(0);
      expect(Number(pt[2])).not.toBe(0);
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = pointsAndQuadrants(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, (q.answer % 4) + 1).correct).toBe(false);
    }
  });
});

describe("pointsAndQuadrants generator — difficulty scales with level", () => {
  it("level 1 is direct identification with small coordinates (no reflection)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = pointsAndQuadrants(1, rng);
      expect(q.prompt).not.toMatch(/reflected/);
      const pt = q.prompt.match(/\((-?\d+),\s*(-?\d+)\)/)!;
      expect(Math.abs(Number(pt[1]))).toBeLessThanOrEqual(5);
      expect(Math.abs(Number(pt[2]))).toBeLessThanOrEqual(5);
    }
  });

  it("level 3 includes reflection (find the image's quadrant)", () => {
    const rng = mulberry32(5);
    let sawReflection = false;
    for (let i = 0; i < 200; i++) {
      if (/reflected/.test(pointsAndQuadrants(3, rng).prompt)) sawReflection = true;
    }
    expect(sawReflection).toBe(true);
  });
});
