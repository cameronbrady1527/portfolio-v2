---
"@cameronbrady/math-components": minor
---

Add the Foundations `slope` generator to the `logic` entry point — a pure,
deterministic `(level, rng) => Problem` function:

- `slope` — the slope of the line through two lattice points, slope = rise/run =
  Δy/Δx. Level 1 gives positive integer slopes; level 2 adds zero (horizontal)
  and negative slopes; level 3 gives reduced fractional slopes. It never emits a
  vertical line (undefined slope); that special case lives in the mastery deck as
  a multiple-choice item. Answers are `expression`-typed so an integer ("3") and
  a fraction ("2/3") grade through one path and any equivalent value counts.

Same seed reproduces the same problem. This extends the Unit 0 (Foundations for
Geometry) Coordinate Plane strand with the Slope Skill Card.
