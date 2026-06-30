"use client";

/**
 * <CPCTC> — reading a congruence statement's CORRESPONDENCE. Two triangles are
 * already known congruent under a STATED order (△ABC ≅ △DEF). Click any side or
 * angle of the first triangle and its corresponding part lights up in the second,
 * with the equality stated (AB ≅ DE, ∠B ≅ ∠E).
 *
 * The sharpening: the second triangle is drawn deliberately ROTATED and REFLECTED
 * so the matching part is NOT in the visually-obvious spot. The student is forced
 * to use the correspondence ORDER (A↔D, B↔E, C↔F) rather than eyeballing position.
 *
 * The pairing is MACHINE-SOURCED: the second triangle is a rigid image of the
 * first stored in a deliberately shuffled vertex order, and `congruenceCheck`
 * recovers the vertex correspondence from the geometry — nothing about the
 * A↔D / B↔E / C↔F mapping (or the D/E/F labels drawn on the figure) is hardcoded.
 * Corresponding parts are marked with a SHARED hue AND matching tick/arc counts
 * (redundant colour + count, so colour is never the only channel).
 *
 * This tool does NOT re-explain WHY corresponding parts are equal — that is the
 * definition page's job. It is purely about USING the correspondence. Controls-
 * first (a part chooser plus clickable figure parts), keyboard-operable, and
 * reduced-motion aware. Zero-stakes: nothing recorded.
 */
import { Fragment, useEffect, useId, useMemo, useState } from "react";
import { Coordinates, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { congruenceCheck, type Pt } from "./logic";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";
import { D, angleArcs, sideTicks, vertexArc } from "./internal/geometry";
import { ANGLE_A, ANGLE_B, ANGLE_C, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ViewSwitcher } from "./internal/controls";

const INK = PREIMAGE; // both triangles' resting ink

/** A scalene base triangle — distinct edge lengths so the correspondence is
 *  unique (an isosceles/equilateral figure would admit several valid pairings). */
const BASE: [Pt, Pt, Pt] = [
  { x: 0, y: 0 },
  { x: 4.2, y: 0 },
  { x: 1.1, y: 3.1 },
];

const SEP = 4; // half the gap between the two triangles' centres

/** The six selectable parts: an angle at a vertex, or a side between two. */
type PartId = "A" | "B" | "C" | "AB" | "BC" | "CA";
const ANGLE_PARTS: PartId[] = ["A", "B", "C"];
const SIDE_PARTS: PartId[] = ["AB", "BC", "CA"];

// Each part's signature hue + mark count — shared by BOTH members of the pair, so
// "these two correspond" reads from colour AND from a matching tick/arc count.
const PART_HUE: Record<PartId, string> = {
  A: ANGLE_A,
  B: ANGLE_B,
  C: ANGLE_C,
  AB: ANGLE_A,
  BC: ANGLE_B,
  CA: ANGLE_C,
};
const PART_COUNT: Record<PartId, number> = { A: 1, B: 2, C: 3, AB: 1, BC: 2, CA: 3 };

export interface CPCTCProps {
  /** Rotation (degrees) applied to the second triangle so its parts are reoriented. */
  rotateDeg?: number;
  /** Whether the second triangle is also reflected (a mirror pose). */
  reflect?: boolean;
  /** The part shown selected on first render. Default the side AB. */
  initialPart?: PartId;
  className?: string;
}

const centroidOf = (ps: Pt[]): Pt => ({
  x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
  y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
});

/** Reflect (optional) then rotate a point about the origin — the rigid pose for
 *  the second triangle. Reflection flips handedness (a genuine mirror image). */
function pose(p: Pt, reflect: boolean, rotateDeg: number): Pt {
  const x = reflect ? -p.x : p.x;
  const y = p.y;
  const a = rotateDeg * D;
  return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) };
}

