# Geometry Component Plan — NYS Next Generation Standards Coverage

A planning document for the interactive components the hub needs in order to
cover the **NYS Next Generation Geometry course** (GEO-G.\*, June 2019
crosswalk). This is the input to the grilling / PRD / issues workflow — it
proposes; the grilling session disposes.

**Source:** NYS Next Generation Mathematics Learning Standards, Geometry
Crosswalk (NYSED, June 2019 draft).

**Status legend:** ✅ have · 🔧 extend existing · 🆕 new component · 💭 ambitious / later

> Created: 2026-06-11 · Owner: Cameron (SME) · Drafted from the crosswalk PDF

---

## 1. Who these are for (the design constraint that shapes everything)

NYS Geometry is nominally a post-Algebra-I course, but our students may:

- **not have taken algebra**, or have passed it with weak retention;
- have **weak foundational skills** (fractions, ratios, negative numbers,
  reading coordinates);
- include **students with special needs** for whom manipulatives are a
  first-class learning tool (already a hub principle).

Yet the Next Gen standards repeatedly say *"include multi-step proofs and
algebraic problems built upon these concepts."* So every component must be
**low-floor, high-ceiling**:

- **Low floor:** the interactive is fully playable with *zero symbols* — drag,
  predict, see. Geometry is the most visual course in the sequence; lean into
  that.
- **High ceiling:** the algebraic/notational layer is *present but optional* —
  revealed via a "show the math" affordance, never required to get the idea.
- **Foundations on demand:** algebra/arithmetic prerequisites are served as
  just-in-time refreshers next to where they're needed, not as gatekeeping
  prerequisites.

## 2. Pedagogical principles (apply to every component)

1. **Predict → act → explain.** Before the interactive reveals an answer, ask
   the student to commit to a prediction. Surprise is the engagement engine —
   "wait, the inscribed angle is *half*?" beats being told.
2. **Misconception-targeted.** Each component below names the specific
   misconception(s) it confronts (e.g., "SSA determines a triangle,"
   "doubling sides doubles area"). A component that doesn't confront a
   misconception is decoration.
3. **CRA progression** (concrete → representational → abstract): manipulate
   first, see the diagram structure second, meet the notation last.
4. **Controls-first, a11y always** (existing Grapher pattern): keyboard
   operable, live captions describing what changed, color-independent
   encodings (dash patterns / labels, not just hue), reduced-motion friendly.
5. **Precise vocabulary as a feature, not a hurdle.** GEO-G.CO.1 makes
   *definitions* a standard. Plain language first, precise term attached —
   every term tappable for its definition.
6. **Same-night authoring stays sacred.** Components are spec-driven props
   (like `GrapherSpec`) so a topic author configures them from MDX without
   touching component code.

---

## 3. What we already have

| Component | Capabilities | Standards it already serves |
|---|---|---|
| `<Grapher>` | Polygon preimage/image on a graph-paper plane; **reflect** (over lines), **translate** (vector), **rotate** (center + angle); `slider`/`choose` controls DSL; a11y caption | GEO-G.CO.2, G.CO.4, G.CO.5 (single transforms), G.CO.6 (partially) |
| `<PracticeSet>` | MC + numeric (with tolerance) questions, hints, scoring, localStorage progress | practice layer for everything |
| Pure logic (`/logic`) | `reflect`, `translate`, `rotate`, `applyTransform`; grading; progress | machine-checkable answers (the math-verification mandate) |

Everything below either **extends** these or stands beside them in
`@cameronbrady/math-components`.

---

## 4. Component inventory by standards domain

### 4.1 Congruence (G.CO) — the transformations home turf

#### 🔧 C1. Dilation + non-rigid transforms in Grapher
- **Standards:** GEO-G.CO.2 (compare distance/angle-preserving vs not), G.SRT.1a/1b, G.C.1
- **What:** add `dilate` (center + scale factor) and a simple `stretch`
  (one-axis scale) to the transform vocabulary. Show side-length readouts so
  students *see* rigid vs non-rigid: translation keeps lengths; stretch doesn't.
