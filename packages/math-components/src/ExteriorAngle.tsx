"use client";

/**
 * <ExteriorAngle> — the EXTERIOR ANGLE THEOREM tool. Reshape a triangle by its
 * SAS parameters (two sides + the included angle) and watch one relationship
 * hold: the exterior angle at vertex B always equals the SUM OF THE TWO REMOTE
 * interior angles (the ones at A and C, the non-adjacent corners). The base AB
 * is extended past B; the exterior angle sits between that extension and side
 * BC. On-figure arcs — the two remote interiors at A and C, and the exterior at
 * B — carry their machine-sourced measures, and the readout proves
 * exterior ∠ = ∠A + ∠C numerically.
 *
 * "Show why" runs the proof: a ray from B parallel to AC splits the exterior
 * angle into a lower part equal to ∠A (a corresponding angle along the parallel,
 * via transversal AB) and an upper part equal to ∠C (an alternate interior
 * angle, via transversal BC). A copy of the ∠A wedge and a copy of the ∠C wedge
 * slide into the exterior wedge and tile it flush with
 * the extension ray — exact, because their measures come from the same
 * `triangleAngles` the figure reads, not from eyeballing. Narrated step by
 * step, paced, with a reduced-motion static fallback and a completion glow.
 *
 * One topic, one tool (no lens switcher). Single source of truth: React state
 * holds the three SAS control values plus the animation clock; the figure,
 * arcs, readout, and assembly are all derived from the pure `triangle` module.
 * Each part keeps its own colour AND its name (∠A / ∠C / exterior), so the
 * figure↔readout link reads without relying on colour. Zero-stakes: nothing
 * recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, MovablePoint, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import {
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
  type Pt,
} from "./logic";
import { arcPoints, easeOut, vertexArc, vertexArcRadius, D } from "./internal/geometry";
import { ANGLE_A, ANGLE_C, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider } from "./internal/controls";

const TRIANGLE_COLOR = PREIMAGE;
const ACCENT_COLOR = IMAGE;
// One colour per remote interior angle (and its matching readout term + the
// part it tiles into the exterior wedge). Colour is reinforcement only — each
// part is also named, so the figure reads without it (quality bar).
const A_COLOR = ANGLE_A; // the remote interior at A
const C_COLOR = ANGLE_C; // the remote interior at C
const EXT_COLOR = IMAGE; // the exterior angle at B

const START_DELAY_MS = 1000; // a beat to read step 1 before the first slide
const ANIM_MS = 2200; // each wedge slide — slow enough to follow
const DISMISS_MS = 6000; // auto-clear the assembled proof after it lands

export interface ExteriorAngleProps {
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

/**
 * A FIXED viewport that holds still as the user reshapes the triangle (cf.
 * TriangleLab FIXED_BOUNDS). Fit once to the union of triangles sampled across
 * the full range of the SAS controls — plus the extension of AB past B, so the
 * exterior ray is always in frame.
 */
const ANGLE_SAMPLES = 5;
const EXT_LEN = 3; // how far past B the extension reaches, in plane units
const FIXED_BOUNDS = (() => {
  const pts: Pt[] = [];
  for (const b of [SIDE_MIN, SIDE_MAX]) {
    for (const c of [SIDE_MIN, SIDE_MAX]) {
      for (let i = 0; i < ANGLE_SAMPLES; i++) {
        const a = ANGLE_MIN + ((ANGLE_MAX - ANGLE_MIN) * i) / (ANGLE_SAMPLES - 1);
        const verts = triangleFromSAS(b, c, a);
        pts.push(...verts);
        // The extension of AB past B along +x.
        pts.push({ x: verts[1].x + EXT_LEN, y: 0 });
      }
    }
  }
  return autoBounds([{ type: "polygon", vertices: pts }]);
})();

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

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

