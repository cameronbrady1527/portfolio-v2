"use client";

/**
 * <TriangleLab> — the TRIANGLE ANGLE SUM tool. Reshape a triangle by its SAS
 * parameters (two sides + the included angle) and watch one invariant hold: the
 * interior angles always sum to 180°. On-figure angle arcs (one per vertex,
 * measure labelled at the corner) make the lens concrete, and "Show why it's
 * 180°" runs the proof as a rigid motion: a half-turn about the midpoint of CA
 * carries the angle at A up to the apex C, a half-turn about the midpoint of CB
 * carries the angle at B up too, and the three angles tile a straight line
 * through C parallel to AB. The half-turns reuse the shipped, exact `rotate()`
 * (see `angleSumAssembly`), so the proof is machine-checked, not eyeballed —
 * narrated step by step, paced, with a reduced-motion static fallback and a
 * completion glow.
 *
 * This tool is deliberately focused on the angle sum. Exterior angle, midsegment,
 * the triangle inequality, and the isosceles base-angle theorem each get their
 * own standalone tool (one topic = one tool); they share the pure `triangle`
 * substrate, not a crowded lens switcher.
 *
 * Single source of truth: React state holds the three SAS control values plus
 * the animation clock; the figure, arcs, readout, and assembly are derived from
 * the pure `triangle` module. Each corner has its own colour AND its letter
 * (A/B/C), so the figure↔readout link reads without relying on colour.
 * Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, MovablePoint, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import {
  angleSumAssembly,
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
  type Pt,
} from "./logic";
import { arcPoints, easeOut, rotPt, vertexArc, vertexArcRadius } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, ANGLE_C, IMAGE, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider } from "./internal/controls";

const TRIANGLE_COLOR = PREIMAGE;
const ACCENT_COLOR = IMAGE;
// One colour per corner for its angle arc + measure (and the matching readout
// term). Colour is reinforcement only — each corner is also named A/B/C, so the
// figure reads without it (quality bar: quantities on the figure, colour-free).
const VERTEX_ARC_COLORS = [ANGLE_A, ANGLE_B, ANGLE_C];

const START_DELAY_MS = 1000; // a beat to read step 1 before the first half-turn
const ANIM_MS = 2600; // each half-turn — slow enough to follow
const DISMISS_MS = 6000; // auto-clear the assembled proof after it lands

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

/**
 * A FIXED viewport that holds still as the user reshapes the triangle. Refitting
 * to the live triangle makes the grid appear to shift while the figure stays put
 * — disorienting (cf. <Grapher> stableBounds, issue #65). Instead we fit once to
 * the union of triangles sampled across the FULL range of the SAS controls.
 */
