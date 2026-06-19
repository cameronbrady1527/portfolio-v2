import type { PracticeQuestion } from "../grade";

/**
 * A generated practice problem IS a {@link PracticeQuestion}. That union already
 * spans `numeric` (arithmetic), `expression`/`equation` (algebra) and `mc`, so
 * generators across the whole Foundations program — signed numbers, solving for
 * x, the distributive property, … — can all emit one shape that `grade()` knows
 * how to check, with no per-generator checking logic.
 */
export type Problem = PracticeQuestion;

/**
 * A pure, seeded problem generator. `level` selects difficulty (1 = easiest and
 * scaling up); `rng` is a deterministic stream (see {@link mulberry32}) so a
 * given seed reproduces the same problem. Generators are pure — no Math.random,
 * no DOM, no clock — which is exactly what makes them unit-testable.
 */
export type ProblemGenerator = (level: number, rng: () => number) => Problem;
