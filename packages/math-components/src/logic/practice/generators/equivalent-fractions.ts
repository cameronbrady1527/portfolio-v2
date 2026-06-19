import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// The base denominator and the scale factor both grow with level, so the
// fractions stay readable while the numbers climb.
function maxBase(level: number): number {
  if (level <= 1) return 6;
  if (level === 2) return 9;
  return 12;
}
function maxMult(level: number): number {
  if (level <= 1) return 4;
  if (level === 2) return 6;
  return 8;
}

/**
 * Equivalent fractions. Builds a proper base fraction a/b and a true equivalent
 * (a·k)/(b·k), then blanks ONE part of the equivalent and asks for it. Emits a
 * `numeric` question whose answer is that missing whole number, so `grade()`
 * checks it exactly. Pure and seeded: same `(level, rng)` → same problem.
 */
export const equivalentFractions: ProblemGenerator = (level, rng): Problem => {
  const b = pick(rng, 2, maxBase(level));
  const a = pick(rng, 1, b - 1); // proper fraction a/b
  const k = pick(rng, 2, maxMult(level)); // a real scale factor

  const num = a * k;
  const den = b * k;
  const hideDenominator = rng() < 0.5;

  // Show one part of the equivalent fraction, blank the other.
  const target = hideDenominator ? `${num}/?` : `?/${den}`;
  const answer = hideDenominator ? den : num;
  const filled = `${num}/${den}`;

  return {
    id: `equivalent-fractions:${a}-${b}-${k}-${hideDenominator ? "d" : "n"}`,
    type: "numeric",
    prompt: `Find the missing number:  ${a}/${b} = ${target}`,
    answer,
    tolerance: 0,
    hints: [
      `Ask what ${b} was multiplied by to get ${den}${hideDenominator ? "" : ` — the same factor scales the top`}.`,
      "Equivalent fractions scale the numerator and denominator by the SAME number.",
    ],
    explanation: `${a}/${b} = ${filled}: multiply the top and bottom of ${a}/${b} by ${k}.`,
  };
};
