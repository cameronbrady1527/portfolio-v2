---
"@cameronbrady/math-components": minor
---

Initial release (0.1.0). Accessible, interactive math components:

- `Grapher` — a controls-first coordinate-plane transformations visualizer
  (reflection / translation / rotation) with an auto-generated a11y caption.
- A declarative spec DSL (`slider`, `choose`, `GrapherSpec`).
- `/logic` subpath — framework-agnostic geometry (`reflect`/`translate`/
  `rotate`/`applyTransform`), answer `grade`, and a key-agnostic `progress`
  core + storage adapter (no React, no mafs).
- A self-contained, scoped, themeable stylesheet (`/styles.css`).
- ESM + CJS + types; `react`/`react-dom` as peers.
