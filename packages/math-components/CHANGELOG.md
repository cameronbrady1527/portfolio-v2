# @cameronbrady/math-components

## 0.5.0

### Minor Changes

- 4bdc62f: Add the `congruence-cpctc` proof family plus a triangle-pair figure for the
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

- e36e1b0: Add the `ProofBuilder` component — the Proofs unit's flagship two-column proof
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
- 778d484: Add a `familyPool` prop to `ProofBuilder` for interleaved practice: when given a
  list of family ids, each generated proof (initial and every "Next proof") is
  drawn from the pool by an independent hash of the seed, so the student meets a
  random proof type each round — the anti-gaming, strategy-selection drill that
  powers the Proofs unit's mixed-practice capstone.
- ae5bd6d: Add a `fixed` mode to `ProofBuilder` for embedding a single, illustrative proof
  in content: with `fixed`, the builder never fades, offers no "Next proof", and
  emits no progress — the student simply justifies each step of the given proof.
  Also export the proof spec types from the package root (`ProofSpec`,
  `ProofStatement`, `ProofDistractor`, `ProofFigure`, `ReasonId`, `ScaffoldLevel`)
  so hosts can author fixed specs, and render a figureless spec cleanly (no stray
  figure caption).
- 4bdc62f: Complete the `ProofBuilder` scaffold dial (Levels 3–4) with an adaptive fade. At
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
- 4bdc62f: Add the `segment-addition` and `angle-addition` proof families and their shared
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

- 2253476: Add the two-column proof engine foundation (`logic/geometry/proof.ts`): `ProofSpec`/`ProofFamily`/`ReasonId`/`ScaffoldLevel` types, the SME-ratified reason bank (`REASON_LABELS`), a dependency-graph `gradeProof` that accepts any valid ordering (reason-id sets + alternative derivation paths), the `generateProof` family registry, and the property-tested `vertical-angles` reference family.
- 4bdc62f: Add the `what-is-a-proof` proof family — the simplest on-ramp to the two-column form: a figureless algebraic proof that, given a linear equation, proves `x = k` justified line-by-line by the Properties of Equality. Pure and seeded like every `ProofFamily`, with structural variation across seeds (one-/two-/three-step forms; Addition, Subtraction, Multiplication, Division, and Distributive properties; varied integer coefficients and solutions) and level-gated distractors. Registered in the `generateProof` family map and exported from the `/logic` and `/logic/geometry` barrels. The accompanying `geometry/proofs/what-is-a-proof.mdx` page mounts the figureless `ProofBuilder` for this family.

## 0.4.0

### Minor Changes

- e731bbc: Add the Triangle Congruence (C5) unit — four interactive components plus the pure geometry core behind them.
  - **Components:** `CongruenceByMotion` (a narrated rigid-motion superposition that establishes the definition of congruence), `CongruenceCriteria` (the inquiry hinge tool — rigid criteria that snap back, the SSA 0→1→2 ambiguous-case regime with the HL-is-the-boundary insight, and AAA scaling; all verdicts read from the geometry core), `CPCTC` (a correspondence-reader that forces reading the congruence statement rather than eyeballing position), and `CongruenceChecker` (a capstone that names the certifying criterion for a pair of triangles).
  - **Pure core** (`/logic` entry point): `solutionCount(criterion, parts)`, `solveTriangles(criterion, parts)`, and `congruenceCheck(t1, t2)` — the property-tested `congruence.ts` module that decides whether a set of parts determines a triangle and, if two triangles are congruent, under which correspondence and criterion.
  - **Marking primitives:** `angleArcs` (concentric equal-angle marks) and `rightAngleSquare`, joining the existing side-tick helpers, so every tool speaks one congruence-marking vocabulary (redundant colour + hatch/arc-count encoding).

## 0.3.0

### Minor Changes

- 47d4c71: Add the Foundations `slope` generator to the `logic` entry point — a pure,
  deterministic `(level, rng) => Problem` function:
  - `slope` — the slope of the line through two lattice points, slope = rise/run =
    Δy/Δx. Level 1 gives positive integer slopes; level 2 adds zero (horizontal)
    and negative slopes; level 3 gives reduced fractional slopes. It never emits a
    vertical line (undefined slope); that special case lives in the mastery deck as
    a multiple-choice item. Answers are `expression`-typed so an integer ("3") and
    a fraction ("2/3") grade through one path and any equivalent value counts.

  Same seed reproduces the same problem. This extends the Unit 0 (Foundations for
  Geometry) Coordinate Plane strand with the Slope Skill Card.

- 49e3983: Add the Foundations Strand 2 (Fractions, Ratios & Proportions) generators to the
  `logic` entry point — pure, deterministic `(level, rng) => Problem` functions:
  - `equivalentFractions` — fill in the missing numerator/denominator of an
    equivalent fraction (numeric).
  - `addSubtractFractions` / `multiplyDivideFractions` — fraction arithmetic with
    exact reduced answers (`expression`, so any equivalent form grades correct).
  - `solveProportion` — solve a proportion for x by cross-multiplication (numeric,
    whole-number unknown by construction).
  - `percents` — percent of a number, "what percent", and "percent of what",
    framed as the proportion part/whole = p/100 (numeric).

  Every generator emits a `grade()`-checkable question; same seed reproduces the
  same problem.

