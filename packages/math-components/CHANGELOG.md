# @cameronbrady/math-components

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
