"use client";

/**
 * <CongruenceByMotion> — the DEFINITION of triangle congruence, shown as a
 * rigid motion. Two same-shape triangles sit in different poses; press the
 * reveal and the first triangle is carried — translate → rotate → (reflect,
 * only when the target is a mirror image) — until it lands EXACTLY on the
 * second. Congruent means *superposable by a rigid motion*, not merely
 * "looks the same".
 *
 * Light agency: a {@link ViewSwitcher} flips the target between three preset
 * poses (slid far, turned, flipped) — no free dragging, and no non-congruent
 * failure case (page 1 stays tight). As the mover lands, the three pairs of
 * corresponding sides and angles are marked (shared hue + matching tick / arc
 * counts, a redundant non-colour encoding) and the correspondence is stated as
 * △ABC ≅ △DEF — seeding CPCTC.
 *
 * Single source of truth: the poses are built by composing the pure
 * `translate` / `rotate` / `reflect` helpers from `logic/geometry`, and the
 * landing is confirmed by `congruenceCheck` — the figure can never drift from
 * the math. Honors prefers-reduced-motion (a static, assembled fallback).
 * Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import {
  congruenceCheck,
  reflect,
  rotate,
  translate,
  type Pt,
  type ReflectLine,
} from "./logic";
import { autoBounds } from "./grapherLogic";
import { angleArcs, easeOut, rotPt, sideTicks } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, ANGLE_C, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ViewSwitcher } from "./internal/controls";

/** Which preset pose the target triangle is drawn in. */
export type Pose = "far" | "rotated" | "reflected";

/** One step of the superposing rigid motion (in translate→rotate→reflect order).
 *  Each is applied with the pure motion helper of the same name. */
type MotionStep =
  | { kind: "translate"; dx: number; dy: number }
  | { kind: "rotate"; deg: 90 | 180 | 270 | -90; about: Pt }
  | { kind: "reflect"; line: ReflectLine };

/** The mover (preimage) — a scalene triangle so its orientation and handedness
 *  are both legible, and the SSS correspondence is unambiguous. */
export const CONGRUENCE_SOURCE: Pt[] = [
  { x: -1, y: -1 }, // A
  { x: 2, y: -1 }, // B
  { x: 0, y: 1 }, // C
];

const centroid = (pts: Pt[]): Pt => ({
  x: (pts[0].x + pts[1].x + pts[2].x) / 3,
  y: (pts[0].y + pts[1].y + pts[2].y) / 3,
});

const verts = (s: { type: "polygon"; vertices: Pt[] }): Pt[] => s.vertices;
const poly = (pts: Pt[]) => ({ type: "polygon" as const, vertices: pts });

/** Apply a single motion step in full, using the pure logic helpers. */
function stepFull(pts: Pt[], s: MotionStep): Pt[] {
  if (s.kind === "translate") return verts(translate(poly(pts), s.dx, s.dy) as never);
  if (s.kind === "rotate") return verts(rotate(poly(pts), s.deg, s.about) as never);
  return verts(reflect(poly(pts), s.line) as never);
}

/** Apply a single motion step partially (animation frame t ∈ [0, 1]): a slide
 *  eases linearly, a turn sweeps by angle, a flip morphs straight through its
 *  mirror line. At t = 1 every kind equals {@link stepFull}. */
function stepPartial(pts: Pt[], s: MotionStep, t: number): Pt[] {
  if (s.kind === "translate") {
    return pts.map((p) => ({ x: p.x + s.dx * t, y: p.y + s.dy * t }));
  }
  if (s.kind === "rotate") {
    return pts.map((p) => {
      const [x, y] = rotPt([p.x, p.y], s.deg * t, s.about);
      return { x, y };
    });
  }
  const dst = stepFull(pts, s);
  return pts.map((p, i) => ({
    x: p.x + (dst[i].x - p.x) * t,
    y: p.y + (dst[i].y - p.y) * t,
  }));
}

/** The mover's vertices after `phase` completed steps plus the current step at
 *  progress `t`. `phase >= steps.length` returns the fully-landed triangle. */
