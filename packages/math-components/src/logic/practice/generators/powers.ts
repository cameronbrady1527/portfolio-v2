import type { Problem, ProblemGenerator } from "./types";

const MINUS = "−"; // U+2212
const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Render an exponent as a superscript string (e.g. 3 → "³", 12 → "¹²"). */
function toSuperscript(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUP[Number(d)])
    .join("");
}

/**
 * Powers & exponents — evaluate a base raised to a whole-number exponent.
 * Squares and cubes first, then negative bases (parenthesized) and powers of
 * ten / larger exponents. Emits a `numeric` question with the exact value, so
 * `grade()` checks it with tolerance 0. Pure and seeded.
 */
export const powers: ProblemGenerator = (level, rng): Problem => {
  let base: number;
  let exp: number;

  if (level <= 1) {
    base = pick(rng, 2, 9);
    exp = pick(rng, 2, 3);
  } else if (level === 2) {
    base = pick(rng, 2, 6);
    exp = pick(rng, 2, 4);
    if (rng() < 0.5) base = -base; // negative bases enter here
  } else if (rng() < 0.5) {
    base = 10; // powers of ten
    exp = pick(rng, 2, 4);
  } else {
    base = pick(rng, 2, 5);
    exp = pick(rng, 4, 6); // larger exponents
  }

  const baseStr = base < 0 ? `(${MINUS}${Math.abs(base)})` : `${base}`;
  const answer = base ** exp;

  return {
    id: `powers:${base}^${exp}`,
    type: "numeric",
    prompt: `Evaluate ${baseStr}${toSuperscript(exp)}.`,
    answer,
    tolerance: 0,
    hints: [
      `The exponent counts how many times the base is multiplied by itself.`,
      base < 0
        ? "A negative base to an EVEN power is positive; to an ODD power, negative."
        : "Multiply step by step — don't multiply the base by the exponent.",
    ],
    explanation:
      base < 0
        ? `(${MINUS}${Math.abs(base)})${toSuperscript(exp)} = ${answer}.`
        : `${base}${toSuperscript(exp)} = ${answer}.`,
  };
};