- caa443f: Add the Foundations Strand 3 (Expressions & Equations) generators to the `logic`
  entry point — pure, deterministic `(level, rng) => Problem` functions:
  - `substituteFormula` — substitute values (including negatives) into an
    expression or formula and evaluate (numeric).
  - `simplifyExpression` — combine like terms and distribute, giving the simplified
    `px + q` (`expression`).
  - `solveLinearEquation` — solve a linear equation for x by inverse operations
    (one-step → two-step → multi-step with distribution / variables on both sides);
    the solution is a whole number by construction (numeric).

  Every generator emits a `grade()`-checkable question; same seed reproduces the
  same problem.

- 73dc4e0: Add the Foundations Strand 4 (Exponents & Roots) generators to the `logic` entry
  point — pure, deterministic `(level, rng) => Problem` functions:
  - `powers` — evaluate a base raised to a whole-number exponent, including
    negative bases and powers of ten (numeric).
  - `squareRoots` — exact roots of perfect squares and estimating a non-perfect
    root between consecutive whole numbers (numeric).
  - `exponentRules` — the product, quotient, and power-of-a-power laws, asked for
    the resulting exponent (numeric).

  Every generator emits a `grade()`-checkable question; same seed reproduces the
  same problem.

- 09ad7f4: Add the Foundations Strand 5 (Coordinate Plane) generators to the `logic` entry
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

- 46d2b46: Add the Foundations (Unit 0) practice toolkit to the `logic` entry point:
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

## 0.2.1

### Patch Changes

- 79044d7: Triangle tools now show congruence (hatch) tick marks on equal sides and label
  each side with its length.
  - `TriangleLab`, `ExteriorAngle`, and `TriangleInequality` draw dynamic
    single/double/triple hatch marks on sides that share a length, so dragging the
    figure into an isosceles or equilateral shape reads as congruent at a glance.
    Marks appear only in the resting state and are drawn in figure ink.
    (`IsoscelesTriangle` and `Midsegment` keep their existing marks.)
  - `TriangleInequality` labels each stick with its measured length (e.g. `a = 6`).

## 0.2.0

### Minor Changes

- 69a96e2: Add AngleExplorer (vertical-angles lens) + the angles geometry module
- b421679: Add TriangleLab (angle-sum invariance lens) + the triangle geometry module

## 0.1.1

### Patch Changes

- 689cbce: Docs: expand the README to document the full published surface — the
  `SequenceBuilder` and `SymmetryExplorer` components, all five Grapher transform
  kinds plus step-through sequences, and the complete `/logic` API (dilation /
  stretch, sequence composition, symmetry detection, coincidence helpers, the
  `expression`/`equation` grading types, and the machine-checkable
  expression/equation equivalence engine).

## 0.1.0

### Minor Changes

- 668a74f: Initial release (0.1.0). Accessible, interactive math components, with a
  framework-agnostic logic core that carries no React and no mafs.

  **Components** (main entry):
  - `Grapher` — a controls-first coordinate-plane transformations visualizer
    (reflection / translation / rotation / dilation / stretch) with an
    auto-generated a11y caption, a stable viewport, vertex labels, an optional
    side-length measurement layer, and step-through support for transform
    sequences.
  - `SequenceBuilder` — a palette puzzle for composing a sequence of
    transformations, judged by geometric coincidence (not string match).
  - `SymmetryExplorer` — propose-and-check hunt for a figure's reflection and
    rotation symmetries.
  - A declarative spec DSL (`slider`, `choose`, `GrapherSpec`).
  - A self-contained, scoped, themeable stylesheet (`/styles.css`).

  **`/logic` subpath** — framework-agnostic, dependency-free:
  - Pure geometry: `reflect` / `translate` / `rotate` / `dilate` / `stretch`,
    the `applyTransform` dispatcher, `applySequence` / `applyStep`, symmetry
    detection (`checkSymmetry` / `allSymmetries`), and tolerance-based
    `pointsCoincide` / `shapesCoincide`.
  - Practice grading: `grade` over multiple-choice, numeric, **expression**, and
    **equation** question types, plus a key-agnostic `progress` core and
    storage adapter.
  - Machine-checkable expression/equation answers via a dependency-free
    tokenizer / recursive-descent parser / evaluator and numeric-sampling
    equivalence (`parseExpression`, `parseEquation`, `evaluate`,
    `expressionsEquivalent`, `equationsEquivalent`, `checkExpressionAnswer`,
    `checkEquationAnswer`) — any algebraically equivalent form is accepted.

  ESM + CJS + types; `react`/`react-dom` as peers; `mafs` and `lucide-react` as
  the only runtime dependencies.
