import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** Canonical "px + q" / "px - q" / "px" (ASCII, so the expression engine parses it). */
function termString(p: number, q: number): string {
  if (q > 0) return `${p}x + ${q}`;
  if (q < 0) return `${p}x - ${Math.abs(q)}`;
  return `${p}x`;
}

/**
 * Simplifying linear expressions: combining like terms and the distributive
 * property (and both together at level 3). The answer is the simplified
 * `px + q`. Emits an `expression` question; `grade()` accepts any equivalent
 * form — in the low-stakes drill that's fine (the mastery deck asks for a
 * specific coefficient/constant for full rigor). Pure and seeded.
 */
export const simplifyExpression: ProblemGenerator = (level, rng): Problem => {
  let prefix: "Simplify" | "Expand";
  let messy: string;
  let p: number;
  let q: number;

  if (level <= 1) {
    // Combine like terms: Ax + B + Cx → (A+C)x + B
    const a = pick(rng, 2, 6);
    const c = pick(rng, 2, 6);
    const b = pick(rng, 1, 9);
    prefix = "Simplify";
    messy = `${a}x + ${b} + ${c}x`;
    p = a + c;
    q = b;
  } else if (level === 2) {
    // Distribute: A(x ± B) → Ax ± AB
    const a = pick(rng, 2, 6);
    const b = pick(rng, 1, 8);
    const plus = rng() < 0.5;
    prefix = "Expand";
    messy = `${a}(x ${plus ? "+" : "-"} ${b})`;
    p = a;
    q = plus ? a * b : -a * b;
  } else if (rng() < 0.5) {
    // Distribute then combine: A(x + B) + Cx → (A+C)x + AB
    const a = pick(rng, 2, 5);
    const b = pick(rng, 1, 6);
    const c = pick(rng, 2, 5);
    prefix = "Simplify";
    messy = `${a}(x + ${b}) + ${c}x`;
    p = a + c;
    q = a * b;
  } else {
    // Distribute then add a constant: A(x + B) + C → Ax + (AB + C)
    const a = pick(rng, 2, 5);
    const b = pick(rng, 1, 6);
    const c = pick(rng, 1, 8);
    prefix = "Simplify";
    messy = `${a}(x + ${b}) + ${c}`;
    p = a;
    q = a * b + c;
  }

  const answer = termString(p, q);
  return {
    id: `simplify-expression:${messy}`.replace(/\s+/g, ""),
    type: "expression",
    prompt: `${prefix}: ${messy}`,
    answer,
    hints: [
      "Distribute across any parentheses first (multiply the outside number in).",
      "Then add the x-terms together and the plain numbers together — separately.",
    ],
    explanation: `${prefix === "Expand" ? "Expanding" : "Simplifying"} gives ${answer}.`,
  };
};
