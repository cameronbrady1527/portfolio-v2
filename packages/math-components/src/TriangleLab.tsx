"use client";

/**
 * <TriangleLab> — reshape a triangle by its SAS parameters (two sides + the
 * included angle) and watch one invariant hold: the interior angles always sum
 * to 180°. On-figure angle arcs (one per vertex, measure labelled at the corner)
 * make the lens concrete, and "Show why it's 180°" runs the proof as a rigid
 * motion: a half-turn about the midpoint of CA carries the angle at A up to the
 * apex C, a half-turn about the midpoint of CB carries the angle at B up too,
 * and the three angles tile a straight line through C parallel to AB. The
 * half-turns reuse the shipped, exact `rotate()` (see `angleSumAssembly`), so
 * the proof is machine-checked, not eyeballed — narrated step by step, paced,
 * with a reduced-motion static fallback and a completion glow.
 *
 * Single source of truth: React state holds the three SAS control values plus
 * the animation clock. The figure, the arcs, the readout, and the assembly are
 * all derived from the pure `triangle` module. Each corner has its own colour
 * AND its letter (A/B/C), so the figure↔readout link reads without relying on
 * colour. Dragging a vertex recomputes the SAS params from the three points and
 * writes them back, so the sliders and the drag-handles stay in lockstep.
 * Zero-stakes: nothing recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Coordinates,
  Mafs,
  MovablePoint,
  Point,
  Polygon,
  Polyline,
  Text,
} from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import {
  angleSumAssembly,
  midsegment,
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
  type Pt,
  type TriangleSide,
} from "./logic";

const TRIANGLE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const ACCENT_COLOR = "var(--cbmc-image-color, #1f8a5b)";

// One colour per corner for its angle arc + measure. Chosen distinct from the
// near-black triangle stroke and the green drag-handles. Colour is reinforcement
// only — each corner is also identified by its letter (A/B/C), so the figure is
// legible without it (quality bar: quantities on the figure, colour-independent).
const VERTEX_ARC_COLORS = [
  "var(--cbmc-angle-a, #b4540a)", // A — warm orange
  "var(--cbmc-angle-b, #2563b4)", // B — blue
  "var(--cbmc-angle-c, #7a3fb0)", // C — violet
];

const DEG = Math.PI / 180;

/**
 * Which invariant the lab is currently spotlighting. The switcher introduced
 * here is deliberately a small, closed union: extensible by adding a case, but
 * NOT yet the author-facing `lenses` prop (that is slice #83). Each lens owns its
 * own figure overlay, controls, and a single `role="status"` readout — only the
 * active lens renders, so the announced quantity is never ambiguous.
 */
type Lens = "angle-sum" | "exterior" | "midsegment";

const LENS_OPTIONS: { id: Lens; label: string }[] = [
  { id: "angle-sum", label: "Angle sum" },
  { id: "exterior", label: "Exterior angle" },
  { id: "midsegment", label: "Midsegment" },
];

/** Vertex metadata for the exterior-angle lens: index into [A,B,C] + remotes. */
const VERTICES = ["A", "B", "C"] as const;
type VertexName = (typeof VERTICES)[number];

/** The three sides offered by the midsegment lens, in figure order. */
const SIDE_OPTIONS: TriangleSide[] = ["AB", "BC", "CA"];

/** Sample an arc of radius `r` about `c`, from `a0deg` to `a1deg` (degrees). */
function arcPoints(c: Pt, a0deg: number, a1deg: number, r: number): [number, number][] {
  const n = 24;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0deg + ((a1deg - a0deg) * i) / n) * DEG;
    pts.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
  }
  return pts;
}

/**
 * The interior angle arc at vertex `v` whose adjacent vertices are `p` and `q`:
 * the polyline tracing the arc, and the bisector point to drop the measure on.
 * The arc sweeps the MINOR angle between the two edges — which, since every
 * interior angle of a triangle is < 180°, is exactly the interior. Its radius
 * scales with the shorter adjacent edge (capped) so it always sits inside even a
 * small or thin triangle. The measure rides just inside the corner along the
 * bisector, opposite the vertex letter (which sits outside), so they never clash.
 */