export function ExteriorAngle({
  sideB: sideB0 = 5,
  sideC: sideC0 = 7,
  includedAngleDeg: angle0 = 45,
  className,
}: ExteriorAngleProps) {
  const [sideB, setSideB] = useState(sideB0);
  const [sideC, setSideC] = useState(sideC0);
  const [includedAngleDeg, setAngle] = useState(angle0);
  // The proof clock: 0 idle; 1 = beat ("here are the two remote angles");
  // 2 = ∠C copy slides into the exterior; 3 = ∠A copy slides in; 4 = landed
  // (the two parts tile the exterior angle flush with the extension ray).
  const [step, setStep] = useState(0);
  const [proofT, setProofT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  // Everything else is derived — no per-frame setState beyond the params above.
  const vertices = useMemo(
    () => triangleFromSAS(sideB, sideC, includedAngleDeg),
    [sideB, sideC, includedAngleDeg],
  );
  const angles = useMemo(() => triangleAngles(vertices), [vertices]);

  const [A, B, C] = vertices;
  // Round the three INTERIOR angles together so they sum to exactly 180° (the
  // proven invariant). The exterior angle at B is the supplement of the interior
  // there, which is ∠A + ∠C — so deriving it as the sum of the two displayed
  // remote parts (rather than rounding it independently) keeps the relationship
  // ∠A + ∠C = exterior EXACT on screen, never 89° + 46° = 134° from naive
  // per-angle rounding.
  const [angA, , angC] = useMemo(() => roundAnglesToSum(angles), [angles]);
  const ext = angA + angC; // = 180 − ∠B, by the proven angle sum.

  // The +x extension of AB past B, where the exterior angle opens.
  const Bext: Pt = { x: B.x + EXT_LEN, y: 0 };

  // On-figure arcs. The two REMOTE interiors at A and C (vertexArc sweeps the
  // minor angle between the two adjacent edges = the interior). The EXTERIOR
  // arc at B between the extension ray (B→Bext, i.e. +x) and ray B→C.
  const arcA = useMemo(() => vertexArc(A, B, C), [A, B, C]);
  const arcC = useMemo(() => vertexArc(C, A, B), [A, B, C]);
  // Exterior wedge at B: from the +x extension (0°) up to the direction of B→C.
  const extWedge = useMemo(() => {
    const angC0 = Math.atan2(C.y - B.y, C.x - B.x) / D; // direction B→C (0..180)
    const r = vertexArcRadius(B, Bext, C);
    return {
      a0: 0,
      a1: angC0,
      r,
      arc: arcPoints(B, 0, angC0, r),
      wedge: [[B.x, B.y], ...arcPoints(B, 0, angC0, r)] as [number, number][],
      label: [
        B.x + (r + 0.55) * Math.cos((angC0 / 2) * D),
        B.y + (r + 0.55) * Math.sin((angC0 / 2) * D),
      ] as [number, number],
      angC0,
    };
  }, [B.x, B.y, C.x, C.y, Bext.x]);

  // The proof construction: the ray from B parallel to AC leaves B at ∠A above
  // the extension (that IS the A→C direction), splitting the exterior angle into
  //   lower [0 .. split]      = ∠A  (corresponding angle, transversal AB)
  //   upper [split .. angC0]  = ∠C  (alternate interior angle, transversal BC)
  // tiling flush with B→C. Two wedge copies share the exterior arc's radius so
  // they tile cleanly: the ∠A copy slides from corner A into the lower split,
  // then the ∠C copy slides from corner C into the upper split. Their angular
  // extents come from the machine-sourced angles, so the tiling is exact.
  const proof = useMemo(() => {
    const r = extWedge.r;
    const split = extWedge.angC0 * (angA / (angA + angC));
    // Lower part (next to the extension ray): equals ∠A. Slides in from corner A.
    const aPart = {
      arc: arcPoints(B, 0, split, r),
      wedge: [[B.x, B.y], ...arcPoints(B, 0, split, r)] as [number, number][],
      label: [
        B.x + (r + 0.55) * Math.cos((split / 2) * D),
        B.y + (r + 0.55) * Math.sin((split / 2) * D),
      ] as [number, number],
    };
    // Upper part (next to side BC): equals ∠C. Slides in from corner C.
    const cPart = {
      arc: arcPoints(B, split, extWedge.angC0, r),
      wedge: [[B.x, B.y], ...arcPoints(B, split, extWedge.angC0, r)] as [number, number][],
      label: [
        B.x + (r + 0.55) * Math.cos(((split + extWedge.angC0) / 2) * D),
        B.y + (r + 0.55) * Math.sin(((split + extWedge.angC0) / 2) * D),
      ] as [number, number],
    };
    // Parallel ray from B in the direction of A→C (at ∠A above the extension).
    const acDir = Math.atan2(C.y - A.y, C.x - A.x) / D;
    const parEnd: Pt = {
      x: B.x + (r + 0.4) * Math.cos(acDir * D),
      y: B.y + (r + 0.4) * Math.sin(acDir * D),
    };
    return { cPart, aPart, split, parEnd };
  }, [B.x, B.y, C.x, C.y, A.x, A.y, angA, angC, extWedge.angC0, extWedge.r]);

  // Slide progress for each part. The lower ∠A slides in on step 2, the upper
  // ∠C on step 3 — matching the narration's lower-then-upper order.
  const tA = step < 2 ? 0 : step === 2 ? proofT : 1;
  const tC = step < 3 ? 0 : step === 3 ? proofT : 1;
  // A copy travels from its home corner (A or C) to vertex B as t goes 0→1.
  const slide = (home: Pt, pts: [number, number][], t: number): [number, number][] => {
    const dx = (B.x - home.x) * (1 - t);
    const dy = (B.y - home.y) * (1 - t);
    return pts.map(([x, y]) => [x - dx, y - dy]);
  };
  const slideLabel = (home: Pt, [x, y]: [number, number], t: number): [number, number] => {
    const dx = (B.x - home.x) * (1 - t);
    const dy = (B.y - home.y) * (1 - t);
    return [x - dx, y - dy];
  };
  const movingC = slide(C, proof.cPart.wedge, tC);
  const movingCLabel = slideLabel(C, proof.cPart.label, tC);
  const movingA = slide(A, proof.aPart.wedge, tA);
  const movingALabel = slideLabel(A, proof.aPart.label, tA);

  const active = step > 0;
  const landed = step >= 4;

  // --- proof playback ------------------------------------------------------
  const clearProofTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const resetProof = () => {
    clearProofTimers();
    setStep(0);
    setProofT(0);
  };
  useEffect(() => clearProofTimers, []);

  const animateLeg = (onDone: () => void) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ANIM_MS);
      setProofT(easeOut(t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const playProof = () => {
    clearProofTimers();
    setProofT(0);
    setStep(1); // beat: "here are the two remote angles"
    if (reduceMotion) {
      setStep(4); // jump straight to the tiled exterior angle
      timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
      return;
    }
    timersRef.current.push(
      setTimeout(() => {
        setStep(2); // ∠C copy slides into the exterior
        setProofT(0);
        animateLeg(() => {
          setStep(3); // ∠A copy slides in on top
          setProofT(0);
          animateLeg(() => {
            setStep(4); // landed — the two parts fill the exterior angle
            timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
          });
        });
      }, START_DELAY_MS),
    );
  };

  // Reshaping the triangle invalidates any running proof — drop it.
  const reshape = (fn: () => void) => {
    if (step !== 0) resetProof();
    fn();
  };

  // Dragging vertex B or C reshapes the triangle; recompute SAS and write back.
  const onDrag = (which: "B" | "C", [x, y]: [number, number]) => {
    const next = which === "B" ? [A, { x, y }, C] : [A, B, { x, y }];
    const sas = sasFromVertices(next);
    reshape(() => {
      setSideB(sas.sideB);
      setSideC(sas.sideC);
      setAngle(sas.includedAngleDeg);
    });
  };

  const proofSteps = [
    `The exterior angle at B sits between side BC and the extension of AB. The two remote interior angles are ∠A = ${angA}° and ∠C = ${angC}°.`,
    `Draw a ray from B parallel to side AC. It splits the exterior angle: the lower part (next to the extension) equals ∠A = ${angA}° — a corresponding angle along the parallel.`,
    `The upper part (next to side BC) equals ∠C = ${angC}° — an alternate interior angle. The two copies tile the exterior angle.`,
    `So the exterior angle is ∠A + ∠C: ${angA}° + ${angC}° = ${ext}°.`,
  ];

  const caption =
    `A triangle with the base AB extended past B. The exterior angle there is ` +
    `${ext}°, which always equals the sum of the two remote interior angles, ` +
    `∠A = ${angA}° and ∠C = ${angC}° (${angA}° + ${angC}° = ${ext}°). Press ` +
    `“Show why” to see the proof: a ray from B parallel to side AC splits the ` +
    `exterior angle into a copy of ∠C and a copy of ∠A, which tile it exactly.`;

  return (
    <figure
      className={["cbmc-exterior-angle", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className={["cbmc-graph-paper", landed && "cbmc-pulse"].filter(Boolean).join(" ")}
        style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}
      >
        <Mafs
          viewBox={{ x: FIXED_BOUNDS.x, y: FIXED_BOUNDS.y }}
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

          {/* The base AB extended past B along +x — the ray the exterior angle
              opens against. Dashed so it reads as a construction, not a side. */}
          <Polyline
            points={[
              [B.x, B.y],
              [Bext.x, Bext.y],
            ]}
            color={MUTED}
            fillOpacity={0}
            weight={1.5}
            svgPolylineProps={{ strokeDasharray: "6 5" }}
          />

          {/* Resting state: the two remote interior arcs (A, C) and the exterior
              arc at B, each with its machine-sourced measure. */}
          {!active ? (
            <>
              <Polyline points={arcA.arc} color={A_COLOR} fillOpacity={0} weight={2} />
              <Polyline points={arcC.arc} color={C_COLOR} fillOpacity={0} weight={2} />
              <Polyline points={extWedge.arc} color={EXT_COLOR} fillOpacity={0} weight={2} />
              <Text x={arcA.label[0]} y={arcA.label[1]} size={15} color={A_COLOR}>
                {`${angA}°`}
              </Text>
              <Text x={arcC.label[0]} y={arcC.label[1]} size={15} color={C_COLOR}>
                {`${angC}°`}
              </Text>
              <Text x={extWedge.label[0]} y={extWedge.label[1]} size={15} color={EXT_COLOR}>
                {`${ext}°`}
              </Text>
            </>
          ) : null}

          {/* The proof in motion: a copy of ∠C and a copy of ∠A slide from their
              home corners into the exterior wedge at B and tile it flush. */}
          {active ? (
            <>
              {/* The parallel ray from B (appears once the split is introduced). */}
              {step >= 2 ? (
                <Polyline
                  points={[
                    [B.x, B.y],
                    [proof.parEnd.x, proof.parEnd.y],
                  ]}
                  color={MUTED}
                  fillOpacity={0}
                  weight={1.5}
                  svgPolylineProps={{ strokeDasharray: "4 4" }}
                />
              ) : null}

              {/* The exterior angle's outline, so the copies tile a visible target. */}
              <Polyline points={extWedge.arc} color={EXT_COLOR} fillOpacity={0} weight={2} />

              <Polygon
                points={movingC}
                color={C_COLOR}
                fillOpacity={0.45}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              <Polygon
                points={movingA}
                color={A_COLOR}
                fillOpacity={0.45}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />

              <Text x={movingCLabel[0]} y={movingCLabel[1]} size={15} color={C_COLOR}>
                {`${angC}°`}
              </Text>
              <Text x={movingALabel[0]} y={movingALabel[1]} size={15} color={A_COLOR}>
                {`${angA}°`}
              </Text>
            </>
          ) : null}

          <VertexLabels vertices={vertices} color={TRIANGLE_COLOR} />
          {!active ? (
            <>
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
            </>
          ) : (
            <Point x={B.x} y={B.y} color={EXT_COLOR} />
          )}
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        Reshape the triangle with the sliders — or drag vertex B or C — and watch
        the exterior angle stay equal to ∠A + ∠C. Then press “Show why”.
      </p>

      <div role="group" aria-label="Triangle parameters">
        <ControlSlider
          label="Side AB"
          value={sideB}
          min={SIDE_MIN}
          max={SIDE_MAX}
          step={0.1}
          onChange={(v) => reshape(() => setSideB(v))}
          display={sideB.toFixed(1)}
        />
        <ControlSlider
          label="Side AC"
          value={sideC}
          min={SIDE_MIN}
          max={SIDE_MAX}
          step={0.1}
          onChange={(v) => reshape(() => setSideC(v))}
          display={sideC.toFixed(1)}
        />
        <ControlSlider
          label="Included angle ∠A"
          value={includedAngleDeg}
          min={ANGLE_MIN}
          max={ANGLE_MAX}
          step={1}
          onChange={(v) => reshape(() => setAngle(v))}
          display={`${Math.round(includedAngleDeg)}°`}
        />
      </div>

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" aria-pressed={active} onClick={playProof}>
          {active ? "Replay the proof" : "Show why"}
        </button>
        {active ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-label="Reset and hide the proof"
            title="Press to reset and hide the proof"
            onClick={resetProof}
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="cbmc-progress" role="status" aria-live="polite">
        <span aria-hidden="true">
          <span style={{ color: EXT_COLOR, fontWeight: 600 }}>exterior ∠</span> ={" "}
          <span style={{ color: A_COLOR, fontWeight: 600 }}>∠A</span> +{" "}
          <span style={{ color: C_COLOR, fontWeight: 600 }}>∠C</span> ={" "}
          <span style={{ color: A_COLOR }}>{angA}°</span> +{" "}
          <span style={{ color: C_COLOR }}>{angC}°</span> ={" "}
          <span style={{ color: EXT_COLOR, fontWeight: 600 }}>{ext}°</span>
        </span>
        <span className="cbmc-sr-only">
          {`The exterior angle at B is ${ext}°, equal to the sum of the two remote interior angles: ∠A = ${angA}° plus ∠C = ${angC}° is ${angA + angC}°.`}
        </span>
      </p>

      {active ? (
        <div
          className="cbmc-proof-narration"
          aria-live="polite"
          style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
        >
          <ol className="cbmc-proof-steps">
            {proofSteps.slice(0, step).map((text, i) => (
              <li
                key={i}
                style={{
                  fontWeight: i === step - 1 ? 700 : 400,
                  color: i === step - 1 ? "var(--cbmc-accent, #176844)" : undefined,
                  opacity: i === step - 1 ? 1 : 0.55,
                }}
              >
                {text}
              </li>
            ))}
          </ol>
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
