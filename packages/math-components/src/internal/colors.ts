/**
 * Shared figure palette (CSS-var driven, with literal fallbacks). One source of
 * truth so every tool colours preimage/image/target/muted and the three angle
 * hues identically — re-themeable by overriding the --cbmc-* custom properties.
 */
export const PREIMAGE = "var(--cbmc-preimage-color, #16231c)"; // the original figure / ink
export const IMAGE = "var(--cbmc-image-color, #1f8a5b)"; // the highlighted / transformed thing
export const TARGET = "var(--cbmc-target-color, #b4540a)"; // a second emphasis line/element
export const MUTED = "var(--cbmc-muted, #6b6353)"; // de-emphasized secondary
export const ACCENT = "var(--cbmc-accent, #176844)"; // action + current-step accent
export const CAPTION = "var(--cbmc-caption-color, #43564b)"; // a11y caption text

// Three distinct corner hues (used where up to three things must be told apart,
// e.g. a triangle's vertices). Distinct from the green IMAGE highlight.
export const ANGLE_A = "var(--cbmc-angle-a, #b4540a)";
export const ANGLE_B = "var(--cbmc-angle-b, #2563b4)";
export const ANGLE_C = "var(--cbmc-angle-c, #7a3fb0)";
