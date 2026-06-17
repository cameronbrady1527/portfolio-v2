"use client";

/**
 * <TriangleInequality> — the TRIANGLE INEQUALITY tool. Set three stick lengths
 * a, b, c and watch whether they can close into a triangle. The lesson is the
 * one inequality that decides it: a triangle exists iff the two shorter sticks
 * are together LONGER than the longest one. Slide the sticks and the figure
 * either closes (the legs meet at an apex) or fails to close (the two shorter
 * legs fall short, leaving a labelled gap they cannot span).
 *
 * The longest stick is always laid as the base, so the binding comparison —
 * (sum of the other two) vs (the longest) — is the thing on screen. Each stick
 * keeps its own colour and length label as it changes role, so identity reads
 * without relying on colour. "Fold the sides up" runs the assembly as a hinge
 * motion: the two legs swing up from the base; when they can reach, they meet at
 * the apex (a triangle, with a completion glow); when they can't, they swing to
 * vertical and visibly miss each other. Reduced-motion jumps to the landed state.
 *
 * Single source of truth: the verdict and apex come from the pure, machine-
 * checked `triangleFromSSS` — the UI never eyeballs whether it closes. One topic,
 * one tool (no lens switcher). Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { triangleFromSSS, type Pt } from "./logic";
import { congruenceTickCounts, easeOut, sideTicks } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, ANGLE_C, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider } from "./internal/controls";

const SIDE_MIN = 1;
const SIDE_MAX = 9;
// One colour per stick, kept with the stick whatever role (base/leg) it plays.
const STICK_COLORS = [ANGLE_A, ANGLE_B, ANGLE_C];
const STICK_NAMES = ["a", "b", "c"];

const START_DELAY_MS = 700;
const ANIM_MS = 1700;
const DISMISS_MS = 5000;

export interface TriangleInequalityProps {
  /** Initial length of stick a. */
  a?: number;
  /** Initial length of stick b. */
  b?: number;
  /** Initial length of stick c. */
  c?: number;
  className?: string;
}

/** The flat (folded-down) layout and the assembled layout for one set of sticks. */
interface Layout {
  valid: boolean;
  /** Index (0..2) of the stick used as the base — the longest. */
  baseIdx: number;
  /** Indices of the two legs: [left pivot leg, right pivot leg]. */
  legIdx: [number, number];
  /** Base endpoints, centred on the origin. */
  left: Pt;
  right: Pt;
  /** Where the apex sits when the legs are folded all the way up (valid case). */
  apex: Pt;
  /** Sum of the two shorter sticks and the longest stick (for the readout). */
  shorterSum: number;
  longest: number;
  /** How far the legs fall short / would overshoot, ≥ 0 only when invalid. */
  shortfall: number;
}

/**
 * Lay three stick lengths out for the figure: the longest becomes the base
 * (centred on the origin), the other two are legs hinged at the base endpoints.
 * The apex (when the sticks close) and the verdict both come from the pure
 * `triangleFromSSS`, so the drawing follows the machine-checked math.
 */
function layout(sides: [number, number, number]): Layout {
  // Longest stick → base. Ties resolve to the earliest index (stable).
  let baseIdx = 0;
  for (let i = 1; i < 3; i++) if (sides[i] > sides[baseIdx]) baseIdx = i;
  const legIdx = [0, 1, 2].filter((i) => i !== baseIdx) as [number, number];
  const L = sides[baseIdx];
  const p = sides[legIdx[0]]; // left leg
  const q = sides[legIdx[1]]; // right leg

  // triangleFromSSS lays AB along +x from the origin; |CA| = p, |CB| = q.
  // Re-centre the base on the origin so the figure stays put as L changes.
  const { vertices, valid } = triangleFromSSS(L, q, p);
  const apexRaw = vertices[2];
  const dx = L / 2;
  return {
    valid,
    baseIdx,
    legIdx,
    left: { x: -dx, y: 0 },
    right: { x: dx, y: 0 },
    apex: { x: apexRaw.x - dx, y: apexRaw.y },
    shorterSum: p + q,
    longest: L,
    shortfall: L - (p + q),
  };
}

/** A FIXED viewport fitting every layout across the full slider ranges, so the
 *  grid holds still while the user reshapes (cf. TriangleLab FIXED_BOUNDS). */
