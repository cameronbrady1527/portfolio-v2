# @cameronbrady/math-components

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
