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

Helpers:

- `slider(value, min, max, { step?, label? })` → a numeric slider.
- `choose(value, options, label?)` → a select over a fixed option set.

The image is computed by the pure geometry module; the figure shows the
preimage + image and a text caption for accessibility. Bounds auto-fit by
default (override with `spec.bounds`).

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

## 6. (Optional) Use the support components

Four scaffolding components are registered globally — use them as bare tags in
any topic `.mdx`, **no imports needed**. They share two hard rules:

- **Zero-stakes.** Self-checks grade and give feedback but record *nothing* —
  no progress writes, ever. A student asking for help is never being measured.
  Don't wire these into tracking.
- **Low floor.** Plain language first; the formal layer comes second.

### `<Refresher>` — just-in-time foundations

A collapsed "Need a refresher?" panel. Reference a library entry by slug:

```mdx
<Refresher id="negative-numbers" />
```

Library slugs: `fractions-decimals`, `negative-numbers`, `ratios`,
`reading-coordinates`, `solving-equations`, `square-roots` (and growing — see
below). A misspelled id **fails the build** with an error listing the valid
slugs, so typos never reach a student.

Escape hatch for a bespoke one-off (children win over `id`):

```mdx
<Refresher title="Square roots, the quick version">
  The square root of 49 is 7, because 7 × 7 = 49.
</Refresher>
```

**Adding a library entry:** drop a file at `content/_refreshers/<slug>.mdx` —
frontmatter `title`, one short idea + tiny example as prose, and optionally a
zero-stakes self-check:

```mdx
---
title: Ratios and proportions
---

export const check = {
  id: "refresher-ratios",
  type: "mc",                       // or "numeric" (same shapes as practice)
  prompt: "…",
  choices: ["…", "…"],
  answer: 0,
  hints: ["…"],
  explanation: "…",
};

A ratio compares two amounts. …
```

Keep entries to one idea. Verify the math like topic content — these render on
many pages.

### `<WorkedExample>` — multi-step solutions without the wall

Steps reveal one at a time. A step with a `check` gates the **Next step**
button until the student attempts it (a wrong attempt gives feedback and still
unlocks — it never dead-ends):

```mdx
<WorkedExample title="Rotate (2, 5) by 90° counter-clockwise about the origin">
  <Step
    check={{
      id: "we-rotation-rule",
      type: "mc",
      prompt: "Which rule applies?",
      choices: ["(x, y) ↦ (−y, x)", "(x, y) ↦ (y, −x)"],
      answer: 0,
      hints: ["CCW sends (1, 0) up to (0, 1)."],
      explanation: "A 90° CCW rotation uses (x, y) ↦ (−y, x).",
    }}
  >
    Pick the rule for a 90° counter-clockwise rotation.
  </Step>
  <Step>Substitute x = 2 and y = 5: (2, 5) ↦ (−5, 2).</Step>
</WorkedExample>
```

### `<PredictThenCheck>` — commit before you see

The reveal (any children: prose, a figure) stays hidden until the student locks
in a prediction. Their prediction remains displayed beside the outcome — that
juxtaposition is the point. A de-emphasized **Skip to the answer** always
exists, so a teacher projecting mid-lesson controls pacing.

```mdx
<PredictThenCheck
  prompt="The point (3, 1) is reflected over the y-axis. Where does it land?"
  choices={["(−3, 1)", "(3, −1)", "(−3, −1)"]}
>
  <p>The image is (−3, 1): the x-coordinate flips, the y stays.</p>
</PredictThenCheck>
```

### `<Term>` — precise vocabulary on tap

Wrap the *teaching occurrence* of a term (usually first use on the page — mark
deliberately, not every mention). Click/keyboard opens a popover with the
definition, plain language first:

```mdx
… called the <Term id="line-of-reflection">line of reflection</Term> …
```

**Adding a glossary entry:** drop `content/_glossary/<slug>.mdx` with
frontmatter `title` (the canonical term) and `subject` (for grouping on the
automatic `/glossary` page), then a plain-language paragraph followed by
`**Formal definition.** …`. Bad ids fail the build, same as refreshers.

## 7. The inquiry topic pattern (use selectively)

Some topics teach best when the student **discovers the result instead of
being told it**. Use this shape when the math has a discoverable payoff — an
invariance, a surprising constant, a rule that emerges from examples
(rotation distance-preservation, triangle angle sum, trig-ratio invariance).
Don't force it on definitional or procedural topics; "some, not all."

Four stages, composed from pieces you already have:

1. **Explore** — open with the `<Grapher>` (or a figure) and an invitation to
   play: "drag the angle through 90°, 180°, 270°. What changes? What doesn't?"
2. **Conjecture** — a `<PredictThenCheck>` makes the student commit:
   "rotate the triangle 180°. What happens to its side lengths?" The
   choices should include the tempting wrong answers.
3. **Test** — prose that sends them back to the interactive to hunt for a
   counterexample: "try to find any rotation that changes a side length."
4. **Formalize** — only now state the theorem, with a `<WorkedExample>`
   walking one concrete case and `<Term>` marking the vocabulary that names
   what they just found.

Worked outline — *"Rotations preserve distance"*:

```mdx
{/* 1 Explore: grapher with angle choose() control, prose invites play */}
{/* 2 Conjecture */}
<PredictThenCheck
  prompt="Rotate the triangle by 180°. What happens to the length of side AB?"
  choices={["It stays exactly the same", "It doubles", "It flips sign", "It depends on the center"]}
>
  <p>It stays exactly the same — rotations move points along circles around
  the center, and circles never change a shape's internal distances.</p>
</PredictThenCheck>
{/* 3 Test: "try to break it" prose */}
{/* 4 Formalize: the rigid-motion statement + a WorkedExample computing one
      image point and checking 2² + 5² = (−5)² + 2² */}
```

The practice set then asks for the *property* ("which measurements survive a
rotation?"), not just coordinates.

## 8. Preview locally

```bash
pnpm --filter resources dev      # http://localhost:3000/<subject>/<unit>/<topic>
pnpm --filter resources test     # run the unit tests
pnpm --filter resources build    # production build (KaTeX renders at build time)
```

The new topic appears in the nav automatically, in `order` position.

## 9. Deploy

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
- [ ] Optional support components (`<Refresher>`, `<WorkedExample>`,
      `<PredictThenCheck>`, `<Term>`) — no imports needed
- [ ] Considered the inquiry pattern if the topic has a discoverable payoff
- [ ] `pnpm --filter resources build` is green
- [ ] Push to `main`
