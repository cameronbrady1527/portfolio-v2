# How to add a new topic page

A topic page is one `.mdx` file. Drop it in the content tree, write the prose,
optionally add an interactive figure and a practice set, and push — the nav,
route, breadcrumb, metadata, and link preview are all derived automatically.
No registry to edit.

This is the same-night authoring path, end to end.

## 1. Create the file

Content lives at:

```
apps/resources/content/<subject>/<unit>/<topic>.mdx
```

The three path segments become the URL and the breadcrumb. For example
`content/geometry/transformations/reflections.mdx` serves
`/geometry/transformations/reflections` with breadcrumb
**Geometry / Transformations / Reflections**. Subject and unit labels are
auto-humanized from the folder names (`linear-equations` → "Linear Equations");
the topic's display name comes from frontmatter.

To add a topic to an existing unit, just add a file. To start a new unit or
subject, make the folders.

## 2. Write the frontmatter

```yaml
---
title: Reflections
order: 1
description: Flip a figure across a line and explore reflections over the axes.
---
```

- **title** — display name (heading, nav, breadcrumb, `<title>`).
- **order** — position within the unit's nav (ascending). Ties break by title.
- **description** — one sentence; used for the `<meta name="description">` and the
  OpenGraph/Twitter link-preview card. Optional but recommended.

## 3. Write the concept prose

Plain Markdown/MDX below the frontmatter. Math uses KaTeX, rendered at build
time:

- Inline: `$(x, y) \mapsto (x, -y)$`
- Block:

  ```
  $$
  (x, y) \mapsto (-x, y)
  $$
  ```

The prose renders as the first content pillar of the page.

## 4. (Optional) Add an interactive figure — `<Grapher>`

Export a `grapher` object. The TopicPage shell renders it in the figure pillar.
Import the control helpers from the Grapher's pure types module:

```mdx
import { choose, slider } from "@/components/GrapherTypes";

export const grapher = {
  spec: {
    // The shape to transform. type is "point" | "segment" | "polygon".
    preimage: {
      type: "polygon",
      vertices: [ { x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 } ],
      label: "ABC",
    },
    // One transform. Wrap a value in choose()/slider() to make it an
    // interactive, keyboard-operable control; leave it a plain literal to fix it.
    transform: {
      kind: "reflection",
      over: { kind: "axis", axis: choose("y", ["x", "y"], "Reflect over") },
    },
  },
};
```

Supported `transform` kinds:

| kind | shape | interactive params |
| --- | --- | --- |
| `reflection` | `{ kind: "reflection", over }` where `over` is `{ kind:"axis", axis:"x"\|"y" }`, `{ kind:"diagonal", slope:1\|-1 }`, or `{ kind:"linear", m, b }` | `axis` / `slope` via `choose(...)` |
| `translation` | `{ kind: "translation", by: { dx, dy } }` | `dx` / `dy` via `slider(...)` |
| `rotation` | `{ kind: "rotation", about: {x,y}, angle }` | `angle` via `choose(90, [90,180,270], "Rotate (°)")` |
| `dilation` | `{ kind: "dilation", about: {x,y}, factor }` | `factor` via `slider(...)` |
| `stretch` | `{ kind: "stretch", axis: "x"\|"y", factor }` (non-rigid, for contrast) | `axis` via `choose(...)`, `factor` via `slider(...)` |

Helpers:

- `slider(value, min, max, { step?, label? })` → a numeric slider.
- `choose(value, options, label?)` → a select over a fixed option set.

The image is computed by the pure geometry module; the figure shows the
preimage + image and a text caption for accessibility. Bounds auto-fit by
default (override with `spec.bounds`). Add `showMeasurements: true` to the
spec to label every side with its length on both preimage and image — the
clearest way to show which transforms preserve distance.

## 5. (Optional) Add a practice set — `<PracticeSet>`

Export a `practice` array. The shell renders it in the practice pillar, grades
answers, gives progressive hints + explanations, tracks score, and persists
progress to `localStorage` (keyed by the topic slug — no setup needed).

```mdx
export const practice = [
  {
    id: "reflect-x-axis",          // unique within the topic
    type: "mc",
    prompt: "Reflecting (3, 2) over the x-axis gives which point?",
    choices: ["(3, -2)", "(-3, 2)", "(2, 3)", "(-3, -2)"],
    answer: 0,                      // index into choices
    hints: ["The x-axis reflection keeps x and negates y."],
    explanation: "Over the x-axis, (x, y) ↦ (x, −y), so (3, 2) ↦ (3, −2).",
  },
  {
    id: "reflect-y-axis-numeric",
    type: "numeric",
    prompt: "Reflect (5, 1) over the y-axis. New x-coordinate?",
    answer: -5,
    tolerance: 0,                   // |response − answer| ≤ tolerance counts as correct
    unit: undefined,                // optional label shown next to the input
    hints: ["The y-axis reflection negates x and keeps y."],
    explanation: "Over the y-axis, (x, y) ↦ (−x, y), so the new x is −5.",
  },
];
```

Question shapes:

- **mc** — `{ id, type:"mc", prompt, choices: string[], answer: number, hints: string[], explanation }`
- **numeric** — `{ id, type:"numeric", prompt, answer: number, tolerance: number, unit?, hints: string[], explanation }`

Keep the exports plain JavaScript (no TypeScript type annotations inside the
`.mdx`).

## 6. Preview locally

```bash
pnpm --filter resources dev      # http://localhost:3000/<subject>/<unit>/<topic>
pnpm --filter resources test     # run the unit tests
pnpm --filter resources build    # production build (KaTeX renders at build time)
```

The new topic appears in the nav automatically, in `order` position.

## 7. Deploy

Commit the file and push to `main`. Vercel auto-deploys the resources project
(it rebuilds only when `apps/resources` or `packages/ui` change). The page goes
live at `https://resources.cameronbrady.dev/<subject>/<unit>/<topic>`, with the
breadcrumb, nav entry, `<title>`, description, and link-preview card all derived
from the file you just wrote.

## Checklist

- [ ] File at `content/<subject>/<unit>/<topic>.mdx`
- [ ] Frontmatter: `title`, `order`, `description`
- [ ] Prose (KaTeX with `$…$` / `$$…$$` as needed)
- [ ] Optional `export const grapher = { spec: … }`
- [ ] Optional `export const practice = [ … ]` with unique `id`s
- [ ] `pnpm --filter resources build` is green
- [ ] Push to `main`
