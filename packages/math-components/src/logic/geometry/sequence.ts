/**
 * Pure sequence (composition) of transformations — GEO-G.CO.5/G.CO.6.
 *
 * A sequence applies transforms in order; the intermediate images are
 * first-class data so a UI can show the ghost trail. Order is significant:
 * composition of transformations is not commutative in general.
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 */
import type { Pt, ReflectLine, Shape, TranslateParams } from "./types";
import { applyTransform } from "./reflect";
import type { DilateParams } from "./dilate";
import type { StretchParams } from "./stretch";

/** One fully-resolved step of a sequence (no interactive params). */
export type TransformStep =
  | { kind: "reflection"; over: ReflectLine }
  | { kind: "translation"; by: TranslateParams }
  | { kind: "rotation"; about: Pt; angle: number }
  | { kind: "dilation"; about: Pt; factor: number }
  | { kind: "stretch"; axis: "x" | "y"; factor: number };

/** Apply one resolved step to a shape. */
export function applyStep(shape: Shape, step: TransformStep): Shape {
  switch (step.kind) {
    case "reflection":
      return applyTransform(shape, "reflection", step.over);
    case "translation":
      return applyTransform(shape, "translation", step.by);
    case "rotation":
      return applyTransform(shape, "rotation", {
        about: step.about,
        angle: step.angle,
      });
    case "dilation": {
      const params: DilateParams = { about: step.about, factor: step.factor };
      return applyTransform(shape, "dilation", params);
    }
    case "stretch": {
      const params: StretchParams = { axis: step.axis, factor: step.factor };
      return applyTransform(shape, "stretch", params);
    }
  }
}

/**
 * Apply a sequence of steps, returning every intermediate image in order
 * (one per step). The final element is the image of the whole sequence;
 * an empty sequence yields an empty array.
 */
export function applySequence(shape: Shape, steps: TransformStep[]): Shape[] {
  const images: Shape[] = [];
  let current = shape;
  for (const step of steps) {
    current = applyStep(current, step);
    images.push(current);
  }
  return images;
}
