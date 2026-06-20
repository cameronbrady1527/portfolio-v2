import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { simplifyExpression } from "./simplify-expression";

// Evaluate a single-variable expression at x, independently of the generator.
function evalAt(expr: string, x: number): number {
  let s = expr.replace(/(\d)\s*([a-z])/g, "$1*$2").replace(/(\d)\s*\(/g, "$1*(");
  s = s.replace(/x/g, `(${x})`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s});`)() as number;
}

const SAMPLE_XS = [-3, -1, 0, 2, 5, 7];

describe("simplifyExpression generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => simplifyExpression(2, a));
    const seqB = Array.from({ length: 12 }, () => simplifyExpression(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("simplifyExpression generator — math correctness", () => {
  it("the simplified answer equals the original expression at every x", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = simplifyExpression(level, rng);
        expect(q.type).toBe("expression");
        if (q.type !== "expression") continue;
        const original = q.prompt.replace(/^(Simplify|Expand):\s*/, "").trim();
        for (const x of SAMPLE_XS) {
          expect(evalAt(q.answer, x)).toBe(evalAt(original, x));
        }
      }
    }
  });

  it("the answer is actually simplified — a single x-term and at most one constant", () => {
    const rng = mulberry32(13);
    for (let i = 0; i < 300; i++) {
      const q = simplifyExpression(3, rng);
      if (q.type !== "expression") continue;
      expect(q.answer).toMatch(/^\d+x( [+-] \d+)?$/);
    }
  });

  it("is shaped to feed grade() — the simplified answer grades correct, a wrong one does not", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = simplifyExpression(2, rng);
      if (q.type !== "expression") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, `${q.answer} + 1`).correct).toBe(false);
    }
  });
});

describe("simplifyExpression generator — difficulty scales with level", () => {
  it("level 1 is pure combining (no parentheses)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      expect(simplifyExpression(1, rng).prompt).not.toMatch(/[()]/);
    }
  });

  it("level 2 introduces the distributive property (parentheses)", () => {
    const rng = mulberry32(4);
    let sawParens = false;
    for (let i = 0; i < 200; i++) {
      if (/[()]/.test(simplifyExpression(2, rng).prompt)) sawParens = true;
    }
    expect(sawParens).toBe(true);
  });
});