- **Misconception:** "every transformation that 'moves' a shape keeps it congruent."
- **Low floor:** scale-factor slider; watch a line not through the center stay
  parallel (G.SRT.1a) — no symbols needed.
- **Effort:** S–M (pure `dilate()` fn + Grapher spec extension; mirrors how
  rotate was added).

#### 🔧 C2. Transformation sequences (composition)
- **Standards:** GEO-G.CO.5 (specify a sequence carrying one figure onto
  another), G.CO.2, G.CO.6
- **What:** Grapher accepts an *ordered list* of transforms; a stepper plays
  them one at a time, leaving ghost intermediates. Inverse mode: given
  preimage + image, the student *builds* the sequence from a palette and tests it.
- **Misconception:** order doesn't matter (it often does — rotate∘translate ≠
  translate∘rotate); a single "weird" mapping can't be decomposed into simple moves.
- **Engagement:** the inverse mode is a puzzle — "get the triangle home in 2 moves."
- **Effort:** M.

#### 🆕 C3. Symmetry Explorer
- **Standards:** GEO-G.CO.3 (rotations/reflections that carry a polygon onto itself)
- **What:** a polygon (regular *and* irregular — the Next Gen edition added
  irregular); student proposes a reflection line or rotation angle, the figure
  animates, and the component verifies "lands on itself" exactly (machine-checked
  with the pure fns). Score: "you found 3 of the 8 symmetries of the octagon."
- **Misconception:** every shape has reflection symmetry; rotation symmetry
  requires "looking the same upside down" only at 180°.
- **Engagement:** collect-them-all game loop. Genuinely fun.
- **Effort:** M.

#### 🆕 C4. Angle Relationships Explorer (lines & transversals)
- **Standards:** GEO-G.CO.9 (vertical angles, parallel lines + transversal,
  perpendicular bisector)
- **What:** two lines + a draggable transversal. Drag anything; angle measures
  update live. Modes: vertical angles · linear pairs · alternate interior /
  corresponding (parallel case vs non-parallel case — the contrast is the
  lesson). Perpendicular-bisector mode: drag a point along the bisector,
  watch the two distances stay equal.
- **Misconception:** alternate interior angles are "always equal" (only when
  lines are parallel); equidistance on a bisector is a coincidence of the drawing.
- **Low floor:** all dragging and watching; the *names* of the angle pairs are
  the only vocabulary load — pattern-coded (not color-only) angle marks.
- **Effort:** M. **Foundational for the entire proofs strand — build early.**

#### 🆕 C5. Triangle Congruence Lab
- **Standards:** GEO-G.CO.7, G.CO.8 (ASA/SAS/SSS/AAS/HL), G.SRT.5
- **What:** the flagship. Pick a criterion; the given parts lock (shown with
  tick/arc marks); everything else is draggable. SSS/SAS/ASA/AAS/HL → no matter
  how you drag, the triangle is rigid up to rigid motion (the component
  *demonstrates* congruence by animating the rigid motion that maps one onto
  the other — exactly the Next Gen framing "congruence in terms of rigid
  motions"). **SSA mode** → the drag finds *two* different triangles (the
  ambiguous case) — proof by toy that SSA fails.
- **Misconception:** SSA works; congruence means "looks the same"; AAA forces congruence.
- **Engagement:** "try to break it" framing — students attempt to make two
  different triangles from the same givens.
- **Effort:** L. Worth it — this is the heart of the course.

#### 🆕 C6. Triangle Properties Lab
- **Standards:** GEO-G.CO.10 (angle sum, exterior angle, triangle inequality,
  midsegment, isosceles base angles)
