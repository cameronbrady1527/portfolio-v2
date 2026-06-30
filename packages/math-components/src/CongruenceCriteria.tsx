"use client";

/**
 * <CongruenceCriteria> — the C5 unit's flagship INQUIRY tool. The student is
 * handed a set of triangle parts (highlighted as fixed constraints) and is
 * invited to *try to build a DIFFERENT triangle from the same parts*. For the
 * rigid criteria — SSS, SAS, ASA, AAS, HL — the linkage refuses to flex: nudge a
 * corner and it springs straight back, because those parts pin every vertex.
 * The student discovers validity by FAILING to find a counter-example, never by
 * being told.
 *
 * Two-beat structure:
 *   1. an INQUIRY beat — live, NON-judgmental feedback only ("it won't budge",
 *      "you found a second triangle"); no verdict yet;
 *   2. a student-triggered CONSOLIDATION beat ("Name it") that labels the result
 *      ("Three sides locked it — SSS is a valid congruence shortcut").
 *
 * Single source of truth: the figure is the actual triangle `solveTriangles`
 * constructs from the parts, and the consolidation VERDICT (valid / ambiguous /
 * continuous) is read from `solutionCount` — never hardcoded. If the math were
 * wrong, the verdict would visibly break.
 *
 * Controls-first (a {@link ViewSwitcher} picks the part-set; rigid sets drive a
 * nudge button, SSA drives a swinging-side {@link ControlSlider} plus a
 * two-solution toggle, AAA drives a scale slider), keyboard-operable, and
 * reduced-motion aware. Zero-stakes: nothing recorded.
 *
 * THREE freedom modes, each a `mode` on its part-set:
 *   - `"rigid"` (SSS/SAS/ASA/AAS/HL): the parts pin the triangle → nudge springs
 *     back → a valid criterion.
 *   - `"swing"` (SSA): the opposite side swings like a door and catches the base
 *     at 0 / 1 / 2 points as it lengthens; the lone "1" is the RIGHT-ANGLE
 *     boundary — which is exactly why HL locks when general SSA does not.
 *   - `"scale"` (AAA): angles fixed, no length anchor → a continuous family of
 *     same-shape, different-size triangles (similar, not congruent).
 * The rigid path, the verdict plumbing, and the two-beat shell are shared across
 * all three; each non-rigid mode adds only its control branch + figure overlay.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import {
  solutionCount,
  solveTriangles,
  type Criterion,
  type Determinacy,
  type Parts,
  type Pt,
} from "./logic";
import { autoBounds } from "./grapherLogic";
import { angleArcs, rightAngleSquare, sideTicks } from "./internal/geometry";
import { ACCENT, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider, ViewSwitcher } from "./internal/controls";

/** The two beats of the inquiry. */
type Beat = "inquiry" | "named";

/** How the leftover freedom (if any) is explored. */
type FreedomMode = "rigid" | "swing" | "scale";

const DEG = Math.PI / 180;

/** A swept control (the SSA swinging side, the AAA size). */
interface Sweep {
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit?: string;
}

/** A part-set the student investigates: the parts, which of them are GIVEN
 *  (drawn as fixed constraints), and the authored discovery story. The verdict
 *  is NOT stored here — it is read live from `solutionCount`. */
interface PartSet {
  criterion: Criterion;
  /** Short switcher label, e.g. "SSS". */
  label: string;
  /** The measured parts handed to the criterion. */
  parts: Parts;
  mode: FreedomMode;
  /** Edge indices i (vertices[i] → vertices[(i+1) % 3]) that are GIVEN sides. */
  givenSides: number[];
  /** Vertex indices whose interior angle is GIVEN. */
  givenAngles: number[];
  /** Vertex index carrying a given right angle, if any (HL). */
  rightAngleAt?: number;
  /** The vertex the student "grabs" and tries to push (rigid nudge handle). */
  apex: number;
  /** A plain-language naming of the given parts, for prose + a11y. */
  given: string;
  /** The authored discovery lead; the machine verdict is appended after it. */
  lead: string;
  /** The slider config for `swing` / `scale` modes. */
  sweep?: Sweep;
}

