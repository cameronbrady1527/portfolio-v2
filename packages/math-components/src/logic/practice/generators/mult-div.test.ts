import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { multDiv } from "./mult-div";

// Recover the two operands and the operation from a prompt like "7 × 8 = ?" or
// "56 ÷ 8 = ?", so the test re-derives the answer independently of the
// generator's own arithmetic — this is what actually verifies the MATH.
function recompute(prompt: string): number {
  const core = prompt.replace(/\s*=\s*\?$/, "").trim();
  const m = core.match(/^(\d+)\s*([×÷])\s*(\d+)$/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const a = Number(m[1]);
  const b = Number(m[3]);
  return m[2] === "×" ? a * b : a / b;
}

describe("multDiv generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => multDiv(1, a));
    const seqB = Array.from({ length: 12 }, () => multDiv(1, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("multDiv generator — math correctness", () => {
  it("every generated problem's stated answer is the true result, and division is always exact", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = multDiv(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const expected = recompute(q.prompt);
        expect(Number.isInteger(expected)).toBe(true); // no fractional division
        expect(q.answer).toBe(expected);
      }
    }
  });

  it("is shaped to feed grade() — answering with the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = multDiv(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });

  it("never produces a trivial ×1 or ÷1 factor", () => {
    const rng = mulberry32(99);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = multDiv(level, rng);
        const core = q.prompt.replace(/\s*=\s*\?$/, "").trim();
        const m = core.match(/^(\d+)\s*[×÷]\s*(\d+)$/u);
        expect(m).not.toBeNull();
        expect(Number(m![1])).toBeGreaterThanOrEqual(2);
        expect(Number(m![2])).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe("multDiv generator — difficulty scales with level", () => {
  it("level 1 stays in the single-digit times tables (factors ≤ 9)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const q = multDiv(1, rng);
      const core = q.prompt.replace(/\s*=\s*\?$/, "").trim();
      // For multiplication both factors are visible; for division the divisor
      // and quotient are ≤ 9, so the dividend can be up to 81 — assert the
      // small factors instead of the product.
      if (core.includes("×")) {
        const [a, b] = core.split("×").map((s) => Number(s.trim()));
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeLessThanOrEqual(9);
      } else {
        const b = Number(core.split("÷")[1].trim());
        expect(b).toBeLessThanOrEqual(9);
      }
    }
  });

  it("higher levels produce larger factors than level 1 ever can", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 300; i++) {
      const q = multDiv(3, rng);
      const core = q.prompt.replace(/\s*=\s*\?$/, "").trim();
      const nums = core.split(/[×÷]/).map((s) => Number(s.trim()));
      if (nums.some((n) => n > 12)) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
