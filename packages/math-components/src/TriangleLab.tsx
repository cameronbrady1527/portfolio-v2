"use client";

/**
 * <TriangleLab> — reshape a triangle by its SAS parameters (two sides + the
 * included angle) and watch one invariant hold: the interior angles always sum
 * to 180°. This slice ships the angle-sum lens as a live readout only — no
 * proof animation (that is a separate slice).
 *
 * Single source of truth: React state holds only the three SAS control values.
 * The figure and the angle readout are useMemo-derived from them and from the
 * pure `triangle` module — the UI never eyeballs an angle. Dragging a vertex
 * recomputes the SAS params from the three points and writes them back, so the
 * sliders and the drag-handles stay in lockstep. Zero-stakes: nothing recorded.
 */
import { useMemo, useState } from "react";
import { Coordinates, Mafs, MovablePoint, Polygon } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import {
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
  type Pt,
} from "./logic";

const TRIANGLE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const ACCENT_COLOR = "var(--cbmc-image-color, #1f8a5b)";

export interface TriangleLabProps {
  /** Initial length of side AB (the side laid along +x from A). */
  sideB?: number;
  /** Initial length of side AC. */
  sideC?: number;
  /** Initial included angle ∠BAC, in degrees (0 < θ < 180). */
  includedAngleDeg?: number;
  className?: string;
}

const SIDE_MIN = 1;
const SIDE_MAX = 10;
const ANGLE_MIN = 5;
const ANGLE_MAX = 175;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/** SAS params recovered from three vertices, clamped into the control ranges. */
function sasFromVertices(verts: Pt[]): {
  sideB: number;
  sideC: number;
  includedAngleDeg: number;
} {
  const [a, b, c] = verts;
  const sideB = Math.hypot(b.x - a.x, b.y - a.y);
  const sideC = Math.hypot(c.x - a.x, c.y - a.y);
  const [angA] = triangleAngles(verts);
  return {
    sideB: clamp(sideB, SIDE_MIN, SIDE_MAX),
    sideC: clamp(sideC, SIDE_MIN, SIDE_MAX),
    includedAngleDeg: clamp(angA, ANGLE_MIN, ANGLE_MAX),
  };
}

export function TriangleLab({
  sideB: sideB0 = 5,
  sideC: sideC0 = 7,
  includedAngleDeg: angle0 = 40,
  className,
}: TriangleLabProps) {
  // The ONLY state: the three SAS control values (single source of truth).
  const [sideB, setSideB] = useState(sideB0);
  const [sideC, setSideC] = useState(sideC0);
  const [includedAngleDeg, setAngle] = useState(angle0);

  // Everything else is derived — no per-frame setState beyond the params above.
  const vertices = useMemo(
    () => triangleFromSAS(sideB, sideC, includedAngleDeg),
    [sideB, sideC, includedAngleDeg],
  );
  const angles = useMemo(() => triangleAngles(vertices), [vertices]);
  const bounds = useMemo(
    () => autoBounds([{ type: "polygon", vertices }]),
    [vertices],
  );

  const [A, B, C] = vertices;
  // Round so the displayed parts sum EXACTLY to the total — the invariance lens
  // must never show 179° or 181° from naive per-angle rounding.
  const [angA, angB, angC] = useMemo(() => roundAnglesToSum(angles), [angles]);
  const sum = angA + angB + angC;

  // Dragging vertex B or C reshapes the triangle; recompute SAS and write back.
  // (Vertex A is the canonical anchor at the origin.)
  const onDrag = (which: "B" | "C", [x, y]: [number, number]) => {
    const next = which === "B" ? [A, { x, y }, C] : [A, B, { x, y }];
    const sas = sasFromVertices(next);
    setSideB(sas.sideB);
    setSideC(sas.sideC);
    setAngle(sas.includedAngleDeg);
  };

  return (
    <div className={["cbmc-triangle-lab", className].filter(Boolean).join(" ")}>
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
          <Polygon
            points={vertices.map((v) => [v.x, v.y] as [number, number])}
            color={TRIANGLE_COLOR}
          />
          <VertexLabels vertices={vertices} color={TRIANGLE_COLOR} />
          <MovablePoint
            point={[B.x, B.y]}
            onMove={(p) => onDrag("B", p as [number, number])}
            color={ACCENT_COLOR}
          />
          <MovablePoint
            point={[C.x, C.y]}
            onMove={(p) => onDrag("C", p as [number, number])}
            color={ACCENT_COLOR}
          />
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        Reshape the triangle with the sliders — or drag vertex B or C — and watch
        the angle sum hold steady.
      </p>

      <div className="cbmc-controls" role="group" aria-label="Triangle parameters">
        <label className="cbmc-control">
          <span>Side AB: {Number(sideB.toFixed(2))}</span>
          <input
            type="range"
            aria-label="Side AB"
            min={SIDE_MIN}
            max={SIDE_MAX}
            step={0.1}
            value={sideB}
            onChange={(e) => setSideB(Number(e.target.value))}
          />
        </label>
        <label className="cbmc-control">
          <span>Side AC: {Number(sideC.toFixed(2))}</span>
          <input
            type="range"
            aria-label="Side AC"
            min={SIDE_MIN}
            max={SIDE_MAX}
            step={0.1}
            value={sideC}
            onChange={(e) => setSideC(Number(e.target.value))}
          />
        </label>
        <label className="cbmc-control">
          <span>Included angle ∠A: {Math.round(includedAngleDeg)}°</span>
          <input
            type="range"
            aria-label="Included angle"
            min={ANGLE_MIN}
            max={ANGLE_MAX}
            step={1}
            value={includedAngleDeg}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="cbmc-progress" role="status" aria-live="polite">
        ∠A + ∠B + ∠C = {angA}° + {angB}° + {angC}° = {sum}°
      </p>
    </div>
  );
}
