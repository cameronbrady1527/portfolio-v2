# Interactive Component UX Standard

_Written 2026-06-14, finalized 2026-06-15 after a browser audit of the six shipped
transformation topics and a full design grill. This is the bar every interactive in
`@cameronbrady/math-components` must clear, and the plan for retrofitting the three we
already shipped (Grapher, SequenceBuilder, SymmetryExplorer)._

---

## 0. Governing principle

> **Reserve the user's mental effort for productive struggle over the _content_, never
> for figuring out how to operate the tool.**

Operating an interactive must feel self-evident; all difficulty is reserved for the
mathematics. This is cognitive-load theory applied — effort spent decoding the interface
is effort stolen from learning. It is the **tie-breaker**: when a design choice trades
tool-simplicity against anything else, tool-simplicity wins.

Everything below is downstream of this principle.

---

## 1. The reframe: the "black box" was a bug, not a design choice

The most jarring thing in the audit — a pure-black graph canvas dropped into the warm
paper page, with the original figure nearly invisible on it — is **one CSS bug**, not a
palette we chose.

The package _already_ ships a warm-paper theme (`--cbmc-paper-bg: #f7f5ef`, warm grid),
and the resources app _already_ imports `@cameronbrady/math-components/styles.css`. But
mafs's own `core.css` declares, **on `.MafsView` itself**:

```css
.MafsView { background: var(--mafs-bg); --mafs-bg: black; --mafs-fg: white; }
```

We styled the wrapper (`.cbmc-graph-paper`) but never wired mafs's variables, so
`.MafsView` painted opaque black over our paper. Because `--mafs-bg: black` is declared
_on the element_, a background set on the parent can't win — the override must land on
`.MafsView` with higher specificity.

Overriding just those vars (proven in-browser) recovers the paper canvas, the warm grid,
**and** makes the `#16231c` preimage readable — it only looked invisible because it was
dark-on-black. Same fix made the "Hunt the square" widget's square obvious. So ~70% of
what read as "boring / can't see anything" is recovered by the theming fix alone.

The remaining real gaps: vertices aren't labeled, controls are unstyled native inputs,
there's no instruction line, captions are robotic, on-figure measurements collide, and
nothing animates.

