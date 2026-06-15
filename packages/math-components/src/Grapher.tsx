"use client";

/**
 * <Grapher> — an interactive geometry figure for the Math Resources Hub.
 *
 * mafs is the rendering substrate, but it is fully encapsulated here: the
 * PUBLIC surface (GrapherProps / GrapherSpec / Control DSL in ./GrapherTypes)
 * speaks only the geometry module's substrate-free `Shape`/`Pt`/`ReflectLine`.
 *
 * Controls-first: any Param wrapped via slider()/choose() renders a native,
 * keyboard-operable labeled control that drives the figure live. The computed
 * image is produced by the pure geometry module (applyTransform), which
 * handles all three transform kinds (reflection/translation/rotation).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Line, Text } from "mafs";
import "mafs/core.css";
import type { Pt, Shape } from "./logic";
import { applySequence } from "./logic";
import {
  isControl,
  type GrapherProps,
  type ReflectLineSpec,
  type SliderControl,
  type ChooseControl,
} from "./GrapherTypes";
import {
  stableBounds,
  autoCaption,
  computeImage,
  controlKey,
  edgeMeasurements,
  forEachControl,
  initialParams,
  stepCaption,
} from "./grapherLogic";

// Colors come from the package's themeable CSS variables (see styles.css),
// each with a sane default so the figure renders correctly with no stylesheet.
const PREIMAGE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const IMAGE_COLOR = "var(--cbmc-image-color, #1f8a5b)"; // resources green accent
const GHOST_COLOR = "var(--cbmc-ghost-color, #9aa89f)"; // faded intermediates

function toShapes(s: Shape | Shape[]): Shape[] {
  return Array.isArray(s) ? s : [s];
}

const PRIME = "′"; // ′

/** The letter for each vertex: A, B, C…, or the shape's own label if it fits. */
function vertexLetters(
  shape: Extract<Shape, { type: "polygon" }>,
  primeLabel: boolean,
): string[] {
  const n = shape.vertices.length;
  const base =
    shape.label && shape.label.length === n
      ? shape.label.split("")
      : Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  return base.map((ch) => (primeLabel ? `${ch}${PRIME}` : ch));
}

/** Place a vertex label just outside the polygon, along the centroid→vertex ray. */
function labelAnchor(v: Pt, centroid: Pt, primeLabel: boolean): Pt {
  const dx = v.x - centroid.x;
  const dy = v.y - centroid.y;
  const len = Math.hypot(dx, dy) || 1;
  // Image labels sit a touch further out so A and A′ never coincide when the
  // image overlaps the preimage (the deterministic preimage/image offset rule).
  const off = primeLabel ? 0.62 : 0.45;
  return { x: v.x + (dx / len) * off, y: v.y + (dy / len) * off };
}

/** Render one shape onto the mafs plane. mafs types never escape this module. */
function ShapeView({
  shape,
  color,
  dashed,
  primeLabel,
  labelVertices = true,
}: {
  shape: Shape;
  color: string;
  dashed: boolean;
  primeLabel: boolean;
  /** Label polygon vertices A,B,C / A′,B′,C′. Off for faded ghost trails. */
  labelVertices?: boolean;
}) {
  const style = dashed ? "dashed" : "solid";
  const label = shape.label
    ? primeLabel
      ? `${shape.label}${PRIME}`
      : shape.label
    : undefined;

  switch (shape.type) {
    case "point":
      return (
        <>
          <Point x={shape.at.x} y={shape.at.y} color={color} />
          {label ? <PointLabel at={shape.at} text={label} color={color} /> : null}
        </>
      );
    case "segment":
      return (
        <Line.Segment
          point1={[shape.from.x, shape.from.y]}
          point2={[shape.to.x, shape.to.y]}
          color={color}
          style={style}
        />
      );
    case "polygon": {
      const vs = shape.vertices;
      const centroid: Pt = {
        x: vs.reduce((s, v) => s + v.x, 0) / vs.length,
        y: vs.reduce((s, v) => s + v.y, 0) / vs.length,
      };
      const letters = vertexLetters(shape, primeLabel);
      return (
        <>
          <Polygon
            points={vs.map((v) => [v.x, v.y] as [number, number])}
            color={color}
            fillOpacity={dashed ? 0.05 : 0.12}
            strokeStyle={style}
          />
          {labelVertices
            ? vs.map((v, i) => {
                const a = labelAnchor(v, centroid, primeLabel);
                return (
                  <Text key={`vl-${i}`} x={a.x} y={a.y} size={18} color={color}>
                    {letters[i]}
                  </Text>
                );
              })
            : null}
        </>
      );
    }
  }
}

