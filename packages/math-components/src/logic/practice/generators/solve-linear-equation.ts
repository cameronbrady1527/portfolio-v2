import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** A trailing "± k" term (ASCII). */
function pm(k: number): string {
  return k < 0 ? `- ${Math.abs(k)}` : `+ ${k}`;
}

/**
 * Solving linear equations by inverse operations. The solution x is chosen first
 * (any integer, including negatives), and the equation is built around it, so x
 * is always a whole number. Levels scale one-step → two-step → multi-step
 * (distribution, or x on both sides). Emits a `numeric` question (the value of
 * x), graded with tolerance 0. Pure and seeded.
 */
export const solveLinearEquation: ProblemGenerator = (level, rng): Problem => {
  let equation: string;
  let x: number;

  if (level <= 1) {
    x = pick(rng, -8, 12);
    const form = pick(rng, 0, 2);
    if (form === 0) {
      const b = pick(rng, 1, 10);
      equation = `x + ${b} = ${x + b}`;
    } else if (form === 1) {
      const b = pick(rng, 1, 10);
      equation = `x - ${b} = ${x - b}`;
    } else {
      const a = pick(rng, 2, 9);
      equation = `${a}x = ${a * x}`;
    }
  } else if (level === 2) {
    x = pick(rng, -7, 10);
    const a = pick(rng, 2, 8);
    const b = pick(rng, 1, 10);
    const minus = rng() < 0.5;
    equation = minus
      ? `${a}x - ${b} = ${a * x - b}`
      : `${a}x + ${b} = ${a * x + b}`;
  } else {
    x = pick(rng, -6, 9);
    if (rng() < 0.5) {
      // distribute: a(x + b) = c
      const a = pick(rng, 2, 6);
      const b = pick(rng, 1, 8);
      equation = `${a}(x + ${b}) = ${a * (x + b)}`;
    } else {
      // x on both sides: ax + b = dx + e
      const a = pick(rng, 3, 8);
      const d = pick(rng, 2, a - 1); // d < a so a − d ≠ 0
      const b = pick(rng, 1, 8);
      const e = (a - d) * x + b; // makes the equation true at this x
      equation = `${a}x + ${b} = ${d}x ${pm(e)}`;
    }
  }

  return {
    id: `solve-linear-equation:${equation}`.replace(/\s+/g, ""),
    type: "numeric",
    prompt: `Solve for x:  ${equation}`,
    answer: x,
    tolerance: 0,
    hints: [
      "Undo what's done to x, using inverse operations on BOTH sides.",
      "Distribute and gather the x-terms on one side first if you need to, then isolate x.",
    ],
    explanation: `x = ${x} makes the equation true.`,
  };
};
