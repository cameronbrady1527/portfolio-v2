---
"@cameronbrady/math-components": minor
---

Add the Triangle Congruence (C5) unit — four interactive components plus the pure geometry core behind them.

- **Components:** `CongruenceByMotion` (a narrated rigid-motion superposition that establishes the definition of congruence), `CongruenceCriteria` (the inquiry hinge tool — rigid criteria that snap back, the SSA 0→1→2 ambiguous-case regime with the HL-is-the-boundary insight, and AAA scaling; all verdicts read from the geometry core), `CPCTC` (a correspondence-reader that forces reading the congruence statement rather than eyeballing position), and `CongruenceChecker` (a capstone that names the certifying criterion for a pair of triangles).
- **Pure core** (`/logic` entry point): `solutionCount(criterion, parts)`, `solveTriangles(criterion, parts)`, and `congruenceCheck(t1, t2)` — the property-tested `congruence.ts` module that decides whether a set of parts determines a triangle and, if two triangles are congruent, under which correspondence and criterion.
- **Marking primitives:** `angleArcs` (concentric equal-angle marks) and `rightAngleSquare`, joining the existing side-tick helpers, so every tool speaks one congruence-marking vocabulary (redundant colour + hatch/arc-count encoding).
