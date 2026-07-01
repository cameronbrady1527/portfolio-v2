---
"@cameronbrady/math-components": minor
---

Add the `ProofBuilder` component — the Proofs unit's flagship two-column proof
interaction. A student meets a machine-drawn intersecting-lines figure beside a
Given/Prove table and constructs the proof by placing tiles: Level 1 supplies the
reasons for pre-printed statements, Level 2 (Parsons) orders and pairs shuffled
statement and reason tiles. Every judgement is read from the pure engine's
`gradeProof` (any valid topological order is accepted; a premature or wrongly-reasoned
row nudges back and does not seat). The figure is coordinated both ways with the
table (focus a row to glow the angles it cites; click an angle to find its rows),
fully keyboard/tap operable (no drag required), reduced-motion aware, and
colour-independent. Ships the `internal/proof-figure.ts` renderer and mounts on the
new `geometry/proofs/vertical-angles` page.
