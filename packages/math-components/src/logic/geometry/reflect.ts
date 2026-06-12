/**
 * Pure reflection math + a transform dispatcher.
 *
 * Substrate-free: no React, no DOM, no mafs. Runs in the node vitest env.
 */
import type {
  Pt,
  ReflectLine,
  Shape,
  Transform,
  TranslateParams,
  RotateParams,
} from "./types";
import { translate } from "./translate";
import { rotate } from "./rotate";
import { dilate, type DilateParams } from "./dilate";
import { stretch, type StretchParams } from "./stretch";

/** Reflect a single point across a line. */
function reflectPt(p: Pt, line: ReflectLine): Pt {
  switch (line.kind) {
    case "axis":
      // x-axis: (x,y) -> (x,-y) ; y-axis: (x,y) -> (-x,y)
      return line.axis === "x" ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y };
    case "diagonal":
      // y = x : (x,y) -> (y,x) ; y = -x : (x,y) -> (-y,-x)
      return line.slope === 1
        ? { x: p.y, y: p.x }
        : { x: -p.y, y: -p.x };
    case "linear":
      return reflectAcrossLinear(p, line.m, line.b);
  }
}

/**
 * Reflect a point across the line y = m·x + b using the standard formula.
 *
 * Writing the line as m·x - y + b = 0 (so a = m, b' = -1, c = b), the
 * reflection of (x0, y0) is:
 *   d = (a·x0 + b'·y0 + c) / (a² + b'²)
 *   x' = x0 - 2·a·d
 *   y' = y0 - 2·b'·d
 */
function reflectAcrossLinear(p: Pt, m: number, b: number): Pt {
  const a = m;
  const bb = -1;
  const c = b;
  const d = (a * p.x + bb * p.y + c) / (a * a + bb * bb);
  return {
    x: p.x - 2 * a * d,
    y: p.y - 2 * bb * d,
  };
}

/**
 * Reflect a shape across a line. Applies vertex-wise to segments and
 * polygons, preserving vertex order and any label.
 */
export function reflect(shape: Shape, line: ReflectLine): Shape {
  switch (shape.type) {
    case "point":
      return { type: "point", at: reflectPt(shape.at, line), label: shape.label };
    case "segment":
      return {
        type: "segment",
        from: reflectPt(shape.from, line),
        to: reflectPt(shape.to, line),
        label: shape.label,
      };
    case "polygon":
      return {
        type: "polygon",
        vertices: shape.vertices.map((v) => reflectPt(v, line)),
        label: shape.label,
      };
  }
}

/**
 * Single dispatcher used by the Grapher, routing each transform kind to its
 * pure implementation (reflection #7, translation #9, rotation #10).
 *
 * The overloads keep the call type-safe per transform kind.
 */
export function applyTransform(
  shape: Shape,
  transform: "reflection",
  params: ReflectLine,
): Shape;
export function applyTransform(
  shape: Shape,
  transform: "translation",
  params: TranslateParams,
): Shape;
export function applyTransform(
  shape: Shape,
  transform: "rotation",
  params: RotateParams,
): Shape;
export function applyTransform(
  shape: Shape,
  transform: "dilation",
  params: DilateParams,
): Shape;
export function applyTransform(
  shape: Shape,
  transform: "stretch",
  params: StretchParams,
): Shape;
export function applyTransform(
  shape: Shape,
  transform: Transform,
  params: ReflectLine | TranslateParams | RotateParams | DilateParams | StretchParams,
): Shape {
  switch (transform) {
    case "reflection":
      return reflect(shape, params as ReflectLine);
    case "translation": {
      const p = params as TranslateParams;
      return translate(shape, p.dx, p.dy);
    }
    case "rotation": {
      const p = params as RotateParams;
      return rotate(shape, p.angle as 90 | 180 | 270 | -90, p.about);
    }
    case "dilation":
      return dilate(shape, params as DilateParams);
    case "stretch":
      return stretch(shape, params as StretchParams);
  }
}
