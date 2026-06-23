import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { addSubtractFractions } from "./add-subtract-fractions";

// Value of "n" or "n/d".
function frac(text: string): number {
  const m = text.match(/^(-?\d+)(?:\/(\d+))?$/);
  if (!m) throw new Error(`unparseable fraction: ${text}`);
  return m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
}

// Re-derive the true value of the prompt "a/b ± c/d = ?" independently.
function evaluatePrompt(prompt: string): number {
  const m = prompt.match(/(\d+)\/(\d+)\s*([+−])\s*(\d+)\/(\d+)/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const a = Number(m[1]) / Number(m[2]);
  const c = Number(m[4]) / Number(m[5]);
  return m[3] === "+" ? a + c : a - c;
}

describe("addSubtractFractions generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => addSubtractFractions(2, a));
    const seqB = Array.from({ length: 12 }, () => addSubtractFractions(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("addSubtractFractions generator — math correctness", () => {
  it("the stated answer equals the true sum/difference of the two fractions", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = addSubtractFractions(level, rng);
        expect(q.type).toBe("expression");
        if (q.type !== "expression") continue;
        const truth = evaluatePrompt(q.prompt);
        expect(Math.abs(frac(q.answer) - truth)).toBeLessThan(1e-9);
      }
    }
  });

  it("never produces a negative result (subtraction is ordered larger − smaller)", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const q = addSubtractFractions(3, rng);
      expect(evaluatePrompt(q.prompt)).toBeGreaterThanOrEqual(0);
    }
  });

  it("is shaped to feed grade() — the stated answer (and equivalent forms) grade correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = addSubtractFractions(2, rng);
      if (q.type !== "expression") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      // A clearly different value grades incorrect.
      expect(grade(q, `${frac(q.answer) + 1}`).correct).toBe(false);
    }
  });
});

describe("addSubtractFractions generator — difficulty scales with level", () => {
  it("level 1 uses like denominators (same bottom on both fractions)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = addSubtractFractions(1, rng);
      const m = q.prompt.match(/(\d+)\/(\d+)\s*[+−]\s*(\d+)\/(\d+)/u)!;
      expect(m[2]).toBe(m[4]); // denominators match
    }
  });

  it("level 3 reaches unlike denominators that need a common denominator", () => {
    const rng = mulberry32(5);
    let sawUnlike = false;
    for (let i = 0; i < 200; i++) {
      const q = addSubtractFractions(3, rng);
      const m = q.prompt.match(/(\d+)\/(\d+)\s*[+−]\s*(\d+)\/(\d+)/u)!;
      if (m[2] !== m[4]) sawUnlike = true;
    }
    expect(sawUnlike).toBe(true);
  });
});