export function CPCTC({
  rotateDeg = 130,
  reflect = true,
  initialPart = "AB",
  className,
}: CPCTCProps) {
  const [selected, setSelected] = useState<PartId>(initialPart);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  // The two triangles and the machine-recovered correspondence between them.
  // t1 sits on the left labelled A,B,C. t2 is a rigid image of t1 placed on the
  // right, stored in a SHUFFLED vertex order — congruenceCheck recovers which t2
  // vertex each t1 vertex maps to, and the D/E/F labels follow that mapping.
  const { t1, t2, t2Letters, sigma } = useMemo(() => {
    const c = centroidOf(BASE);
    const centred = BASE.map((p) => ({ x: p.x - c.x, y: p.y - c.y }));
    const t1pts = centred.map((p) => ({ x: p.x - SEP, y: p.y })) as Pt[];
    // Physical images of A, B, C (in that order) on the right side.
    const imgInAbcOrder = centred.map((p) => {
      const r = pose(p, reflect, rotateDeg);
      return { x: r.x + SEP, y: r.y };
    });
    // Store t2 in a cyclically shuffled order so the correspondence is genuinely
    // recovered (not the identity) — array index ≠ statement order.
    const t2pts: Pt[] = [imgInAbcOrder[1], imgInAbcOrder[2], imgInAbcOrder[0]];
    const result = congruenceCheck(t1pts, t2pts);
    const sig = result.correspondence ?? ([0, 1, 2] as [number, number, number]);
    // Place D/E/F by the recovered mapping: t1 vertex i (letter "ABC"[i]) ↔ the
    // t2 vertex sig[i], which therefore carries letter "DEF"[i].
    const letters = ["?", "?", "?"];
    sig.forEach((j, i) => {
      letters[j] = "DEF"[i];
    });
    return { t1: t1pts, t2: t2pts, t2Letters: letters, sigma: sig };
  }, [rotateDeg, reflect]);

  const bounds = useMemo(
    () =>
      autoBounds([
        { type: "polygon", vertices: t1 },
        { type: "polygon", vertices: t2 },
      ]),
    [t1, t2],
  );

  // A reduced-motion-aware highlight transition: a brief thickening of the
  // highlighted pair when the selection changes. Skipped entirely under
  // prefers-reduced-motion (the highlight simply appears, static).
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (reduceMotion) {
      setFlash(false);
      return;
    }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 420);
    return () => clearTimeout(t);
  }, [selected, reduceMotion]);

  const hue = PART_HUE[selected];
  const count = PART_COUNT[selected];
  const hiWeight = flash ? 7.5 : 5;

  const isAngle = selected.length === 1;
  const idxOf = (letter: string) => "ABC".indexOf(letter);

  // Resolve the selected part to concrete geometry on BOTH triangles + the stated
  // equality, all routed through the recovered correspondence `sigma`.
  const marking = useMemo(() => {
    if (isAngle) {
      const v = idxOf(selected); // t1 vertex
      const pv = sigma[v]; // its partner vertex in t2
      const t1Neigh = [0, 1, 2].filter((k) => k !== v);
      const t2Neigh = [0, 1, 2].filter((k) => k !== pv);
      const t1Arc = vertexArc(t1[v], t1[t1Neigh[0]], t1[t1Neigh[1]]);
      const t2Arc = vertexArc(t2[pv], t2[t2Neigh[0]], t2[t2Neigh[1]]);
      return {
        kind: "angle" as const,
        t1Wedge: t1Arc.wedge,
        t2Wedge: t2Arc.wedge,
        t1Arcs: angleArcs(t1[v], t1[t1Neigh[0]], t1[t1Neigh[1]], count),
        t2Arcs: angleArcs(t2[pv], t2[t2Neigh[0]], t2[t2Neigh[1]], count),
        t1Label: `∠${"ABC"[v]}`,
        t2Label: `∠${t2Letters[pv]}`,
      };
    }
    const a = idxOf(selected[0]);
    const b = idxOf(selected[1]);
    const pa = sigma[a];
    const pb = sigma[b];
    return {
      kind: "side" as const,
      t1Seg: [t1[a], t1[b]] as [Pt, Pt],
      t2Seg: [t2[pa], t2[pb]] as [Pt, Pt],
      t1Ticks: sideTicks(t1[a], t1[b], count),
      t2Ticks: sideTicks(t2[pa], t2[pb], count),
      t1Label: `${"ABC"[a]}${"ABC"[b]}`,
      t2Label: `${t2Letters[pa]}${t2Letters[pb]}`,
    };
  }, [selected, isAngle, count, sigma, t1, t2, t2Letters]);

  const partWord = isAngle ? "Angle" : "Side";
  const markWord = isAngle ? "arc" : "tick";

  const xy = (p: Pt): [number, number] => [p.x, p.y];

  // A clickable, focusable angle wedge / side hit-area on the FIRST triangle.
  const hitProps = (part: PartId, label: string) => ({
    tabIndex: 0,
    role: "button",
    "aria-pressed": selected === part,
    "aria-label": `${label} — select to see its corresponding part`,
    className: "cbmc-angle-hit",
    style: { cursor: "pointer" } as const,
    onClick: () => setSelected(part),
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setSelected(part);
      }
    },
  });

  // Side hit-area: a thin quad hugging the segment (a reliable click/focus target).
  const sideQuad = (p: Pt, q: Pt, hw = 0.34): [number, number][] => {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const L = Math.hypot(dx, dy) || 1;
    const nx = (-dy / L) * hw;
    const ny = (dx / L) * hw;
    return [
      [p.x + nx, p.y + ny],
      [q.x + nx, q.y + ny],
      [q.x - nx, q.y - ny],
      [p.x - nx, p.y - ny],
    ];
  };

  const sideEnds = (part: PartId): [Pt, Pt] => {
    const a = idxOf(part[0]);
    const b = idxOf(part[1]);
    return [t1[a], t1[b]];
  };
  const angleWedge = (part: PartId): [number, number][] => {
    const v = idxOf(part);
    const neigh = [0, 1, 2].filter((k) => k !== v);
    return vertexArc(t1[v], t1[neigh[0]], t1[neigh[1]], 0.85).wedge;
  };

  return (
    <figure
      className={["cbmc-cpctc", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <p className="cbmc-instruction" style={{ marginBottom: "0.4rem" }}>
        Given <strong>△ABC ≅ △DEF</strong>. The second triangle is turned and
        flipped — click a side or angle of the first triangle and read off its
        corresponding part by the letters, not the position.
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

          {/* The two triangle outlines (always shown whole). */}
          <Polygon points={t1.map(xy)} color={INK} fillOpacity={0.05} weight={2} />
          <Polygon points={t2.map(xy)} color={INK} fillOpacity={0.05} weight={2} />

          {/* Clickable, focusable parts on the FIRST triangle: angle wedges… */}
          {ANGLE_PARTS.map((part) => (
            <Polygon
              key={`hit-${part}`}
              points={angleWedge(part)}
              color={PART_HUE[part]}
              fillOpacity={selected === part ? 0.12 : 0.05}
              weight={selected === part ? 1.2 : 0}
              svgPolygonProps={hitProps(part, `Angle ${part}`)}
            />
          ))}
          {/* …and side hit-areas. */}
          {SIDE_PARTS.map((part) => {
            const [p, q] = sideEnds(part);
            return (
              <Polygon
                key={`hit-${part}`}
                points={sideQuad(p, q)}
                color={PART_HUE[part]}
                fillOpacity={selected === part ? 0.14 : 0}
                weight={0}
                svgPolygonProps={hitProps(part, `Side ${part}`)}
              />
            );
          })}

          {/* The highlighted pair — same hue + matching mark count on both. */}
          {marking.kind === "angle" ? (
            <>
              <Polygon
                points={marking.t1Wedge}
                color={hue}
                fillOpacity={0.18}
                weight={0}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              <Polygon
                points={marking.t2Wedge}
                color={hue}
                fillOpacity={0.18}
                weight={0}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
              {marking.t1Arcs.map((arc, i) => (
                <Polyline key={`a1-${i}`} points={arc} color={hue} fillOpacity={0} weight={2.5} />
              ))}
              {marking.t2Arcs.map((arc, i) => (
                <Polyline key={`a2-${i}`} points={arc} color={hue} fillOpacity={0} weight={2.5} />
              ))}
            </>
          ) : (
            <>
              <Polyline
                points={[xy(marking.t1Seg[0]), xy(marking.t1Seg[1])]}
                color={hue}
                fillOpacity={0}
                weight={hiWeight}
              />
              <Polyline
                points={[xy(marking.t2Seg[0]), xy(marking.t2Seg[1])]}
                color={hue}
                fillOpacity={0}
                weight={hiWeight}
              />
              {marking.t1Ticks.map((seg, i) => (
                <Polyline key={`t1-${i}`} points={seg} color={hue} fillOpacity={0} weight={2.5} />
              ))}
              {marking.t2Ticks.map((seg, i) => (
                <Polyline key={`t2-${i}`} points={seg} color={hue} fillOpacity={0} weight={2.5} />
              ))}
            </>
          )}

          <VertexLabels vertices={t1} label="ABC" color={INK} />
          <VertexLabels vertices={t2} label={t2Letters.join("")} color={INK} />

          {/* Tiny vertex dots so the corners read clearly. */}
          {t1.map((v, i) => (
            <Point key={`p1-${i}`} x={v.x} y={v.y} color={MUTED} />
          ))}
          {t2.map((v, i) => (
            <Point key={`p2-${i}`} x={v.x} y={v.y} color={MUTED} />
          ))}
        </Mafs>
      </div>

      {/* The headline equality, colour-coded to the on-figure marks. */}
      <p
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.6rem", fontSize: "1rem", fontWeight: 600 }}
      >
        <span aria-hidden="true" style={{ color: hue }}>
          {marking.t1Label} ≅ {marking.t2Label}
        </span>
        <span style={{ marginLeft: "0.6rem", fontWeight: 400, color: "var(--cbmc-muted, #6b6353)" }}>
          {`${partWord} ${marking.t1Label.replace("∠", "")} of △ABC corresponds to ${
            partWord.toLowerCase()
          } ${marking.t2Label.replace("∠", "")} of △DEF.`}
        </span>
        <span className="cbmc-sr-only">
          {` Both are marked with ${count} ${markWord}${count === 1 ? "" : "s"} in the same colour, so they read as corresponding even though the second triangle is reoriented.`}
        </span>
      </p>

      {/* Controls-first part chooser (the keyboard baseline; the figure parts are
          the same selection by direct manipulation). */}
      <ViewSwitcher<PartId>
        label="Choose a part"
        value={selected}
        options={[
          { value: "A", label: "∠A" },
          { value: "B", label: "∠B" },
          { value: "C", label: "∠C" },
          { value: "AB", label: "AB" },
          { value: "BC", label: "BC" },
          { value: "CA", label: "CA" },
        ]}
        onChange={setSelected}
      />

      <figcaption
        id={captionId}
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--cbmc-caption-color, #43564b)",
        }}
      >
        Two congruent triangles under the stated correspondence △ABC ≅ △DEF, with
        the second drawn rotated and reflected. Selecting{" "}
        {isAngle ? "angle" : "side"} {marking.t1Label.replace("∠", "")} highlights
        its corresponding part {marking.t2Label.replace("∠", "")} in the second
        triangle — matched by the correspondence order, not by where it sits.
      </figcaption>
    </figure>
  );
}