function PointLabel({
  at,
  text,
  color,
}: {
  at: Pt;
  text: string;
  color: string;
}) {
  // Lazy import-free label: reuse mafs Point's coordinate space via a small text.
  return (
    <text
      x={at.x}
      y={at.y}
      fill={color}
      fontSize={0.5}
      transform={`translate(0.2, -0.2)`}
      style={{
        pointerEvents: "none",
        fontFamily: "var(--cbmc-font, var(--font-sans, sans-serif))",
      }}
    >
      {text}
    </text>
  );
}

/** A single auto-derived, keyboard-operable control. */
function ControlField({
  id,
  ctrl,
  value,
  onValue,
}: {
  id: string;
  ctrl: SliderControl | ChooseControl<string | number>;
  value: number | string;
  onValue: (v: number | string) => void;
}) {
  const label = ctrl.label ?? id;
  if (ctrl.control === "slider") {
    return (
      <div className="cbmc-control-row">
        <label htmlFor={id} className="cbmc-control-label">
          {label}
        </label>
        <input
          id={id}
          type="range"
          className="cbmc-range"
          min={ctrl.min}
          max={ctrl.max}
          step={ctrl.step}
          value={Number(value)}
          onChange={(e) => onValue(Number(e.target.value))}
        />
        <output htmlFor={id} className="cbmc-control-value">
          {value}
        </output>
      </div>
    );
  }
  // A choose() renders as a segmented button group: every option visible at
  // once (no hidden dropdown), the active one tinted. Preserves option types.
  return (
    <div className="cbmc-control-row">
      <span id={`${id}-label`} className="cbmc-control-label">
        {label}
      </span>
      <div
        className="cbmc-controls cbmc-segmented"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {ctrl.options.map((o) => {
          const selected = String(o) === String(value);
          return (
            <button
              key={String(o)}
              type="button"
              className="cbmc-chip"
              aria-pressed={selected}
              onClick={() => onValue(o)}
            >
              {String(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The line of reflection drawn on the plane (so the symmetry is visible). */
function ReflectLineView({ over }: { over: ReflectLineSpec }) {
  const lineColor = "var(--cbmc-line-color, #43564b)";
  if (over.kind === "axis") {
    // axes are already drawn by Coordinates; emphasise nothing extra.
    return null;
  }
  if (over.kind === "diagonal") {
    const slope = isControl(over.slope) ? over.slope.value : over.slope;
    return (
      <Line.PointSlope
        point={[0, 0]}
        slope={slope}
        color={lineColor}
        style="dashed"
      />
    );
  }
  return (
    <Line.PointSlope
      point={[0, over.b]}
      slope={over.m}
      color={lineColor}
      style="dashed"
    />
  );
}

export function Grapher({ spec, onChange, className }: GrapherProps) {
  const [params, setParams] = useState<Record<string, number | string>>(() =>
    initialParams(spec.transform),
  );

  const preimageShapes = useMemo(() => toShapes(spec.preimage), [spec.preimage]);

  // Sequence mode: an array transform is played step by step (0 = start).
  const sequence = Array.isArray(spec.transform) ? spec.transform : null;
  const [stepIndex, setStepIndex] = useState(0);
  const sequenceTrails = useMemo(
    () =>
      sequence
        ? preimageShapes.map((s) => applySequence(s, sequence))
        : null,
    [sequence, preimageShapes],
  );

  const image = useMemo(() => {
    if (sequenceTrails) {
      if (stepIndex === 0) return null;
      return sequenceTrails.map((trail) => trail[stepIndex - 1]);
    }
    return computeImage(spec, params);
  }, [spec, params, sequenceTrails, stepIndex]);

  // A FIXED viewport: depends only on the spec, never on the live params, so the
  // grid holds still and the shape moves within it as the user drives controls.
  const bounds = useMemo(() => stableBounds(spec), [spec]);

  const caption = useMemo(
    () =>
      spec.caption ??
      (sequence ? stepCaption(spec, stepIndex) : autoCaption(spec, params)),
    [spec, params, sequence, stepIndex],
  );

  const setParam = useCallback((key: string, value: number | string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Fire onChange after a control-driven param commit (skip the initial mount).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!onChange) return;
    const img = computeImage(spec, params);
    onChange({ params, image: img ?? spec.preimage });
  }, [params, onChange, spec]);

  // Build the control list (path -> control descriptor) in declaration order.
  const controls = useMemo(() => {
    const list: Array<{
      key: string;
      ctrl: SliderControl | ChooseControl<string | number>;
    }> = [];
    forEachControl(spec.transform, (path, ctrl) => {
      list.push({
        key: controlKey(path, ctrl.label),
        ctrl: ctrl as SliderControl | ChooseControl<string | number>,
      });
    });
    return list;
  }, [spec.transform]);

  const showImage = spec.showImage !== false;
  const captionId = "grapher-caption";

  return (
    <figure
      className={["cbmc-grapher", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className="cbmc-graph-paper"
        style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}
      >
        <Mafs
          viewBox={{ x: bounds.x, y: bounds.y }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />
          {!Array.isArray(spec.transform) &&
          spec.transform.kind === "reflection" ? (
            <ReflectLineView over={spec.transform.over} />
          ) : null}

          {preimageShapes.map((s, i) => (
            <ShapeView
              key={`pre-${i}`}
              shape={s}
              color={PREIMAGE_COLOR}
              dashed={false}
              primeLabel={false}
            />
          ))}

          {sequenceTrails && stepIndex > 1
            ? sequenceTrails.flatMap((trail, ti) =>
                trail.slice(0, stepIndex - 1).map((s, i) => (
                  <ShapeView
                    key={`ghost-${ti}-${i}`}
                    shape={{ ...s, label: undefined }}
                    color={GHOST_COLOR}
                    dashed
                    primeLabel={false}
                    labelVertices={false}
                  />
                )),
              )
            : null}

          {showImage && image
            ? toShapes(image).map((s, i) => (
                <ShapeView
                  key={`img-${i}`}
                  shape={s}
                  color={IMAGE_COLOR}
                  dashed
                  primeLabel
                />
              ))
            : null}

          {spec.showMeasurements
            ? [
                ...preimageShapes.map((s, i) => ({ s, color: PREIMAGE_COLOR, k: `mp-${i}` })),
                ...(showImage && image
                  ? toShapes(image).map((s, i) => ({ s, color: IMAGE_COLOR, k: `mi-${i}` }))
                  : []),
              ].flatMap(({ s, color, k }) =>
                edgeMeasurements(s).map((m, j) => (
                  <Text
                    key={`${k}-${j}`}
                    x={m.at.x}
                    y={m.at.y}
                    size={14}
                    color={color}
                  >
                    {m.text}
                  </Text>
                )),
              )
            : null}
        </Mafs>
      </div>

      {sequence ? (
        <div
          role="group"
          aria-label="Sequence steps"
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((k) => Math.max(0, k - 1))}
          >
            Back
          </button>
          <button
            type="button"
            disabled={stepIndex >= sequence.length}
            onClick={() =>
              setStepIndex((k) => Math.min(sequence.length, k + 1))
            }
          >
            Next step
          </button>
        </div>
      ) : null}

      {controls.length > 0 ? (
        <div
          role="group"
          aria-label="Figure controls"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          {controls.map(({ key, ctrl }) => (
            <ControlField
              key={key}
              id={`grapher-ctrl-${key}`}
              ctrl={ctrl}
              value={params[key] ?? ctrl.value}
              onValue={(v) => setParam(key, v)}
            />
          ))}
        </div>
      ) : null}

      <figcaption
        id={captionId}
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--cbmc-caption-color, #43564b)",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

// Re-export the public DSL so consumers can `import { Grapher, slider, choose }`.
export { slider, choose } from "./GrapherTypes";
export type {
  GrapherSpec,
  GrapherProps,
  GrapherChange,
  TransformSpec,
  ReflectLineSpec,
  Control,
  Param,
  Pt,
  Shape,
} from "./GrapherTypes";
