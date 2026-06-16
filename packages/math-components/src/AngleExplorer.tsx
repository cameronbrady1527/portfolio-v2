"use client";

/**
 * <AngleExplorer> — two lines crossed by a transversal, with the angle
 * relationships read straight off the pure `transversalAngles` module. The UI
 * never eyeballs an angle: every measure and verdict in the readout comes from
 * angles.ts.
 *
 * This slice ships the VERTICAL-ANGLES lens only: a keyboard-operable
 * transversal-angle slider drives the figure, and an aria-live readout names a
 * vertical-angle pair and its measure. Later slices add the lens toggle and the
 * other relationships. Zero-stakes: nothing is recorded anywhere.
 *
 * Performance: React state holds only the control value (transversalDir); the
 * whole figure is useMemo-derived from it (the SymmetryExplorer pattern). No
 * per-frame setState.
 */
import { useId, useMemo, useState } from "react";
import { Coordinates, Mafs, Line, Polyline } from "mafs";
import "mafs/core.css";
import { transversalAngles, type AngleId } from "./logic";
import type { Pt } from "./logic";

const LINE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const TRANSVERSAL_COLOR = "var(--cbmc-target-color, #b4540a)";
const MARK_COLOR = "var(--cbmc-image-color, #1f8a5b)";

// Cosmetic geometry only — positions never affect the math. The two lines sit a
// fixed distance above/below the origin; the transversal passes through it.
const LINE1_THROUGH: Pt = { x: 0, y: 1.5 };
const LINE2_THROUGH: Pt = { x: 0, y: -1.5 };
const ORIGIN: Pt = { x: 0, y: 0 };
const VIEW = 6;

export interface AngleExplorerProps {
  /** Direction angle of the first line, degrees. Default 0 (horizontal). */
  line1Dir?: number;
  /** Direction angle of the second line, degrees. Default 0 (horizontal). */
  line2Dir?: number;
  /** Initial transversal direction angle, degrees. Default 60. */
  transversalDir?: number;
  className?: string;
}

const fmt = (a: number) => `${Math.round(a * 10) / 10}°`;

/** Intersection of the transversal (through `ORIGIN` at `tDir`) with a line
 *  (through `linePt` at `lineDir`). Used for rendering the arcs only. */
function intersect(linePt: Pt, lineDir: number, tDir: number): Pt {
  const D = Math.PI / 180;
  const lu = { x: Math.cos(lineDir * D), y: Math.sin(lineDir * D) };
  const tu = { x: Math.cos(tDir * D), y: Math.sin(tDir * D) };
  // Solve linePt + s·lu = ORIGIN + u·tu.
  const det = lu.x * -tu.y - lu.y * -tu.x;
  if (Math.abs(det) < 1e-9) return linePt; // parallel-to-transversal guard
  const rx = ORIGIN.x - linePt.x;
  const ry = ORIGIN.y - linePt.y;
  const s = (rx * -tu.y - ry * -tu.x) / det;
  return { x: linePt.x + s * lu.x, y: linePt.y + s * lu.y };
}

/** Sample a small arc (radius r) from angle a0 to a1 (degrees) about `c`. */
function arcPoints(c: Pt, a0: number, a1: number, r = 0.6): [number, number][] {
  const D = Math.PI / 180;
  const n = 16;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D;
    pts.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
  }
  return pts;
}

export function AngleExplorer({
  line1Dir = 0,
  line2Dir = 0,
  transversalDir = 60,
  className,
}: AngleExplorerProps) {
  const [tDir, setTDir] = useState(transversalDir);
  const sliderId = useId();

  // The whole figure + all verdicts are derived from the control value.
  const figure = useMemo(() => {
    const result = transversalAngles({ line1Dir, line2Dir, transversalDir: tDir });

    // Highlight one vertical pair at the first intersection: slots 1 & 4.
    const lensPair = result.pairs.find(
      (p) =>
        p.relationship === "vertical" &&
        p.angles[0] === 1 &&
        p.angles[1] === 4,
    );
    const [idA, idB] = lensPair!.angles;

    const c1 = intersect(LINE1_THROUGH, line1Dir, tDir);

    // Arc directions: bound by the line ray (lineDir) and the transversal ray
    // (tDir). Slot 1 opens between tDir and line1Dir; slot 4 is its vertical
    // (opposite) twin, i.e. the two rays advanced by 180°.
    const markA = arcPoints(c1, line1Dir, tDir);
    const markB = arcPoints(c1, line1Dir + 180, tDir + 180);

    return { result, idA, idB, markA, markB };
  }, [line1Dir, line2Dir, tDir]);

  const { result, idA, idB, markA, markB } = figure;
  const measureA = result.angles[idA].measure;
  const measureB = result.angles[idB].measure;

  const lineSeg = (through: Pt, dir: number): [[number, number], [number, number]] => {
    const D = Math.PI / 180;
    const u = { x: Math.cos(dir * D), y: Math.sin(dir * D) };
    const L = VIEW * 2;
    return [
      [through.x - L * u.x, through.y - L * u.y],
      [through.x + L * u.x, through.y + L * u.y],
    ];
  };

  const l1 = lineSeg(LINE1_THROUGH, line1Dir);
  const l2 = lineSeg(LINE2_THROUGH, line2Dir);

  return (
    <div className={["cbmc-angle-explorer", className].filter(Boolean).join(" ")}>
      <div
        className="cbmc-graph-paper"
        style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}
      >
        <Mafs
          viewBox={{ x: [-VIEW, VIEW], y: [-VIEW, VIEW] }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />
          <Line.Segment point1={l1[0]} point2={l1[1]} color={LINE_COLOR} />
          <Line.Segment point1={l2[0]} point2={l2[1]} color={LINE_COLOR} />
          <Line.PointAngle
            point={[ORIGIN.x, ORIGIN.y]}
            angle={(tDir * Math.PI) / 180}
            color={TRANSVERSAL_COLOR}
          />
          {/* Vertical-pair angle marks. Pattern-coded (solid vs dashed stroke)
              so the pair is distinguishable without relying on color. */}
          <Polyline
            points={markA}
            color={MARK_COLOR}
            fillOpacity={0}
            svgPolylineProps={{ strokeDasharray: "none" }}
          />
          <Polyline
            points={markB}
            color={MARK_COLOR}
            fillOpacity={0}
            svgPolylineProps={{ strokeDasharray: "5 4" }}
          />
        </Mafs>
      </div>

      {/* The marks' non-color encoding, surfaced to the DOM for a11y/tests. */}
      <span
        data-cbmc-angle-pattern="solid"
        data-cbmc-angle={idA}
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}
      />
      <span
        data-cbmc-angle-pattern="dashed"
        data-cbmc-angle={idB}
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.75rem" }}>
        <label htmlFor={sliderId} className="cbmc-control-label">
          Transversal angle
        </label>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={179}
          step={1}
          value={tDir}
          aria-label="Transversal angle"
          aria-valuetext={fmt(tDir)}
          onChange={(e) => setTDir(Number(e.target.value))}
        />
        <span className="cbmc-control-value">{fmt(tDir)}</span>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        Drag the transversal angle and watch the vertical angles stay equal.
      </p>

      <div role="status" aria-live="polite" style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        <p>
          The vertical-angle pair (angles {idA} and {idB}) measures{" "}
          {fmt(measureA)} and {fmt(measureB)} — vertical angles are always equal.
        </p>
      </div>
    </div>
  );
}
