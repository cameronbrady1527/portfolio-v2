"use client";

/**
 * <IsoscelesTriangle> — the ISOSCELES TRIANGLE / BASE ANGLES tool. Two sides of
 * the triangle are ALWAYS equal — the user cannot make them unequal; that
 * constraint IS the lesson. Slide the equal-side length and the apex angle and
 * watch the one invariant hold: the two BASE ANGLES (the angles opposite the
 * equal sides) stay equal to each other. Single tick marks on both legs say
 * "these are equal"; matching arcs and measures at B and C say "so are these".
 *
 * "Show why" runs the proof as a rigid motion: a reflection across the triangle's
 * axis of symmetry — the line through the apex A and the midpoint of the base BC,
 * which is also the apex-angle bisector and the perpendicular bisector of BC. The
 * fold swaps B and C while fixing A, so ∠B maps exactly onto ∠C — proving they
 * are equal. The reflection uses the pure, machine-checked `reflect()`, so the
 * fold is computed, not eyeballed; it is narrated step by step, paced, with a
 * reduced-motion static fallback and a completion glow.
 *
 * This tool is deliberately focused on the base-angles theorem (one topic, one
 * tool). It shares the pure `triangle`/`reflect` substrate with the other
 * triangle tools, not a crowded lens switcher.
 *
 * Single source of truth: React state holds the two control values plus the
 * animation clock; the figure, arcs, readout, and folded copy are derived from
 * the pure `triangle`/`reflect` modules. Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import { reflect, roundAnglesToSum, triangleAngles, type Pt, type Shape } from "./logic";
import { easeOut, vertexArc } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider } from "./internal/controls";

const TRIANGLE_COLOR = PREIMAGE;
// The apex angle ∠A gets its own hue; the two EQUAL base angles ∠B and ∠C share
// one hue (they are the same measure — colour reinforces the equality).
const APEX_COLOR = ANGLE_A;
const BASE_COLOR = ANGLE_B;
const FOLD_COLOR = IMAGE;

const LEG_MIN = 2;
const LEG_MAX = 9;
const APEX_MIN = 10;
const APEX_MAX = 160;

const START_DELAY_MS = 1000; // a beat to read step 1 before the fold begins
const ANIM_MS = 2400; // the fold sweep — slow enough to follow
const DISMISS_MS = 6000; // auto-clear the proof after it lands

export interface IsoscelesTriangleProps {
  /** Initial length of the two equal legs AB and AC. */
  legLength?: number;
  /** Initial apex angle ∠A, in degrees (the angle between the equal legs). */
  apexAngleDeg?: number;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Canonical isosceles placement: the apex A sits at the top ON THE y-AXIS, and
 * the base BC rests symmetrically on the x-axis (B left, C right). Built so the
 * coordinate y-axis IS the triangle's axis of symmetry — which makes the
 * base-angles fold a clean reflection across x = 0. The two legs |AB| = |AC| are
 * equal by the left/right symmetry, so the equal-leg constraint is exact.
 */
function isoVertices(leg: number, apexDeg: number): Pt[] {
  const a = (apexDeg * Math.PI) / 180;
  const half = leg * Math.sin(a / 2); // half the base length
  const height = leg * Math.cos(a / 2); // apex height above the base
  return [
    { x: 0, y: height }, // A — apex, on the axis of symmetry
    { x: -half, y: 0 }, // B — base left
    { x: half, y: 0 }, // C — base right
  ];
}

/**
 * A FIXED viewport that holds still as the user reshapes the triangle. Fit once
 * to the union of triangles sampled across the full range of BOTH controls (cf.
 * TriangleLab FIXED_BOUNDS), so the grid never appears to drift.
 */
const LEG_SAMPLES = 4;
const APEX_SAMPLES = 5;
const FIXED_BOUNDS = (() => {
  const shapes = [];
  for (let li = 0; li < LEG_SAMPLES; li++) {
    const leg = LEG_MIN + ((LEG_MAX - LEG_MIN) * li) / (LEG_SAMPLES - 1);
    for (let ai = 0; ai < APEX_SAMPLES; ai++) {
      const apex = APEX_MIN + ((APEX_MAX - APEX_MIN) * ai) / (APEX_SAMPLES - 1);
      shapes.push({ type: "polygon" as const, vertices: isoVertices(leg, apex) });
    }
  }
  return autoBounds(shapes);
})();

/** A short perpendicular tick at the midpoint of segment PQ (the "equal" mark). */
function legTick(p: Pt, q: Pt, len = 0.18): [[number, number], [number, number]] {
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const L = Math.hypot(dx, dy) || 1;
  // Unit normal to the leg.
  const nx = -dy / L;
  const ny = dx / L;
  return [
    [mx - nx * len, my - ny * len],
    [mx + nx * len, my + ny * len],
  ];
}

