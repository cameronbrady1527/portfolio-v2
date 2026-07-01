"use client";

/**
 * <CongruenceChecker> — the C5 capstone "Is it congruent?" tool. The student
 * picks a preset pair of triangles, each drawn with a set of GIVEN parts marked
 * (the kind of givens a proof hands you), and the tool reports the verdict:
 *
 *   "Congruent — by SAS, △ABC ≅ △DEF"      or      "Not congruent."
 *
 * Two things are machine-sourced, never hardcoded per preset:
 *   1. the VERDICT (congruent vs. not) comes straight from `congruenceCheck`
 *      run on the actually-drawn triangle coordinates — if the geometry is wrong
 *      the verdict visibly breaks;
 *   2. the CRITERION a student would cite (SSS / SAS / ASA / AAS / HL — or the
 *      famous non-criteria SSA / AAA) is DERIVED from the topology of the marked
 *      given parts by `classifyCriterion`, not stored as a string on the preset.
 * The △ABC ≅ △DEF correspondence and the D/E/F labels drawn on the second
 * triangle follow the vertex map `congruenceCheck` recovers.
 *
 * This reinforces the proof-entry skill: read the givens, pick the criterion.
 * The SSA preset is the lesson in disguise — two sides and a non-included angle
 * are marked, yet the two triangles are genuinely different, so the verdict is
 * "Not congruent." Controls-first (a preset radiogroup — the keyboard baseline),
 * reduced-motion aware, with the verdict in an aria-live region. Zero-stakes.
 */
import { useEffect, useId, useMemo, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline } from "mafs";
import "mafs/core.css";
import {
  congruenceCheck,
  solveTriangles,
  triangleFromSAS,
  triangleFromSSS,
  type Pt,
} from "./logic";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import { D, angleArcs, rightAngleSquare, sideTicks, vertexArc } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, ANGLE_C, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ViewSwitcher } from "./internal/controls";

const INK = PREIMAGE;
const SEP = 4.6; // half the gap between the two triangles' centres

/** A given part the preset marks as congruent on BOTH triangles (same vertex
 *  indices on each). A side carries `count` ticks; an angle carries `count`
 *  concentric arcs, or a right-angle square when `right`. */
export type Mark =
  | { kind: "side"; verts: [number, number]; count: number }
  | { kind: "angle"; vert: number; count?: number; right?: boolean };

/** A criterion a student might cite — the five valid ones plus the two famous
 *  non-criteria SSA and AAA. */
export type CheckerCriterion =
  | "SSS"
  | "SAS"
  | "ASA"
  | "AAS"
  | "HL"
  | "SSA"
  | "AAA";

const VALID_CRITERIA: CheckerCriterion[] = ["SSS", "SAS", "ASA", "AAS", "HL"];

/** Does an undirected side {a,b} touch vertex `v`? */
const touches = (verts: [number, number], v: number) => verts[0] === v || verts[1] === v;

/**
 * The criterion a student would cite, derived purely from WHICH parts are marked
 * (their topology), never hardcoded per preset:
 *   3 sides → SSS; 2 sides + included angle → SAS, else SSA; 2 angles + included
 *   side → ASA, else AAS; a right angle + 2 sides → HL; 3 angles → AAA.
 */
export function classifyCriterion(marks: Mark[]): CheckerCriterion {
  const sides = marks.filter((m): m is Extract<Mark, { kind: "side" }> => m.kind === "side");
  const angles = marks.filter((m): m is Extract<Mark, { kind: "angle" }> => m.kind === "angle");
  const hasRight = angles.some((a) => a.right);

  if (sides.length === 3 && angles.length === 0) return "SSS";
  if (angles.length === 3 && sides.length === 0) return "AAA";

  if (sides.length === 2 && angles.length === 1) {
    const v = angles[0].vert;
    if (hasRight) return "HL"; // right angle + a hypotenuse + a leg
    // SAS iff the marked angle sits BETWEEN the two marked sides.
    const included = sides.every((s) => touches(s.verts, v));
    return included ? "SAS" : "SSA";
  }

  if (angles.length === 2 && sides.length === 1) {
    const av = [angles[0].vert, angles[1].vert];
    // ASA iff the marked side joins the two marked angles' vertices.
    const included = av.every((v) => touches(sides[0].verts, v));
    return included ? "ASA" : "AAS";
  }

  return "AAA";
}

