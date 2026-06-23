import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { percents } from "./percents";

// Re-derive the answer from the prompt independently, for each of the three
// forms a percent question can take.
function recompute(prompt: string): { value: number; whole: boolean } {
  let m = prompt.match(/What is (\d+)% of (\d+)/);
  if (m) {
    const v = (Number(m[1]) * Number(m[2])) / 100; // p% of n
    return { value: v, whole: Number.isInteger(v) };
  }
  m = prompt.match(/(\d+) is what percent of (\d+)/);
  if (m) {
    const v = (Number(m[1]) / Number(m[2])) * 100; // part is what % of whole
    return { value: v, whole: Number.isInteger(v) };
  }
  m = prompt.match(/(\d+)% of what number is (\d+)/);
  if (m) {
    const v = (Number(m[2]) * 100) / Number(m[1]); // p% of W is part → W
    return { value: v, whole: Number.isInteger(v) };
  }
  throw new Error(`unparseable prompt: ${prompt}`);
}

describe("percents generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => percents(3, a));
    const seqB = Array.from({ length: 12 }, () => percents(3, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("percents generator — math correctness", () => {
  it("every stated answer matches an independent recomputation and is a whole number", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = percents(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const { value, whole } = recompute(q.prompt);
        expect(whole).toBe(true);
        expect(q.answer).toBe(value);
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = percents(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("percents generator — difficulty scales with level", () => {
  it("level 1 asks only the direct 'what is p% of n' form", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      expect(percents(1, rng).prompt).toMatch(/^What is \d+% of \d+\?$/);
    }
  });

  it("level 3 includes the reversed forms (what percent / of what number)", () => {
    const rng = mulberry32(5);
    let sawReversed = false;
    for (let i = 0; i < 200; i++) {
      const p = percents(3, rng).prompt;
      if (/what percent of|of what number/.test(p)) sawReversed = true;
    }
    expect(sawReversed).toBe(true);
  });
});