_(Note: nothing in any widget is draggable — all interaction is via controls. "Where do
I click" is about unstyled controls + missing instructions, not hidden drag targets.)_

---

## 2. The standard (the rubric)

A component ships only when it passes everything under **Required**. **Recommended**
items are done where they pay off, not mandated. Use as a PR checklist.

### Required (every component)
- [ ] **Belongs on import.** The component looks finished the moment the package + its
      stylesheet are imported — paper canvas, warm grid, readable figures. No app
      configuration required. (See §3.1 — theming is the package's job.)
- [ ] **AA contrast** for every drawn element against the _actual_ canvas color.
- [ ] **Preimage vs image distinguishable by both color and style** (survives grayscale
      / color-blindness).
- [ ] **Polygon vertices labeled** A, B, C…; image vertices A′, B′, C′ (see §3.2).
- [ ] **Controls are styled** (no raw browser inputs); choose-controls are segmented
      buttons (see §3.3).
- [ ] **A guaranteed instruction line** ("try this →") travels with the component.
- [ ] **Caption is a real sentence** — no internal vocabulary ("polygon", "N vertices"),
      no broken grammar.
- [ ] **Keyboard operable; labeled controls; `aria-label`s on figure groups.** (Already
      passing — do not regress.)
- [ ] **Consistent interaction grammar** with the other components: same control
      styling, same layout order (instruction → figure → controls → caption).

### Recommended (do where it helps)
- [ ] Eased motion (~200–400ms) on state change; respect `prefers-reduced-motion`. Most
      valuable on the sequence stepper.
- [ ] A marked, named pivot (center of dilation/rotation, line of reflection/symmetry).
- [ ] An original-vs-image legend.

---

## 3. Concrete specs (the decisions)

### 3.1 Theming — the package is a self-contained entity
The package owns its look. Importing it + its stylesheet yields a finished component;
the app supplies nothing. It harmonizes with any host by **good defaults + inheritance**,
never by coupling: it must not reach into app tokens (no host CSS vars, no Tailwind
classes). It drives mafs from its _own_ `--cbmc-*` tokens, paper values baked in as
fallbacks, on the `.MafsView` scope:

```css
.cbmc-graph-paper .MafsView {
  --mafs-bg: var(--cbmc-paper-bg, #f7f5ef);
  --mafs-fg: var(--cbmc-axis-color, #43564b);
  --mafs-line-color: var(--cbmc-grid-line, #b8ae9c);
  --grid-line-subdivision-color: var(--cbmc-grid-line-subtle, #e6e0d4);
  --mafs-origin-color: var(--cbmc-origin-color, #8a7f6c);
}
```

One theming surface (`--cbmc-*`), paper default at the package level. Fonts come along
via `font-family: inherit`. A different consumer can re-theme (incl. dark) by overriding
the same vars — but is never required to.

### 3.2 Vertex labels
- **Auto-derived** A, B, C… from polygon vertex order (index → letter); the image's
  vertices get the **primed** set automatically. No authoring required.
- **Placement:** offset each label outward along the ray from the centroid through the
  vertex (small fixed pixel offset, tuned once), so labels sit outside the shape and off
  the edges.
- **Overlap rule (preimage vs image close together):** preimage labels offset one
  direction, image labels the opposite — deterministic, cheap.
- **Override:** a spec may pass explicit labels (e.g. textbook "P, Q, R"); default needs
  none. Standalone points/segments keep their single label. The broken whole-shape
  `"ABC"` label (currently computed then dropped for polygons) is removed.

### 3.3 Controls
- **Style native inputs via the package stylesheet** — themed `range` (track + thumb in
  `--cbmc-*`, visible focus ring, value readout). No heavy custom widgets, no new JS dep.
- **Choose-controls → segmented button group, always.** Shows all options at once
  (answers "where do I click"), matches the quiz aesthetic. Many options wrap to multiple
  rows rather than collapsing to a dropdown.
- The SequenceBuilder palette and SymmetryExplorer operation list adopt the same styled
  button/chip set.

### 3.4 Instruction, legend, caption
- **Instruction** = an optional `instruction` field on the component spec, rendered
  inside the widget above the figure. Travels with the component so it's never forgotten;
  MDX prose around the component remains for teaching context.
- **Legend** = auto-rendered from the figure's own labels/colors (e.g. ■ original ·
  ▢ image), on by default, suppressible.
- **Caption** = templated into a real sentence, e.g. _"Triangle ABC dilated about the
  origin by a scale factor of 2 → triangle A′B′C′."_ Stays both visible caption and a11y
  description.

### 3.5 On-figure measurements
- **Opt-in** (`showMeasurements` already exists); the flag sets the _initial_ state.
- **Student-facing "Show side lengths" toggle** lets the learner control their own
  clutter (agency over cognitive load). Initial = on for Dilations (lengths are the
  lesson), off elsewhere.
- **Placement:** vertex letters at vertices (§3.2); lengths at edge **midpoints** offset
  along the edge normal — structurally separate, so the two never collide. 2-dp decimals
  (no algebra needed to read "2.24").

### 3.6 Motion — deferred
Recommended, not in this pass. When added: tween image vertices old→new with an eased
transition gated on `prefers-reduced-motion`; the sequence stepper animates each step.

---

## 4. Enforcement
- **The §2 checklist is the primary gate** (in the PR template for component work).
- **One automated guard now:** a Playwright smoke test that loads a topic and asserts the
  rendered `.MafsView` background is paper (not black) and that shapes were drawn — the
  single assertion that would have caught the black-box bug automatically.
- **Full visual-regression screenshot diffing is deferred.** It adds ~3–5 hrs over the
  smoke test up front (mostly cross-environment rendering determinism — baselines must be
  pinned to an identical container or they flake), plus a permanent tax on every
  intentional visual change. It wouldn't catch the black-box class better than the smoke
  test does. Revisit once component count makes manual eyeballing stop scaling.

---

## 5. Delivery plan

Lightweight: the standard doc is the spec (no separate PRD). Five vertical slices, TDD
where there's pure logic, on a **single feature branch → one PR** (avoids the stacked-PR
merge mechanics from the original build). Motion deferred.

1. **Theming fix** — wire mafs vars in package `styles.css` + the Playwright smoke
   assertion. Smallest diff, biggest win; ships paper to all 6 topics at once.
2. **Vertex labels** — A/B/C · A′B′C′ in `ShapeView`; pure placement helper, unit-tested.
3. **Styled control layer** — themed range + segmented button group; convert all
   choose-controls to segmented.
4. **Instruction spec field + auto legend + templated caption + measurements toggle &
   placement.** Caption builder is pure, unit-tested.
5. **SequenceBuilder + SymmetryExplorer** — button restyle + vertex labels applied.

The shared theming fix (1) hits all six topics automatically; labels + controls (2–3)
live in the shared Grapher, so every Grapher topic inherits them. Only (5) is
widget-specific.
