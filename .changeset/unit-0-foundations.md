---
"@cameronbrady/math-components": minor
---

Add the Foundations (Unit 0) practice toolkit to the `logic` entry point:

- **Seeded problem generators** (`(level, rng) => Problem`, pure and
  deterministic): `signedAddSub`, `multDiv`, `orderOfOperations`, and
  `rounding`, plus the shared `Problem` / `ProblemGenerator` types.
- **`mulberry32`** seeded PRNG for reproducible practice streams.
- **Drill fluency state machine** — `initFluency` / `fluencyReducer` with
  `DEFAULT_FLUENCY_THRESHOLD` and the `FluencyState` / `FluencyEvent` types.
- **Per-skill mastery flag** on progress — `recordMastery`, `isMastered`,
  `countMastered`.

Every generator emits a `grade()`-checkable question, so the same seed always
reproduces the same problem and every stated answer is machine-verifiable.
