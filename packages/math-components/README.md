# @cameronbrady/math-components

Accessible, interactive math components for React — a controls-first
coordinate-plane **Grapher** for geometric transformations, plus the
framework-agnostic geometry, grading, and progress **logic** behind it.

Built for the [Math Resources Hub](https://resources.cameronbrady.dev) and
extracted so you can drop the same accessible interactives into your own site.

> Status: `0.x` — the API is settling. Expect small changes before `1.0`.

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
| `@cameronbrady/math-components` | `Grapher` + the spec DSL (`slider`, `choose`, `GrapherSpec`, types) |
| `@cameronbrady/math-components/logic` | Framework-agnostic math: `reflect` / `translate` / `rotate` / `applyTransform`, `grade`, and a key-agnostic progress core + adapter. **No React, no mafs** — import it anywhere. |
| `@cameronbrady/math-components/styles.css` | The self-contained, scoped stylesheet |

Only need the math? Import from `/logic` and you won't pull React or mafs into
your bundle:

```ts
import { reflect, applyTransform } from "@cameronbrady/math-components/logic";
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
