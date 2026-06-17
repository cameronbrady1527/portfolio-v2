---
"@cameronbrady/math-components": patch
---

Triangle tools now show congruence (hatch) tick marks on equal sides and label
each side with its length.

- `TriangleLab`, `ExteriorAngle`, and `TriangleInequality` draw dynamic
  single/double/triple hatch marks on sides that share a length, so dragging the
  figure into an isosceles or equilateral shape reads as congruent at a glance.
  Marks appear only in the resting state and are drawn in figure ink.
  (`IsoscelesTriangle` and `Midsegment` keep their existing marks.)
- `TriangleInequality` labels each stick with its measured length (e.g. `a = 6`).
