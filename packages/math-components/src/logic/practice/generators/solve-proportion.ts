import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// Base ratio and multiplier ranges grow with level, keeping the numbers tidy.
function ranges(level: number): { base: number; mult: number } {
  if (level <= 1) return { base: 4, mult: 3 };
  if (level === 2) return { base: 5, mult: 4 };
  return { base: 6, mult: 6 };
}

/**
 * Solve a proportion for x. Builds a TRUE proportion (p·s)/(q·s) = (p·t)/(q·t)
 * from a base ratio p:q and two distinct multipliers, then blanks one of the
 * four numbers. Because every number is an integer product, the unknown is
 * always a whole number found by cross-multiplication. Emits a `numeric`
 * question graded with tolerance 0. Pure and seeded.
 */
export const solveProportion: ProblemGenerator = (level, rng): Problem => {
  const { base, mult } = ranges(level);
  const q = pick(rng, 2, base);
  let p = pick(rng, 1, base);
  while (p === q) p = pick(rng, 1, base); // avoid the 1:1 ratio

  const s = pick(rng, 1, mult);
  let t = pick(rng, 1, mult);
  while (t === s) t = pick(rng, 1, mult); // distinct multipliers → ratios differ

  // Proportion (p·s)/(q·s) = (p·t)/(q·t).
  const values = [p * s, q * s, p * t, q * t];
  const hidden = pick(rng, 0, 3);
  const answer = values[hidden];
  const slots = values.map((v, i) => (i === hidden ? "x" : `${v}`));

  return {
    id: `solve-proportion:${values.join("-")}@${hidden}`,
    type: "numeric",
    prompt: `Solve for x:  ${slots[0]}/${slots[1]} = ${slots[2]}/${slots[3]}`,
    answer,
    tolerance: 0,
    hints: [
      "Cross-multiply: the diagonal products are equal.",
      "Set the two cross-products equal, then divide to isolate x.",
    ],
    explanation: `Cross-multiplying ${slots[0]}/${slots[1]} = ${slots[2]}/${slots[3]} gives x = ${answer}.`,
  };
};
