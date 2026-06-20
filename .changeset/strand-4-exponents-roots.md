---
"@cameronbrady/math-components": minor
---

Add the Foundations Strand 4 (Exponents & Roots) generators to the `logic` entry
point — pure, deterministic `(level, rng) => Problem` functions:

- `powers` — evaluate a base raised to a whole-number exponent, including
  negative bases and powers of ten (numeric).
- `squareRoots` — exact roots of perfect squares and estimating a non-perfect
  root between consecutive whole numbers (numeric).
- `exponentRules` — the product, quotient, and power-of-a-power laws, asked for
  the resulting exponent (numeric).

Every generator emits a `grade()`-checkable question; same seed reproduces the
same problem.