// Concrete, legible figures for each part-set. The exact part values are echoed
// verbatim by the tests that prove the verdict is sourced from solutionCount(),
// so keep them in sync if you change them.
const PART_SETS: PartSet[] = [
  {
    criterion: "SSS",
    label: "SSS",
    parts: { sides: [6, 5, 7] },
    mode: "rigid",
    givenSides: [0, 1, 2],
    givenAngles: [],
    apex: 2,
    given: "all three sides",
    lead: "With all three side lengths fixed, there is nowhere for a corner to go.",
  },
  {
    criterion: "SAS",
    label: "SAS",
    parts: { sides: [6, 5], includedAngle: 55 },
    mode: "rigid",
    givenSides: [0, 2],
    givenAngles: [0],
    apex: 2,
    given: "two sides and the angle between them",
    lead: "Two sides and the angle wedged between them leave the third side no choice.",
  },
  {
    criterion: "ASA",
    label: "ASA",
    parts: { angles: [50, 60], includedSide: 6 },
    mode: "rigid",
    givenSides: [0],
    givenAngles: [0, 1],
    apex: 2,
    given: "two angles and the side between them",
    lead: "One side and the two angles standing on it send their rays to a single meeting point.",
  },
  {
    criterion: "AAS",
    label: "AAS",
    parts: { angles: [50, 60], side: 6 },
    mode: "rigid",
    givenSides: [1],
    givenAngles: [0, 1],
    apex: 2,
    given: "two angles and a side not between them",
    lead: "Two angles fix the third (they sum to 180°), so a known side pins the whole triangle.",
  },
  {
    criterion: "HL",
    label: "HL",
    parts: { hypotenuse: 8, leg: 5 },
    mode: "rigid",
    givenSides: [0, 2],
    givenAngles: [],
    rightAngleAt: 2,
    apex: 1,
    given: "the right angle, the hypotenuse, and one leg",
    lead: "A right angle, the hypotenuse, and one leg: Pythagoras forces the other leg exactly.",
  },
  {
    // SSA — the swinging-door non-criterion. angle 30° at A, adjacent AB = 6, so
    // the altitude is 6·sin30° = 3: the swinging side BC catches the base at
    // 0 (opp<3), exactly 1 at the right angle (opp=3), or 2 (3<opp<6) points.
    criterion: "SSA",
    label: "SSA",
    parts: { angle: 30, adjacent: 6, opposite: 4 },
    mode: "swing",
    givenSides: [0, 1], // AB (adjacent) and BC (opposite, the swinging side)
    givenAngles: [0], // the angle at A
    apex: 2, // C is the vertex that swings
    given: "two sides and a non-included angle",
    lead: "Two sides and the angle that is NOT between them: the opposite side swings like a door and can catch the base in two different places.",
    sweep: { label: "Swinging side BC", min: 1.5, max: 6.5, step: 0.5, initial: 4 },
  },
  {
    // AAA — the scale-free non-criterion. Three fixed angles, no length anchor.
    criterion: "AAA",
    label: "AAA",
    parts: { angles: [50, 60, 70] },
    mode: "scale",
    givenSides: [],
    givenAngles: [0, 1, 2],
    apex: 0,
    given: "all three angles",
    lead: "Three equal angles fix the shape but anchor no length.",
    sweep: { label: "Triangle size", min: 2, max: 9, step: 0.5, initial: 5 },
  },
];

const byCriterion = (c: Criterion) => PART_SETS.find((p) => p.criterion === c);
const sweepOf = (set: PartSet): Sweep | undefined => set.sweep;

/** Vertices A and B (and the altitude of B over the base) of an SSA part-set —
 *  the fixed scaffolding the swinging side BC hinges on. */
