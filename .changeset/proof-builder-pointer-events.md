---
"@cameronbrady/math-components": patch
---

Fix two "have to click twice" bugs in the proof builder, both from decorative
content stealing the first pointer click:

- Rendered KaTeX inside a labelled control (statement/reason tiles) is now
  `pointer-events: none`, so a tile seats on the FIRST click instead of the
  second (its nested sub-spans were swallowing the initial mousedown/up).
- In proof figures, only the interactive hit-regions receive pointer events; the
  decorative angle arcs / ticks / labels / crossing lines no longer intercept the
  click meant for the region beneath, so selecting an angle to highlight it works
  reliably.

Also sharpen the "you are here" affordance: the active row carries an accent
left-bar and the row instruction is set in that same accent colour.
