---
"@cameronbrady/math-components": minor
---

Add the Foundations Strand 5 (Coordinate Plane) generators to the `logic` entry
point — pure, deterministic `(level, rng) => Problem` functions:

- `pointsAndQuadrants` — identify a point's quadrant from its signs, including
  the quadrant of a reflected image (numeric, 1–4).
- `distanceOnPlane` — distance between two points: axis-aligned differences and
  diagonal distances built from Pythagorean triples so the result is whole
  (numeric).
- `midpoint` — a coordinate of a segment's midpoint, built to be a whole number
  (numeric).

Every generator emits a `grade()`-checkable question; same seed reproduces the
same problem. This completes the Unit 0 (Foundations for Geometry) generator set.
