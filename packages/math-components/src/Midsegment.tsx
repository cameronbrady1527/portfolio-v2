"use client";

/**
 * <Midsegment> — the TRIANGLE MIDSEGMENT (MIDLINE) THEOREM tool. Reshape a
 * triangle by its SAS parameters and watch one pair of facts hold: the segment
 * joining the midpoints of two sides is always PARALLEL to the third side and
 * exactly HALF its length. The midsegment, both midpoints, and the base it
 * mirrors carry machine-sourced length labels and matching tick marks, so the
 * ½-and-∥ relationship is the thing on screen — read straight from the pure,
 * machine-checked `midsegment()` helper, never eyeballed.
 *
 * A side switcher flips WHICH midsegment is shown (the one parallel to AB, BC,
 * or CA) — three views of the SAME figure, not three tools. "Show why" runs the
 * proof as a dilation by factor 2 centred at the opposite vertex: the small
 * triangle (apex + the two midpoints) scales outward by 2× until the midsegment
 * lands flush on the base. A dilation maps a segment to a PARALLEL segment, and
 * the scale ½ → 1 makes the half-length visible — the midsegment laid end to end
 * exactly covers the base. Narrated step by step, paced, with a reduced-motion
 * static fallback and a completion glow.
 *
 * Single source of truth: React state holds the SAS controls, the chosen side,
 * and the animation clock; the figure, midpoints, lengths, and parallelism are
 * derived from the pure `triangle` module. Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import { midsegment, triangleFromSAS, type Pt, type TriangleSide } from "./logic";
import { easeOut } from "./internal/geometry";
import { IMAGE, MUTED, PREIMAGE, TARGET } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider, ViewSwitcher } from "./internal/controls";

const TRIANGLE_COLOR = PREIMAGE;
const BASE_COLOR = TARGET; // the third side the midsegment mirrors
const MID_COLOR = IMAGE; // the midsegment + its midpoints

const SIDE_MIN = 1;
const SIDE_MAX = 10;
const ANGLE_MIN = 5;
const ANGLE_MAX = 175;

const START_DELAY_MS = 1000;
const ANIM_MS = 2400;
const DISMISS_MS = 6000;

export interface MidsegmentProps {
  /** Initial length of side AB (the side laid along +x from A). */
  sideB?: number;
  /** Initial length of side AC. */
  sideC?: number;
  /** Initial included angle ∠BAC, in degrees (0 < θ < 180). */
  includedAngleDeg?: number;
  className?: string;
}

/** A FIXED viewport fitting every triangle across the full SAS ranges, so the
 *  grid holds still while the user reshapes (cf. TriangleLab FIXED_BOUNDS). */
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

/** The endpoints of the named side, and the apex opposite it (the vertex the two
 *  midpoint-bearing sides share). Matches the mapping inside `midsegment()`, so
 *  the dilation centre we draw is exactly the one the theorem uses. */
function sideAndApex(vertices: Pt[], side: TriangleSide): { p: Pt; q: Pt; apex: Pt } {
  const [A, B, C] = vertices;
  const [p, q, apex] =
    side === "AB" ? [A, B, C] : side === "BC" ? [B, C, A] : [C, A, B];
  return { p, q, apex };
}

const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const SIDE_OPTIONS: { value: TriangleSide; label: string }[] = [
  { value: "AB", label: "parallel to AB" },
  { value: "BC", label: "parallel to BC" },
  { value: "CA", label: "parallel to CA" },
];