export function IsoscelesTriangle({
  legLength: leg0 = 6,
  apexAngleDeg: apex0 = 40,
  className,
}: IsoscelesTriangleProps) {
  const [legLength, setLeg] = useState(clamp(leg0, LEG_MIN, LEG_MAX));
  const [apexAngleDeg, setApex] = useState(clamp(apex0, APEX_MIN, APEX_MAX));
  // The proof clock: 0 idle; 1 = beat (axis drawn); 2 = folding; 3 = landed.
  const [step, setStep] = useState(0);
  const [foldT, setFoldT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  // Everything is derived — both legs are driven by the SAME length, so the two
  // legs are equal BY CONSTRUCTION (the user cannot pull them apart).
  const vertices = useMemo(
    () => isoVertices(legLength, apexAngleDeg),
    [legLength, apexAngleDeg],
  );
  const angles = useMemo(() => triangleAngles(vertices), [vertices]);

  const [A, B, C] = vertices;
  // Round so the three displayed angles sum EXACTLY to 180°.
  const [angA, angB, angC] = useMemo(() => roundAnglesToSum(angles), [angles]);

  // On-figure angle arcs: apex at A, the two base angles at B and C.
  const arcA = useMemo(() => vertexArc(A, B, C), [A, B, C]);
  const arcB = useMemo(() => vertexArc(B, A, C), [A, B, C]);
  const arcC = useMemo(() => vertexArc(C, A, B), [A, B, C]);

  // Equal-tick marks at each leg's midpoint (same single tick = "these sides
  // are equal"). AB and AC are the two equal legs.
  const tickAB = useMemo(() => legTick(A, B), [A, B]);
  const tickAC = useMemo(() => legTick(A, C), [A, C]);

  // The axis of symmetry: the line through the apex A and the midpoint of base
  // BC. By the canonical placement that is exactly the y-axis (x = 0) — also the
  // apex-angle bisector and the perpendicular bisector of BC. Reflecting across
  // the y-axis sends (x, y) → (−x, y), which swaps B and C while fixing A — no
  // slope arithmetic, exact.
  const axisMidBC = useMemo(() => ({ x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }), [B, C]);
  const axisLine = useMemo(() => ({ kind: "axis" as const, axis: "y" as const }), []);

  // The folded copy: reflect the triangle across its axis of symmetry. The pure,
  // machine-checked reflect() swaps B and C while fixing A — so ∠B lands on ∠C.
  const folded = useMemo(() => {
    const shape: Shape = { type: "polygon", vertices };
    return (reflect(shape, axisLine) as { type: "polygon"; vertices: Pt[] }).vertices;
  }, [vertices, axisLine]);

  // Interpolate the fold: each vertex slides from its position to its reflected
  // image as foldT runs 0→1. (A is fixed, so it doesn't move.)
  const tt = step < 2 ? 0 : step === 2 ? foldT : 1;
  const foldingVerts = useMemo(
    () =>
      vertices.map((v, i) => ({
        x: v.x + (folded[i].x - v.x) * tt,
        y: v.y + (folded[i].y - v.y) * tt,
      })),
    [vertices, folded, tt],
  );

  const active = step > 0;
  const landed = step >= 3;

  // --- proof playback ------------------------------------------------------
  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const resetProof = () => {
    clearTimers();
    setStep(0);
    setFoldT(0);
  };
  useEffect(() => clearTimers, []);

  const animate = (onDone: () => void) => {
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ANIM_MS);
      setFoldT(easeOut(k));
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        rafRef.current = null;
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const playProof = () => {
    clearTimers();
    setFoldT(0);
    setStep(1); // beat: the axis is drawn
    if (reduceMotion) {
      setStep(3); // jump straight to the folded/landed state
      timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
      return;
    }
    timersRef.current.push(
      setTimeout(() => {
        setStep(2); // the triangle folds across the axis
        setFoldT(0);
        animate(() => {
          setStep(3); // landed — B on C, C on B
          timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
        });
      }, START_DELAY_MS),
    );
  };

  // Reshaping invalidates any running proof — drop it.
  const reshape = (fn: () => void) => {
    if (step !== 0) resetProof();
    fn();
  };

  const proofSteps = [
    `Fold the triangle along the line through the apex A and the midpoint of the base BC — its axis of symmetry.`,
    `Because the two legs AB and AC are equal, the fold lands B on C and C on B, while A stays fixed.`,
    `The angle at B falls exactly onto the angle at C, so the base angles are equal: ∠B = ∠C = ${angB}°.`,
  ];

  const caption =
    `An isosceles triangle with apex A and equal legs AB = AC = ${legLength.toFixed(1)}. ` +
    `Because the legs are equal, the base angles are equal: ∠B = ∠C = ${angB}° ` +
    `(with apex ∠A = ${angA}°). Press “Show why ∠B = ∠C” to fold the triangle along ` +
    `its axis of symmetry — the line through A and the midpoint of BC — which swaps ` +
    `B and C and lands ∠B exactly onto ∠C.`;

  return (
    <figure
      className={["cbmc-isosceles", className].filter(Boolean).join(" ")}
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

          {/* The axis of symmetry (dashed) — drawn once the proof begins. */}
          {active ? (
            <Polyline
              points={[
                [A.x, A.y],
                [axisMidBC.x, axisMidBC.y],
              ]}
              color={MUTED}
              fillOpacity={0}
              weight={1.5}
              svgPolylineProps={{ strokeDasharray: "6 5" }}
            />
          ) : null}

          {/* The original triangle. */}
          <Polygon
            points={vertices.map((v) => [v.x, v.y] as [number, number])}
            color={TRIANGLE_COLOR}
          />

          {/* The folded copy sweeping across the axis (proof in motion). */}
          {active ? (
            <Polygon
              points={foldingVerts.map((v) => [v.x, v.y] as [number, number])}
              color={FOLD_COLOR}
              fillOpacity={0.18}
              weight={2}
              svgPolygonProps={{ style: { pointerEvents: "none" } }}
            />
          ) : null}

          {/* Equal-tick marks on the two equal legs AB and AC. */}
          <Polyline points={tickAB} color={TRIANGLE_COLOR} fillOpacity={0} weight={2} />
          <Polyline points={tickAC} color={TRIANGLE_COLOR} fillOpacity={0} weight={2} />

          {/* On-figure angle arcs: apex ∠A, and the equal base angles ∠B, ∠C. */}
          <Polyline points={arcA.arc} color={APEX_COLOR} fillOpacity={0} weight={2} />
          <Polyline points={arcB.arc} color={BASE_COLOR} fillOpacity={0} weight={2} />
          <Polyline points={arcC.arc} color={BASE_COLOR} fillOpacity={0} weight={2} />
          <Text x={arcA.label[0]} y={arcA.label[1]} size={15} color={APEX_COLOR}>
            {`${angA}°`}
          </Text>
          <Text x={arcB.label[0]} y={arcB.label[1]} size={15} color={BASE_COLOR}>
            {`${angB}°`}
          </Text>
          <Text x={arcC.label[0]} y={arcC.label[1]} size={15} color={BASE_COLOR}>
            {`${angC}°`}
          </Text>

          <VertexLabels vertices={vertices} color={TRIANGLE_COLOR} />
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        The two legs are always equal — that&apos;s the lesson. Reshape with the
        sliders and watch the base angles ∠B and ∠C stay equal. Then press “Show
        why ∠B = ∠C”.
      </p>

      <div role="group" aria-label="Isosceles triangle parameters">
        <ControlSlider
          label="Equal side length"
          value={legLength}
          min={LEG_MIN}
          max={LEG_MAX}
          step={0.1}
          onChange={(v) => reshape(() => setLeg(v))}
          display={legLength.toFixed(1)}
        />
        <ControlSlider
          label="Apex angle ∠A"
          value={apexAngleDeg}
          min={APEX_MIN}
          max={APEX_MAX}
          step={1}
          onChange={(v) => reshape(() => setApex(v))}
          display={`${Math.round(apexAngleDeg)}°`}
        />
      </div>

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" aria-pressed={active} onClick={playProof}>
          {active ? "Fold again" : "Show why ∠B = ∠C"}
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
          equal legs ⇒ equal base angles:{" "}
          <span style={{ color: BASE_COLOR, fontWeight: 600 }}>∠B</span> ={" "}
          <span style={{ color: BASE_COLOR, fontWeight: 600 }}>∠C</span> ={" "}
          <span style={{ color: BASE_COLOR, fontWeight: 600 }}>{angB}°</span>{" "}
          (apex <span style={{ color: APEX_COLOR, fontWeight: 600 }}>∠A</span> = {angA}°)
        </span>
        <span className="cbmc-sr-only">
          The two legs are equal, so the base angles are equal: ∠B = ∠C = {angB}
          °, with apex angle ∠A = {angA}°. The three angles sum to {angA + angB + angC}°.
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