function vertexArc(
  v: Pt,
  p: Pt,
  q: Pt,
  rOverride?: number,
): { arc: [number, number][]; wedge: [number, number][]; label: [number, number] } {
  const angP = Math.atan2(p.y - v.y, p.x - v.x) / DEG;
  const angQ = Math.atan2(q.y - v.y, q.x - v.x) / DEG;
  // Signed sweep normalized to (-180, 180]; |delta| is the interior angle.
  const delta = ((angQ - angP + 540) % 360) - 180;
  const r = rOverride ?? vertexArcRadius(v, p, q);
  const arc = arcPoints(v, angP, angP + delta, r);
  const mid = (angP + delta / 2) * DEG;
  const labelR = r + 0.5;
  return {
    arc,
    wedge: [[v.x, v.y], ...arc], // closed to the vertex → a fillable wedge
    label: [v.x + labelR * Math.cos(mid), v.y + labelR * Math.sin(mid)],
  };
}

/** The adaptive arc radius at a corner: a fraction of the shorter adjacent edge. */
function vertexArcRadius(v: Pt, p: Pt, q: Pt): number {
  const lp = Math.hypot(p.x - v.x, p.y - v.y);
  const lq = Math.hypot(q.x - v.x, q.y - v.y);
  return Math.min(0.7, 0.32 * Math.min(lp, lq));
}

/** Rotate a rendered point `deg` degrees about center `c` (for the proof motion). */
function rotPt([x, y]: [number, number], deg: number, c: Pt): [number, number] {
  const a = deg * DEG;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = x - c.x;
  const dy = y - c.y;
  return [c.x + cos * dx - sin * dy, c.y + sin * dx + cos * dy];
}

