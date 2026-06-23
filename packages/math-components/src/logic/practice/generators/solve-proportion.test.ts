import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { solveProportion } from "./solve-proportion";

// Re-derive x by CROSS-MULTIPLICATION from "A/B = C/D" (one slot is "x"),
// independently of how the generator built the proportion.
function solveForX(prompt: string): { value: number; whole: boolean } {
  const m = prompt.match(/([x\d]+)\/([x\d]+)\s*=\s*([x\d]+)\/([x\d]+)/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const [A, B, C, D] = [m[1], m[2], m[3], m[4]];
  const num = (s: string) => Number(s);
  let value: number;
  if (A === "x") value = (num(B) * num(C)) / num(D);
  else if (B === "x") value = (num(A) * num(D)) / num(C);
  else if (C === "x") value = (num(A) * num(D)) / num(B);
  else value = (num(B) * num(C)) / num(A);
  return { value, whole: Number.isInteger(value) };
}

describe("solveProportion generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => solveProportion(2, a));
    const seqB = Array.from({ length: 12 }, () => solveProportion(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("solveProportion generator — math correctness", () => {
  it("the stated answer solves the proportion (cross-products equal) and is a whole number", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = solveProportion(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const { value, whole } = solveForX(q.prompt);
        expect(whole).toBe(true);
        expect(q.answer).toBe(value);
      }
    }
  });

  it("the two ratios are not written identically (a real proportion to solve)", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const q = solveProportion(2, rng);
      const m = q.prompt.match(/([x\d]+)\/([x\d]+)\s*=\s*([x\d]+)\/([x\d]+)/u)!;
      expect(`${m[1]}/${m[2]}`).not.toBe(`${m[3]}/${m[4]}`);
    }
  });

  it("places the unknown in different slots across a run", () => {
    const rng = mulberry32(5);
    const slots = new Set<number>();
    for (let i = 0; i < 300; i++) {
      const m = solveProportion(2, rng).prompt.match(/([x\d]+)\/([x\d]+)\s*=\s*([x\d]+)\/([x\d]+)/u)!;
      [m[1], m[2], m[3], m[4]].forEach((s, idx) => {
        if (s === "x") slots.add(idx);
      });
    }
    expect(slots.size).toBeGreaterThanOrEqual(2);
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = solveProportion(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("solveProportion generator — difficulty scales with level", () => {
  it("level 1 stays small (all four numbers ≤ 20)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const nums = solveProportion(1, rng).prompt.match(/\d+/g)!.map(Number);
      for (const n of nums) expect(n).toBeLessThanOrEqual(20);
    }
  });

  it("higher levels reach larger numbers than level 1 allows", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 300; i++) {
      const nums = solveProportion(3, rng).prompt.match(/\d+/g)!.map(Number);
      if (nums.some((n) => n > 20)) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
