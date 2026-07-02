---
"@cameronbrady/math-components": minor
---

Add a `familyPool` prop to `ProofBuilder` for interleaved practice: when given a
list of family ids, each generated proof (initial and every "Next proof") is
drawn from the pool by an independent hash of the seed, so the student meets a
random proof type each round — the anti-gaming, strategy-selection drill that
powers the Proofs unit's mixed-practice capstone.
