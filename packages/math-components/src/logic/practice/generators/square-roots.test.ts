import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { squareRoots } from "./square-roots";

describe("squareRoots generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => squareRoots(2, a));
    const seqB = Array.from({ length: 12 }, () => squareRoots(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("squareRoots generator — math correctness", () => {
  it("perfect-square roots are exact, and estimates name the right lower integer", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = squareRoots(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;

        const exact = q.prompt.match(/√(\d+) = \?/);
        if (exact) {
          const r = Math.sqrt(Number(exact[1]));
          expect(Number.isInteger(r)).toBe(true); // genuinely a perfect square
          expect(q.answer).toBe(r);
          continue;
        }

        const est = q.prompt.match(/√(\d+) lies between/);
        expect(est).not.toBeNull();
        const m = Number(est![1]);
        expect(Number.isInteger(Math.sqrt(m))).toBe(false); // NOT a perfect square
        expect(q.answer).toBe(Math.floor(Math.sqrt(m)));
        // genuinely between answer and answer+1
        expect(q.answer * q.answer).toBeLessThan(m);
        expect((q.answer + 1) * (q.answer + 1)).toBeGreaterThan(m);
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = squareRoots(3, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("squareRoots generator — difficulty scales with level", () => {
  it("level 1 is exact perfect-square roots only", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      expect(squareRoots(1, rng).prompt).toMatch(/√\d+ = \?/);
    }
  });

  it("level 3 includes estimating between consecutive integers", () => {
    const rng = mulberry32(5);
    let sawEstimate = false;
    for (let i = 0; i < 200; i++) {
      if (/lies between/.test(squareRoots(3, rng).prompt)) sawEstimate = true;
    }
    expect(sawEstimate).toBe(true);
  });
});