/** Ease-out so each half-turn decelerates gently into its landing. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const START_DELAY_MS = 1000; // a beat to read step 1 before the first half-turn
const ANIM_MS = 2600; // each half-turn — slow enough to follow
const DISMISS_MS = 6000; // auto-clear the assembled proof after it lands

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

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
 * the union of triangles sampled across the FULL range of the SAS controls (the
 * angle sampled at several points so the tall θ≈90° case is captured, not just
 * the endpoints). The triangle then moves within a stationary frame.
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
  // The proof clock: step 0 idle; 1 = beat, 2 = A half-turn, 3 = B half-turn,
  // 4 = landed. proofT (0…1) is how far the CURRENT half-turn has swung.
  const [step, setStep] = useState(0);
  const [proofT, setProofT] = useState(0);
  // Lens selection + each lens's own pick (control values only — derived below).
  const [lens, setLens] = useState<Lens>("angle-sum");
  const [extVertex, setExtVertex] = useState<VertexName>("C");
  const [msSide, setMsSide] = useState<TriangleSide>("AB");
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const abId = useId();
  const acId = useId();
  const angId = useId();
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

  // On-figure angle arcs: one per corner, each between its two adjacent edges.
  const arcs = useMemo(
    () => [vertexArc(A, B, C), vertexArc(B, A, C), vertexArc(C, A, B)],
    [A, B, C],
  );
  const measures = [angA, angB, angC];

  // The proof construction: the half-turn centers (side midpoints) and the
  // images of A and B that land on the straight line through the apex C. Reuses
  // the shipped, exact rotate() — machine-checked, not eyeballed. The three
  // proof wedges share one radius so they tile cleanly when assembled at C.
  const proof = useMemo(() => {
    const asm = angleSumAssembly(vertices);
    const rP = Math.min(
      vertexArcRadius(A, C, B),
      vertexArcRadius(B, C, A),
      vertexArcRadius(C, A, B),
    );
    return {
      asm,
      A: vertexArc(A, C, B, rP), // wedge of ∠A (rays to C and B)
      B: vertexArc(B, C, A, rP), // wedge of ∠B
      C: vertexArc(C, A, B, rP), // wedge of ∠C — the one that never moves
    };
  }, [vertices, A, B, C]);

  // --- exterior-angle lens (derived) --------------------------------------
  // At the focus vertex, the exterior angle (180 − interior) equals the sum of
  // the two REMOTE interior angles. All three numbers come from the same
  // sum-preserving rounding as the readout, so 180 − interior === remoteA +
  // remoteB holds in what's shown — the identity the lens exists to demonstrate.
  const exterior = useMemo(() => {
    const i = VERTICES.indexOf(extVertex);
    const interior = [angA, angB, angC][i];
    const remotes = [angA, angB, angC].filter((_, k) => k !== i);
    const remoteNames = VERTICES.filter((_, k) => k !== i);
    const v = vertices[i];
    // The exterior ray: extend the side from a neighbour THROUGH this vertex.
    const neighbour = vertices[(i + 1) % 3];
    const dir = { x: v.x - neighbour.x, y: v.y - neighbour.y };
    const len = Math.hypot(dir.x, dir.y) || 1;
    const tip = { x: v.x + (dir.x / len) * 2, y: v.y + (dir.y / len) * 2 };
    // The exterior-angle arc: from the extension ray to the far edge of the
    // triangle at this vertex (the side NOT shared with `neighbour`).
    const far = vertices[(i + 2) % 3];
    const arc = vertexArc(v, tip, far);
    return {
      vertexName: extVertex,
      interior,
      value: 180 - interior,
      remotes,
      remoteNames,
      vertex: v,
      tip,
      arc,
    };
  }, [extVertex, angA, angB, angC, vertices]);

  // --- midsegment lens (derived) ------------------------------------------
  // The midsegment parallel to the chosen side: endpoints, parallel-to flag, and
  // half-length all come straight from the pure `midsegment()` — never eyeballed.
  const mid = useMemo(() => {
    const ms = midsegment(vertices, msSide);
    const [p, q] =
      msSide === "AB"
        ? [A, B]
        : msSide === "BC"
          ? [B, C]
          : [C, A];
    const sideLen = Math.hypot(q.x - p.x, q.y - p.y);
    return { ms, side: msSide, sideLen };
  }, [vertices, msSide, A, B, C]);

  // How far each half-turn has swung: A swings during step 2, B during step 3.
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

  // Animate one half-turn (proofT 0 → 1, eased), then hand off to `onDone`.
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

  // Leaving the angle-sum lens abandons any running proof (it belongs to that
  // lens only); the proof overlay is gated on `lens === "angle-sum"` below too.
  const selectLens = (next: Lens) => {
    if (next !== "angle-sum" && step !== 0) resetProof();
    setLens(next);
  };

  // Dragging vertex B or C reshapes the triangle; recompute SAS and write back.
  // (Vertex A is the canonical anchor at the origin.)
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

          {/* Angle-sum lens, resting state: thin on-figure angle arcs +
              machine-sourced measures — the lens drawn in its own language. */}
          {lens === "angle-sum" && !active &&
            arcs.map((a, i) => (
              <Polyline
                key={`arc-${i}`}
                points={a.arc}
                color={VERTEX_ARC_COLORS[i]}
                fillOpacity={0}
                weight={2}
              />
            ))}
          {lens === "angle-sum" && !active &&
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

          {/* Exterior-angle lens: extend a side through the focus vertex and arc
              the exterior angle, labelled with its measure. */}
          {lens === "exterior" ? (
            <>
              <Polyline
                points={[
                  [exterior.vertex.x, exterior.vertex.y],
                  [exterior.tip.x, exterior.tip.y],
                ]}
                color="var(--cbmc-muted, #6b6353)"
                fillOpacity={0}
                weight={1.5}
                svgPolylineProps={{ strokeDasharray: "6 5" }}
              />
              <Polyline
                points={exterior.arc.arc}
                color={ACCENT_COLOR}
                fillOpacity={0}
                weight={2}
              />
              <Text
                x={exterior.arc.label[0]}
                y={exterior.arc.label[1]}
                size={15}
                color={ACCENT_COLOR}
              >
                {`${exterior.value}°`}
              </Text>
            </>
          ) : null}

          {/* Midsegment lens: the midsegment parallel to the chosen side, drawn
              between the two adjacent midpoints. */}
          {lens === "midsegment" ? (
            <>
              <Polyline
                points={[
                  [mid.ms.start.x, mid.ms.start.y],
                  [mid.ms.end.x, mid.ms.end.y],
                ]}
                color={ACCENT_COLOR}
                fillOpacity={0}
                weight={3}
              />
              <Point x={mid.ms.start.x} y={mid.ms.start.y} color={ACCENT_COLOR} />
              <Point x={mid.ms.end.x} y={mid.ms.end.y} color={ACCENT_COLOR} />
            </>
          ) : null}

          {/* The proof in motion: ∠A and ∠B half-turn about the side midpoints
              to land beside ∠C, tiling a straight line through C parallel to AB. */}
          {active ? (
            <>
              {/* The assembly line ℓ ∥ AB through the apex — the proof's target. */}
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
              {/* The half-turn pivots: the midpoints of CA and CB. */}
              {step >= 2 ? (
                <Point x={midCA.x} y={midCA.y} color={VERTEX_ARC_COLORS[0]} />
              ) : null}
              {step >= 3 ? (
                <Point x={midCB.x} y={midCB.y} color={VERTEX_ARC_COLORS[1]} />
              ) : null}

              {/* ∠C never moves; ∠A and ∠B swing in. */}
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

              {/* Measures travel with their angles. */}
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
        <div className="cbmc-control-row">
          <label htmlFor={abId} className="cbmc-control-label">Side AB</label>
          <input
            id={abId}
            type="range"
            aria-label="Side AB"
            aria-valuetext={sideB.toFixed(1)}
            min={SIDE_MIN}
            max={SIDE_MAX}
            step={0.1}
            value={sideB}
            onChange={(e) => reshape(() => setSideB(Number(e.target.value)))}
          />
          <span className="cbmc-control-value">{sideB.toFixed(1)}</span>
        </div>
        <div className="cbmc-control-row">
          <label htmlFor={acId} className="cbmc-control-label">Side AC</label>
          <input
            id={acId}
            type="range"
            aria-label="Side AC"
            aria-valuetext={sideC.toFixed(1)}
            min={SIDE_MIN}
            max={SIDE_MAX}
            step={0.1}
            value={sideC}
            onChange={(e) => reshape(() => setSideC(Number(e.target.value)))}
          />
          <span className="cbmc-control-value">{sideC.toFixed(1)}</span>
        </div>
        <div className="cbmc-control-row">
          <label htmlFor={angId} className="cbmc-control-label">Angle ∠A</label>
          <input
            id={angId}
            type="range"
            aria-label="Included angle"
            aria-valuetext={`${Math.round(includedAngleDeg)}°`}
            min={ANGLE_MIN}
            max={ANGLE_MAX}
            step={1}
            value={includedAngleDeg}
            onChange={(e) => reshape(() => setAngle(Number(e.target.value)))}
          />
          <span className="cbmc-control-value">{Math.round(includedAngleDeg)}°</span>
        </div>
      </div>

      {/* Lens switcher — a segmented group of native buttons (keyboard-operable;
          colour-independent via aria-pressed + text). Each lens owns the controls
          + readout below. Extensible by adding a LENS_OPTIONS entry + a case. */}
      <div
        className="cbmc-controls"
        role="group"
        aria-label="Lens"
        style={{ marginTop: "0.75rem" }}
      >
        {LENS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="cbmc-chip"
            aria-pressed={lens === opt.id}
            onClick={() => selectLens(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Angle-sum lens ─────────────────────────────────────────────── */}
      {lens === "angle-sum" ? (
        <>
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
        </>
      ) : null}

      {/* ── Exterior-angle lens ────────────────────────────────────────── */}
      {lens === "exterior" ? (
        <>
          <div
            className="cbmc-controls"
            role="group"
            aria-label="Exterior-angle vertex"
            style={{ marginTop: "0.5rem" }}
          >
            {VERTICES.map((name) => (
              <button
                key={name}
                type="button"
                className="cbmc-chip"
                aria-pressed={extVertex === name}
                onClick={() => setExtVertex(name)}
              >
                {`Vertex ${name}`}
              </button>
            ))}
          </div>
          <p className="cbmc-progress" role="status" aria-live="polite">
            Exterior angle at {exterior.vertexName} = 180° − ∠{exterior.vertexName}{" "}
            = 180° − {exterior.interior}° = {exterior.value}° = ∠
            {exterior.remoteNames[0]} + ∠{exterior.remoteNames[1]} ={" "}
            {exterior.remotes[0]}° + {exterior.remotes[1]}° ={" "}
            {exterior.remotes[0] + exterior.remotes[1]}°
          </p>
        </>
      ) : null}

      {/* ── Midsegment lens ────────────────────────────────────────────── */}
      {lens === "midsegment" ? (
        <>
          <div
            className="cbmc-controls"
            role="group"
            aria-label="Midsegment parallel side"
            style={{ marginTop: "0.5rem" }}
          >
            {SIDE_OPTIONS.map((side) => (
              <button
                key={side}
                type="button"
                className="cbmc-chip"
                aria-pressed={msSide === side}
                onClick={() => setMsSide(side)}
              >
                {`Side ${side}`}
              </button>
            ))}
          </div>
          <p className="cbmc-progress" role="status" aria-live="polite">
            Midsegment ∥ {mid.side} (parallel to {mid.side}), length{" "}
            {mid.ms.length.toFixed(1)} = ½ · |{mid.side}| = ½ ·{" "}
            {mid.sideLen.toFixed(1)} = {(mid.sideLen / 2).toFixed(1)}
          </p>
        </>
      ) : null}

      {active && lens === "angle-sum" ? (
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
