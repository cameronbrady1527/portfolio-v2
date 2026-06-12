/**
 * Pure helpers behind <Grapher>: param resolution, image computation, bounds
 * auto-fit, and a11y caption generation. No React, no mafs.
 */
import type { Pt, ReflectLine, Shape, TransformStep } from "./logic";
import { applyTransform, applySequence } from "./logic";
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
  transform: TransformSpec | TransformStep[],
): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  forEachControl(transform, (path, ctrl) => {
    out[controlKey(path, ctrl.label)] = ctrl.value;
  });
  return out;
}

/** Visit every interactive Control in a transform spec with its path. */
export function forEachControl(
  transform: TransformSpec | TransformStep[],
  visit: (
    path: string,
    ctrl: { value: number | string; label?: string },
  ) => void,
): void {
  // A sequence is fixed data in v1 — it exposes no interactive controls.
  if (Array.isArray(transform)) return;
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
  } else if (transform.kind === "dilation") {
    if (isControl(transform.factor)) visit("factor", transform.factor);
  } else if (transform.kind === "stretch") {
    if (isControl(transform.axis)) visit("axis", transform.axis);
    if (isControl(transform.factor)) visit("factor", transform.factor);
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
  if (Array.isArray(transform)) {
    apply = (s) => applySequence(s, transform).at(-1) ?? s;
  } else if (transform.kind === "reflection") {
    const line = resolveReflectLine(transform.over, params);
    apply = (s) => applyTransform(s, "reflection", line);
  } else if (transform.kind === "translation") {
    const dx = resolveParam(transform.by.dx, "dx", params);
    const dy = resolveParam(transform.by.dy, "dy", params);
    apply = (s) => applyTransform(s, "translation", { dx, dy });
  } else if (transform.kind === "rotation") {
    const angle = resolveParam(transform.angle, "angle", params);
    apply = (s) => applyTransform(s, "rotation", { about: transform.about, angle });
  } else if (transform.kind === "dilation") {
    const factor = resolveParam(transform.factor, "factor", params);
    apply = (s) => applyTransform(s, "dilation", { about: transform.about, factor });
  } else {
    const axis = resolveParam(transform.axis, "axis", params);
    const factor = resolveParam(transform.factor, "factor", params);
    apply = (s) => applyTransform(s, "stretch", { axis, factor });
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
  if (Array.isArray(t)) {
    return stepCaption(spec, t.length);
  }
  if (t.kind === "reflection") {
    const line = resolveReflectLine(t.over, params);
    return `A ${subject} reflected across ${describeLine(line)}.`;
  }
  if (t.kind === "translation") {
    const dx = resolveParam(t.by.dx, "dx", params);
    const dy = resolveParam(t.by.dy, "dy", params);
    return `A ${subject} translated by the vector (${dx}, ${dy}).`;
  }
  if (t.kind === "rotation") {
    const angle = resolveParam(t.angle, "angle", params);
    return `A ${subject} rotated ${angle}° about (${t.about.x}, ${t.about.y}).`;
  }
  if (t.kind === "dilation") {
    const factor = resolveParam(t.factor, "factor", params);
    return `A ${subject} dilated about (${t.about.x}, ${t.about.y}) by a scale factor of ${factor}.`;
  }
  const axis = resolveParam(t.axis, "axis", params);
  const factor = resolveParam(t.factor, "factor", params);
  const direction = axis === "x" ? "horizontally" : "vertically";
  return `A ${subject} stretched ${direction} by a factor of ${factor}.`;
}

/** One edge's measurement: midpoint anchor, exact length, display text. */
export type EdgeMeasurement = { at: Pt; length: number; text: string };

function measureEdge(a: Pt, b: Pt): EdgeMeasurement {
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  // Trim to 2 decimals for display, dropping trailing zeros ("3", "1.41").
  const text = String(Number(length.toFixed(2)));
  return { at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, length, text };
}

/**
 * Side-length measurements for a shape (the opt-in `showMeasurements` layer):
 * one entry per edge, anchored at the edge midpoint. Points have no edges.
 */
export function edgeMeasurements(shape: Shape): EdgeMeasurement[] {
  switch (shape.type) {
    case "point":
      return [];
    case "segment":
      return [measureEdge(shape.from, shape.to)];
    case "polygon":
      return shape.vertices.map((v, i) =>
        measureEdge(v, shape.vertices[(i + 1) % shape.vertices.length]),
      );
  }
}

/** Human-readable description of one resolved sequence step. */
export function describeStep(step: TransformStep): string {
  switch (step.kind) {
    case "reflection":
      return `reflected across ${describeLine(step.over)}`;
    case "translation":
      return `translated by the vector (${step.by.dx}, ${step.by.dy})`;
    case "rotation":
      return `rotated ${step.angle}\u00b0 about (${step.about.x}, ${step.about.y})`;
    case "dilation":
      return `dilated about (${step.about.x}, ${step.about.y}) by a scale factor of ${step.factor}`;
    case "stretch":
      return `stretched ${step.axis === "x" ? "horizontally" : "vertically"} by a factor of ${step.factor}`;
  }
}

/**
 * Caption for a sequence spec at step k (0 = before any steps). Falls back to
 * the regular caption for non-sequence specs.
 */
export function stepCaption(spec: GrapherSpec, k: number): string {
  const t = spec.transform;
  if (!Array.isArray(t)) return autoCaption(spec, initialParams(t));
  const shapes = Array.isArray(spec.preimage) ? spec.preimage : [spec.preimage];
  const subject =
    shapes.length === 1 ? describeShape(shapes[0]) : `${shapes.length} shapes`;
  if (k <= 0) {
    return `A ${subject} before any of the ${t.length} steps.`;
  }
  const step = t[Math.min(k, t.length) - 1];
  return `Step ${Math.min(k, t.length)} of ${t.length}: ${describeStep(step)}.`;
}
