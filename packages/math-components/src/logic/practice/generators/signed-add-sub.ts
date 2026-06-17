import type { Problem, ProblemGenerator } from "./types";

// Typographic minus (U+2212), so prompts read like real math — "−7", not "-7".
const MINUS = "−";

/** A leading term: bare, with a typographic minus for negatives. */
function lead(n: number): string {
  return n < 0 ? `${MINUS}${Math.abs(n)}` : `${n}`;
}

/** A following operand: negatives are parenthesized so "−7 − (−3)" reads right. */
function operand(n: number): string {
  return n < 0 ? `(${MINUS}${Math.abs(n)})` : `${n}`;
}

// Operand magnitude grows with level. The hard signed cases — a negative
// leading term, subtracting a negative — are present at every level; only the
// numbers get bigger, so fluency builds before the magnitude does.
function maxMagnitude(level: number): number {
  if (level <= 1) return 9; // single digit
  if (level === 2) return 20;
  return 50;
}

/** Integer in [-max, max] drawn from the seeded stream. */
function pick(rng: () => number, max: number): number {
  return Math.round(rng() * 2 * max) - max;
}

/**
 * Signed integer addition & subtraction. Emits a `numeric` question whose stated
 * answer is the exact arithmetic result, so `grade()` checks it with tolerance 0
 * and no new logic. Pure and seeded: same `(level, rng)` → same problem.
 */
export const signedAddSub: ProblemGenerator = (level, rng): Problem => {
  const max = maxMagnitude(level);
  const a = pick(rng, max);
  const b = pick(rng, max);
  const isAdd = rng() < 0.5;
  const op = isAdd ? "+" : MINUS;
  const answer = isAdd ? a + b : a - b;

  const promptCore = `${lead(a)} ${op} ${operand(b)}`;
  const move = isAdd
    ? b >= 0
      ? `right ${b}`
      : `left ${Math.abs(b)}`
    : b >= 0
      ? `left ${b}`
      : `right ${Math.abs(b)}`;

  return {
    id: `signed-add-sub:${a}${isAdd ? "+" : "-"}${b}`,
    type: "numeric",
    prompt: `${promptCore} = ?`,
    answer,
    tolerance: 0,
    hints: [
      `Picture a number line. Start at ${lead(a)}, then move ${move}.`,
      "Subtracting a negative is the same as adding its opposite, and adding a negative is the same as subtracting.",
    ],
    explanation: `${promptCore} = ${lead(answer)}.`,
  };
};
