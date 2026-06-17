import type { Problem, ProblemGenerator } from "./types";

// Typographic operators, so prompts read like real math — "7 × 8", "56 ÷ 8".
const TIMES = "×"; // U+00D7
const DIVIDE = "÷"; // U+00F7

// Factor magnitude grows with level: single-digit times tables first, then
// through 12, then into two-digit factors. Division is always built from a
// clean product, so every quotient is exact at every level.
function maxFactor(level: number): number {
  if (level <= 1) return 9; // single-digit times tables
  if (level === 2) return 12; // the full tables
  return 20; // two-digit factors
}

/** Integer in [lo, hi] drawn from the seeded stream. */
function pickRange(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/**
 * Multiplication & division fact fluency. Emits a `numeric` question whose
 * stated answer is the exact result. Division problems are constructed from a
 * product (dividend = divisor × quotient), so the answer is always a whole
 * number and `grade()` checks it with tolerance 0. Pure and seeded.
 */
export const multDiv: ProblemGenerator = (level, rng): Problem => {
  const max = maxFactor(level);
  const isMultiply = rng() < 0.5;

  if (isMultiply) {
    const a = pickRange(rng, 2, max);
    const b = pickRange(rng, 2, max);
    const answer = a * b;
    return {
      id: `mult-div:${a}x${b}`,
      type: "numeric",
      prompt: `${a} ${TIMES} ${b} = ?`,
      answer,
      tolerance: 0,
      hints: [
        `Think of it as ${a} groups of ${b} (or ${b} groups of ${a}).`,
        "Lean on a fact you know: build up from a nearby times-table fact.",
      ],
      explanation: `${a} ${TIMES} ${b} = ${answer}.`,
    };
  }

  // Build division from a known product so the quotient is always exact.
  const divisor = pickRange(rng, 2, max);
  const quotient = pickRange(rng, 2, max);
  const dividend = divisor * quotient;
  return {
    id: `mult-div:${dividend}d${divisor}`,
    type: "numeric",
    prompt: `${dividend} ${DIVIDE} ${divisor} = ?`,
    answer: quotient,
    tolerance: 0,
    hints: [
      `Ask: ${divisor} times what makes ${dividend}?`,
      "Division undoes multiplication — reach for the matching times-table fact.",
    ],
    explanation: `${dividend} ${DIVIDE} ${divisor} = ${quotient}, because ${divisor} ${TIMES} ${quotient} = ${dividend}.`,
  };
};
