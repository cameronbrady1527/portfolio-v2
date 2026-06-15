# @cameronbrady/math-components

Accessible, interactive math components for React — a controls-first
coordinate-plane **Grapher**, a transformation-sequence puzzle
(**SequenceBuilder**), and a **SymmetryExplorer** — plus the framework-agnostic
geometry, grading, and answer-checking **logic** behind them.

Built for the [Math Resources Hub](https://resources.cameronbrady.dev) and
extracted so you can drop the same accessible interactives into your own site.

> Status: `0.x` — the API is settling. Expect small changes before `1.0`.

## Components

- **`Grapher`** — a controls-first coordinate plane that animates a geometric
  transformation (`reflection` · `translation` · `rotation` · `dilation` ·
  `stretch`) or a step-through **sequence** of them, with vertex labels, an
  optional side-length measurement layer, and an auto-generated plain-language
  caption.
- **`SequenceBuilder`** — a palette puzzle: the student composes a sequence of
  transformations to map a preimage onto a target, judged by geometric
  coincidence (not string matching).
- **`SymmetryExplorer`** — propose-and-check hunt for a figure's reflection and
  rotation symmetries.

## Install

```bash
npm install @cameronbrady/math-components
```

`react` and `react-dom` (v19+) are peer dependencies. `mafs` (the rendering
substrate) comes along automatically.

## Quick start

```tsx
import { Grapher, choose } from "@cameronbrady/math-components";
import "@cameronbrady/math-components/styles.css"; // once, anywhere

export function ReflectionDemo() {
  return (
    <Grapher
      spec={{
        preimage: {
          type: "polygon",
          label: "T",
          vertices: [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 2, y: 4 },
          ],
        },
        transform: {
          kind: "reflection",
          // a labeled, keyboard-operable <select> the student drives
          over: { kind: "axis", axis: choose("x", ["x", "y"], "Reflect over") },
        },
      }}
      onChange={({ image }) => {
        /* react to the transformed figure */
      }}
    />
  );
}
```

Wrap a parameter in `slider(...)` or `choose(...)` and the Grapher renders a
native control for it that drives the figure live. Leave it as a plain value to
keep it fixed.

## Accessibility

Accessibility is a first-class promise here, not an afterthought:

- **Controls-first.** Native `<input type="range">` / `<select>` elements drive
  the figure — fully keyboard-operable. Dragging (where enabled) is only an
  enhancement on top.
- **Described figure.** Every Grapher auto-generates a plain-language
  `<figcaption>` (e.g. _“A T polygon reflected across the y-axis.”_) and wires it
  up via `aria-describedby`, so screen-reader users get the same information the
  visual conveys.
- **Color-independent.** Meaning never rests on color alone.

## Entry points

| Import | What you get |
|--------|--------------|
| `@cameronbrady/math-components` | `Grapher`, `SequenceBuilder`, `SymmetryExplorer` + the spec DSL (`slider`, `choose`, `GrapherSpec`, types) |
| `@cameronbrady/math-components/logic` | Framework-agnostic math (below). **No React, no mafs** — import it anywhere. |
| `@cameronbrady/math-components/styles.css` | The self-contained, scoped stylesheet |

The `/logic` entry is pure, dependency-free TypeScript:

- **Geometry** — `reflect` / `translate` / `rotate` / `dilate` / `stretch`, the
  `applyTransform` dispatcher, `applySequence` / `applyStep` for ordered
  compositions, symmetry detection (`checkSymmetry` / `allSymmetries`), and
  tolerance-based `pointsCoincide` / `shapesCoincide`.
- **Grading** — `grade` over `mc`, `numeric`, `expression`, and `equation`
  question types.
- **Machine-checkable algebra** — `checkExpressionAnswer` /
  `checkEquationAnswer` (plus `parseExpression`, `equationsEquivalent`, …):
  a dependency-free parser + numeric-sampling equivalence, so any algebraically
  equivalent form of an answer is accepted — no string matching.
- **Progress** — a key-agnostic store core + a `localStorage` adapter you pass
  your own key to.

Only need the math? Import from `/logic` and you won't pull React or mafs into
your bundle:

```ts
import { reflect, applyTransform } from "@cameronbrady/math-components/logic";

// "x + 4x" is accepted as equivalent to "5x" — no string matching.
import { checkExpressionAnswer } from "@cameronbrady/math-components/logic";
checkExpressionAnswer("x + 4x", "5x"); // → true
```

The progress adapter takes a storage key you supply, so it never collides with
another app's namespace:

```ts
import { loadProgress, saveProgress } from "@cameronbrady/math-components/logic";
const progress = loadProgress("my-app:progress");
```

## Theming

The stylesheet is namespaced (everything under `cbmc-`) — no global utility
classes, nothing that collides with your styles. Colors are CSS variables with
sane defaults; set any of them on an ancestor (or `:root`) to re-theme:

```css
:root {
  --cbmc-image-color: #2563eb;  /* the transformed image */
  --cbmc-grid-line: #e5e7eb;    /* graph-paper grid */
}
```

See [`src/styles.css`](./src/styles.css) for the full list. The figure still
renders correctly even without the stylesheet (every value has an inline
fallback) — importing it just adds the graph-paper background and the theming
surface.

## License

MIT © Cameron Brady
