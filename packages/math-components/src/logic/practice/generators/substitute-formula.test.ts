import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { substituteFormula } from "./substitute-formula";

// Independently evaluate an algebraic expression with given variable values —
// a small parser that knows nothing about how the generator computed its answer.
function evalExpr(expr: string, vars: Record<string, number>): number {
  let s = expr.replace(/−/g, "-").replace(/²/g, "**2");
  s = s.replace(/(\d)\s*([a-z])/g, "$1*$2"); // 3x -> 3*x
  s = s.replace(/(\d)\s*\(/g, "$1*("); // 2( -> 2*(
  for (const [k, v] of Object.entries(vars)) {
    s = s.replace(new RegExp(k, "g"), `(${v})`);
  }
  if (/[a-z]/.test(s)) throw new Error(`unsubstituted variable in: ${s}`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s});`)() as number;
}

// Recompute the answer from the prompt "Evaluate <expr> when <assignments>".
function recompute(promptRaw: string): number {
  const prompt = promptRaw.replace(/−/g, "-");
  const m = prompt.match(/Evaluate (.+) when (.+)\.?$/);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const expr = m[1].trim();
  const vars: Record<string, number> = {};
  for (const a of m[2].matchAll(/([a-z])\s*=\s*(-?\d+)/g)) {
    vars[a[1]] = Number(a[2]);
  }
  return evalExpr(expr, vars);
}

describe("substituteFormula generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => substituteFormula(2, a));
    const seqB = Array.from({ length: 12 }, () => substituteFormula(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("substituteFormula generator — math correctness", () => {
  it("the stated answer equals the expression evaluated at the given values", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = substituteFormula(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(q.answer).toBe(recompute(q.prompt));
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = substituteFormula(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });

  it("substitutes negative values too (connecting to signed-number work)", () => {
    const rng = mulberry32(23);
    let sawNegative = false;
    for (let i = 0; i < 300; i++) {
      const q = substituteFormula(2, rng);
      if (/=\s*−\d/.test(q.prompt)) sawNegative = true;
    }
    expect(sawNegative).toBe(true);
  });
});

describe("substituteFormula generator — difficulty scales with level", () => {
  it("level 1 substitutes a single variable", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = substituteFormula(1, rng);
      const assigns = q.prompt.match(/([a-z])\s*=/g) ?? [];
      expect(assigns.length).toBe(1);
    }
  });

  it("level 3 introduces exponents (squared terms)", () => {
    const rng = mulberry32(5);
    let sawSquare = false;
    for (let i = 0; i < 200; i++) {
      if (/²/u.test(substituteFormula(3, rng).prompt)) sawSquare = true;
    }
    expect(sawSquare).toBe(true);
  });
});