export interface CheckerPreset {
  id: string;
  /** A neutral chip label — the criterion is NOT revealed (the tool is the
   *  assessment: the student must judge it). */
  label: string;
  /** Base triangle for the first figure. */
  base1: Pt[];
  /** Base triangle for the second figure (a rigid image of base1 for congruent
   *  pairs; a genuinely different triangle for the SSA non-example). */
  base2: Pt[];
  /** Pose applied to the second figure so it is not in the obvious position. */
  pose: { rotateDeg: number; reflect: boolean };
  /** The given parts, marked identically (same vertex indices) on both figures. */
  marks: Mark[];
}

const centroid = (ps: Pt[]): Pt => ({
  x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
  y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
});

/** Centre a base triangle, optionally reflect+rotate it, then shift in x. */
function frame(base: Pt[], shiftX: number, rotateDeg = 0, reflect = false): Pt[] {
  const c = centroid(base);
  const a = rotateDeg * D;
  return base.map((p) => {
    let x = p.x - c.x;
    const y0 = p.y - c.y;
    if (reflect) x = -x;
    return {
      x: x * Math.cos(a) - y0 * Math.sin(a) + shiftX,
      y: x * Math.sin(a) + y0 * Math.cos(a),
    };
  });
}

// ── Preset geometry ─────────────────────────────────────────────────────────
// Each `base` is built from the pure constructors so the marked parts are real.
// Scalene shapes everywhere so the recovered correspondence is unambiguous.

// SAS: |AB|=5, |AC|=4, included ∠A = 58°. Vertices [A,B,C] = [0,1,2].
const SAS_BASE = triangleFromSAS(5, 4, 58);

// ASA: ∠A=50°, ∠B=60°, included side AB = 6. Vertices [A,B,C] = [0,1,2].
const ASA_BASE = solveTriangles("ASA", { angles: [50, 60], includedSide: 6 })[0];

// SSS: sides AB=5, BC=4, CA=6.
const SSS_BASE = triangleFromSSS(5, 4, 6).vertices;

// HL: hypotenuse 5, leg 3 → the 3-4-5 right triangle. solveTriangles places the
// right angle at vertex 2 (origin); legs CA (2-0) & CB (2-1), hypotenuse AB (0-1).
const HL_BASE = solveTriangles("HL", { hypotenuse: 5, leg: 3 })[0];

// SSA (the non-example): ∠A=35°, adjacent AB=6, opposite BC=4 — the ambiguous
// regime, so the two solutions are different triangles sharing those three parts.
const SSA_SOLUTIONS = solveTriangles("SSA", { angle: 35, adjacent: 6, opposite: 4 });

export const CHECKER_PRESETS: CheckerPreset[] = [
  {
    id: "sas",
    label: "Pair 1",
    base1: SAS_BASE,
    base2: SAS_BASE,
    pose: { rotateDeg: 146, reflect: false },
    marks: [
      { kind: "side", verts: [0, 1], count: 1 },
      { kind: "side", verts: [0, 2], count: 2 },
      { kind: "angle", vert: 0, count: 1 },
    ],
  },
  {
    id: "asa",
    label: "Pair 2",
    base1: ASA_BASE,
    base2: ASA_BASE,
    pose: { rotateDeg: 108, reflect: true },
    marks: [
      { kind: "angle", vert: 0, count: 1 },
      { kind: "angle", vert: 1, count: 2 },
      { kind: "side", verts: [0, 1], count: 1 },
    ],
  },
  {
    id: "sss",
    label: "Pair 3",
    base1: SSS_BASE,
    base2: SSS_BASE,
    pose: { rotateDeg: 196, reflect: true },
    marks: [
      { kind: "side", verts: [0, 1], count: 1 },
      { kind: "side", verts: [1, 2], count: 2 },
      { kind: "side", verts: [2, 0], count: 3 },
    ],
  },
  {
    id: "hl",
    label: "Pair 4",
    base1: HL_BASE,
    base2: HL_BASE,
    pose: { rotateDeg: 96, reflect: false },
    marks: [
      { kind: "angle", vert: 2, right: true },
      { kind: "side", verts: [0, 1], count: 1 }, // hypotenuse
      { kind: "side", verts: [2, 0], count: 2 }, // a leg
    ],
  },
  {
    id: "ssa",
    label: "Pair 5",
    base1: SSA_SOLUTIONS[0],
    base2: SSA_SOLUTIONS[1] ?? SSA_SOLUTIONS[0],
    pose: { rotateDeg: 0, reflect: false },
    marks: [
      { kind: "angle", vert: 0, count: 1 },
      { kind: "side", verts: [0, 1], count: 1 }, // adjacent
      { kind: "side", verts: [1, 2], count: 2 }, // opposite (the swinging side)
    ],
  },
];

