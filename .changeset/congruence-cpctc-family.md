---
"@cameronbrady/math-components": minor
---

Add the `congruence-cpctc` proof family plus a triangle-pair figure for the
`ProofBuilder`. The pure, seeded generator proves two triangles congruent by the
criterion the givens force — **SSS**, **SAS**, or **ASA** — and then concludes a
pair of corresponding parts congruent by **CPCTC**. The structure varies in ways
that change the DAG: the criterion (which alters the congruence row's reason and
which prerequisite rows exist, including a derived pair of right angles via
"all right angles are congruent"), the given/prove split, and the goal (a
corresponding angle vs a corresponding segment). Distractors gate in at level ≥ 3
(a wrong-correspondence CPCTC conclusion, a scrambled-correspondence congruence).

A new `triangle-pair` `ProofFigure` variant draws two congruent triangles with
standard congruence markings — matching tick counts on congruent sides, matching
arc counts on congruent angles, and a right-angle square where relevant — built
additively in `internal/proof-figure.ts` (`buildTrianglePair`, reusing
`triangleFromSSS` and the `sideTicks` / `angleArcs` / `rightAngleSquare` marking
primitives) and rendered in `ProofBuilder` with coordinated letter-based
highlight (focus a row to glow the parts it cites; click a vertex to find its
rows). Mounts on the new `geometry/proofs/congruent-triangles` page.
