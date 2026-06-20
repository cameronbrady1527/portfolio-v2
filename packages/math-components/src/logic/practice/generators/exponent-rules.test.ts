import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { exponentRules } from "./exponent-rules";

const SUP: Record<string, number> = {
  "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4,
  "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9,
};
const toNum = (run: string) => Number([...run].map((c) => SUP[c]).join(""));

// Re-derive the resulting exponent from the prompt independently of the rules.
function recompute(prompt: string): number {
  const power = prompt.match(/\(\d+([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/u);
  if (power) return toNum(power[1]) * toNum(power[2]); // (b^a)^c → a·c
  const runs = [...prompt.matchAll(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/gu)].map((r) => toNum(r[0]));
  if (prompt.includes("×")) return runs[0] + runs[1]; // product rule
  if (prompt.includes("÷")) return runs[0] - runs[1]; // quotient rule
  throw new Error(`unparseable prompt: ${prompt}`);
}

describe("exponentRules generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => exponentRules(3, a));
    const seqB = Array.from({ length: 12 }, () => exponentRules(3, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("exponentRules generator — math correctness", () => {
  it("the stated exponent follows the correct law and is positive", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = exponentRules(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(q.answer).toBe(recompute(q.prompt));
        expect(q.answer).toBeGreaterThan(0); // quotient kept positive
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = exponentRules(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("exponentRules generator — difficulty scales with level", () => {
  it("level 1 is the product rule only (multiplication)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = exponentRules(1, rng);
      expect(q.prompt).toContain("×");
      expect(q.prompt).not.toContain("÷");
      expect(q.prompt).not.toMatch(/\(\d/); // no power-of-a-power
    }
  });

  it("level 3 includes the power-of-a-power or quotient rules", () => {
    const rng = mulberry32(5);
    let sawOther = false;
    for (let i = 0; i < 200; i++) {
      const q = exponentRules(3, rng);
      if (/\(\d/.test(q.prompt) || q.prompt.includes("÷")) sawOther = true;
    }
    expect(sawOther).toBe(true);
  });
});
