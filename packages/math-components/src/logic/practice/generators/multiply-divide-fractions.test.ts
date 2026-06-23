import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { multiplyDivideFractions } from "./multiply-divide-fractions";

function frac(text: string): number {
  const m = text.match(/^(-?\d+)(?:\/(\d+))?$/);
  if (!m) throw new Error(`unparseable fraction: ${text}`);
  return m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
}

// Re-derive the true value of "a/b × c/d" or "a/b ÷ c/d" independently.
function evaluatePrompt(prompt: string): number {
  const m = prompt.match(/(\d+)\/(\d+)\s*([×÷])\s*(\d+)\/(\d+)/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const a = Number(m[1]) / Number(m[2]);
  const c = Number(m[4]) / Number(m[5]);
  return m[3] === "×" ? a * c : a / c;
}

describe("multiplyDivideFractions generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => multiplyDivideFractions(2, a));
    const seqB = Array.from({ length: 12 }, () => multiplyDivideFractions(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("multiplyDivideFractions generator — math correctness", () => {
  it("the stated answer equals the true product/quotient of the two fractions", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = multiplyDivideFractions(level, rng);
        expect(q.type).toBe("expression");
        if (q.type !== "expression") continue;
        const truth = evaluatePrompt(q.prompt);
        expect(Math.abs(frac(q.answer) - truth)).toBeLessThan(1e-9);
      }
    }
  });

  it("is shaped to feed grade() — the stated answer (and equivalent forms) grade correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = multiplyDivideFractions(2, rng);
      if (q.type !== "expression") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, `${frac(q.answer) + 1}`).correct).toBe(false);
    }
  });

  it("includes both multiplication and division across a run", () => {
    const rng = mulberry32(5);
    let sawMul = false;
    let sawDiv = false;
    for (let i = 0; i < 200; i++) {
      const p = multiplyDivideFractions(2, rng).prompt;
      if (p.includes("×")) sawMul = true;
      if (p.includes("÷")) sawDiv = true;
    }
    expect(sawMul).toBe(true);
    expect(sawDiv).toBe(true);
  });
});

describe("multiplyDivideFractions generator — difficulty scales with level", () => {
  it("level 1 stays small (denominators ≤ 5)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const q = multiplyDivideFractions(1, rng);
      const m = q.prompt.match(/(\d+)\/(\d+)\s*[×÷]\s*(\d+)\/(\d+)/u)!;
      expect(Number(m[2])).toBeLessThanOrEqual(5);
      expect(Number(m[4])).toBeLessThanOrEqual(5);
    }
  });

  it("higher levels reach larger denominators than level 1 allows", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 300; i++) {
      const m = multiplyDivideFractions(3, rng).prompt.match(/(\d+)\/(\d+)\s*[×÷]\s*(\d+)\/(\d+)/u)!;
      if (Number(m[2]) > 5 || Number(m[4]) > 5) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