const FIXED_BOUNDS = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let a = SIDE_MIN; a <= SIDE_MAX; a++)
    for (let b = SIDE_MIN; b <= SIDE_MAX; b++)
      for (let cc = SIDE_MIN; cc <= SIDE_MAX; cc++) {
        const lo = layout([a, b, cc]);
        const p = lo.longest; // legs at most this tall when swung to vertical
        pts.push(lo.left, lo.right, lo.apex);
        // Vertical-reach extremes of the legs (the fold's invalid apex).
        pts.push({ x: lo.left.x, y: p }, { x: lo.right.x, y: p });
      }
  return autoBounds([{ type: "polygon", vertices: pts }]);
})();

const clampSide = (v: number) => Math.max(SIDE_MIN, Math.min(SIDE_MAX, v));

/** Linear interpolate an angle (degrees) and place a leg's free end. */
function swing(pivot: Pt, len: number, fromDeg: number, toDeg: number, t: number): Pt {
  const a = ((fromDeg + (toDeg - fromDeg) * t) * Math.PI) / 180;
  return { x: pivot.x + len * Math.cos(a), y: pivot.y + len * Math.sin(a) };
}

export function TriangleInequality({
  a: a0 = 4,
  b: b0 = 6,
  c: c0 = 9,
  className,
}: TriangleInequalityProps) {
  const [sides, setSides] = useState<[number, number, number]>([
    clampSide(a0),
    clampSide(b0),
    clampSide(c0),
  ]);
  // Fold clock: 0 idle, 1 beat (flat), 2 swinging, 3 landed.
  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const lo = useMemo(() => layout(sides), [sides]);
  const { valid, baseIdx, legIdx, left, right, apex, shorterSum, longest, shortfall } = lo;

  const baseColor = STICK_COLORS[baseIdx];
  const leftColor = STICK_COLORS[legIdx[0]];
  const rightColor = STICK_COLORS[legIdx[1]];
  const pLen = sides[legIdx[0]];
  const qLen = sides[legIdx[1]];

  const active = step > 0;
  const landed = step >= 3;
  const folding = step === 2;
  // The legs' free ends at the current fold progress. Flat: left along +x (0°),
  // right along −x (180°). Final: meeting at the apex (valid) or swung to
  // vertical so they visibly miss (invalid).
  const tt = step < 2 ? 0 : step === 2 ? t : 1;
  const leftFinal = valid
    ? (Math.atan2(apex.y - left.y, apex.x - left.x) * 180) / Math.PI
    : 90;
  const rightFinal = valid
    ? (Math.atan2(apex.y - right.y, apex.x - right.x) * 180) / Math.PI
    : 90;
  const leftEnd = swing(left, pLen, 0, leftFinal, tt);
  const rightEnd = swing(right, qLen, 180, rightFinal, tt);

  // Flat resting layout (legs lying on the base, pointing toward each other).
  const flatLeftEnd: Pt = { x: left.x + pLen, y: 0 };
  const flatRightEnd: Pt = { x: right.x - qLen, y: 0 };

  // Congruence (hatch) marks: equal-length sticks get matching ticks, drawn in
  // ink so two equal sticks read as congruent despite their distinct colours.
  // The ticks ride whichever edge each stick occupies in the resting layout.
  const tickCounts = congruenceTickCounts(sides);
  const restingTickSegs = (() => {
    const baseEdge: [Pt, Pt] = [left, right];
    const leftEdge: [Pt, Pt] = valid
      ? [left, apex]
      : [
          { x: left.x, y: left.y + 0.15 },
          { x: flatLeftEnd.x, y: flatLeftEnd.y + 0.15 },
        ];
    const rightEdge: [Pt, Pt] = valid
      ? [right, apex]
      : [
          { x: right.x, y: right.y + 0.15 },
          { x: flatRightEnd.x, y: flatRightEnd.y + 0.15 },
        ];
    const edges: { idx: number; edge: [Pt, Pt] }[] = [
      { idx: baseIdx, edge: baseEdge },
      { idx: legIdx[0], edge: leftEdge },
      { idx: legIdx[1], edge: rightEdge },
    ];
    return edges.flatMap(({ idx, edge }) =>
      tickCounts[idx] > 0 ? sideTicks(edge[0], edge[1], tickCounts[idx]) : [],
    );
  })();

  // A side's length label, nudged off the line (perpendicular, away from the
  // `away` reference point) so it clears the congruence tick on the midpoint.
  const sideLabelPos = (p: Pt, q: Pt, away: Pt, d = 0.6): [number, number] => {
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L;
    let ny = dx / L;
    if ((mx - away.x) * nx + (my - away.y) * ny < 0) {
      nx = -nx;
      ny = -ny;
    }
    return [mx + nx * d, my + ny * d];
  };
  const labLeftValid = sideLabelPos(left, apex, right);
  const labRightValid = sideLabelPos(right, apex, left);
  const labLeftActive = sideLabelPos(left, leftEnd, right);
  const labRightActive = sideLabelPos(right, rightEnd, left);

  // --- fold playback -------------------------------------------------------
  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const reset = () => {
    clearTimers();
    setStep(0);
    setT(0);
  };
  useEffect(() => clearTimers, []);

  const animate = (onDone: () => void) => {
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ANIM_MS);
      setT(easeOut(k));
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        rafRef.current = null;
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const playFold = () => {
    clearTimers();
    setT(0);
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

  const reshape = (next: [number, number, number]) => {
    if (step !== 0) reset();
    setSides(next);
  };
  const setSide = (i: number, v: number) => {
    const next = [...sides] as [number, number, number];
    next[i] = v;
    reshape(next);
  };

  const verdict = valid
    ? `${shorterSum} > ${longest}, so sticks of length ${sides[0]}, ${sides[1]}, and ${sides[2]} close into a triangle.`
    : `${shorterSum} is not greater than ${longest}, so sticks of length ${sides[0]}, ${sides[1]}, and ${sides[2]} cannot close — the two shorter sticks fall short by ${shortfall}.`;

  const caption =
    `Three sticks of lengths a = ${sides[0]}, b = ${sides[1]}, and c = ${sides[2]}. ` +
    `They form a triangle exactly when the two shorter sticks together exceed the ` +
    `longest. Here the two shorter sticks sum to ${shorterSum} and the longest is ` +
    `${longest}, so the figure ${valid ? "closes into a triangle" : "cannot close"}. ` +
    `Press “Fold the sides up” to watch the two legs ${valid ? "swing up and meet" : "swing up and fall short"}.`;

  const foldSteps = [
    `Lay the longest stick (${longest}) flat as the base; the other two are hinged at its ends.`,
    valid
      ? `Swing the two shorter sticks up — ${pLen} + ${qLen} = ${shorterSum} reaches across, so they meet at a point.`
      : `Swing the two shorter sticks up — ${pLen} + ${qLen} = ${shorterSum} can't reach across ${longest}, so they never meet.`,
    valid
      ? `The three sticks close into a triangle.`
      : `There is no triangle: the gap of ${shortfall} can't be closed.`,
  ];

  const num = (i: number) => (
    <span style={{ color: STICK_COLORS[i], fontWeight: 600 }}>{sides[i]}</span>
  );

  return (
    <figure
      className={["cbmc-triangle-inequality", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className={["cbmc-graph-paper", landed && valid && "cbmc-pulse"]
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

          {/* The base — the longest stick — always lies flat. */}
          <Polyline
            points={[
              [left.x, left.y],
              [right.x, right.y],
            ]}
            color={baseColor}
            fillOpacity={0}
            weight={3.5}
          />
          <Text x={(left.x + right.x) / 2} y={-0.5} size={15} color={baseColor}>
            {`${STICK_NAMES[baseIdx]} = ${longest}`}
          </Text>

          {active ? (
            <>
              {/* The two legs swinging up from the base ends. */}
              <Polyline
                points={[
                  [left.x, left.y],
                  [leftEnd.x, leftEnd.y],
                ]}
                color={leftColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Polyline
                points={[
                  [right.x, right.y],
                  [rightEnd.x, rightEnd.y],
                ]}
                color={rightColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Text x={labLeftActive[0]} y={labLeftActive[1]} size={14} color={leftColor}>
                {`${STICK_NAMES[legIdx[0]]} = ${pLen}`}
              </Text>
              <Text x={labRightActive[0]} y={labRightActive[1]} size={14} color={rightColor}>
                {`${STICK_NAMES[legIdx[1]]} = ${qLen}`}
              </Text>
              {/* Free-end markers; when they coincide (valid, landed) it reads as a vertex. */}
              <Point x={leftEnd.x} y={leftEnd.y} color={leftColor} />
              <Point x={rightEnd.x} y={rightEnd.y} color={rightColor} />
              {/* Landed-but-open: mark the gap they couldn't span. */}
              {landed && !valid ? (
                <Polyline
                  points={[
                    [leftEnd.x, leftEnd.y],
                    [rightEnd.x, rightEnd.y],
                  ]}
                  color={MUTED}
                  fillOpacity={0}
                  weight={1.5}
                  svgPolylineProps={{ strokeDasharray: "5 5" }}
                />
              ) : null}
            </>
          ) : valid ? (
            // Resting, closes: the assembled triangle.
            <>
              <Polygon
                points={[
                  [left.x, left.y],
                  [right.x, right.y],
                  [apex.x, apex.y],
                ]}
                color={IMAGE}
                fillOpacity={0.12}
                weight={0}
              />
              <Polyline
                points={[
                  [left.x, left.y],
                  [apex.x, apex.y],
                ]}
                color={leftColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Polyline
                points={[
                  [right.x, right.y],
                  [apex.x, apex.y],
                ]}
                color={rightColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Text x={labLeftValid[0]} y={labLeftValid[1]} size={14} color={leftColor}>
                {`${STICK_NAMES[legIdx[0]]} = ${pLen}`}
              </Text>
              <Text x={labRightValid[0]} y={labRightValid[1]} size={14} color={rightColor}>
                {`${STICK_NAMES[legIdx[1]]} = ${qLen}`}
              </Text>
            </>
          ) : (
            // Resting, can't close: legs laid flat from each end (lifted a hair
            // off the base so the three sticks read as distinct), leaving a gap.
            <>
              <Polyline
                points={[
                  [left.x, left.y + 0.15],
                  [flatLeftEnd.x, flatLeftEnd.y + 0.15],
                ]}
                color={leftColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Polyline
                points={[
                  [right.x, right.y + 0.15],
                  [flatRightEnd.x, flatRightEnd.y + 0.15],
                ]}
                color={rightColor}
                fillOpacity={0}
                weight={3.5}
              />
              <Point x={flatLeftEnd.x} y={flatLeftEnd.y + 0.15} color={leftColor} />
              <Point x={flatRightEnd.x} y={flatRightEnd.y + 0.15} color={rightColor} />
              <Polyline
                points={[
                  [flatLeftEnd.x, flatLeftEnd.y + 0.15],
                  [flatRightEnd.x, flatRightEnd.y + 0.15],
                ]}
                color={MUTED}
                fillOpacity={0}
                weight={1.5}
                svgPolylineProps={{ strokeDasharray: "5 5" }}
              />
              <Text x={(left.x + flatLeftEnd.x) / 2} y={0.7} size={14} color={leftColor}>
                {`${STICK_NAMES[legIdx[0]]} = ${pLen}`}
              </Text>
              <Text x={(right.x + flatRightEnd.x) / 2} y={0.7} size={14} color={rightColor}>
                {`${STICK_NAMES[legIdx[1]]} = ${qLen}`}
              </Text>
              <Text x={(flatLeftEnd.x + flatRightEnd.x) / 2} y={0.7} size={14} color={MUTED}>
                {`gap ${shortfall}`}
              </Text>
            </>
          )}

          {/* Congruence ticks on equal sticks (resting state only). */}
          {!active &&
            restingTickSegs.map((seg, i) => (
              <Polyline
                key={`stick-${i}`}
                points={seg}
                color={PREIMAGE}
                fillOpacity={0}
                weight={2}
              />
            ))}
        </Mafs>
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        Set the three stick lengths and see whether they close. Then press “Fold
        the sides up” to watch the two shorter sticks try to meet.
      </p>

      <div role="group" aria-label="Stick lengths">
        {[0, 1, 2].map((i) => (
          <ControlSlider
            key={i}
            label={`Side ${STICK_NAMES[i]}`}
            value={sides[i]}
            min={SIDE_MIN}
            max={SIDE_MAX}
            step={1}
            onChange={(v) => setSide(i, v)}
            display={`${sides[i]}`}
          />
        ))}
      </div>

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" aria-pressed={active} onClick={playFold}>
          {active ? "Fold again" : "Fold the sides up"}
        </button>
        {active ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-label="Reset and hide the fold"
            title="Press to reset and hide the fold"
            onClick={reset}
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="cbmc-progress" role="status" aria-live="polite">
        <span aria-hidden="true">
          {num(legIdx[0])} + {num(legIdx[1])} ={" "}
          <span style={{ fontWeight: 600 }}>{shorterSum}</span>{" "}
          {valid ? ">" : "≤"}{" "}
          <span style={{ color: baseColor, fontWeight: 600 }}>{longest}</span> —{" "}
          {valid ? "a triangle ✓" : `no triangle (short by ${shortfall}) ✗`}
        </span>
        <span className="cbmc-sr-only">{verdict}</span>
      </p>

      {active ? (
        <div
          className="cbmc-proof-narration"
          aria-live="polite"
          style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
        >
          <ol className="cbmc-proof-steps">
            {foldSteps.slice(0, step).map((text, i) => (
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
