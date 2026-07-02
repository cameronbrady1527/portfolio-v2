---
"@cameronbrady/math-components": minor
---

Add the `segment-addition` and `angle-addition` proof families and their shared
figure primitives. Two pure, seeded `ProofFamily` generators build two-column
proofs on collinear points (Segment Addition Postulate) and on rays from a vertex
(Angle Addition Postulate), structurally varied across build-up, break-down,
perpendicular right-angle, and transitive midpoint/bisector templates, with
distractors gated to level ≥ 3 and property-tested to grade valid under any
topological order across levels 1–4.

Extends `ProofFigure` with two additive variants — `points-on-line` (labelled
collinear points with congruence ticks) and `rays-from-point` (rays from a shared
vertex with congruence arcs and right-angle squares) — plus pure builders
(`buildPointsOnLine`, `buildRaysFromPoint`) and coordinated figure↔table
highlighting in `ProofBuilder`. Ships the `segment-addition` and `angle-addition`
topic pages.
