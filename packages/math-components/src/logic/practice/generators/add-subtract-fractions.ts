import type { Problem, ProblemGenerator } from "./types";

const MINUS = "−"; // U+2212, display only

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Render a reduced rational as the canonical answer string ("3/4", "2", "0"). */
function fractionString(n: number, d: number): string {
  if (n === 0) return "0";
  const g = gcd(n, d);
  const rn = n / g;
  const rd = d / g;
  return rd === 1 ? `${rn}` : `${rn}/${rd}`;
}

// Denominator strategy by level: same bottom, then a multiple, then unlike.
function pickDenominators(level: number, rng: () => number): [number, number] {
  if (level <= 1) {
    const b = pick(rng, 3, 8);
    return [b, b]; // like denominators
  }
  if (level === 2) {
    const b = pick(rng, 2, 6);
    return [b, b * pick(rng, 2, 3)]; // one is a multiple of the other
  }
  const b = pick(rng, 2, 8);
  let d = pick(rng, 2, 9);
  while (d === b) d = pick(rng, 2, 9); // unlike denominators
  return [b, d];
}

/**
 * Adding & subtracting fractions. Builds two proper fractions, picks + or −
 * (ordered larger − smaller so the result is never negative), and states the
 * exact value as a reduced fraction. Emits an `expression` question, so
 * `grade()` accepts any equivalent form (3/4, 6/8, 0.75). Pure and seeded.
 */
export const addSubtractFractions: ProblemGenerator = (level, rng): Problem => {
  const [b, d] = pickDenominators(level, rng);
  const isAdd = rng() < 0.5;

  let n1 = pick(rng, 1, b - 1); // proper n1/dd1
  let dd1 = b;
  let n2 = pick(rng, 1, d - 1); // proper n2/dd2
  let dd2 = d;

  // For subtraction, order so the first fraction is the larger — never negative.
  if (!isAdd && n1 * dd2 < n2 * dd1) {
    [n1, dd1, n2, dd2] = [n2, dd2, n1, dd1];
  }

  const op = isAdd ? "+" : MINUS;
  const num = isAdd ? n1 * dd2 + n2 * dd1 : n1 * dd2 - n2 * dd1;
  const den = dd1 * dd2;
  const answer = fractionString(num, den);

  const sameDen = dd1 === dd2;
  return {
    id: `add-subtract-fractions:${n1}-${dd1}${isAdd ? "p" : "m"}${n2}-${dd2}`,
    type: "expression",
    prompt: `${n1}/${dd1} ${op} ${n2}/${dd2} = ?`,
    answer,
    hints: [
      sameDen
        ? "Same bottom number — just add or subtract the tops."
        : "Different bottoms: rewrite both over a common denominator first.",
      "Combine the numerators over the common denominator, then simplify.",
    ],
    explanation: `${n1}/${dd1} ${op} ${n2}/${dd2} = ${answer}.`,
  };
};
