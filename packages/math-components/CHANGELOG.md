# @cameronbrady/math-components

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
