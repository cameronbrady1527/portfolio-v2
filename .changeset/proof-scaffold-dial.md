---
"@cameronbrady/math-components": minor
---

Complete the `ProofBuilder` scaffold dial (Levels 3–4) with an adaptive fade. At
Level 3 the statement and reason banks gain the engine's plausible distractor
tiles (a distractor is rejected on placement and nudges without seating) while
per-row feedback and the coordinated figure highlight stay on. Level 4 (mastery)
shows the full bank at minimal scaffold: the figure highlight turns OFF and
feedback goes HOLISTIC — the student assembles the whole proof (rows seat without
per-row gating), presses Submit for one whole-DAG verdict against `gradeProof`,
wrong rows are flagged, and retry keeps the sound prefix. Within a practice set
the difficulty AUTO-FADES: two clean completions at a level advance the next
generated proof (fresh seed) one step, and a clean Level-4 pass marks the family
"comfortable". Persistence is delegated to the host via new pure hooks
(`onProgressChange` / `onStartOver`, `initialCompletions` / `initialComfortable`,
`ProofProgressSnapshot`), so the package stays storage-free. The current level,
completions, comfortable flag, submission state, and flagged rows are surfaced on
`data-cbmc-*` attributes.