function poseAt(source: Pt[], steps: MotionStep[], phase: number, t: number): Pt[] {
  let pts = source;
  for (let i = 0; i < Math.min(phase, steps.length); i++) pts = stepFull(pts, steps[i]);
  if (phase < steps.length) pts = stepPartial(pts, steps[phase], t);
  return pts;
}

/**
 * The source and target triangles for a pose, plus the ordered rigid motion
 * (translate → rotate → reflect) that carries source onto target. The target is
 * *defined* as the composition of those steps, so the mover lands on it exactly
 * and `congruenceCheck(source, target)` is always congruent. Pure — usable in a
 * plain node test.
 */
export function buildCongruencePose(pose: Pose): {
  source: Pt[];
  target: Pt[];
  steps: MotionStep[];
} {
  const source = CONGRUENCE_SOURCE;
  const c = centroid(source);
  let steps: MotionStep[];
  if (pose === "far") {
    steps = [{ kind: "translate", dx: 5, dy: 2.5 }];
  } else {
    const dx = 4;
    const dy = 2;
    const about: Pt = { x: c.x + dx, y: c.y + dy }; // centroid after the slide
    if (pose === "rotated") {
      steps = [
        { kind: "translate", dx, dy },
        { kind: "rotate", deg: 90, about },
      ];
    } else {
      steps = [
        { kind: "translate", dx, dy },
        { kind: "rotate", deg: 90, about },
        // A horizontal mirror through the (rotation-preserved) centroid flips
        // handedness, so the target is a genuine mirror image.
        { kind: "reflect", line: { kind: "linear", m: 0, b: about.y } },
      ];
    }
  }
  return { source, target: poseAt(source, steps, steps.length, 0), steps };
}

const POSES: Pose[] = ["far", "rotated", "reflected"];

/** A fixed viewport that fits the source, every target pose, and the swept
 *  intermediate positions, so the grid holds still through the motion. */
const FIXED_BOUNDS = (() => {
  const cloud: Pt[] = [...CONGRUENCE_SOURCE];
  for (const pose of POSES) {
    const { source, steps } = buildCongruencePose(pose);
    for (let phase = 0; phase <= steps.length; phase++) {
      for (const t of [0, 0.5, 1]) cloud.push(...poseAt(source, steps, phase, t));
    }
  }
  return autoBounds([{ type: "polygon", vertices: cloud }], 1);
})();

// Per-part identity: corresponding parts share a hue AND a tick / arc count
// (vertex A & side a → 1 mark, B → 2, C → 3). Redundant so colour is never the
// only channel.
const PART_HUE = [ANGLE_A, ANGLE_B, ANGLE_C];
const VERTEX_LABELS = ["A", "B", "C"];
const TARGET_LABELS = ["D", "E", "F"];
// Each vertex's two neighbours, for the interior-angle arcs.
const NEIGHBOURS: [number, number][] = [
  [1, 2],
  [2, 0],
  [0, 1],
];

const START_DELAY_MS = 700; // a beat to read the first narration line
const PHASE_MS = 1500; // one motion beat — slow enough to follow
const BETWEEN_MS = 450; // pause between beats
const DISMISS_MS = 6000; // auto-clear after it has landed

export interface CongruenceByMotionProps {
  /** Which target pose is shown first. Default "rotated". */
  initialPose?: Pose;
  className?: string;
}

const POSE_OPTIONS: { value: Pose; label: string }[] = [
  { value: "far", label: "Slid far" },
  { value: "rotated", label: "Turned" },
  { value: "reflected", label: "Flipped" },
];

// The correspondence, machine-true by construction: every step maps vertex i to
// vertex i, so D↔A, E↔B, F↔C — and the matching sides / angles follow.
const CORRESPONDENCE =
  "A↔D, B↔E, C↔F · side AB↔DE, BC↔EF, CA↔FD · ∠A↔∠D, ∠B↔∠E, ∠C↔∠F";

