/**
 * Pure helpers behind <Grapher>: param resolution, image computation, bounds
 * auto-fit, and a11y caption generation. No React, no mafs.
 */
import type { Pt, ReflectLine, Shape } from "./logic";
import { applyTransform } from "./logic";
import {
  isControl,
  type GrapherSpec,
  type Param,
  type ReflectLineSpec,
  type TransformSpec,
} from "./GrapherTypes";

/** Stable key for a control so its value can live in a record keyed by name. */
export function controlKey(
  path: string,
  label: string | undefined,
): string {
  return label && label.trim().length > 0 ? label : path;
}

/**
 * Resolve a Param to its current value, reading from the live `params` record
 * (keyed by control key) when the param is an interactive Control.
 */
export function resolveParam<T extends string | number>(
  param: Param<T>,
  path: string,
  params: Readonly<Record<string, number | string>>,
): T {
  if (!isControl(param)) return param;
  const key = controlKey(path, param.label);
  const live = params[key];
  return (live ?? param.value) as T;
}

/** Collect the initial params record (defaults) from every Control in a spec. */
export function initialParams(
  transform: TransformSpec,
): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  forEachControl(transform, (path, ctrl) => {
    out[controlKey(path, ctrl.label)] = ctrl.value;
  });
  return out;
}

/** Visit every interactive Control in a transform spec with its path. */
export function forEachControl(
  transform: TransformSpec,
  visit: (
    path: string,
    ctrl: { value: number | string; label?: string },
  ) => void,
): void {
  if (transform.kind === "reflection") {
    const over = transform.over;
    if (over.kind === "axis" && isControl(over.axis)) {
      visit("axis", over.axis);
    } else if (over.kind === "diagonal" && isControl(over.slope)) {
      visit("slope", over.slope);
    }
    // linear has only fixed m,b — no controls
  } else if (transform.kind === "translation") {
    if (isControl(transform.by.dx)) visit("dx", transform.by.dx);
    if (isControl(transform.by.dy)) visit("dy", transform.by.dy);
  } else if (transform.kind === "rotation") {
    if (isControl(transform.angle)) visit("angle", transform.angle);
  }
}

/** Build a concrete ReflectLine from a ReflectLineSpec + live params. */
export function resolveReflectLine(
  over: ReflectLineSpec,
  params: Readonly<Record<string, number | string>>,
): ReflectLine {
  if (over.kind === "axis") {
    return { kind: "axis", axis: resolveParam(over.axis, "axis", params) };
  }
  if (over.kind === "diagonal") {
    return { kind: "diagonal", slope: resolveParam(over.slope, "slope", params) };
  }
  return { kind: "linear", m: over.m, b: over.b };
}

/**
 * Compute the image of the preimage under the spec's transform + live params.
 * Handles all three transform kinds (reflection/translation/rotation).
 */
export function computeImage(
  spec: GrapherSpec,
  params: Readonly<Record<string, number | string>>,
): Shape | Shape[] | null {
  const { transform, preimage } = spec;
  let apply: (s: Shape) => Shape;
  if (transform.kind === "reflection") {
    const line = resolveReflectLine(transform.over, params);
    apply = (s) => applyTransform(s, "reflection", line);
  } else if (transform.kind === "translation") {
    const dx = resolveParam(transform.by.dx, "dx", params);
    const dy = resolveParam(transform.by.dy, "dy", params);
    apply = (s) => applyTransform(s, "translation", { dx, dy });
  } else {
    const angle = resolveParam(transform.angle, "angle", params);
    apply = (s) => applyTransform(s, "rotation", { about: transform.about, angle });
  }
  return Array.isArray(preimage) ? preimage.map(apply) : apply(preimage);
}

/** All points referenced by a shape (for bounds auto-fit). */
function shapePoints(shape: Shape): Pt[] {
  switch (shape.type) {
    case "point":
      return [shape.at];
    case "segment":
      return [shape.from, shape.to];
    case "polygon":
      return shape.vertices;
  }
}

/** Auto-fit symmetric-ish bounds around all given shapes, with padding. */
export function autoBounds(
  shapes: Shape[],
  pad = 1,
): { x: [number, number]; y: [number, number] } {
  const pts = shapes.flatMap(shapePoints);
  if (pts.length === 0) {
    return { x: [-5, 5], y: [-5, 5] };
  }
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  // Always include the origin so axes/lines of reflection are visible.
  minX = Math.min(minX, 0);
  maxX = Math.max(maxX, 0);
  minY = Math.min(minY, 0);
  maxY = Math.max(maxY, 0);
  return {
    x: [Math.floor(minX - pad), Math.ceil(maxX + pad)],
    y: [Math.floor(minY - pad), Math.ceil(maxY + pad)],
  };
}

/** Human-readable description of a reflection line. */
function describeLine(line: ReflectLine): string {
  switch (line.kind) {
    case "axis":
      return line.axis === "x" ? "the x-axis" : "the y-axis";
    case "diagonal":
      return line.slope === 1 ? "the line y = x" : "the line y = -x";
    case "linear": {
      const b =
        line.b === 0 ? "" : line.b > 0 ? ` + ${line.b}` : ` - ${-line.b}`;
      return `the line y = ${line.m}x${b}`;
    }
  }
}

/** Human-readable description of a single shape. */
function describeShape(shape: Shape): string {
  const name = shape.label ? `${shape.label} ` : "";
  switch (shape.type) {
    case "point":
      return `${name}point (${shape.at.x}, ${shape.at.y})`;
    case "segment":
      return `${name}segment`;
    case "polygon":
      return `${name}polygon with ${shape.vertices.length} vertices`;
  }
}

/** Auto-generate an a11y caption for the current figure. */
export function autoCaption(
  spec: GrapherSpec,
  params: Readonly<Record<string, number | string>>,
): string {
  const shapes = Array.isArray(spec.preimage)
    ? spec.preimage
    : [spec.preimage];
  const subject =
    shapes.length === 1
      ? describeShape(shapes[0])
      : `${shapes.length} shapes`;

  const t = spec.transform;
  if (t.kind === "reflection") {
    const line = resolveReflectLine(t.over, params);
    return `A ${subject} reflected across ${describeLine(line)}.`;
  }
  if (t.kind === "translation") {
    const dx = resolveParam(t.by.dx, "dx", params);
    const dy = resolveParam(t.by.dy, "dy", params);
    return `A ${subject} translated by the vector (${dx}, ${dy}).`;
  }
  const angle = resolveParam(t.angle, "angle", params);
  return `A ${subject} rotated ${angle}° about (${t.about.x}, ${t.about.y}).`;
}