function swingScaffold(set: PartSet): { A: Pt; B: Pt; altitude: number } {
  const angle = set.parts.angle ?? 0;
  const adjacent = set.parts.adjacent ?? 0;
  return {
    A: { x: 0, y: 0 },
    B: { x: adjacent * Math.cos(angle * DEG), y: adjacent * Math.sin(angle * DEG) },
    altitude: adjacent * Math.sin(angle * DEG),
  };
}

/** The 0 / 1 / 2 triangles an SSA part-set forms at a given swinging-side length. */
function swingSolutions(set: PartSet, opposite: number): Pt[][] {
  return solveTriangles("SSA", { ...set.parts, opposite });
}

/** The single similar triangle an AAA part-set forms at a given base size — built
 *  by anchoring its two given angles on a base of length `size` (ASA). */
function scaleTriangle(set: PartSet, size: number): Pt[] {
  const [a, b] = set.parts.angles ?? [];
  return solveTriangles("ASA", { angles: [a, b], includedSide: size })[0] ?? [];
}

/** The triangle currently drawn for a part-set, given the live control state. */
function figureOf(set: PartSet, slider: number, solIdx: number): Pt[] {
  if (set.mode === "swing") {
    const tris = swingSolutions(set, slider);
    return tris[Math.min(solIdx, Math.max(0, tris.length - 1))] ?? [];
  }
  if (set.mode === "scale") return scaleTriangle(set, slider);
  return solveTriangles(set.criterion, set.parts)[0] ?? [];
}

/** The resting triangle a rigid part-set produces (the first/only solution). */
function restTriangle(set: PartSet): Pt[] {
  return solveTriangles(set.criterion, set.parts)[0] ?? [];
}

/** A circle (centre c, radius r) as a closed polyline — the swing path BC traces. */
function circlePolyline(c: Pt, r: number, n = 72): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
  }
  return pts;
}

/** A stable signature of a triangle (sorted, rounded edge lengths) — surfaced so
 *  tests can assert the nudge leaves a determined triangle unchanged, or that the
 *  SSA toggle / AAA scale genuinely produces a *different* triangle. */
function signature(tri: Pt[]): string {
  if (tri.length !== 3) return "";
  const e = [
    Math.hypot(tri[0].x - tri[1].x, tri[0].y - tri[1].y),
    Math.hypot(tri[1].x - tri[2].x, tri[1].y - tri[2].y),
    Math.hypot(tri[2].x - tri[0].x, tri[2].y - tri[0].y),
  ];
  return e
    .map((l) => l.toFixed(2))
    .sort()
    .join(",");
}

/** Map a determinacy onto the consolidation verdict sentence. The validity word
 *  is therefore a pure function of solutionCount — the figure can never claim a
 *  criterion is valid unless the math says `unique`. */
function verdictOf(label: string, det: Determinacy): string {
  switch (det.kind) {
    case "unique":
      return `Every attempt lands on the same triangle — ${label} is a valid congruence shortcut.`;
    case "ambiguous":
      return `Two different triangles fit these parts — ${label} is NOT a valid congruence criterion.`;
    case "continuous":
      return `The parts fix the shape but not the size — ${label} is NOT a congruence criterion.`;
    case "impossible":
      return `These parts cannot close into a triangle.`;
  }
}

/** Per-set viewBox covering its WHOLE control sweep, so the grid holds still
 *  while the SSA side swings or the AAA triangle scales. */
function sweepBounds(set: PartSet) {
  const cloud: Pt[] = [];
  const sw = set.sweep;
  if (set.mode === "swing" && sw) {
    for (let o = sw.min; o <= sw.max + 1e-9; o += sw.step) {
      for (const t of swingSolutions(set, o)) cloud.push(...t);
    }
    const { A, B } = swingScaffold(set);
    cloud.push(A, B);
  } else if (set.mode === "scale" && sw) {
    for (let s = sw.min; s <= sw.max + 1e-9; s += sw.step) cloud.push(...scaleTriangle(set, s));
  } else {
    cloud.push(...restTriangle(set));
  }
  return autoBounds([{ type: "polygon", vertices: cloud }], 1.3);
}

