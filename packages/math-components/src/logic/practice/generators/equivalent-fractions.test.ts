import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { equivalentFractions } from "./equivalent-fractions";

// Re-derive the missing number by CROSS-MULTIPLICATION, independently of how the
// generator built the pair: from "a/b = N/D" with one side blank, the equal
// fractions force a·D = b·N. This is what actually verifies the MATH.
function recompute(prompt: string): { answer: number; whole: boolean } {
  const m = prompt.match(/(\d+)\/(\d+)\s*=\s*(\?|\d+)\/(\?|\d+)/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (m[3] === "?") {
    const d = Number(m[4]);
    const value = (a * d) / b; // N = a·D / b
    return { answer: value, whole: Number.isInteger(value) };
  }
  const n = Number(m[3]);
  const value = (b * n) / a; // D = b·N / a
  return { answer: value, whole: Number.isInteger(value) };
}

describe("equivalentFractions generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => equivalentFractions(1, a));
    const seqB = Array.from({ length: 12 }, () => equivalentFractions(1, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("equivalentFractions generator — math correctness", () => {
  it("every blank, filled with the stated answer, makes the fractions truly equal", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = equivalentFractions(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const { answer, whole } = recompute(q.prompt);
        expect(whole).toBe(true); // the blank is always a whole number
        expect(q.answer).toBe(answer);
      }
    }
  });

  it("uses a proper base fraction and a real (≥2) scale factor — never the trivial a/b = a/b", () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 300; i++) {
      const q = equivalentFractions(2, rng);
      const m = q.prompt.match(/(\d+)\/(\d+)\s*=\s*(\?|\d+)\/(\?|\d+)/u)!;
      const a = Number(m[1]);
      const b = Number(m[2]);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThan(b); // proper fraction
      // the known side of the target is a strict multiple, so it differs from a/b
      const knownTarget = m[3] === "?" ? Number(m[4]) : Number(m[3]);
      const base = m[3] === "?" ? b : a;
      expect(knownTarget).toBeGreaterThan(base);
    }
  });

  it("is shaped to feed grade() — answering with the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = equivalentFractions(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });

  it("blanks both the numerator and the denominator across a run", () => {
    const rng = mulberry32(5);
    let blankNum = false;
    let blankDen = false;
    for (let i = 0; i < 200; i++) {
      const m = equivalentFractions(2, rng).prompt.match(/=\s*(\?|\d+)\/(\?|\d+)/u)!;
      if (m[1] === "?") blankNum = true;
      if (m[2] === "?") blankDen = true;
    }
    expect(blankNum).toBe(true);
    expect(blankDen).toBe(true);
  });
});

describe("equivalentFractions generator — difficulty scales with level", () => {
  it("level 1 stays small (denominators ≤ 6)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const q = equivalentFractions(1, rng);
      const b = Number(q.prompt.match(/(\d+)\/(\d+)/u)![2]);
      expect(b).toBeLessThanOrEqual(6);
    }
  });

  it("higher levels reach larger denominators than level 1 allows", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 300; i++) {
      const q = equivalentFractions(3, rng);
      const b = Number(q.prompt.match(/(\d+)\/(\d+)/u)![2]);
      if (b > 6) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
