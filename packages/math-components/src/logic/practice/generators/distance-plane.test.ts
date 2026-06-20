import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { distanceOnPlane } from "./distance-plane";

// Re-derive the distance between the two points independently.
function recompute(prompt: string): number {
  const pts = [...prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
  if (pts.length !== 2) throw new Error(`expected 2 points: ${prompt}`);
  const [x1, y1] = [Number(pts[0][1]), Number(pts[0][2])];
  const [x2, y2] = [Number(pts[1][1]), Number(pts[1][2])];
  return Math.hypot(x2 - x1, y2 - y1);
}

describe("distanceOnPlane generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => distanceOnPlane(2, a));
    const seqB = Array.from({ length: 12 }, () => distanceOnPlane(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("distanceOnPlane generator — math correctness", () => {
  it("the stated distance equals √(Δx² + Δy²) and is a whole number", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = distanceOnPlane(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const d = recompute(q.prompt);
        expect(Number.isInteger(d)).toBe(true); // triples / axis-aligned only
        expect(q.answer).toBe(d);
      }
    }
  });

  it("the two points are distinct", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const pts = [...distanceOnPlane(3, rng).prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
      expect(`${pts[0][1]},${pts[0][2]}`).not.toBe(`${pts[1][1]},${pts[1][2]}`);
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = distanceOnPlane(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("distanceOnPlane generator — difficulty scales with level", () => {
  it("level 1 is axis-aligned (the two points share an x or a y)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const pts = [...distanceOnPlane(1, rng).prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
      const sameX = pts[0][1] === pts[1][1];
      const sameY = pts[0][2] === pts[1][2];
      expect(sameX || sameY).toBe(true);
    }
  });

  it("level 3 uses diagonal (Pythagorean) distances", () => {
    const rng = mulberry32(5);
    let sawDiagonal = false;
    for (let i = 0; i < 200; i++) {
      const pts = [...distanceOnPlane(3, rng).prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
      if (pts[0][1] !== pts[1][1] && pts[0][2] !== pts[1][2]) sawDiagonal = true;
    }
    expect(sawDiagonal).toBe(true);
  });
});