- **What:** one draggable triangle, switchable lenses: (a) angle-sum — the
  three corner angles tear off and visually line up on a straight line, live as
  you drag; (b) exterior angle vs the two remote interiors (live sum readout);
  (c) triangle inequality — drag until the triangle *degenerates* and snaps
  flat (why a 2-3-7 triangle can't exist); (d) midsegment — always parallel,
  always half, with readouts; (e) isosceles — force two sides equal, watch base
  angles stay equal.
- **Misconception:** angle sum only works for "nice" triangles; any three sticks
  make a triangle.
- **Effort:** M–L (five small lenses on one substrate).

#### 🆕 C7. Quadrilateral Lab
- **Standards:** GEO-G.CO.11 (parallelogram theorems + converses, inclusive trapezoid)
- **What:** a draggable quadrilateral with toggleable constraints
  ("force opposite sides parallel", "force diagonals to bisect each other",
  "force congruent diagonals"…). Students discover the **hierarchy** by
  stacking constraints: parallelogram → rectangle/rhombus → square; the
  *inclusive* trapezoid (NYS definition called out). Diagonals drawn with live
  bisection/congruence indicators.
- **Misconception:** a square isn't a rectangle; a trapezoid can't be a
  parallelogram (NYS uses the inclusive definition — at least one pair);
  diagonal properties are independent facts rather than *characterizations*.
- **Effort:** M–L.

#### 💭 C8. Construction Canvas (virtual compass & straightedge)
- **Standards:** GEO-G.CO.12, G.CO.13 (constructions — a NYS *fluency
  recommendation*), feeds G.C (inscribed/circumscribed circles)
- **What:** a true manipulative: compass (set radius, draw arc) + straightedge
  (line through two points) + point/label tools, on the graph-paper aesthetic.
  Guided mode (steps validated against the target construction: copy/bisect
  segment & angle, perpendiculars, parallels, points of concurrency, inscribed
  equilateral triangle / square / hexagon) and free-play mode.
- **Why ambitious:** it's an editor, not a parametrized figure — selection,
  hit-testing, undo, validation. Biggest single build in this plan and the
  crown jewel of the **virtual manipulatives epic** (a11y bar is highest here:
  full keyboard operability for compass/straightedge actions).
- **Effort:** XL. Tier 4, but it's the signature piece — nothing on the open
  web does this well *and* accessibly.

#### 💭 C18. Proof Builder *(spans G.CO, G.SRT, G.GPE — listed here with its densest cluster)*
- **Standards:** GEO-G.CO.9, G.CO.10, G.CO.11, G.SRT.4, G.SRT.5b, G.GPE.4 —
  every "prove and apply" standard, all carrying "include multi-step proofs"
  notes. Proofs are a Regents staple and **super important** (SME's words).
- **What:** students *construct* proofs instead of reading them: a
  drag-and-drop two-column (and/or flowchart) builder with a bank of
  statements and reasons, machine-checked logical validity, and
  misconception-aware distractors in the bank. Peak inquiry pedagogy —
  building the argument is the discovery.
- **Interim path (until built):** explorers (C4/C6/C7) supply the *why*;
  X2 stepper supplies proof *reading*; PracticeSet supplies proof *fragments*
  as MC ("which reason justifies step 3?") — cheap, machine-checkable, and
  close to what Regents partial credit rewards.
- **Why deferred:** XL build (validity engine, statement banks, drag-drop
  a11y). When the **Proofs subject** (roadmap ⬜) spins up, this graduates to
  its own PRD as that subject's foundation component.
- **Effort:** XL. Tier 4.

### 4.2 Similarity, Right Triangles & Trigonometry (G.SRT)

#### 🆕 C9. Similarity Lab
- **Standards:** GEO-G.SRT.2, G.SRT.3 (AA~/SAS~/SSS~), G.SRT.4 (side-splitter,
  geometric mean), G.SRT.5
- **What:** builds on dilation (C1). Two triangles; student attempts to map one
  onto the other with rigid motions + one dilation (the *definition* of
  similar). Side-splitter lens: drag a line parallel to a base across a
  triangle, live ratio readouts on the split sides (always equal). Right-triangle
  altitude lens: drag the altitude foot, geometric-mean relationships update.
- **Misconception:** similar = "same shape-ish"; proportionality is about
  *adding* the same amount rather than *multiplying* by the same factor (the
  classic additive-thinking error — ratio refreshers attach here).
- **Effort:** M–L.

#### 🆕 C10. Trig Ratio Explorer
- **Standards:** GEO-G.SRT.6, G.SRT.7 (complementary sine/cosine), G.SRT.8
  (incl. special right triangles), G.SRT.9 (A = ½ab·sin C)
- **What:** a right triangle on a "similarity ladder": fix the acute angle,
  drag the hypotenuse longer/shorter — the triangle grows but the three ratios
  (displayed as live fractions opp/hyp, adj/hyp, opp/adj) **don't move**.
  That's the entire conceptual content of SRT.6 made visible. Then: name the
  frozen ratios (sin/cos/tan); complementary-angle lens (swap the reference
  angle, watch sin↔cos trade places); special-triangles lens (30-60-90,
  45-45-90 with exact values); ½ab·sin C lens (drag C; the auxiliary altitude
  h = b·sin C is drawn live, area updates).
- **Misconception:** sine is a *button*, not a *ratio*; trig values depend on
  triangle size; sin 30° + sin 60° = sin 90°.
- **Low floor:** ratios shown numerically as "opposite ÷ hypotenuse = 0.5"
  before any sin/cos symbols; fraction refresher attaches here.
- **Effort:** M–L. **High leverage: trig is where weak-foundations students
  most often fall off the bus.**

### 4.3 Circles (G.C)

#### 🆕 C11. Circle Angles Explorer
- **Standards:** GEO-G.C.2a (angles ↔ intercepted arcs), G.C.2b (radii,
  chords, tangents, secants), G.C.1 (all circles similar — via dilation lens)
- **What:** a circle with draggable points. Lenses: central vs **inscribed
  angle** (drag the vertex around the circle — the angle *doesn't change*
  until the arc does; the half-the-central-angle reveal); inscribed in a
  semicircle (always 90°); inscribed quadrilateral (opposite angles sum 180°);
  tangent ⟂ radius; tangent/secant angle–arc relationships; congruent chords ↔
  congruent arcs.
- **Misconception:** inscribed = central; moving the vertex changes the
  inscribed angle; a tangent meets a circle at "about" one point.
- **Engagement:** the inscribed-angle invariance is one of the great "no way"
  moments in school math — pure predict-then-check material.
- **Effort:** L (many lenses, one substrate).

#### 🆕 C12. Sector & Arc Explorer
- **Standards:** GEO-G.C.5 (central angle ↔ arc length ↔ radius ↔ sector area,
  degrees only)
- **What:** central-angle and radius sliders; the sector shades; arc length
  and area update as live *proportions* of circumference/area ("90° is ¼ of
  the circle → ¼ of the area"). The proportional-reasoning framing is exactly
  the Next Gen wording ("using proportionality, find one given two others").
- **Misconception:** arc length and sector area are unrelated formulas to
  memorize, rather than one idea (fraction of the whole circle).
- **Effort:** S–M. A good *early* circles win.

### 4.4 Expressing Geometric Properties with Equations (G.GPE)

> ⚠️ This is the most algebra-loaded domain. Every component here carries
> refresher attachments (slope, square roots, distance) and shows numbers
> before formulas.

#### 🆕 C13. Coordinate Geometry Toolkit
- **Standards:** GEO-G.GPE.4 (coordinate proofs), G.GPE.5a/b/c (slopes of
  parallel/perpendicular lines), G.GPE.7 (perimeter/area) — three NYS
  *fluency recommendations* in one component
- **What:** a coordinate plane holding a polygon with draggable vertices and
  toggleable **measurement layers**: side lengths (distance), slopes (with
  parallel ‖ / perpendicular ⟂ badges), midpoints, diagonals, perimeter, area.
  "Coordinate proof" scaffold mode: claim ("this is a rectangle") → checklist
  of what must be verified → each measurement layer ticks off evidence.
- **Misconception:** perpendicular slopes are "opposite" (sign flip only, no
  reciprocal); distance = difference of coordinates; a proof is the picture.
- **Low floor:** counting grid squares for slope before the formula; distance
  as right-triangle hypotenuse drawn on screen (Pythagorean overlay).
- **Effort:** M–L. **The workhorse of the coordinate strand.**

#### 🆕 C14. Circle Equation Grapher
- **Standards:** GEO-G.GPE.1a, G.GPE.1b (equation ↔ graph, both directions)
- **What:** two-way binding: sliders for center (integer) and radius (positive
  integer per the NYS graphing note) ↔ the equation (x−h)² + (y−k)² = r²
  updating live, with a draggable point on the circle showing the
  Pythagorean right triangle from the center (the *derivation* made visible).
  Completing-the-square is handled in content via the Worked-Example Stepper
  (X2), not in this component.
- **Misconception:** the signs of h, k in the equation; r vs r²; the equation
  is unrelated to the Pythagorean theorem.
- **Effort:** M.

#### 🆕 C15. Segment Partition Explorer
- **Standards:** GEO-G.GPE.6 (directed segment, given ratio; midpoint as the 1:1 case)
- **What:** a directed segment A→B with a ratio control; the partition point
  slides with live coordinates; the "walk the vector" decomposition is drawn
  (¾ of the run, ¾ of the rise). Midpoint shown as the special case, matching
  the NYS note ("midpoint formula is a derivative of this standard").
- **Misconception:** ratio 2:1 means "⅔ of the way" confusion (part:part vs
  part:whole — *the* error for this standard); direction A→B vs B→A doesn't matter.
- **Effort:** S.

### 4.5 Geometric Measurement & Dimension (G.GMD)

#### 🆕 C16. Volume & Cavalieri Visualizer
- **Standards:** GEO-G.GMD.1 (informal arguments: circumference, circle area,
  cylinder/pyramid/cone volume), G.GMD.3 (volume problems ★)
- **What (2D-first, deliberately):** circle area by sector-rearrangement into
  a near-parallelogram (slider: number of sectors); Cavalieri as a sheared
  stack of card-like layers (slider: shear — volume readout doesn't change);
  cone:cylinder = 1:3 and pyramid:prism = 1:3 shown as fill-up animations.
  Practice layer does the ★-modeling computation work.
- **Misconception:** tilted solids hold less; π appears in formulas by decree;
  doubling a radius doubles the area/volume.
- **Effort:** M–L without real 3D (SVG/mafs trickery is enough for all of the
  above). Real-3D versions fold into C17 later.

#### 💭 C17. Cross-Section & Revolution Explorer (3D)
- **Standards:** GEO-G.GMD.4 (plane sections — *not* limited to parallel/
  perpendicular to the base — and solids of revolution)
- **What:** a true-3D interactive (react-three-fiber): pick a solid, drag a
  cutting plane at any tilt, see the cross-section extracted as a 2D shape;
  spin a 2D region about an axis to generate the solid of revolution.
- **Why deferred:** first 3D dependency in the package (bundle size, a11y
  story for 3D manipulation needs real design). Content can ship earlier with
  curated images/video + practice.
- **Effort:** XL. Tier 4.

### 4.6 Modeling with Geometry (G.MG ★)

**No new component.** GEO-G.MG.1–3 (shapes describing objects, density by
area/volume, design problems) are *content + practice* standards that reuse
C13 (coordinates), C16 (volume) and the PracticeSet — modeling contexts are
where the ★ practice problems live. Revisit only if a dedicated
density-visualizer earns its keep later.

---

## 5. Cross-cutting components (the weak-foundations support layer)

These serve **every** topic and are the direct answer to "accessible to
students who haven't taken algebra."

#### 🆕 X1. Refresher (just-in-time foundations)
Collapsible "Need a refresher?" panels attachable at any point in an MDX
topic: solving one-step/two-step equations, square roots, ratios &
proportions, negative numbers, reading coordinates, fraction ↔ decimal.
Written once, reused everywhere; each is plain-language + one tiny example +
one self-check. **Effort: S** (component) + content library that grows.

#### 🆕 X2. Worked-Example Stepper
Reveals a worked solution one step at a time; each step can carry a
self-check prompt ("what should happen next?") before revealing. Directly
supports the "multi-step … algebraic problems" notes all over the Next Gen
standards, without wall-of-algebra intimidation. **Effort: S–M.**

#### 🆕 X3. Term (glossary tooltips) + glossary page
Tap a term → precise NYS-style definition (GEO-G.CO.1 makes definitions a
*standard*, "as these exist within a plane") in plain language + the formal
version. Terms accumulate into a per-subject glossary page. **Effort: S–M.**

#### 🔧 X4. PracticeSet: expression/equation input
Already on the roadmap (Epic 4). Needed course-wide for the algebraic-problems
notes; answers stay machine-checkable (parse + structural/numeric
equivalence, not string match). **Effort: M.**

#### 🔧 X5. Predict-then-check harness
A light wrapper tying a one-question prediction (MC) to an interactive reveal
— formalizing principle #1 so authors get it for free in MDX:
*predict → play → explain*. **Effort: S.**

---

## 6. Coverage matrix (standard → component)

| NYS standard | Component(s) | Status |
|---|---|---|
| GEO-G.CO.1 (definitions) | X3 + content | 🆕 |
| GEO-G.CO.2 (transforms as functions; rigid vs not) | Grapher ✅ + C1 | 🔧 |
| GEO-G.CO.3 (symmetries, incl. irregular) | C3 | 🆕 |
| GEO-G.CO.4 (definitions of transforms) | Grapher ✅ + content | ✅ |
| GEO-G.CO.5 (draw images; sequences) | Grapher ✅ + C2 | 🔧 |
| GEO-G.CO.6 (congruence via rigid motions) | C2 + C5 | 🆕 |
| GEO-G.CO.7–8 (criteria ASA/SAS/SSS/AAS/HL) | C5 | 🆕 |
| GEO-G.CO.9 (lines & angles theorems) | C4 · C18 later | 🆕 |
| GEO-G.CO.10 (triangle theorems) | C6 · C18 later | 🆕 |
| GEO-G.CO.11 (parallelogram theorems) | C7 · C18 later | 🆕 |
| GEO-G.CO.12–13 (constructions, fluency) | C8 | 💭 |
| GEO-G.SRT.1a/1b (dilation properties) | C1 | 🔧 |
| GEO-G.SRT.2–3 (similarity; AA~/SAS~/SSS~) | C9 | 🆕 |
| GEO-G.SRT.4–5 (similarity theorems; fluency) | C9 + X2 · C18 later | 🆕 |
| GEO-G.SRT.6–8 (trig ratios, special rt △s ★) | C10 | 🆕 |
| GEO-G.SRT.9 (A = ½ab·sin C) | C10 | 🆕 |
| GEO-G.C.1 (all circles similar) | C1 + C11 | 🆕 |
| GEO-G.C.2a/2b (angles, arcs, chords, tangents) | C11 | 🆕 |
| GEO-G.C.5 (sector proportionality) | C12 | 🆕 |
| GEO-G.GPE.1a/1b (circle equations) | C14 + X2 | 🆕 |
| GEO-G.GPE.4 (coordinate proofs, fluency) | C13 · C18 later | 🆕 |
| GEO-G.GPE.5a/b/c (slopes ‖/⟂, fluency) | C13 | 🆕 |
| GEO-G.GPE.6 (partition a segment) | C15 | 🆕 |
| GEO-G.GPE.7 (perimeter/area ★, fluency) | C13 | 🆕 |
| GEO-G.GMD.1, 3 (volume arguments + problems ★) | C16 | 🆕 |
| GEO-G.GMD.4 (cross-sections, revolution) | C17 (interim: content) | 💭 |
| GEO-G.MG.1–3 (modeling ★) | content + practice reusing C13/C16 | — |

**Every standard in the course is covered by this plan.** Two standards lean
on Tier-4 ambitions (C8 constructions, C17 3D) and have interim content-only
paths.

---

## 7. Proposed build order

Sequenced by (a) NYS course order, (b) reuse of what exists, (c) unblocking
the most content soonest. Tiers, not dates.

**Tier 1 — extend the home turf + the support layer**
C1 dilation/stretch · C2 sequences · C3 symmetry · X1 refresher · X3 term ·
X5 predict-then-check
*Rationale: C1–C3 complete the transformations story on the existing Grapher
substrate (small lifts, big coverage); X1/X3/X5 make every subsequent topic
weak-foundations-ready from day one.*

**Tier 2 — congruence core + the algebra bridge**
C4 angle relationships · C6 triangle properties · C5 congruence lab ·
X2 worked-example stepper · X4 expression input
*Rationale: this is the spine of the course's first half and of the proofs
strand; X2/X4 unlock the "algebraic problems" notes.*

**Tier 3 — similarity, trig, circles, coordinates**
C9 similarity · C10 trig ratios · C12 sector (early, it's small) ·
C11 circle angles · C13 coordinate toolkit · C14 circle equations ·
C15 segment partition · C7 quadrilateral lab
*Rationale: second half of the course; C12/C15 are quick wins to interleave
with the larger labs.*

**Tier 4 — signature ambitions**
C8 construction canvas (manipulatives epic flagship) · C16 volume visualizer ·
C17 3D cross-sections · C18 proof builder (graduates to the Proofs subject's
own PRD when that subject spins up)
*Rationale: highest effort, highest distinctiveness; each has an interim
content-only path so coverage never blocks on them.*

---

## 8. Working notes & constraints

- **Where components live:** all new interactives go in
  `@cameronbrady/math-components` (with pure logic under `/logic` and
  machine-checkable invariants), once the Plan B slice stack (#28–#31) is
  pushed and merged. **Don't start component work before that lands** — it
  would fork the package.
- **Math verification mandate applies to component content too:** every
  readout/invariant a component displays is backed by a pure function with
  tests (the inscribed-angle relationship, ratio invariance, etc.) — the
  component *is* the machine check.
- **One substrate, many lenses** is the recurring shape (C6, C10, C11, C13):
  prefer one draggable figure with switchable measurement/constraint layers
  over many near-duplicate components — fewer APIs, more discovery.
- **Standards text in the teacher layer:** each topic page's "For teachers"
  section should quote its GEO-G.\* standard(s) (Epic 3 decision: hand-written
  text + link, per topic).
- **Next step:** grilling session (`/grill-me`) on Tier 1 to pressure-test
  granularity, then `/to-prd` → `/to-issues` → `/tdd` per the established
  workflow.

---

## 9. Grill decisions (2026-06-11, ratified by SME)

1. **Two-track Tier 1.** Track A (content support layer) first — unblocked;
   Track B (Grapher extensions C1–C3) blocked until the package slice stack
   (#28–#31) is pushed and merged.
2. **Track A roster = X1 + X2 + X3 + X5**, all new files in `apps/resources`
   on `main`. X2 pulled forward from Tier 2 (same character, no conflicts).
   **X4 (expression input) explicitly deferred** — it edits `PracticeSet`,
   which the unpushed stack also edits; building it now manufactures a
   merge conflict.
3. **Refreshers: slug library** (`content/_refreshers/<slug>.mdx`,
   `<Refresher id="…" />`) with inline-children escape hatch. Seed library:
   one-/two-step equations, square roots, ratios & proportions, negatives,
   reading coordinates, fraction ↔ decimal.
4. **Refresher self-checks are untracked** — graded with pure `grade()`,
   nothing written to the progress store. Product principle behind it:
   the hub is a **supplemental tool, not an AI tutor**; keep tracking minimal.
5. **Inquiry/discovery is an editorial convention, not a component (for now).**
   Document the pattern (explore → conjecture → test → formalize) in
   `adding-a-topic.md`; revisit a dedicated component after 2–3 discovery
   topics exist. SME favors inquiry tasks selectively — "some, not all."
6. **Term (X3): explicit marking only** (no auto-linking), entries in
   `content/_glossary/<slug>.mdx` (plain language first, formal second),
   click/keyboard popovers (never hover-only), plus a `/glossary` page.
7. **C18 Proof Builder added** (Tier 4): proofs are super important —
   important enough to be its own dedicated build when the Proofs subject
   spins up, not a corner of this plan. Interim path documented in §4.1.
8. **X5 gate is soft** — default-hidden reveal with a de-emphasized skip
   affordance (teachers projecting mid-lesson need the bypass).
9. **Test surface (Track A):** slug-library loaders (build-time failure on
   unknown slug) · Refresher (id render, escape hatch, untracked guarantee
   asserted) · Stepper (ordered reveal, self-check gating, keyboard) ·
   Term (popover a11y) · X5 (default-hidden, prediction persists after
   reveal). Behavior-only, RTL, no snapshots.
