import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { midpoint } from "./midpoint";

// Re-derive the asked midpoint coordinate independently.
function recompute(prompt: string): { value: number; whole: boolean } {
  const pts = [...prompt.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)];
  const axis = prompt.match(/the ([xy])-coordinate/)![1];
  const [x1, y1] = [Number(pts[0][1]), Number(pts[0][2])];
  const [x2, y2] = [Number(pts[1][1]), Number(pts[1][2])];
  const value = axis === "x" ? (x1 + x2) / 2 : (y1 + y2) / 2;
  return { value, whole: Number.isInteger(value) };
}

describe("midpoint generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => midpoint(2, a));
    const seqB = Array.from({ length: 12 }, () => midpoint(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("midpoint generator — math correctness", () => {
  it("the stated answer is the average of the relevant coordinates, a whole number", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = midpoint(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const { value, whole } = recompute(q.prompt);
        expect(whole).toBe(true);
        expect(q.answer).toBe(value);
      }
    }
  });

  it("asks for both x- and y-coordinates across a run", () => {
    const rng = mulberry32(5);
    const axes = new Set<string>();
    for (let i = 0; i < 200; i++) {
      axes.add(midpoint(2, rng).prompt.match(/the ([xy])-coordinate/)![1]);
    }
    expect(axes.has("x")).toBe(true);
    expect(axes.has("y")).toBe(true);
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = midpoint(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("midpoint generator — difficulty scales with level", () => {
  it("level 1 keeps coordinates small (within ±8)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const nums = midpoint(1, rng).prompt.match(/-?\d+/g)!.map(Number);
      for (const n of nums) expect(Math.abs(n)).toBeLessThanOrEqual(8);
    }
  });

  it("level 3 reaches larger coordinates than level 1 allows", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 200; i++) {
      const nums = midpoint(3, rng).prompt.match(/-?\d+/g)!.map(Number);
      if (nums.some((n) => Math.abs(n) > 8)) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
