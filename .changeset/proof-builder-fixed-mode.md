---
"@cameronbrady/math-components": minor
---

Add a `fixed` mode to `ProofBuilder` for embedding a single, illustrative proof
in content: with `fixed`, the builder never fades, offers no "Next proof", and
emits no progress — the student simply justifies each step of the given proof.
Also export the proof spec types from the package root (`ProofSpec`,
`ProofStatement`, `ProofDistractor`, `ProofFigure`, `ReasonId`, `ScaffoldLevel`)
so hosts can author fixed specs, and render a figureless spec cleanly (no stray
figure caption).