export function Midsegment({
  sideB: sideB0 = 8,
  sideC: sideC0 = 6,
  includedAngleDeg: angle0 = 55,
  className,
}: MidsegmentProps) {
  const [sideB, setSideB] = useState(sideB0);
  const [sideC, setSideC] = useState(sideC0);
  const [includedAngleDeg, setAngle] = useState(angle0);
  const [side, setSide] = useState<TriangleSide>("AB");
  // Proof clock: 0 idle; 1 = beat (show the small triangle); 2 = scaling out by
  // 2×; 3 = landed flush on the base. scaleT (0…1) drives the dilation 1→2.
  const [step, setStep] = useState(0);
  const [scaleT, setScaleT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const vertices = useMemo(
    () => triangleFromSAS(sideB, sideC, includedAngleDeg),
    [sideB, sideC, includedAngleDeg],
  );

  // The midsegment + the base it mirrors — all lengths/parallelism from the
  // pure helper, never from pixels.
  const ms = useMemo(() => midsegment(vertices, side), [vertices, side]);
  const { p: baseP, q: baseQ, apex } = useMemo(
    () => sideAndApex(vertices, side),
    [vertices, side],
  );
  const baseLen = useMemo(
    () => Math.hypot(baseQ.x - baseP.x, baseQ.y - baseP.y),
    [baseP, baseQ],
  );

  const active = step > 0;
  const landed = step >= 3;
  // Dilation factor about the apex: 1 (midsegment) → 2 (lands on the base).
  const factor = step < 2 ? 1 : step === 2 ? 1 + scaleT : 2;
  const dil = (pt: Pt): Pt => ({
    x: apex.x + factor * (pt.x - apex.x),
    y: apex.y + factor * (pt.y - apex.y),
  });
  // The scaling midsegment endpoints (start→ baseP-ish via the apex ray, end→
  // baseQ). At factor 2 they coincide exactly with the base endpoints.
  const movingStart = dil(ms.start);
  const movingEnd = dil(ms.end);

  // --- proof playback ------------------------------------------------------
  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const reset = () => {
    clearTimers();
    setStep(0);
    setScaleT(0);
  };
  useEffect(() => clearTimers, []);

  const animate = (onDone: () => void) => {
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ANIM_MS);
      setScaleT(easeOut(k));
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
    setScaleT(0);
    setStep(1);
    if (reduceMotion) {
      setStep(3);
      timersRef.current.push(setTimeout(reset, DISMISS_MS));
      return;
    }
    timersRef.current.push(
      setTimeout(() => {
        setStep(2);
        animate(() => {
          setStep(3);
          timersRef.current.push(setTimeout(reset, DISMISS_MS));
        });
      }, START_DELAY_MS),
    );
  };

  // Reshaping (or switching the side) invalidates any running proof — drop it.
  const reshape = (fn: () => void) => {
    if (step !== 0) reset();
    fn();
  };

  const halfLen = ms.length;
  const sideName = side; // "AB" | "BC" | "CA"

  const proofSteps = [
    `Start with the midsegment joining the midpoints of the two sides that meet at the opposite vertex.`,
    `Dilate the small triangle by a factor of 2 from that vertex — every length, including the midsegment, doubles.`,
    `The midsegment scales out to land exactly on ${sideName}: a dilation sends a segment to a parallel one, so it is ∥ ${sideName} and half its length.`,
  ];

  const caption =
    `A triangle whose midsegment parallel to side ${sideName} joins the midpoints of the ` +
    `other two sides. It is always parallel to ${sideName} and exactly half as long: here ` +
    `the midsegment is ${halfLen.toFixed(1)} and ${sideName} is ${baseLen.toFixed(1)}. ` +
    `Press “Show why” to watch a dilation by 2 from the opposite vertex carry the ` +
    `midsegment out onto ${sideName}.`;

  // Parallel mark: a chevron (›) pointing ALONG the segment, drawn at its
  // midpoint. Matching chevrons on two segments is the standard notation for
  // "these are parallel" — distinct from a perpendicular tick, which would
  // (wrongly) assert the segments are EQUAL in length. Presentational only.
  const parallelMark = (a: Pt, b: Pt, fwd = 0.18, half = 0.16): [number, number][] => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const nx = -uy;
    const ny = ux;
    // tail ─ apex ─ tail, forming a "›" that points along the segment.
    return [
      [mx - ux * fwd + nx * half, my - uy * fwd + ny * half],
      [mx + ux * fwd, my + uy * fwd],
      [mx - ux * fwd - nx * half, my - uy * fwd - ny * half],
    ];
  };

  const baseTick = parallelMark(baseP, baseQ);
  const msTick = parallelMark(ms.start, ms.end);

  return (
    <figure
      className={["cbmc-midsegment", className].filter(Boolean).join(" ")}
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

          {/* The base the midsegment mirrors — always emphasized with one tick. */}
          <Polyline
            points={[
              [baseP.x, baseP.y],
              [baseQ.x, baseQ.y],
            ]}
            color={BASE_COLOR}
            fillOpacity={0}
            weight={3.5}
          />
          <Polyline points={baseTick} color={BASE_COLOR} fillOpacity={0} weight={2.5} />
          <Text
            x={(baseP.x + baseQ.x) / 2}
            y={(baseP.y + baseQ.y) / 2 - 0.5}
            size={15}
            color={BASE_COLOR}
          >
            {`${sideName} = ${baseLen.toFixed(1)}`}
          </Text>

          {active ? (
            <>
              {/* The small triangle being scaled out from the apex. */}
              <Polygon
                points={[
                  [apex.x, apex.y],
                  [movingStart.x, movingStart.y],
                  [movingEnd.x, movingEnd.y],
                ]}
                color={MID_COLOR}
                fillOpacity={0.12}
                weight={0}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              <Polyline
                points={[
                  [movingStart.x, movingStart.y],
                  [movingEnd.x, movingEnd.y],
                ]}
                color={MID_COLOR}
                fillOpacity={0}
                weight={3.5}
              />
              <Point x={movingStart.x} y={movingStart.y} color={MID_COLOR} />
              <Point x={movingEnd.x} y={movingEnd.y} color={MID_COLOR} />
              {/* The dilation centre. */}
              <Point x={apex.x} y={apex.y} color={MUTED} />
            </>
          ) : (
            <>
              {/* Resting: the midsegment + its two midpoints + a matching tick to
                  assert it is parallel to the base. */}
              <Polyline
                points={[
                  [ms.start.x, ms.start.y],
                  [ms.end.x, ms.end.y],
                ]}
                color={MID_COLOR}
                fillOpacity={0}
                weight={3.5}
              />
              <Polyline points={msTick} color={MID_COLOR} fillOpacity={0} weight={2.5} />
              <Point x={ms.start.x} y={ms.start.y} color={MID_COLOR} />
              <Point x={ms.end.x} y={ms.end.y} color={MID_COLOR} />
              <Text
                x={(ms.start.x + ms.end.x) / 2}
                y={(ms.start.y + ms.end.y) / 2 + 0.45}
                size={15}
                color={MID_COLOR}
              >
                {`${halfLen.toFixed(1)}`}
              </Text>
            </>
          )}

          <VertexLabels vertices={vertices} color={TRIANGLE_COLOR} />
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        Reshape the triangle with the sliders and watch the midsegment stay
        parallel to the base at exactly half its length. Then press “Show why”.
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
          onChange={(v) => reshape(() => setAngle(clamp(v, ANGLE_MIN, ANGLE_MAX)))}
          display={`${Math.round(includedAngleDeg)}°`}
        />
      </div>

      <ViewSwitcher
        label="Which midsegment"
        value={side}
        options={SIDE_OPTIONS}
        onChange={(v) => reshape(() => setSide(v))}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" aria-pressed={active} onClick={playProof}>
          {active ? "Show why again" : "Show why"}
        </button>
        {active ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-label="Reset and hide the demonstration"
            title="Press to reset and hide the demonstration"
            onClick={reset}
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="cbmc-progress" role="status" aria-live="polite">
        <span aria-hidden="true">
          midsegment ={" "}
          <span style={{ color: MID_COLOR, fontWeight: 600 }}>{halfLen.toFixed(1)}</span>{" "}
          = ½ ·{" "}
          <span style={{ color: BASE_COLOR, fontWeight: 600 }}>{baseLen.toFixed(1)}</span>,
          and ∥{" "}
          <span style={{ color: BASE_COLOR, fontWeight: 600 }}>{sideName}</span>
        </span>
        <span className="cbmc-sr-only">
          {`The midsegment is ${halfLen.toFixed(1)}, which is half of ${sideName} (${baseLen.toFixed(1)}), and it is parallel to ${sideName}.`}
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
