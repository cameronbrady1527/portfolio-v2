import type { Problem, ProblemGenerator } from "./types";

const TIMES = "×";
const DIVIDE = "÷";
const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function sup(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUP[Number(d)])
    .join("");
}

const ASK = "as a single power of";

/**
 * Exponent rules — product (add exponents), quotient (subtract), and
 * power-of-a-power (multiply). Asks for the resulting exponent, so the answer is
 * a single whole number `grade()` checks exactly (and the rule, not arithmetic,
 * is what's tested). Quotients are kept so the result stays positive. Pure and
 * seeded.
 */
export const exponentRules: ProblemGenerator = (level, rng): Problem => {
  const b = pick(rng, 2, 5); // base (display only — doesn't change the exponent)

  // Choose the rule by level.
  const rule =
    level <= 1 ? "product" : level === 2 ? (rng() < 0.5 ? "product" : "quotient") : pick(rng, 0, 2);

  if (rule === "quotient" || rule === 1) {
    const a = pick(rng, 4, 9);
    const c = pick(rng, 2, a - 1); // a > c → positive result
    return make(`${b}${sup(a)} ${DIVIDE} ${b}${sup(c)}`, b, a - c, "Subtract the exponents");
  }
  if (rule === 2) {
    // power of a power: (b^a)^c
    const a = pick(rng, 2, 4);
    const c = pick(rng, 2, 3);
    return make(`(${b}${sup(a)})${sup(c)}`, b, a * c, "Multiply the exponents");
  }
  // product (default / level 1)
  const a = pick(rng, 2, 6);
  const c = pick(rng, 2, 6);
  return make(`${b}${sup(a)} ${TIMES} ${b}${sup(c)}`, b, a + c, "Add the exponents");
};

function make(expr: string, base: number, answer: number, lead: string): Problem {
  return {
    id: `exponent-rules:${expr}`.replace(/\s+/g, ""),
    type: "numeric",
    prompt: `Write ${expr} ${ASK} ${base}. What is the exponent?`,
    answer,
    tolerance: 0,
    hints: [
      `${lead} — the base stays ${base}.`,
      "Same base is the key: the rule combines the exponents, not the bases.",
    ],
    explanation: `${expr} = ${base}${sup(answer)}, so the exponent is ${answer}.`,
  };
}
