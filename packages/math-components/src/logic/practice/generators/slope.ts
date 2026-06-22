import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function choose<T>(rng: () => number, xs: readonly T[]): T {
  return xs[pick(rng, 0, xs.length - 1)];
}
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// Reduced fractional slopes (numerator, denominator) in lowest terms — the
// level-3 pool. A sign is applied separately, so denominators stay positive.
const FRACTIONS: readonly [number, number][] = [
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [1, 4],
  [3, 2],
  [2, 5],
  [4, 3],
  [5, 3],
];

/**
 * Format a reduced slope rise/run as the canonical answer string. Integers come
 * out bare ("3", "-2", "0"); fractions as "num/den" with the sign on the
 * numerator ("2/3", "-3/4"). ASCII minus so the expression engine parses it.
 */
function slopeAnswer(rise: number, run: number): string {
  const sign = rise < 0 ? -1 : 1;
  const g = gcd(Math.abs(rise), run) || 1;
  const num = Math.abs(rise) / g;
  const den = run / g;
  if (num === 0) return "0";
  if (den === 1) return `${sign < 0 ? "-" : ""}${num}`;
  return `${sign < 0 ? "-" : ""}${num}/${den}`;
}

/**
 * Slope of the line through two lattice points — slope = rise/run = Δy/Δx. The
 * generator never emits a vertical line (Δx = 0, undefined slope): that special
 * case is covered in the mastery deck as a multiple-choice item, since it has no
 * numeric answer to type. Levels: 1 = positive integer slopes; 2 = adds
 * negatives and zero (horizontal lines); 3 = reduced fractional slopes. Emits an
 * `expression` answer so an integer ("3") and a fraction ("2/3") grade through
 * one path — and any equivalent value counts, which is exactly right for "find
 * the slope". Pure and seeded.
 */
export const slope: ProblemGenerator = (level, rng): Problem => {
  const x1 = pick(rng, -5, 4);
  const y1 = pick(rng, -5, 5);

  let run: number;
  let rise: number;

  if (level <= 1) {
    // Positive integer slope: rise = m · run, m ≥ 1.
    run = pick(rng, 1, 3);
    rise = run * pick(rng, 1, 4);
  } else if (level === 2) {
    // Integer slope including zero and negatives.
    run = pick(rng, 1, 3);
    rise = run * pick(rng, -4, 4);
  } else {
    // Reduced fraction slope, either sign.
    const [num, den] = choose(rng, FRACTIONS);
    const s = rng() < 0.5 ? 1 : -1;
    run = den;
    rise = s * num;
  }

  const x2 = x1 + run; // run > 0 always, so the points never coincide vertically
  const y2 = y1 + rise;
  const answer = slopeAnswer(rise, run);

  return {
    id: `slope:${x1}.${y1}-${x2}.${y2}`,
    type: "expression",
    prompt: `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
    answer,
    hints: [
      "Slope = rise / run = (change in y) / (change in x).",
      `Δy = ${y2} − (${y1}) = ${y2 - y1}; Δx = ${x2} − (${x1}) = ${x2 - x1}.`,
    ],
    explanation: `slope = Δy/Δx = (${y2} − ${y1}) / (${x2} − ${x1}) = ${y2 - y1}/${x2 - x1} = ${answer}.`,
  };
};
