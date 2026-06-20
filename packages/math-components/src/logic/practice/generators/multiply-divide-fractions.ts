import type { Problem, ProblemGenerator } from "./types";

const TIMES = "×"; // U+00D7
const DIVIDE = "÷"; // U+00F7

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function fractionString(n: number, d: number): string {
  if (n === 0) return "0";
  const g = gcd(n, d);
  return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`;
}

function maxDen(level: number): number {
  if (level <= 1) return 5;
  if (level === 2) return 7;
  return 9;
}

/**
 * Multiplying & dividing fractions. Multiplication multiplies across; division
 * multiplies by the reciprocal. States the exact reduced result. Emits an
 * `expression` question, so `grade()` accepts any equivalent form. Pure and
 * seeded. Both fractions are proper, so division can give a result above 1.
 */
export const multiplyDivideFractions: ProblemGenerator = (level, rng): Problem => {
  const max = maxDen(level);
  const b = pick(rng, 2, max);
  const d = pick(rng, 2, max);
  const a = pick(rng, 1, b - 1); // proper a/b
  const c = pick(rng, 1, d - 1); // proper c/d
  const isMultiply = rng() < 0.5;

  const op = isMultiply ? TIMES : DIVIDE;
  // a/b × c/d = ac/bd ;  a/b ÷ c/d = ad/bc
  const num = isMultiply ? a * c : a * d;
  const den = isMultiply ? b * d : b * c;
  const answer = fractionString(num, den);

  return {
    id: `multiply-divide-fractions:${a}-${b}${isMultiply ? "x" : "d"}${c}-${d}`,
    type: "expression",
    prompt: `${a}/${b} ${op} ${c}/${d} = ?`,
    answer,
    hints: [
      isMultiply
        ? "Multiply straight across: tops together, bottoms together."
        : `Dividing by ${c}/${d} is multiplying by its reciprocal, ${d}/${c}.`,
      "Then simplify the result to lowest terms.",
    ],
    explanation: isMultiply
      ? `${a}/${b} ${TIMES} ${c}/${d} = ${a * c}/${b * d} = ${answer}.`
      : `${a}/${b} ${DIVIDE} ${c}/${d} = ${a}/${b} ${TIMES} ${d}/${c} = ${a * d}/${b * c} = ${answer}.`,
  };
};
