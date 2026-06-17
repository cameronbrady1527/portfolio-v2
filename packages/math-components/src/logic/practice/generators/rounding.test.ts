import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { rounding } from "./rounding";

const PLACE: Record<string, number> = { ten: 10, hundred: 100, thousand: 1000 };

// Re-derive each problem's answer WITHOUT the generator's arithmetic.
//  - place-value items ("Round N to the nearest hundred.") → round N to that place
//  - real-world items (two numbers, "how many … are needed?") → ceiling division
function recompute(prompt: string): number {
  const place = prompt.match(/nearest (ten|hundred|thousand)/);
  if (place) {
    const n = Number(prompt.match(/Round ([\d]+)/)![1]);
    const p = PLACE[place[1]];
    return Math.round(n / p) * p;
  }
  const nums = (prompt.match(/\d+/g) ?? []).map(Number);
  if (nums.length !== 2) throw new Error(`expected 2 numbers: ${prompt}`);
  const total = Math.max(...nums);
  const capacity = Math.min(...nums);
  return Math.ceil(total / capacity);
}

describe("rounding generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => rounding(2, a));
    const seqB = Array.from({ length: 12 }, () => rounding(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("rounding generator — math correctness", () => {
  it("every stated answer matches an independent recomputation, and is a whole number", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = rounding(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(Number.isInteger(q.answer)).toBe(true);
        expect(q.answer).toBe(recompute(q.prompt));
      }
    }
  });

  it("place-value problems are never already rounded (the digit actually matters)", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const q = rounding(3, rng);
      const place = q.prompt.match(/nearest (ten|hundred|thousand)/);
      if (!place) continue;
      const n = Number(q.prompt.match(/Round ([\d]+)/)![1]);
      const p = PLACE[place[1]];
      expect(n % p).not.toBe(0); // genuinely needs rounding
    }
  });

  it("real-world problems genuinely round UP (total is not a multiple of capacity)", () => {
    const rng = mulberry32(17);
    let sawRoundUp = false;
    for (let i = 0; i < 300; i++) {
      const q = rounding(2, rng);
      if (/nearest/.test(q.prompt)) continue;
      const nums = (q.prompt.match(/\d+/g) ?? []).map(Number);
      expect(nums).toHaveLength(2);
      const total = Math.max(...nums);
      const capacity = Math.min(...nums);
      expect(total % capacity).not.toBe(0);
      // The ceiling is strictly more than the floor — a real round-up.
      expect(q.answer).toBe(Math.floor(total / capacity) + 1);
      sawRoundUp = true;
    }
    expect(sawRoundUp).toBe(true);
  });

  it("is shaped to feed grade() — answering with the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = rounding(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("rounding generator — difficulty scales with level", () => {
  it("level 1 place-value rounding is to the nearest ten", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const q = rounding(1, rng);
      if (/nearest/.test(q.prompt)) {
        expect(q.prompt).toMatch(/nearest ten/);
      }
    }
  });

  it("level 3 reaches the nearest thousand", () => {
    const rng = mulberry32(5);
    let sawThousand = false;
    for (let i = 0; i < 300; i++) {
      if (/nearest thousand/.test(rounding(3, rng).prompt)) sawThousand = true;
    }
    expect(sawThousand).toBe(true);
  });
});
