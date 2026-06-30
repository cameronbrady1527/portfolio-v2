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
 *      "you can't make a different one"); no verdict yet;
 *   2. a student-triggered CONSOLIDATION beat ("Name it") that labels the result
 *      ("Three sides locked it — SSS is a valid congruence shortcut").
 *
 * Single source of truth: the figure is the actual triangle `solveTriangles`
 * constructs from the parts, and the consolidation VERDICT (valid / ambiguous /
 * continuous) is read from `solutionCount` — never hardcoded. If the math were
 * wrong, the verdict would visibly break.
 *
 * Controls-first (a {@link ViewSwitcher} picks the part-set, a button drives the
 * nudge), keyboard-operable, and reduced-motion aware (a static fallback that
 * still tells the rigidity story). Zero-stakes: nothing recorded.
 *
 * EXTENSIBILITY (for the page-4 slice #116): every part-set carries a `mode`. All
 * the entries here are `"rigid"`; the SSA ("swing", two discrete solutions) and
 * AAA ("scale", a continuous family) freedom behaviors are added by appending
 * PART_SETS entries with a new mode and a matching control branch — the rigid
 * path, the verdict plumbing, and the two-beat shell are untouched.
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
import { angleArcs, rightAngleSquare, sideTicks, vertexArc } from "./internal/geometry";
import { ACCENT, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ViewSwitcher } from "./internal/controls";

/** The two beats of the inquiry. */
type Beat = "inquiry" | "named";

/** How the leftover freedom (if any) is explored. This slice ships only
 *  `"rigid"`; #116 appends `"swing"` (SSA) and `"scale"` (AAA). */
type FreedomMode = "rigid";

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
  /** The vertex the student "grabs" and tries to push (the nudge handle). */
  apex: number;
  /** A plain-language naming of the given parts, for prose + a11y. */
  given: string;
  /** The authored discovery lead; the machine verdict is appended after it. */
  lead: string;
}

// Concrete, legible scalene figures for each rigid criterion. The exact part
// values are echoed verbatim by the tests that prove the verdict is sourced from
// solutionCount(), so keep them in sync if you change them.
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
];

const byCriterion = (c: Criterion) => PART_SETS.find((p) => p.criterion === c);

/** The resting triangle a part-set produces (the first/only solution). */
function restTriangle(set: PartSet): Pt[] {
  const tris = solveTriangles(set.criterion, set.parts);
  return tris[0] ?? [];
}

/** A stable signature of a triangle (sorted, rounded edge lengths) — surfaced so
 *  tests can assert the nudge leaves the determined triangle unchanged. */
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

/** A fixed viewport that frames every part-set's triangle plus a margin for the
 *  nudge wobble, so the grid holds still as the student switches part-sets. */
const FIXED_BOUNDS = (() => {
  const cloud: Pt[] = [];
  for (const set of PART_SETS) cloud.push(...restTriangle(set));
  return autoBounds([{ type: "polygon", vertices: cloud }], 1.4);
})();

const VERTEX_LABELS = ["A", "B", "C"];
// Distinct tick / arc counts give each given part its own non-colour identity
// even though the locked parts all share the green "locked" hue.
const SIDE_TICKS = [1, 2, 3];
const ANGLE_ARCS = [1, 2];

const WOBBLE_MS = 1000; // one springs-back attempt — a few decaying bounces
const DISMISS_MS = 7000; // auto-return the named beat to inquiry

export interface CongruenceCriteriaProps {
  /** Which rigid part-sets the switcher offers. Default ["SSS", "SAS"] (page 2).
   *  Unknown / non-rigid criteria are ignored in this slice. */
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
  const [criterion, setCriterion] = useState<Criterion>(
    initialCriterion && sets.some((s) => s.criterion === initialCriterion)
      ? initialCriterion
      : (sets[0]?.criterion ?? "SSS"),
  );
  const set = useMemo(
    () => byCriterion(criterion) ?? PART_SETS[0],
    [criterion],
  );

  const [beat, setBeat] = useState<Beat>("inquiry");
  const [attempts, setAttempts] = useState(0);
  // The nudge handle's live offset from its locked vertex (springs back to 0).
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const tri = useMemo(() => restTriangle(set), [set]);
  // The verdict, read from the pure core — never asserted in the component.
  const det = useMemo(
    () => solutionCount(set.criterion, set.parts),
    [set],
  );