const VERTEX_LABELS = ["A", "B", "C"];
// Distinct tick / arc counts give each given part its own non-colour identity
// even though the locked parts all share the green "locked" hue.
const SIDE_TICKS = [1, 2, 3];
const ANGLE_ARCS = [1, 2, 3];

const WOBBLE_MS = 1000; // one springs-back attempt — a few decaying bounces
const DISMISS_MS = 7000; // auto-return the named beat to inquiry

export interface CongruenceCriteriaProps {
  /** Which part-sets the switcher offers. Default ["SSS", "SAS"] (page 2).
   *  Page 4 mounts ["HL", "SSA", "AAA"]. Unknown criteria are ignored. */
  criteria?: Criterion[];
  /** Which part-set is selected first. Defaults to the first available. */
  initialCriterion?: Criterion;
  className?: string;
}

export function CongruenceCriteria({
  criteria = ["SSS", "SAS"],
  initialCriterion,
  className,
}: CongruenceCriteriaProps) {
  const sets = useMemo(
    () => criteria.map(byCriterion).filter((s): s is PartSet => Boolean(s)),
    [criteria],
  );
  const initialSet =
    (initialCriterion && sets.find((s) => s.criterion === initialCriterion)) ??
    sets[0] ??
    PART_SETS[0];

  const [criterion, setCriterion] = useState<Criterion>(initialSet.criterion);
  const set = useMemo(() => byCriterion(criterion) ?? PART_SETS[0], [criterion]);

  const [beat, setBeat] = useState<Beat>("inquiry");
  const [attempts, setAttempts] = useState(0);
  // The swept control's value (SSA swinging side, or AAA size) — reset per set.
  const [slider, setSlider] = useState<number>(sweepOf(initialSet)?.initial ?? 0);
  // Which of the two SSA solutions is shown when the case is ambiguous.
  const [solIdx, setSolIdx] = useState(0);
  // The rigid nudge handle's live offset from its locked vertex (springs to 0).
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const scaffold = set.mode === "swing" ? swingScaffold(set) : null;
  // `sin(30°)` evaluates to 2.9999999999999996, not 3, so a slider that LANDS on
  // the boundary step is snapped to the true altitude — the geometry then resolves
  // to the exact single right-angle triangle instead of a hair-thin ambiguous pair.
  const atRightAngle =
    set.mode === "swing" && scaffold != null && Math.abs(slider - scaffold.altitude) < 1e-6;
  const effSlider = atRightAngle && scaffold ? scaffold.altitude : slider;

  // The displayed triangle and the live verdict, both read from the pure core.
  const tri = useMemo(
    () => figureOf(set, effSlider, solIdx),
    [set, effSlider, solIdx],
  );
  const liveParts = useMemo<Parts>(
    () => (set.mode === "swing" ? { ...set.parts, opposite: effSlider } : set.parts),
    [set, effSlider],
  );
  const det = useMemo(
    () => solutionCount(set.criterion, liveParts),
    [set.criterion, liveParts],
  );
  const bounds = useMemo(() => sweepBounds(set), [set]);

  const solutionCountNow = set.mode === "swing" ? swingSolutions(set, effSlider).length : 1;

  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setOffset({ x: 0, y: 0 });
  };
  useEffect(() => clearTimers, []);

  // Switching part-set restarts the inquiry and re-seeds the swept control.
  const selectCriterion = (c: Criterion) => {
    clearTimers();
    setCriterion(c);
    setBeat("inquiry");
    setAttempts(0);
    setSolIdx(0);
    setSlider(sweepOf(byCriterion(c) ?? PART_SETS[0])?.initial ?? 0);
  };

  // A rigid nudge attempt: shove the grabbed corner, then spring it straight
  // back. The determined triangle itself never changes — the offset is purely
  // the failed attempt, so the student FEELS there is no room to move.
  const nudge = () => {
    setAttempts((n) => n + 1);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (reduceMotion) {
      setOffset({ x: 0, y: 0 });
      return;
    }
    const dir = attempts % 2 === 0 ? 1 : -1;
    const amp = 1.15 * dir; // a hard shove — the corner visibly jumps
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / WOBBLE_MS);
      const decay = (1 - k) ** 1.3;
      const wob = Math.sin(k * Math.PI * 6) * decay;
      setOffset({ x: amp * wob, y: amp * 0.7 * wob });
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        rafRef.current = null;
        setOffset({ x: 0, y: 0 });
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const nameIt = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setOffset({ x: 0, y: 0 });
    setBeat("named");
    timersRef.current.push(setTimeout(() => setBeat("inquiry"), DISMISS_MS));
  };

  const explore = () => {
    clearTimers();
    setBeat("inquiry");
  };

  // The rigid nudge handle's drawn position (locked vertex + failed offset).
  const handle = useMemo<Pt>(() => {
    const v = tri[set.apex];
    return v ? { x: v.x + offset.x, y: v.y + offset.y } : { x: 0, y: 0 };
  }, [tri, set.apex, offset]);
  const wobbling = offset.x !== 0 || offset.y !== 0;

  const named = beat === "named";

  // The right-angle square is given on HL, and surfaces dynamically at the SSA
  // boundary (the swinging side meeting the base perpendicularly).
  const rightAngleVertex =
    set.rightAngleAt != null ? set.rightAngleAt : atRightAngle ? 2 : undefined;

  // The consolidation sentence: reuse verdictOf for the NOT-valid cases (so the
  // verdict is always machine-sourced), but for the lone SSA right-angle boundary
  // tell the HL story instead of the generic "unique → valid" line.
  const consolidation = (() => {
    if (set.mode === "swing" && det.kind === "unique") {
      return atRightAngle
        ? "Right here — and only here — the second triangle vanishes: the swinging side just reaches the base, meeting it at a right angle. A right angle with the hypotenuse and a leg is exactly the HL criterion, which is why HL locks a triangle when general SSA cannot."
        : "At this length the swinging side is long enough to reach the base only once, so here it happens to be determined — but lengths just shorter give two triangles, so SSA is still not a guarantee.";
    }
    return `${set.lead} ${verdictOf(set.label, det)}`;
  })();

  // The live (inquiry-beat) feedback, branched by freedom mode.
  const inquiry = (() => {
    if (set.mode === "swing") {
      if (det.kind === "impossible")
        return "Too short to reach. The swinging side BC can't stretch down to the base, so no triangle closes — yet.";
      if (det.kind === "unique")
        return atRightAngle
          ? "Exactly one triangle. The swinging side just barely reaches the base, meeting it at a right angle — the only length with no second solution. This is the HL case."
          : "Just one triangle now — the side is long enough that it can only reach the base on one side.";
      return "Two different triangles fit these very same parts. The side swings to two landing points on the base — switch between the solutions to compare them.";
    }
    if (set.mode === "scale") {
      return "Every triangle in this family has the same three angles — the same shape — but a different size. Equal angles never pin down how big the triangle is.";
    }
    return null; // rigid uses its own inline copy below
  })();

  return (
    <figure
      className={["cbmc-congruence-criteria", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className={["cbmc-graph-paper", named && "cbmc-pulse"].filter(Boolean).join(" ")}
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

          {/* SSA overlay: the fixed AB side and the circular swing path of BC,
              whose crossings with the base ARE the possible C positions. */}
          {set.mode === "swing" && scaffold ? (
            <>
              <Polyline
                points={[
                  [scaffold.A.x, scaffold.A.y],
                  [scaffold.B.x, scaffold.B.y],
                ]}
                color={PREIMAGE}
                fillOpacity={0}
                weight={2.5}
              />
              <Polyline
                points={circlePolyline(scaffold.B, effSlider)}
                color={MUTED}
                fillOpacity={0}
                weight={1.25}
                svgPolylineProps={{ strokeDasharray: "4 5" }}
              />
              {swingSolutions(set, effSlider).map((t, k, arr) => (
                <Point
                  key={`sol-${k}`}
                  x={t[2].x}
                  y={t[2].y}
                  color={k === Math.min(solIdx, arr.length - 1) ? ACCENT : MUTED}
                />
              ))}
            </>
          ) : null}

          {/* The displayed triangle — the parts force exactly this one (rigid),
              or this swing solution / this size (SSA / AAA). */}
          {tri.length === 3 ? (
            <Polygon
              points={tri.map((p) => [p.x, p.y])}
              color={PREIMAGE}
              fillOpacity={0.06}
              weight={2.5}
            />
          ) : null}

          {/* GIVEN sides — green "locked" ticks, a distinct count each. */}
          {tri.length === 3 &&
            set.givenSides.map((i, k) => {
              const a = tri[i];
              const b = tri[(i + 1) % 3];
              if (!a || !b) return null;
              return sideTicks(a, b, SIDE_TICKS[k] ?? 1).map((seg, j) => (
                <Polyline
                  key={`gs-${i}-${j}`}
                  points={seg}
                  color={IMAGE}
                  fillOpacity={0}
                  weight={2.5}
                />
              ));
            })}

          {/* GIVEN angles — green "locked" arcs, a distinct count each. */}
          {tri.length === 3 &&
            set.givenAngles.map((i, k) => {
              const v = tri[i];
              const p = tri[(i + 1) % 3];
              const q = tri[(i + 2) % 3];
              if (!v || !p || !q) return null;
              return angleArcs(v, p, q, ANGLE_ARCS[k] ?? 1).map((arc, j) => (
                <Polyline
                  key={`ga-${i}-${j}`}
                  points={arc}
                  color={IMAGE}
                  fillOpacity={0}
                  weight={2}
                />
              ));
            })}

          {/* A right angle — given on HL, or surfacing at the SSA boundary. */}
          {tri.length === 3 && rightAngleVertex != null && tri[rightAngleVertex]
            ? (() => {
                const i = rightAngleVertex;
                const v = tri[i];
                const p = tri[(i + 1) % 3];
                const q = tri[(i + 2) % 3];
                return (
                  <Polyline
                    points={rightAngleSquare(v, p, q)}
                    color={IMAGE}
                    fillOpacity={0}
                    weight={2.5}
                  />
                );
              })()
            : null}

          {/* The failed rigid nudge: a dashed "rubber" outline of where you tried
              to drag the corner, springing back to the locked triangle. */}
          {set.mode === "rigid" && wobbling && tri.length === 3 ? (
            <Polygon
              points={tri.map((p, i) => (i === set.apex ? [handle.x, handle.y] : [p.x, p.y]))}
              color={MUTED}
              fillOpacity={0}
              weight={1.5}
              svgPolygonProps={{ strokeDasharray: "5 5" }}
            />
          ) : null}

          {/* Vertex labels. */}
          {tri.map((p, i) => (
            <Text key={`lbl-${i}`} x={p.x} y={p.y} size={14} color={PREIMAGE}>
              {VERTEX_LABELS[i]}
            </Text>
          ))}

          {/* The rigid nudge handle — the corner the student grabs and pushes. */}
          {set.mode === "rigid" && tri[set.apex] ? (
            <Point x={handle.x} y={handle.y} color={wobbling ? MUTED : ACCENT} />
          ) : null}
        </Mafs>
      </div>

      <ViewSwitcher<Criterion>
        label="Part set"
        value={criterion}
        options={sets.map((s) => ({ value: s.criterion, label: s.label }))}
        onChange={selectCriterion}
      />

      {/* Mode-specific instruction. */}
      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        {set.mode === "rigid" ? (
          <>
            You are given <strong>{set.given}</strong> (marked in green). Grab corner{" "}
            {VERTEX_LABELS[set.apex]} and try to make a <em>different</em> triangle from the
            same parts.
          </>
        ) : set.mode === "swing" ? (
          <>
            You are given <strong>{set.given}</strong> (marked in green) — but the angle is{" "}
            <em>not</em> between the two sides. Lengthen the swinging side BC and watch it
            catch the base. When two triangles appear, switch between them.
          </>
        ) : (
          <>
            You are given <strong>{set.given}</strong> (marked in green). Grow or shrink the
            triangle — the angles never change, only the size does.
          </>
        )}
      </p>

      {/* Mode-specific controls. */}
      {set.mode !== "rigid" && set.sweep ? (
        <ControlSlider
          label={set.sweep.label}
          value={slider}
          min={set.sweep.min}
          max={set.sweep.max}
          step={set.sweep.step}
          onChange={(v) => {
            setSlider(v);
            if (beat === "named") setBeat("inquiry");
          }}
          display={`${slider}${set.sweep.unit ?? ""}`}
        />
      ) : null}

      {set.mode === "swing" && solutionCountNow === 2 ? (
        <ViewSwitcher<string>
          label="Which triangle"
          value={String(Math.min(solIdx, 1))}
          options={[
            { value: "0", label: "Solution 1" },
            { value: "1", label: "Solution 2" },
          ]}
          onChange={(v) => setSolIdx(Number(v))}
        />
      ) : null}

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        {set.mode === "rigid" ? (
          <button type="button" className="cbmc-btn" onClick={nudge}>
            Try to make a different one
          </button>
        ) : null}
        {named ? (
          <button type="button" className="cbmc-btn" onClick={explore}>
            Explore again
          </button>
        ) : (
          <button type="button" className="cbmc-btn cbmc-btn-primary" onClick={nameIt}>
            Name it
          </button>
        )}
      </div>

      {/* Non-colour encoding of the locked-part marks, surfaced for AT / tests. */}
      {set.givenSides.map((i, k) => (
        <span
          key={`pat-s-${i}`}
          className="cbmc-sr-only"
          data-cbmc-given-side={i}
          data-cbmc-marks={SIDE_TICKS[k] ?? 1}
        />
      ))}

      {/* Machine-sourced state, surfaced for AT / tests: the determinacy from
          solutionCount, the live solution count, the right-angle boundary flag,
          and a stable signature of the displayed triangle. */}
      <span
        className="cbmc-sr-only"
        data-cbmc-determinacy={det.kind}
        data-cbmc-solution-count={solutionCountNow}
        data-cbmc-right-angle={atRightAngle ? "true" : "false"}
        data-cbmc-triangle={signature(tri)}
      />

      <div
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}
      >
        {named ? (
          <p style={{ fontWeight: 600, color: "var(--cbmc-accent, #176844)" }}>
            {consolidation}
          </p>
        ) : set.mode === "rigid" ? (
          <p>
            It won't budge. However you push corner {VERTEX_LABELS[set.apex]}, the triangle
            springs right back — with {set.given} fixed, you can't make a different one.
            {attempts > 0 ? (
              <>
                {" "}
                <span style={{ color: "var(--cbmc-muted, #6b6353)" }}>
                  ({attempts} {attempts === 1 ? "try" : "tries"} — still the same triangle.)
                </span>
              </>
            ) : null}{" "}
            When you're convinced, press <strong>Name it</strong>.
          </p>
        ) : (
          <p>
            {inquiry} When you're ready to name what you found, press <strong>Name it</strong>.
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
        An inquiry tool for triangle congruence. You are given {set.given} of a triangle
        (marked in green) and explore whether those parts force a single triangle. For a rigid
        criterion a nudged corner springs back; for SSA the swinging side can meet the base in
        two places; for AAA the triangle scales freely. Pressing “Name it” reports that{" "}
        {set.label} is{" "}
        {det.kind === "unique" ? "a valid" : det.kind === "impossible" ? "an impossible" : "not a valid"}{" "}
        congruence criterion, a verdict read from the underlying geometry.
      </figcaption>
    </figure>
  );
}
