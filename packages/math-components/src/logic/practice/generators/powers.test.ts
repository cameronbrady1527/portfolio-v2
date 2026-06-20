import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { powers } from "./powers";

const SUP: Record<string, number> = {
  "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4,
  "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9,
};

// Re-derive base^exp from "Evaluate <base><superscript>." independently.
function recompute(prompt: string): number {
  const m = prompt.match(/Evaluate (.+?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\.?$/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const base = Number(m[1].replace(/[()]/g, "").replace(/−/g, "-"));
  const exp = Number([...m[2]].map((c) => SUP[c]).join(""));
  return base ** exp;
}

describe("powers generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => powers(2, a));
    const seqB = Array.from({ length: 12 }, () => powers(2, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("powers generator — math correctness", () => {
  it("the stated answer equals base raised to the exponent", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = powers(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(q.answer).toBe(recompute(q.prompt));
      }
    }
  });

  it("is shaped to feed grade() — the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = powers(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });

  it("handles negative bases correctly (parenthesized; even/odd exponents)", () => {
    const rng = mulberry32(23);
    let sawNegBase = false;
    for (let i = 0; i < 300; i++) {
      const q = powers(2, rng);
      if (q.prompt.includes("(−")) {
        sawNegBase = true;
        // recompute already covers the sign; just confirm the value matches.
        if (q.type === "numeric") expect(q.answer).toBe(recompute(q.prompt));
      }
    }
    expect(sawNegBase).toBe(true);
  });
});

describe("powers generator — difficulty scales with level", () => {
  it("level 1 is small positive bases with exponent 2 or 3", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const q = powers(1, rng);
      expect(q.prompt).not.toContain("(−"); // no negative bases at level 1
      const exp = recomputeExp(q.prompt);
      expect(exp).toBeGreaterThanOrEqual(2);
      expect(exp).toBeLessThanOrEqual(3);
    }
  });

  it("level 3 reaches larger exponents or powers of ten", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 200; i++) {
      const q = powers(3, rng);
      if (recomputeExp(q.prompt) >= 4 || /Evaluate 10/.test(q.prompt)) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});

function recomputeExp(prompt: string): number {
  const m = prompt.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\.?$/u)!;
  return Number([...m[1]].map((c) => SUP[c]).join(""));
}