// Short plain-language note for each verdict, keyed by the derived criterion.
const CRITERION_NOTE: Record<CheckerCriterion, string> = {
  SSS: "All three pairs of sides match, so the triangles are rigid — SSS pins them down.",
  SAS: "Two sides and the angle between them match — SAS forces the third side, so they are congruent.",
  ASA: "Two angles and the side between them match — ASA forces the rest of the triangle.",
  AAS: "Two angles and a non-included side match — AAS (the third angle follows from the 180° sum, so it reduces to ASA).",
  HL: "A right angle, the hypotenuse, and a leg match — HL locks a right triangle down.",
  SSA: "Two sides and a non-included angle are marked (SSA). That pattern leaves two different triangles — exactly the two you see — so it does NOT force congruence.",
  AAA: "All three angles match (AAA): same shape, but any size — similar, not congruent.",
};

const HUES = [ANGLE_A, ANGLE_B, ANGLE_C];

export interface CongruenceCheckerProps {
  /** The preset shown on first render (by id). Default the SAS pair. */
  initialPreset?: string;
  className?: string;
}

const xy = (p: Pt): [number, number] => [p.x, p.y];

export function CongruenceChecker({
  initialPreset = "sas",
  className,
}: CongruenceCheckerProps) {
  const presetIds = CHECKER_PRESETS.map((p) => p.id);
  const initial = presetIds.includes(initialPreset) ? initialPreset : presetIds[0];
  const [selectedId, setSelectedId] = useState(initial);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  const preset = CHECKER_PRESETS.find((p) => p.id === selectedId) ?? CHECKER_PRESETS[0];

  // The two drawn triangles, the verdict (from the geometry) and the criterion
  // (from the marked parts), plus the D/E/F labels from the recovered map.
  const view = useMemo(() => {
    const t1 = frame(preset.base1, -SEP);
    const t2 = frame(preset.base2, SEP, preset.pose.rotateDeg, preset.pose.reflect);
    const result = congruenceCheck(t1, t2);
    const criterion = classifyCriterion(preset.marks);
    // D/E/F follow the correspondence: t1 vertex i ↔ t2 vertex sigma[i].
    const sigma = result.correspondence ?? ([0, 1, 2] as [number, number, number]);
    const t2Letters = ["D", "E", "F"];
    const labels = ["?", "?", "?"];
    sigma.forEach((j, i) => {
      labels[j] = t2Letters[i];
    });
    const congruent = result.congruent && VALID_CRITERIA.includes(criterion);
    return { t1, t2, congruent, criterion, t2Letters: labels };
  }, [preset]);

  const { t1, t2, congruent, criterion, t2Letters } = view;

  const bounds = useMemo(
    () =>
      autoBounds([
        { type: "polygon", vertices: t1 },
        { type: "polygon", vertices: t2 },
      ]),
    [t1, t2],
  );

  // A small reduced-motion-aware emphasis pulse on the verdict when it changes.
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (reduceMotion) {
      setFlash(false);
      return;
    }
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 480);
    return () => clearTimeout(id);
  }, [selectedId, reduceMotion]);

  // Render a mark on a single triangle: ticks for a side, arcs / right-square for
  // an angle, in the mark's signature hue (so the same given part reads on both).
  const renderMark = (t: Pt[], mark: Mark, hue: string, keyPrefix: string) => {
    if (mark.kind === "side") {
      const [a, b] = mark.verts;
      const ticks = sideTicks(t[a], t[b], mark.count);
      return (
        <g key={keyPrefix} role="presentation">
          <Polyline points={[xy(t[a]), xy(t[b])]} color={hue} fillOpacity={0} weight={4} />
          {ticks.map((seg, i) => (
            <Polyline key={`${keyPrefix}-tk-${i}`} points={seg} color={hue} fillOpacity={0} weight={2.5} />
          ))}
        </g>
      );
    }
    const v = mark.vert;
    const [n0, n1] = [0, 1, 2].filter((k) => k !== v);
    if (mark.right) {
      return (
        <Polyline
          key={keyPrefix}
          points={rightAngleSquare(t[v], t[n0], t[n1])}
          color={hue}
          fillOpacity={0}
          weight={2.5}
        />
      );
    }
    const wedge = vertexArc(t[v], t[n0], t[n1]).wedge;
    const arcs = angleArcs(t[v], t[n0], t[n1], mark.count ?? 1);
    return (
      <g key={keyPrefix} role="presentation">
        <Polygon points={wedge} color={hue} fillOpacity={0.16} weight={0} />
        {arcs.map((arc, i) => (
          <Polyline key={`${keyPrefix}-ar-${i}`} points={arc} color={hue} fillOpacity={0} weight={2.5} />
        ))}
      </g>
    );
  };

  const headline = congruent
    ? `Congruent — by ${criterion}, △ABC ≅ △DEF`
    : "Not congruent.";
  const note = CRITERION_NOTE[criterion];

  return (
    <figure
      className={["cbmc-congruence-checker", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <p className="cbmc-instruction" style={{ marginBottom: "0.4rem" }}>
        Each pair shows two triangles with their <strong>given parts marked</strong>{" "}
        (matching colour and tick/arc count = a given pair of equal parts). Pick a
        pair and decide: do those givens force the triangles to be congruent — and
        by which criterion?
      </p>

      <div
        className="cbmc-graph-paper"
        style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}
      >
        <Mafs
          viewBox={{ x: bounds.x, y: bounds.y }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 0, labels: () => "" }}
            yAxis={{ lines: 0, labels: () => "" }}
          />

          {/* Both triangle outlines. */}
          <Polygon points={t1.map(xy)} color={INK} fillOpacity={0.05} weight={2} />
          <Polygon points={t2.map(xy)} color={INK} fillOpacity={0.05} weight={2} />

          {/* The given parts, marked identically on both triangles. */}
          {preset.marks.map((mark, i) => {
            const hue = HUES[i % HUES.length];
            return [
              renderMark(t1, mark, hue, `m1-${selectedId}-${i}`),
              renderMark(t2, mark, hue, `m2-${selectedId}-${i}`),
            ];
          })}

          <VertexLabels vertices={t1} label="ABC" color={INK} />
          <VertexLabels vertices={t2} label={t2Letters.join("")} color={INK} />

          {t1.map((v, i) => (
            <Point key={`p1-${i}`} x={v.x} y={v.y} color={MUTED} />
          ))}
          {t2.map((v, i) => (
            <Point key={`p2-${i}`} x={v.x} y={v.y} color={MUTED} />
          ))}
        </Mafs>
      </div>

      {/* The verdict — machine-sourced, in an aria-live region. */}
      <p
        role="status"
        aria-live="polite"
        className={!reduceMotion && flash ? "cbmc-pulse" : undefined}
        style={{ marginTop: "0.6rem", fontSize: "1.05rem", fontWeight: 700 }}
      >
        <span style={{ color: congruent ? "var(--cbmc-accent, #176844)" : "var(--cbmc-angle-a, #b4540a)" }}>
          {headline}
        </span>
      </p>
      <p style={{ marginTop: "0.2rem", fontWeight: 400, color: "var(--cbmc-muted, #6b6353)" }}>
        {note}
        <span className="cbmc-sr-only">
          {congruent
            ? ` The verdict is computed from the triangles' coordinates, and the criterion ${criterion} is read from the marked given parts.`
            : " The verdict is computed from the triangles' coordinates: the two triangles do not coincide under any vertex matching."}
        </span>
      </p>

      {/* Controls-first preset chooser (the keyboard baseline). */}
      <ViewSwitcher<string>
        label="Choose a triangle pair"
        value={selectedId}
        options={CHECKER_PRESETS.map((p) => ({ value: p.id, label: p.label }))}
        onChange={setSelectedId}
      />

      <figcaption
        id={captionId}
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--cbmc-caption-color, #43564b)",
        }}
      >
        Two triangles with their given parts marked. The checker reports whether
        they are congruent — sourced from the figure's coordinates — and, when
        they are, the criterion those givens certify (△ABC ≅ △DEF in
        corresponding order).
      </figcaption>
    </figure>
  );
}
