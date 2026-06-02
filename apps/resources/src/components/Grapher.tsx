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
import { Coordinates, Mafs, Point, Polygon, Line } from "mafs";
import "mafs/core.css";
import type { Pt, Shape } from "@/lib/geometry";
import {
  isControl,
  type GrapherProps,
  type ReflectLineSpec,
  type SliderControl,
  type ChooseControl,
} from "./GrapherTypes";
import {
  autoBounds,
  autoCaption,
  computeImage,
  controlKey,
  forEachControl,
  initialParams,
} from "./grapherLogic";

const PREIMAGE_COLOR = "var(--mafs-fg, #16231c)";
const IMAGE_COLOR = "#1f8a5b"; // resources green accent

function toShapes(s: Shape | Shape[]): Shape[] {
  return Array.isArray(s) ? s : [s];
}

/** Render one shape onto the mafs plane. mafs types never escape this module. */
function ShapeView({
  shape,
  color,
  dashed,
  primeLabel,
}: {
  shape: Shape;
  color: string;
  dashed: boolean;
  primeLabel: boolean;
}) {
  const style = dashed ? "dashed" : "solid";
  const label = shape.label
    ? primeLabel
      ? `${shape.label}'`
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
    case "polygon":
      return (
        <Polygon
          points={shape.vertices.map((v) => [v.x, v.y] as [number, number])}
          color={color}
          fillOpacity={dashed ? 0.05 : 0.12}
          strokeStyle={style}
        />
      );
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
      style={{ pointerEvents: "none", fontFamily: "var(--font-sans, sans-serif)" }}
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
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  } as const;
  if (ctrl.control === "slider") {
    return (
      <div style={rowStyle}>
        <label htmlFor={id} style={{ minWidth: "3rem" }}>
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={ctrl.min}
          max={ctrl.max}
          step={ctrl.step}
          value={Number(value)}
          onChange={(e) => onValue(Number(e.target.value))}
        />
        <output htmlFor={id}>{value}</output>
      </div>
    );
  }
  return (
    <div style={rowStyle}>
      <label htmlFor={id} style={{ minWidth: "3rem" }}>
        {label}
      </label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => {
          // Preserve numeric option types where the options are numbers.
          const opt = ctrl.options.find((o) => String(o) === e.target.value);
          onValue(opt ?? e.target.value);
        }}
      >
        {ctrl.options.map((o) => (
          <option key={String(o)} value={String(o)}>
            {String(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

/** The line of reflection drawn on the plane (so the symmetry is visible). */
function ReflectLineView({ over }: { over: ReflectLineSpec }) {
  const lineColor = "var(--mafs-grid-line, #43564b)";
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

  const image = useMemo(
    () => computeImage(spec, params),
    [spec, params],
  );

  const bounds = useMemo(() => {
    if (spec.bounds) return spec.bounds;
    const all = image ? [...preimageShapes, ...toShapes(image)] : preimageShapes;
    return autoBounds(all);
  }, [spec.bounds, preimageShapes, image]);

  const caption = useMemo(
    () => spec.caption ?? autoCaption(spec, params),
    [spec, params],
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
      className={className}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div className="graph-paper" style={{ borderRadius: "var(--radius, 0.5rem)" }}>
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
          {spec.transform.kind === "reflection" ? (
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
        </Mafs>
      </div>

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
          color: "var(--muted-foreground, #43564b)",
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
} from "./GrapherTypes";
