# Math review sheet — Tracks A & B (untracked scratch; delete after ratifying)

Generated 2026-06-14. Every coordinate/length/symmetry answer below was
**machine-checked against the actual shipped pure functions** in
`@cameronbrady/math-components/logic` (19/19 pass). Arithmetic and
conceptual items are verified by reasoning and flagged for your SME eye.

Your job: scan, and either ✅ ratify or mark anything you'd word differently.

---

## A. Geometry answers — MACHINE-CHECKED (19/19 pass) ✅

| # | Where | Claim | Verified |
|---|-------|-------|----------|
| 1 | rotations Q1 | (1,0) rot 90° CCW → (0,1) | ✅ |
| 2 | rotations Q2 | (4,3) rot 180° → new y = −3 | ✅ |
| 3 | rotations worked example | (2,5) rot 90° CCW → (−5,2); 2²+5²=(−5)²+2²=29 | ✅ |
| 4 | reflections prediction | (3,1) reflect y-axis → (−3,1) | ✅ |
| 5 | dilations Q1 | (2,3) dilate k=2 origin → (4,6) | ✅ |
| 6 | dilations Q2 | length 5 × scale 3 → 15 | ✅ |
| 7 | sequences Q1 | (1,2) T⟨2,0⟩ then R90° → (−2,3) | ✅ |
| 8 | sequences Q2 | (4,1) reflect y then T⟨0,3⟩ → (−4,4); x = −4 | ✅ |
| 9 | sequences Q3 | (1,0): R-then-T → (5,1); T-then-R → (0,6) (order matters) | ✅ |
| 10 | builder puzzle | △(1,1)(3,1)(1,2) T⟨3,0⟩ then R90° → (−1,4)(−1,6)(−2,4) | ✅ |
| 11 | symmetry topic | square → 3 rotations [90,180,270] + 4 reflections | ✅ |
| 12 | symmetry topic | isosceles △ → 0 rotations, 1 reflection | ✅ |
| 13 | symmetry Q1 | regular hexagon → 6 lines (and 5 rotations) | ✅ |
| 14 | symmetry Q3 | generic parallelogram → 180° rotation, 0 reflections | ✅ |

(Re-run anytime: the node script lives in the message history; it imports the
built `dist/logic` and compares to each stated answer.)

---

## B. Arithmetic / conceptual answers — verified by reasoning ✅

| Where | Claim | Note |
|-------|-------|------|
| refresher: ratios | 2:3, red 2→6 (×3), yellow 3×3 = **9** | distractor "7 cups" = adding 4 to both — the exact misconception. ✅ |
| refresher: solving eq | 3x − 5 = 10 → x = **5** | ✅ |
| refresher: square roots | √64 = **8** | distractor "32" = 64÷2, named in explanation. ✅ |
| refresher: negatives | −2 − 6 = **−8** | ✅ |
| refresher: coordinates | 4 left, 1 up = **(−4, 1)** | ✅ |
| refresher: fractions | 2/5 = **0.4** | ✅ |
| dilations Q3 | dilation preserves **angle measures** (not lengths/perimeter) | similar, not congruent. ✅ |
| symmetry Q2 | square min rotation = 360÷4 = **90°** | ✅ |
| symmetry Q3 | parallelogram = rotation-only; isosceles △ = reflection-only; pentagon = both | ✅ |

---

## C. Glossary definitions — reviewed (your call on wording) ✅

All six are correct; two carry a harmless HS-level simplification you may want
to eyeball:

- **preimage / image** — standard, prime-mark convention noted. ✅
- **rigid motion** — "preserves distance and angle measure." (Distance alone
  already implies angle; stating both is a fine teaching choice.) ✅
- **line of reflection** — "perpendicular bisector of every segment joining a
  point to its image." (True for points off the line; points *on* the line are
  fixed — not worth complicating for 9–10.) ✅
- **center of rotation** — "every point and its image lie on a circle centered
  there." (The center itself is the degenerate case; fine.) ✅
- **congruent** — "iff a sequence of rigid motions maps one onto the other" —
  exactly the NYS Next Gen framing. ✅

---

## D. SME judgment calls (not math errors — pedagogy/wording)

These are yours to bless or tweak; none are wrong:

1. **Refresher self-checks are untracked by design** — a wrong answer gives
   feedback but records nothing. Confirm that's the tone you want for
   remediation (we decided yes in the grill).
2. **Predict-then-Check soft skip** — "Skip to the answer" is intentionally
   present but de-emphasized (teacher-pacing). Confirm.
3. **Sequences topic** is currently exposition-first. It's the prime candidate
   for the inquiry rewrite (explore→conjecture→test→formalize) post-merge.
4. **Distractor quality** — each MC wrong answer encodes a named misconception
   (add-instead-of-multiply, halve-instead-of-root, order-doesn't-matter).
   Worth a glance that these match what you see in your classroom.

---

## How to look at it yourself (three ways)

1. **This sheet** — fastest; everything checkable is here.
2. **On GitHub** — each PR's *Files changed* tab. Content lives in:
   `apps/resources/content/_refreshers/`, `.../_glossary/`, and the topic
   `.mdx` files under `.../geometry/transformations/`.
3. **Rendered locally** (to see KaTeX + the interactives):
   `pnpm --filter resources dev` → visit `/geometry/transformations/<topic>`
   and `/glossary`.