export function CongruenceByMotion({
  initialPose = "rotated",
  className,
}: CongruenceByMotionProps) {
  const [pose, setPose] = useState<Pose>(initialPose);
  // Motion clock: 0 idle; 1…phases = animating that beat; phases+1 = landed.
  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const { source, target, steps } = useMemo(() => buildCongruencePose(pose), [pose]);
  const phases = steps.length;
  const N = phases + 1; // the landed step
  const landed = step >= N;
  const active = step > 0;

  // What the rigid motion confirms: the two triangles are congruent. Read from
  // the pure core, never asserted.
  const check = useMemo(() => congruenceCheck(source, target), [source, target]);

  // The mover's current vertices.
  const mover = useMemo<Pt[]>(() => {
    if (step === 0) return source;
    if (landed) return target;
    return poseAt(source, steps, step - 1, t);
  }, [step, t, landed, source, target, steps]);

  // The rotation pivot and mirror line, surfaced once their beat is reached.
  const pivot = useMemo(() => {
    const r = steps.find((s) => s.kind === "rotate");
    return r && r.kind === "rotate" ? r.about : null;
  }, [steps]);
  const mirrorY = useMemo(() => {
    const r = steps.find((s) => s.kind === "reflect");
    return r && r.kind === "reflect" && r.line.kind === "linear" ? r.line.b : null;
  }, [steps]);

  // --- reveal playback -----------------------------------------------------
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

  const animatePhase = (phase: number, onDone: () => void) => {
    setStep(phase + 1);
    setT(0);
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / PHASE_MS);
      setT(easeOut(k));
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        rafRef.current = null;
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const runFrom = (phase: number) => {
    if (phase >= phases) {
      setStep(N);
      timersRef.current.push(setTimeout(reset, DISMISS_MS));
      return;
    }
    animatePhase(phase, () => {
      timersRef.current.push(setTimeout(() => runFrom(phase + 1), BETWEEN_MS));
    });
  };

  const playReveal = () => {
    clearTimers();
    setT(0);
    if (reduceMotion) {
      setStep(N); // jump straight to the assembled, landed figure
      timersRef.current.push(setTimeout(reset, DISMISS_MS));
      return;
    }
    setStep(1); // hold the first narration line for a beat, then move
    timersRef.current.push(setTimeout(() => runFrom(0), START_DELAY_MS));
  };

  const selectPose = (p: Pose) => {
    reset();
    setPose(p);
  };

  // --- narration -----------------------------------------------------------
  // One beat per motion step, then a landing conclusion — revealed line by line.
  const narration = useMemo(() => {
    const lines: string[] = [];
    for (const s of steps) {
      if (s.kind === "translate") {
        lines.push(
          "Slide the triangle over — every point moves the same distance in the same direction.",
        );
      } else if (s.kind === "rotate") {
        lines.push("Turn it a quarter-turn about the marked point until its sides line up.");
      } else {
        lines.push(
          "Flip it across the line — the target is a mirror image, so a reflection is needed.",
        );
      }
    }
    const verbs =
      phases === 1
        ? "A slide alone"
        : phases === 2
          ? "A slide and a turn"
          : "A slide, a turn, and a flip";
    lines.push(
      `${verbs} carried it on — it lands exactly on the target, so the two triangles are congruent: △ABC ≅ △DEF.`,
    );
    return lines;
  }, [steps, phases]);

  const caption =
    `Two congruent triangles — △ABC and △DEF — drawn in different poses. Choose ` +
    `a pose for △DEF, then press “Carry △ABC onto △DEF”. The first triangle is ` +
    `slid${pose === "far" ? "" : ", turned"}${pose === "reflected" ? ", and flipped" : ""} ` +
    `until it covers the second exactly. Because a rigid motion carries one onto ` +
    `the other, they are congruent — and the parts that come to rest on each ` +
    `other are the corresponding parts: ${CORRESPONDENCE}.`;

  const showMarks = landed;
  const t0 = target;

  return (
    <figure
      className={["cbmc-congruence-by-motion", className].filter(Boolean).join(" ")}
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

          {/* The TARGET △DEF — a dashed outline the mover is carried onto. */}
          <Polygon
            points={target.map((p) => [p.x, p.y])}
            color={MUTED}
            fillOpacity={landed ? 0 : 0.05}
            weight={2}
            svgPolygonProps={{ strokeDasharray: "6 5" }}
          />
          {!landed
            ? target.map((p, i) => (
                <Text key={`tlbl-${i}`} x={p.x} y={p.y} size={14} color={MUTED}>
                  {TARGET_LABELS[i]}
                </Text>
              ))
            : null}

          {/* The rotation pivot (once its beat begins) and the mirror line. */}
          {pivot && step >= 2 ? <Point x={pivot.x} y={pivot.y} color={PREIMAGE} /> : null}
          {mirrorY != null && step >= phases ? (
            <Polyline
              points={[
                [FIXED_BOUNDS.x[0], mirrorY],
                [FIXED_BOUNDS.x[1], mirrorY],
              ]}
              color={MUTED}
              fillOpacity={0}
              weight={1}
              svgPolylineProps={{ strokeDasharray: "3 5" }}
            />
          ) : null}

          {/* The MOVER △ABC — solid, carried by the rigid motion. */}
          <Polygon
            points={mover.map((p) => [p.x, p.y])}
            color={IMAGE}
            fillOpacity={0.14}
            weight={2.5}
          />
          {mover.map((p, i) => (
            <Point key={`mpt-${i}`} x={p.x} y={p.y} color={IMAGE} />
          ))}
          {!landed
            ? mover.map((p, i) => (
                <Text key={`mlbl-${i}`} x={p.x} y={p.y} size={14} color={IMAGE}>
                  {VERTEX_LABELS[i]}
                </Text>
              ))
            : null}

          {/* Landed: name the corresponding parts on the coincident triangle. */}
          {showMarks ? (
            <>
              {/* Corresponding angles — arcs, hue + count by vertex. */}
              {[0, 1, 2].map((i) => {
                const [p, q] = NEIGHBOURS[i];
                return angleArcs(t0[i], t0[p], t0[q], i + 1).map((arc, k) => (
                  <Polyline
                    key={`arc-${i}-${k}`}
                    points={arc}
                    color={PART_HUE[i]}
                    fillOpacity={0}
                    weight={2}
                  />
                ));
              })}
              {/* Corresponding sides — ticks, count by side. */}
              {[0, 1, 2].map((i) => {
                const a = t0[i];
                const b = t0[(i + 1) % 3];
                return sideTicks(a, b, i + 1).map((seg, k) => (
                  <Polyline
                    key={`tick-${i}-${k}`}
                    points={seg}
                    color={PREIMAGE}
                    fillOpacity={0}
                    weight={2}
                  />
                ));
              })}
              {/* The coincident vertices, labelled with the correspondence. */}
              {[0, 1, 2].map((i) => (
                <Text key={`clbl-${i}`} x={t0[i].x} y={t0[i].y} size={14} color={PART_HUE[i]}>
                  {`${VERTEX_LABELS[i]}=${TARGET_LABELS[i]}`}
                </Text>
              ))}
            </>
          ) : null}
        </Mafs>
      </div>

      <ViewSwitcher<Pose>
        label="Pose of the second triangle"
        value={pose}
        options={POSE_OPTIONS}
        onChange={selectPose}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" aria-pressed={active} onClick={playReveal}>
          {active ? "Carry it again" : "Carry △ABC onto △DEF"}
        </button>
        {active ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-label="Reset and hide the motion"
            title="Press to reset and hide the motion"
            onClick={reset}
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        Pick a pose for the second triangle, then carry the first one onto it.
        Want to drive the slide, turn, and flip yourself? Try the{" "}
        <a href="/geometry/transformations/translations">transformations tools</a>.
      </p>

      {/* The marks' non-colour encoding, surfaced for a11y / tests. */}
      {[0, 1, 2].map((i) => (
        <span
          key={`pat-${i}`}
          className="cbmc-sr-only"
          data-cbmc-part={i}
          data-cbmc-marks={i + 1}
        />
      ))}

      <div role="status" aria-live="polite" style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        {active ? (
          <ol className="cbmc-proof-steps">
            {narration.slice(0, step).map((text, i) => (
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
        ) : (
          <p>
            △ABC and △DEF are congruent ({check.congruent ? "✓" : "—"}): a rigid
            motion carries one exactly onto the other. Press “Carry △ABC onto
            △DEF” to watch it land, and the corresponding parts come to rest on
            each other — {CORRESPONDENCE}.
          </p>
        )}
      </div>

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
