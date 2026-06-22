import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { slope } from "./slope";

// Independently re-derive the slope from the two points named in the prompt,
// by a different route than the generator (raw Δy/Δx as a float).
function pointsOf(prompt: string): [number, number, number, number] {
  const pts = [...prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
  if (pts.length !== 2) throw new Error(`expected 2 points: ${prompt}`);
  return [
    Number(pts[0][1]),
    Number(pts[0][2]),
    Number(pts[1][1]),
    Number(pts[1][2]),
  ];
}
function recomputeSlope(prompt: string): number {
  const [x1, y1, x2, y2] = pointsOf(prompt);
  return (y2 - y1) / (x2 - x1);
}
// Parse the generator's answer string ("3", "-2", "2/3", "-3/4") to a number.
function valueOf(answer: string): number {
  const m = answer.match(/^(-?\d+)(?:\/(\d+))?$/);
  if (!m) throw new Error(`unparseable slope answer: ${answer}`);
  return m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
}

describe("slope generator — math correctness", () => {
  it("the stated answer equals (y₂ − y₁)/(x₂ − x₁)", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = slope(level, rng);
        expect(q.type).toBe("expression");
        if (q.type !== "expression") continue;
        expect(valueOf(q.answer)).toBeCloseTo(recomputeSlope(q.prompt), 9);
        expect(grade(q, q.answer).correct).toBe(true);
      }
    }
  });

  it("never emits a vertical line — the two x-coordinates always differ", () => {
    const rng = mulberry32(99);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const [x1, , x2] = pointsOf(slope(level, rng).prompt);
        expect(x1).not.toBe(x2);
      }
    }
  });

  it("states fractional slopes in lowest terms", () => {
    const rng = mulberry32(31);
    for (let i = 0; i < 300; i++) {
      const m = slope(3, rng).answer.match(/^-?(\d+)\/(\d+)$/);
      if (!m) continue;
      const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
      expect(g(Number(m[1]), Number(m[2]))).toBe(1);
    }
  });

  it("a deliberately wrong slope grades incorrect", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = slope(2, rng);
      if (q.type !== "expression") continue;
      const wrong = String(valueOf(q.answer) + 1);
      expect(grade(q, wrong).correct).toBe(false);
    }
  });
});

describe("slope generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => slope(3, a));
    const seqB = Array.from({ length: 12 }, () => slope(3, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("slope generator — difficulty scales with level", () => {
  it("level 1 slopes are positive integers", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const m = recomputeSlope(slope(1, rng).prompt);
      expect(Number.isInteger(m)).toBe(true);
      expect(m).toBeGreaterThan(0);
    }
  });

  it("level 2 produces zero and negative integer slopes too", () => {
    const rng = mulberry32(5);
    let sawZero = false;
    let sawNegative = false;
    for (let i = 0; i < 300; i++) {
      const m = recomputeSlope(slope(2, rng).prompt);
      expect(Number.isInteger(m)).toBe(true);
      if (m === 0) sawZero = true;
      if (m < 0) sawNegative = true;
    }
    expect(sawZero).toBe(true);
    expect(sawNegative).toBe(true);
  });

  it("level 3 produces non-integer (fractional) slopes", () => {
    const rng = mulberry32(8);
    let sawFraction = false;
    for (let i = 0; i < 200; i++) {
      if (!Number.isInteger(recomputeSlope(slope(3, rng).prompt))) {
        sawFraction = true;
      }
    }
    expect(sawFraction).toBe(true);
  });
});
