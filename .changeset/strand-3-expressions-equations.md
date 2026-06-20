---
"@cameronbrady/math-components": minor
---

Add the Foundations Strand 3 (Expressions & Equations) generators to the `logic`
entry point — pure, deterministic `(level, rng) => Problem` functions:

- `substituteFormula` — substitute values (including negatives) into an
  expression or formula and evaluate (numeric).
- `simplifyExpression` — combine like terms and distribute, giving the simplified
  `px + q` (`expression`).
- `solveLinearEquation` — solve a linear equation for x by inverse operations
  (one-step → two-step → multi-step with distribution / variables on both sides);
  the solution is a whole number by construction (numeric).

Every generator emits a `grade()`-checkable question; same seed reproduces the
same problem.
