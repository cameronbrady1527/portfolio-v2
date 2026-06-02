/**
 * Canonical geometry types for the Math Resources Hub.
 *
 * These are the substrate-agnostic shapes the `<Grapher>` and the pure
 * transform module both speak. They intentionally carry NO dependency on
 * mafs (or any rendering library) so the transform math can be unit-tested in
 * a plain node environment.
 */

/** A point in the cartesian plane. */
export type Pt = { x: number; y: number };

/** A geometric figure that can be transformed and rendered. */
export type Shape =
  | { type: "point"; at: Pt; label?: string }
  | { type: "segment"; from: Pt; to: Pt; label?: string }
  | { type: "polygon"; vertices: Pt[]; label?: string };

/** A line of reflection. */
export type ReflectLine =
  | { kind: "axis"; axis: "x" | "y" }
  | { kind: "diagonal"; slope: 1 | -1 } // y = x | y = -x
  | { kind: "linear"; m: number; b: number }; // y = m·x + b

/**
 * The transform kinds the Grapher can express. Only `reflection` is
 * functional in slice #7; `translation` and `rotation` are reserved for
 * slices #9/#10 and throw when applied.
 */
export type Transform = "reflection" | "translation" | "rotation";

/** Parameters for a translation (slice #9). */
export type TranslateParams = { dx: number; dy: number };

/** Parameters for a rotation (slice #10). */
export type RotateParams = { about: Pt; angle: number };
