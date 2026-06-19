import type { Problem, ProblemGenerator } from "./types";

// Typographic operators so prompts read like real math.
const TIMES = "×"; // U+00D7
const DIVIDE = "÷"; // U+00F7
const MINUS = "−"; // U+2212
const SQ = "²"; // U+00B2

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Choose one of `n` forms from the seeded stream. */
function choose(rng: () => number, n: number): number {
  return Math.floor(rng() * n);
}

// Each form BUILDS an expression from seeded operands AND computes its own
// answer by the known structure — never by parsing — so the generator is the
// source of truth and the test re-checks it with real operator precedence.

// Level 1: precedence of × ÷ over + −, no parentheses, no exponents.
function level1(rng: () => number): { prompt: string; answer: number } {
  const form = choose(rng, 4);
  if (form === 0) {
    const a = pick(rng, 2, 12);
    const b = pick(rng, 2, 9);
    const c = pick(rng, 2, 9);
    return { prompt: `${a} + ${b} ${TIMES} ${c}`, answer: a + b * c };
  }
  if (form === 1) {
    const a = pick(rng, 2, 9);
    const b = pick(rng, 2, 9);
    const c = pick(rng, 2, 12);
    return { prompt: `${a} ${TIMES} ${b} + ${c}`, answer: a * b + c };
  }
  if (form === 2) {
    const a = pick(rng, 3, 9);
    const b = pick(rng, 2, 9);
    const product = a * b;
    const c = pick(rng, 2, Math.min(12, product - 1)); // keep it non-negative
    return { prompt: `${a} ${TIMES} ${b} ${MINUS} ${c}`, answer: product - c };
  }
  // a + b ÷ c, built from a clean quotient.
  const a = pick(rng, 2, 12);
  const c = pick(rng, 2, 6);
  const q = pick(rng, 2, 6);
  const b = c * q;
  return { prompt: `${a} + ${b} ${DIVIDE} ${c}`, answer: a + q };
}

// Level 2: parentheses change the result.
function level2(rng: () => number): { prompt: string; answer: number } {
  const form = choose(rng, 4);
  if (form === 0) {
    const a = pick(rng, 2, 9);
    const b = pick(rng, 2, 9);
    const c = pick(rng, 2, 9);
    return { prompt: `(${a} + ${b}) ${TIMES} ${c}`, answer: (a + b) * c };
  }
  if (form === 1) {
    const a = pick(rng, 5, 14);
    const b = pick(rng, 2, a - 1); // a > b, stays non-negative
    const c = pick(rng, 2, 9);
    return { prompt: `(${a} ${MINUS} ${b}) ${TIMES} ${c}`, answer: (a - b) * c };
  }
  if (form === 2) {
    const a = pick(rng, 2, 9);
    const b = pick(rng, 2, 9);
    const c = pick(rng, 2, 9);
    return { prompt: `${a} ${TIMES} (${b} + ${c})`, answer: a * (b + c) };
  }
  // (a + b) ÷ c, sum built as a clean multiple of c.
  const c = pick(rng, 2, 6);
  const q = pick(rng, 2, 6);
  const sum = c * q;
  const a = pick(rng, 2, sum - 2);
  const b = sum - a;
  return { prompt: `(${a} + ${b}) ${DIVIDE} ${c}`, answer: q };
}

// Level 3: exponents enter the mix.
function level3(rng: () => number): { prompt: string; answer: number } {
  const form = choose(rng, 3);
  if (form === 0) {
    const a = pick(rng, 2, 20);
    const b = pick(rng, 2, 9);
    return { prompt: `${a} + ${b}${SQ}`, answer: a + b * b };
  }
  if (form === 1) {
    const a = pick(rng, 2, 6);
    const b = pick(rng, 2, 6);
    const base = a + b;
    const c = pick(rng, 2, Math.min(20, base * base - 1)); // non-negative
    return { prompt: `(${a} + ${b})${SQ} ${MINUS} ${c}`, answer: base * base - c };
  }
  // a² − b × c, kept non-negative.
  const a = pick(rng, 4, 12);
  const square = a * a;
  const b = pick(rng, 2, 9);
  const c = pick(rng, 2, Math.max(2, Math.floor((square - 1) / b)));
  return { prompt: `${a}${SQ} ${MINUS} ${b} ${TIMES} ${c}`, answer: square - b * c };
}

/**
 * Order-of-operations evaluation. Emits a `numeric` question whose stated answer
 * is the value under correct precedence (PEMDAS). Operands are chosen so every
 * result is a whole number (division is built from clean quotients; subtraction
 * stays non-negative), so `grade()` checks it with tolerance 0. Pure and seeded.
 */
export const orderOfOperations: ProblemGenerator = (level, rng): Problem => {
  const { prompt, answer } =
    level <= 1 ? level1(rng) : level === 2 ? level2(rng) : level3(rng);

  return {
    id: `order-of-operations:${prompt.replace(/\s+/g, "")}`,
    type: "numeric",
    prompt: `${prompt} = ?`,
    answer,
    tolerance: 0,
    hints: [
      "PEMDAS: Parentheses, then Exponents, then Multiply/Divide (left to right), then Add/Subtract (left to right).",
      "Do one operation at a time and rewrite the whole expression after each step.",
    ],
    explanation: `Following order of operations, ${prompt} = ${answer}.`,
  };
};