const ANGLE_SAMPLES = 5;
const FIXED_BOUNDS = (() => {
  const shapes = [];
  for (const b of [SIDE_MIN, SIDE_MAX]) {
    for (const c of [SIDE_MIN, SIDE_MAX]) {
      for (let i = 0; i < ANGLE_SAMPLES; i++) {
        const a = ANGLE_MIN + ((ANGLE_MAX - ANGLE_MIN) * i) / (ANGLE_SAMPLES - 1);
        shapes.push({ type: "polygon" as const, vertices: triangleFromSAS(b, c, a) });
      }
    }
  }
  return autoBounds(shapes);
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

export function TriangleLab({
  sideB: sideB0 = 5,
  sideC: sideC0 = 7,
  includedAngleDeg: angle0 = 40,
  className,
}: TriangleLabProps) {
  const [sideB, setSideB] = useState(sideB0);
  const [sideC, setSideC] = useState(sideC0);
  const [includedAngleDeg, setAngle] = useState(angle0);
  // The proof clock: step 0 idle; 1 = beat, 2 = A half-turn, 3 = B half-turn,
  // 4 = landed. proofT (0…1) is how far the CURRENT half-turn has swung.
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
  // Round so the displayed parts sum EXACTLY to the total — the invariance lens
  // must never show 179° or 181° from naive per-angle rounding.
  const [angA, angB, angC] = useMemo(() => roundAnglesToSum(angles), [angles]);
  const sum = angA + angB + angC;
  const measures = [angA, angB, angC];

  // On-figure angle arcs: one per corner, each between its two adjacent edges.
  const arcs = useMemo(
    () => [vertexArc(A, B, C), vertexArc(B, A, C), vertexArc(C, A, B)],
    [A, B, C],
  );

  // The proof construction: half-turn centers (side midpoints) and the images of
  // A and B that land on the straight line through the apex C. Reuses the
  // shipped, exact rotate() — machine-checked. The three proof wedges share one
  // radius so they tile cleanly when assembled at C.
  const proof = useMemo(() => {
    const asm = angleSumAssembly(vertices);
    const rP = Math.min(
      vertexArcRadius(A, C, B),
      vertexArcRadius(B, C, A),
      vertexArcRadius(C, A, B),
    );
    return {
      asm,
      A: vertexArc(A, C, B, rP),
      B: vertexArc(B, C, A, rP),
      C: vertexArc(C, A, B, rP),
    };
  }, [vertices, A, B, C]);

  const tA = step < 2 ? 0 : step === 2 ? proofT : 1;
  const tB = step < 3 ? 0 : step === 3 ? proofT : 1;
  const { midCA, midCB, imageOfA, imageOfB } = proof.asm;
  const movingA = proof.A.wedge.map((p) => rotPt(p, 180 * tA, midCA));
  const movingALabel = rotPt(proof.A.label, 180 * tA, midCA);
  const movingB = proof.B.wedge.map((p) => rotPt(p, 180 * tB, midCB));
  const movingBLabel = rotPt(proof.B.label, 180 * tB, midCB);
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
    setStep(1); // beat: "here are the three angles"
    if (reduceMotion) {
      setStep(4); // jump straight to the assembled straight angle
      timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
      return;
    }
    timersRef.current.push(
      setTimeout(() => {
        setStep(2); // A swings up to C
        setProofT(0);
        animateLeg(() => {
          setStep(3); // B swings up to C
          setProofT(0);
          animateLeg(() => {
            setStep(4); // landed — they fill a straight line
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
    `Start with the triangle's three angles: ∠A = ${angA}°, ∠B = ${angB}°, ∠C = ${angC}°.`,
    `Rotate the angle at A a half-turn about the midpoint of side CA — it lands at the apex C.`,
    `Rotate the angle at B a half-turn about the midpoint of side CB — it lands at C too.`,
    `The three angles now fill a straight line through C: ${angA}° + ${angB}° + ${angC}° = 180°.`,
  ];

  const caption =
    `A triangle with angles ∠A = ${angA}°, ∠B = ${angB}°, and ∠C = ${angC}°, which ` +
    `always sum to 180°. Press “Show why it's 180°” to see the proof: a half-turn ` +
    `about the midpoint of CA carries ∠A to the apex C and a half-turn about the ` +
    `midpoint of CB carries ∠B there too, so the three angles fill a straight ` +
    `line through C parallel to AB.`;

  return (
    <figure
      className={["cbmc-triangle-lab", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className={["cbmc-graph-paper", landed && "cbmc-pulse"]
          .filter(Boolean)
          .join(" ")}
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

          {/* Resting state: thin on-figure angle arcs + machine-sourced measures
              — the angle-sum lens drawn in the language of the concept. */}
          {!active &&
            arcs.map((a, i) => (
              <Polyline
                key={`arc-${i}`}
                points={a.arc}
                color={VERTEX_ARC_COLORS[i]}
                fillOpacity={0}
                weight={2}
              />
            ))}
          {!active &&
            arcs.map((a, i) => (
              <Text
                key={`meas-${i}`}
                x={a.label[0]}
                y={a.label[1]}
                size={15}
                color={VERTEX_ARC_COLORS[i]}
              >
                {`${measures[i]}°`}
              </Text>
            ))}

          {/* The proof in motion: ∠A and ∠B half-turn about the side midpoints
              to land beside ∠C, tiling a straight line through C parallel to AB. */}
          {active ? (
            <>
              {step >= 2 ? (
                <Polyline
                  points={[
                    [imageOfB.x, imageOfB.y],
                    [imageOfA.x, imageOfA.y],
                  ]}
                  color="var(--cbmc-muted, #6b6353)"
                  fillOpacity={0}
                  weight={1.5}
                  svgPolylineProps={{ strokeDasharray: "6 5" }}
                />
              ) : null}
              {step >= 2 ? (
                <Point x={midCA.x} y={midCA.y} color={VERTEX_ARC_COLORS[0]} />
              ) : null}
              {step >= 3 ? (
                <Point x={midCB.x} y={midCB.y} color={VERTEX_ARC_COLORS[1]} />
              ) : null}

              <Polygon
                points={proof.C.wedge}
                color={VERTEX_ARC_COLORS[2]}
                fillOpacity={0.45}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              <Polygon
                points={movingA}
                color={VERTEX_ARC_COLORS[0]}
                fillOpacity={0.45}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              <Polygon
                points={movingB}
                color={VERTEX_ARC_COLORS[1]}
                fillOpacity={0.45}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />

              <Text x={movingALabel[0]} y={movingALabel[1]} size={15} color={VERTEX_ARC_COLORS[0]}>
                {`${angA}°`}
              </Text>
              <Text x={proof.C.label[0]} y={proof.C.label[1]} size={15} color={VERTEX_ARC_COLORS[2]}>
                {`${angC}°`}
              </Text>
              <Text x={movingBLabel[0]} y={movingBLabel[1]} size={15} color={VERTEX_ARC_COLORS[1]}>
                {`${angB}°`}
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
          ) : null}
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        Reshape the triangle with the sliders — or drag vertex B or C — and watch
        the angle sum hold steady. Then press “Show why it&apos;s 180°”.
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
        <button
          type="button"
          className="cbmc-btn"
          aria-pressed={active}
          onClick={playProof}
        >
          {active ? "Replay the proof" : "Show why it's 180°"}
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
        <span style={{ color: VERTEX_ARC_COLORS[0], fontWeight: 600 }}>∠A</span> +{" "}
        <span style={{ color: VERTEX_ARC_COLORS[1], fontWeight: 600 }}>∠B</span> +{" "}
        <span style={{ color: VERTEX_ARC_COLORS[2], fontWeight: 600 }}>∠C</span> ={" "}
        <span style={{ color: VERTEX_ARC_COLORS[0] }}>{angA}°</span> +{" "}
        <span style={{ color: VERTEX_ARC_COLORS[1] }}>{angB}°</span> +{" "}
        <span style={{ color: VERTEX_ARC_COLORS[2] }}>{angC}°</span> = {sum}°
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