  const clearTimers = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setOffset({ x: 0, y: 0 });
  };
  useEffect(() => clearTimers, []);

  // Switching part-set restarts the inquiry from scratch.
  const selectCriterion = (c: Criterion) => {
    clearTimers();
    setCriterion(c);
    setBeat("inquiry");
    setAttempts(0);
  };

  // A nudge attempt: shove the grabbed corner, then spring it straight back. The
  // determined triangle itself never changes — the offset is purely the failed
  // attempt, so the student FEELS there is no room to move.
  const nudge = () => {
    setAttempts((n) => n + 1);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (reduceMotion) {
      // No motion: the rigidity is told, not animated. A brief static poke.
      setOffset({ x: 0, y: 0 });
      return;
    }
    // Push in an alternating direction so repeated taps feel like real prodding.
    const dir = attempts % 2 === 0 ? 1 : -1;
    const amp = 1.15 * dir; // a hard shove — the corner visibly jumps
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / WOBBLE_MS);
      // A stiff damped spring: several decaying bounces that settle hard at 0,
      // so however the student shoves the corner it springs straight back.
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

  // The grabbed corner's drawn position (locked vertex + the failed-attempt
  // offset). At rest the offset is 0, so the handle sits on the vertex.
  const handle = useMemo<Pt>(() => {
    const v = tri[set.apex];
    return v ? { x: v.x + offset.x, y: v.y + offset.y } : { x: 0, y: 0 };
  }, [tri, set.apex, offset]);
  const wobbling = offset.x !== 0 || offset.y !== 0;

  const named = beat === "named";

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
          viewBox={{ x: FIXED_BOUNDS.x, y: FIXED_BOUNDS.y }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />

          {/* The determined triangle — the parts force exactly this one. */}
          <Polygon
            points={tri.map((p) => [p.x, p.y])}
            color={PREIMAGE}
            fillOpacity={0.06}
            weight={2.5}
          />

          {/* GIVEN sides — green "locked" ticks, a distinct count each. */}
          {set.givenSides.map((i, k) => {
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
          {set.givenAngles.map((i, k) => {
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

          {/* A given right angle (HL) — the little square. */}
          {set.rightAngleAt != null && tri[set.rightAngleAt]
            ? (() => {
                const i = set.rightAngleAt as number;
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

          {/* The failed nudge: a dashed "rubber" outline of where you tried to
              drag the corner, springing back to the locked triangle. */}
          {wobbling ? (
            <Polygon
              points={tri.map((p, i) =>
                i === set.apex ? [handle.x, handle.y] : [p.x, p.y],
              )}
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

          {/* The nudge handle — the corner the student grabs and pushes. */}
          {tri[set.apex] ? (
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

      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        You are given <strong>{set.given}</strong> (marked in green). Grab corner{" "}
        {VERTEX_LABELS[set.apex]} and try to make a <em>different</em> triangle from
        the same parts.
      </p>

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" onClick={nudge}>
          Try to make a different one
        </button>
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
          solutionCount and a stable signature of the determined triangle (which
          a nudge must never change). */}
      <span
        className="cbmc-sr-only"
        data-cbmc-determinacy={det.kind}
        data-cbmc-triangle={signature(tri)}
      />

      <div
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}
      >
        {named ? (
          <p style={{ fontWeight: 600, color: "var(--cbmc-accent, #176844)" }}>
            {set.lead} {verdictOf(set.label, det)}
          </p>
        ) : (
          <p>
            It won't budge. However you push corner {VERTEX_LABELS[set.apex]}, the
            triangle springs right back — with {set.given} fixed, you can't make a
            different one.
            {attempts > 0 ? (
              <>
                {" "}
                <span style={{ color: "var(--cbmc-muted, #6b6353)" }}>
                  ({attempts} {attempts === 1 ? "try" : "tries"} — still the same
                  triangle.)
                </span>
              </>
            ) : null}{" "}
            When you're convinced, press <strong>Name it</strong>.
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
        An inquiry tool for triangle congruence. You are given {set.given} of a
        triangle (marked in green) and try to build a different triangle from the
        same parts by nudging a corner. For a rigid criterion the corner springs
        back — the parts determine the triangle — so pressing “Name it” reports
        that {set.label} is {det.kind === "unique" ? "a valid" : "not a valid"}{" "}
        congruence criterion, a verdict read from the underlying geometry.
      </figcaption>
    </figure>
  );
}
