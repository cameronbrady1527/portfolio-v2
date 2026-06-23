import type { Problem, ProblemGenerator } from "./types";

const ROOT = "√"; // U+221A

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function perfectSquare(n: number): Problem {
  const radicand = n * n;
  return {
    id: `square-roots:exact-${radicand}`,
    type: "numeric",
    prompt: `${ROOT}${radicand} = ?`,
    answer: n,
    tolerance: 0,
    hints: [
      `Ask: what number times itself makes ${radicand}?`,
      `${n} × ${n} = ${radicand}, so the square root is ${n}.`,
    ],
    explanation: `${ROOT}${radicand} = ${n}, because ${n}² = ${radicand}.`,
  };
}

function estimate(n: number, rng: () => number): Problem {
  // m lands strictly between n² and (n+1)², so it's never a perfect square.
  const m = n * n + pick(rng, 1, 2 * n);
  return {
    id: `square-roots:between-${m}`,
    type: "numeric",
    prompt: `${ROOT}${m} lies between which two consecutive whole numbers? Enter the smaller one.`,
    answer: n,
    tolerance: 0,
    hints: [
      `Find the nearest perfect squares below and above ${m}.`,
      `${n}² = ${n * n} and ${n + 1}² = ${(n + 1) * (n + 1)}, and ${m} is between them.`,
    ],
    explanation: `${n}² = ${n * n} < ${m} < ${(n + 1) * (n + 1)} = ${n + 1}², so ${ROOT}${m} is between ${n} and ${n + 1}.`,
  };
}

/**
 * Square roots — exact roots of perfect squares, and estimating a non-perfect
 * root between consecutive whole numbers (the Regents "between which two
 * integers" form). Emits a `numeric` question graded with tolerance 0. Pure and
 * seeded.
 */
export const squareRoots: ProblemGenerator = (level, rng): Problem => {
  if (level <= 1) {
    return perfectSquare(pick(rng, 2, 9));
  }
  if (level === 2) {
    return rng() < 0.5
      ? perfectSquare(pick(rng, 2, 12))
      : estimate(pick(rng, 2, 9), rng);
  }
  return rng() < 0.5
    ? estimate(pick(rng, 2, 15), rng)
    : perfectSquare(pick(rng, 5, 15));
};
