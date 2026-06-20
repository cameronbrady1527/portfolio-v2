import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { solveLinearEquation } from "./solve-linear-equation";

// Evaluate one side of an equation at a given x, independently of the generator.
function evalSide(side: string, x: number): number {
  let s = side.replace(/(\d)\s*([a-z])/g, "$1*$2").replace(/(\d)\s*\(/g, "$1*(");
  s = s.replace(/x/g, `(${x})`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s});`)() as number;
}

function sides(prompt: string): [string, string] {
  const eq = prompt.replace(/^Solve for x:\s*/, "").trim();
  const [l, r] = eq.split("=");
  return [l.trim(), r.trim()];
}

describe("solveLinearEquation generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => solveLinearEquation(2, a));
    const seqB = Array.from({ length: 12 }, () => solveLinearEquation(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("solveLinearEquation generator — math correctness", () => {
  it("the stated answer, substituted back, makes both sides equal", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = solveLinearEquation(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(Number.isInteger(q.answer)).toBe(true);
        const [l, r] = sides(q.prompt);
        expect(evalSide(l, q.answer)).toBe(evalSide(r, q.answer));
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = solveLinearEquation(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("solveLinearEquation generator — difficulty scales with level", () => {
  it("level 1 is one step (a single x, no parentheses)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = solveLinearEquation(1, rng);
      const eq = q.prompt.replace(/^Solve for x:\s*/, "");
      expect(eq).not.toMatch(/[()]/);
      expect((eq.match(/x/g) ?? []).length).toBe(1);
    }
  });

  it("level 3 reaches multi-step forms (parentheses or x on both sides)", () => {
    const rng = mulberry32(5);
    let sawComplex = false;
    for (let i = 0; i < 200; i++) {
      const q = solveLinearEquation(3, rng);
      const eq = q.prompt.replace(/^Solve for x:\s*/, "");
      const xCount = (eq.match(/x/g) ?? []).length;
      if (/[()]/.test(eq) || xCount === 2) sawComplex = true;
    }
    expect(sawComplex).toBe(true);
  });
});
