import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { orderOfOperations } from "./order-of-operations";

// Independently evaluate the prompt with JavaScript's OWN operator precedence —
// a real PEMDAS engine that knows nothing about how the generator computed its
// answer. This is what actually verifies the order-of-operations MATH.
function evaluate(prompt: string): number {
  let s = prompt.replace(/\s*=\s*\?$/, "").trim();
  s = s.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  s = s.replace(/²/g, "**2").replace(/³/g, "**3");
  // Only digits, spaces, parentheses and arithmetic operators are allowed.
  if (!/^[\d\s()+\-*/.]+$/.test(s)) {
    throw new Error(`unsafe/unparseable prompt: ${prompt} -> ${s}`);
  }
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s});`)() as number;
}

describe("orderOfOperations generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => orderOfOperations(2, a));
    const seqB = Array.from({ length: 12 }, () => orderOfOperations(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("orderOfOperations generator — PEMDAS correctness", () => {
  it("every stated answer equals the value under real operator precedence", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = orderOfOperations(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        const expected = evaluate(q.prompt);
        expect(Number.isInteger(expected)).toBe(true); // results stay whole
        expect(q.answer).toBe(expected);
      }
    }
  });

  it("is shaped to feed grade() — answering with the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = orderOfOperations(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });

  it("the naive strict-left-to-right value differs sometimes — precedence actually matters", () => {
    const rng = mulberry32(31);
    let sawDifference = false;
    for (let i = 0; i < 200; i++) {
      const q = orderOfOperations(2, rng);
      if (q.type !== "numeric") continue;
      // A learner who ignores precedence reads strictly left to right.
      const tokens = q.prompt
        .replace(/\s*=\s*\?$/, "")
        .replace(/[()²³]/g, "")
        .replace(/−/g, "-")
        .trim();
      // Skip exponent forms here; just probe the flat +-×÷ ones.
      if (/[²³]/.test(q.prompt)) continue;
      const parts = tokens.match(/\d+|[+\-×÷]/gu);
      if (!parts) continue;
      let acc = Number(parts[0]);
      for (let k = 1; k < parts.length; k += 2) {
        const op = parts[k];
        const n = Number(parts[k + 1]);
        acc = op === "+" ? acc + n : op === "−" || op === "-" ? acc - n : op === "×" ? acc * n : acc / n;
      }
      if (acc !== q.answer) sawDifference = true;
    }
    expect(sawDifference).toBe(true);
  });
});

describe("orderOfOperations generator — difficulty scales with level", () => {
  it("level 1 has no parentheses or exponents (just precedence of × ÷ over + −)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = orderOfOperations(1, rng);
      expect(q.prompt).not.toMatch(/[()²³]/u);
    }
  });

  it("level 2 introduces parentheses", () => {
    const rng = mulberry32(4);
    let sawParens = false;
    for (let i = 0; i < 200; i++) {
      if (/[()]/.test(orderOfOperations(2, rng).prompt)) sawParens = true;
    }
    expect(sawParens).toBe(true);
  });

  it("level 3 introduces exponents", () => {
    const rng = mulberry32(5);
    let sawExponent = false;
    for (let i = 0; i < 200; i++) {
      if (/[²³]/u.test(orderOfOperations(3, rng).prompt)) sawExponent = true;
    }
    expect(sawExponent).toBe(true);
  });
});
