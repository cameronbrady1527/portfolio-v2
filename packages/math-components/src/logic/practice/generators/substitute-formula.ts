import type { Problem, ProblemGenerator } from "./types";

const MINUS = "−"; // U+2212, display only — values use the same glyph

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Render a signed value the way students read it: x = −3, not x = -3. */
function show(n: number): string {
  return n < 0 ? `${MINUS}${Math.abs(n)}` : `${n}`;
}

/**
 * Substituting values into a formula/expression — the spine of Regents work:
 * plug numbers in and evaluate. Emits a `numeric` question (the exact value), so
 * `grade()` checks it with tolerance 0. Values include negatives, tying back to
 * signed-number fluency. Pure and seeded.
 */
export const substituteFormula: ProblemGenerator = (level, rng): Problem => {
  let expr: string;
  let assignments: string;
  let answer: number;

  if (level <= 1) {
    // a·x ± b, one variable.
    const a = pick(rng, 2, 9);
    const b = pick(rng, 1, 12);
    const x = pick(rng, -9, 12);
    const plus = rng() < 0.5;
    expr = `${a}x ${plus ? "+" : MINUS} ${b}`;
    assignments = `x = ${show(x)}`;
    answer = plus ? a * x + b : a * x - b;
  } else if (level === 2) {
    // a·x ± c·y, two variables.
    const a = pick(rng, 2, 8);
    const c = pick(rng, 2, 8);
    const x = pick(rng, -8, 10);
    const y = pick(rng, -8, 10);
    const plus = rng() < 0.5;
    expr = `${a}x ${plus ? "+" : MINUS} ${c}y`;
    assignments = `x = ${show(x)} and y = ${show(y)}`;
    answer = plus ? a * x + c * y : a * x - c * y;
  } else {
    // Squared terms.
    if (rng() < 0.5) {
      // x² + b
      const b = pick(rng, 1, 12);
      const x = pick(rng, -6, 9);
      expr = `x² + ${b}`;
      assignments = `x = ${show(x)}`;
      answer = x * x + b;
    } else {
      // a² + b² (Pythagorean shape)
      const a = pick(rng, 2, 9);
      const b = pick(rng, 2, 9);
      expr = `a² + b²`;
      assignments = `a = ${show(a)} and b = ${show(b)}`;
      answer = a * a + b * b;
    }
  }

  return {
    id: `substitute-formula:${expr}@${assignments}`.replace(/\s+/g, ""),
    type: "numeric",
    prompt: `Evaluate ${expr} when ${assignments}.`,
    answer,
    tolerance: 0,
    hints: [
      "Replace each letter with its value — keep negatives in parentheses.",
      "Then follow the order of operations: powers and products before adding.",
    ],
    explanation: `Substituting gives ${answer}.`,
  };
};
