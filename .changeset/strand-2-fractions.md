---
"@cameronbrady/math-components": minor
---

Add the Foundations Strand 2 (Fractions, Ratios & Proportions) generators to the
`logic` entry point — pure, deterministic `(level, rng) => Problem` functions:

- `equivalentFractions` — fill in the missing numerator/denominator of an
  equivalent fraction (numeric).
- `addSubtractFractions` / `multiplyDivideFractions` — fraction arithmetic with
  exact reduced answers (`expression`, so any equivalent form grades correct).
- `solveProportion` — solve a proportion for x by cross-multiplication (numeric,
  whole-number unknown by construction).
- `percents` — percent of a number, "what percent", and "percent of what",
  framed as the proportion part/whole = p/100 (numeric).

Every generator emits a `grade()`-checkable question; same seed reproduces the
same problem.
