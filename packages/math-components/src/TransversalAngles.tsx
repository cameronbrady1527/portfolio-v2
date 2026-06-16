"use client";

/**
 * <TransversalAngles> — TWO LINES CUT BY A TRANSVERSAL, the figure where the
 * parallel-line angle theorems live. Both lines are drawn (unlike the
 * single-crossing Intersecting Lines tool), so the parallel toggle is honest:
 * with the lines parallel, corresponding / alternate-interior / alternate-
 * exterior angles are EQUAL and co-interior (same-side interior) angles are
 * SUPPLEMENTARY; un-parallel the lines and those relationships visibly break.
 * That break is the lesson.
 *
 * The four relationships are views of the one figure (a `ViewSwitcher`). For the
 * selected view, the representative pair is highlighted with filled wedges,
 * arcs, and measures; matching single-arc marks mean "equal", distinct colours
 * mean "not equal / supplementary". Every measure and verdict is read from the
 * pure `transversalAngles` module — the UI never eyeballs an angle. The eight
 * slots are mapped to rendered sectors by (intersection, region, θ-vs-
 * supplement), which is unique, so corresponding angles land in matching
 * corners automatically. Zero-stakes: nothing recorded.
 */
import { useId, useMemo, useState } from "react";
import { Coordinates, Line, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { transversalAngles } from "./logic";
import type { AngleId, PairRelationship } from "./logic";
import type { Pt } from "./logic";
import { D, arcLabel, arcPoints, lineIntersect, wedge } from "./internal/geometry";
import { ANGLE_B, CAPTION, IMAGE, MUTED, PREIMAGE, TARGET } from "./internal/colors";
import { ControlSlider, ViewSwitcher } from "./internal/controls";

const LINE_COLOR = PREIMAGE; // the two lines
const TRANSVERSAL_COLOR = TARGET; // the transversal
const A_COLOR = IMAGE; // the first highlighted angle
const B_COLOR = ANGLE_B; // the second highlighted angle (distinct ⇒ "not equal")

const VIEW = 5;
const SEP = 1.6; // half the vertical gap between the two lines
const FILL_R = 0.6; // highlighted wedge radius
const MARK_R = 0.6; // congruence arc radius
const LABEL_R = 0.95; // measure-label radius (highlighted)
const SMALL_R = 0.78; // measure-label radius (the other six, small)

const fmt = (a: number) => `${Math.round(a * 10) / 10}°`;

// The relationship views and the representative pair shown for each.
type View = "corresponding" | "alternate-interior" | "alternate-exterior" | "co-interior";
const REP: Record<View, [AngleId, AngleId]> = {
  corresponding: [1, 5],
  "alternate-interior": [4, 5],
  "alternate-exterior": [1, 8],
  "co-interior": [4, 6],
};
const VIEW_LABEL: Record<View, string> = {
  corresponding: "Corresponding",
  "alternate-interior": "Alternate interior",
  "alternate-exterior": "Alternate exterior",
  "co-interior": "Co-interior",
};
/** Whether the view's relationship is "these are equal" (vs supplementary). */
const IS_EQUALITY: Record<View, boolean> = {
  corresponding: true,
  "alternate-interior": true,
  "alternate-exterior": true,
  "co-interior": false,
};

interface SlotGeom {
  a0: number;
  a1: number;
  center: Pt;
  measure: number;
  region: "interior" | "exterior";
}

/**
 * The four angle sectors at one crossing, keyed by slot id. Each sector is
 * classified interior/exterior by whether its bisector points toward the other
 * crossing (`interiorVec`); within a region the θ-sector and the supplement-
 * sector are told apart by measure, which uniquely fixes the slot id. `theta`
 * comes from the pure module so the mapping agrees with it exactly.
 */
function slotsAt(
  center: Pt,
  lineDir: number,
  tDir: number,
  interiorVec: { x: number; y: number },
  theta: number,
  ids: { extTheta: AngleId; extSupp: AngleId; intTheta: AngleId; intSupp: AngleId },
): Record<AngleId, SlotGeom> {
  const norm360 = (r: number) => ((r % 360) + 360) % 360;
  const rays = [lineDir, tDir, lineDir + 180, tDir + 180].map(norm360).sort((a, b) => a - b);
  const ext: SlotGeom[] = [];
  const int: SlotGeom[] = [];
  for (let i = 0; i < 4; i++) {
    const a0 = rays[i];
    const a1 = rays[(i + 1) % 4] + (i === 3 ? 360 : 0);
    const bis = ((a0 + a1) / 2) * D;
    const interior = Math.cos(bis) * interiorVec.x + Math.sin(bis) * interiorVec.y > 0;
    const s: SlotGeom = {
      a0,
      a1,
      center,
      measure: a1 - a0,
      region: interior ? "interior" : "exterior",
    };
    (interior ? int : ext).push(s);
  }
  const out = {} as Record<AngleId, SlotGeom>;
  const assign = (arr: SlotGeom[], thetaId: AngleId, suppId: AngleId) => {
    const [s0, s1] = arr;
    const s0IsTheta = Math.abs(s0.measure - theta) <= Math.abs(s1.measure - theta);
    out[thetaId] = s0IsTheta ? s0 : s1;
    out[suppId] = s0IsTheta ? s1 : s0;
  };
  assign(ext, ids.extTheta, ids.extSupp);
  assign(int, ids.intTheta, ids.intSupp);
  return out;
}

export interface TransversalAnglesProps {
  /** Initial transversal direction, degrees (25–155). Default 115. */
  transversalDir?: number;
  /** Initial tilt of the second line when not parallel, degrees. Default 22. */
  secondLineDir?: number;
  className?: string;
}

export function TransversalAngles({
  transversalDir = 115,
  secondLineDir = 22,
  className,
}: TransversalAnglesProps) {
  const [tDir, setTDir] = useState(transversalDir);
  const [parallel, setParallel] = useState(true);
  const [lineBSlider, setLineBSlider] = useState(secondLineDir);
  const [view, setView] = useState<View>("corresponding");
  const captionId = useId();

  const line1Dir = 0;
  const lineBDir = parallel ? 0 : lineBSlider;

  const figure = useMemo(() => {
    const result = transversalAngles({
      line1Dir,
      line2Dir: lineBDir,
      transversalDir: tDir,
    });
    // Both lines pass through (0, ±SEP); the transversal through the origin.
    const aPt: Pt = { x: 0, y: SEP };
    const bPt: Pt = { x: 0, y: -SEP };
    const P1 = lineIntersect(aPt, line1Dir, { x: 0, y: 0 }, tDir);
    const P2 = lineIntersect(bPt, lineBDir, { x: 0, y: 0 }, tDir);
    const toP2 = { x: P2.x - P1.x, y: P2.y - P1.y };
    const toP1 = { x: P1.x - P2.x, y: P1.y - P2.y };
    const theta1 = result.angles[1].measure;
    const theta2 = result.angles[5].measure;
    const s1 = slotsAt(P1, line1Dir, tDir, toP2, theta1, {
      extTheta: 1,
      extSupp: 2,
      intSupp: 3,
      intTheta: 4,
    });
    const s2 = slotsAt(P2, lineBDir, tDir, toP1, theta2, {
      extTheta: 8,
      extSupp: 7,
      intSupp: 6,
      intTheta: 5,
    });
    const slots = { ...s1, ...s2 } as Record<AngleId, SlotGeom>;
    return { result, P1, P2, slots };
  }, [line1Dir, lineBDir, tDir]);

  const { result, P1, P2, slots } = figure;
  const [idA, idB] = REP[view];
  const mA = result.angles[idA].measure;
  const mB = result.angles[idB].measure;
  const isEquality = IS_EQUALITY[view];
  const equal = result.pairs.find(
    (p) =>
      p.relationship === (view as PairRelationship) &&
      ((p.angles[0] === idA && p.angles[1] === idB) ||
        (p.angles[0] === idB && p.angles[1] === idA)),
  )?.equal;
  const sum = Math.round((mA + mB) * 10) / 10;
  const supplementary = Math.abs(mA + mB - 180) < 0.5;
  // The headline verdict for the active view: equal (equality views) or
  // supplementary (co-interior). Holds IFF the lines are parallel.
  const holds = isEquality ? !!equal : supplementary;

  const lineSeg = (
    through: Pt,
    dir: number,
  ): [[number, number], [number, number]] => {
    const u = { x: Math.cos(dir * D), y: Math.sin(dir * D) };
    const L = VIEW * 2.2;
    return [
      [through.x - L * u.x, through.y - L * u.y],
      [through.x + L * u.x, through.y + L * u.y],
    ];
  };
  const segA = lineSeg({ x: 0, y: SEP }, line1Dir);
  const segB = lineSeg({ x: 0, y: -SEP }, lineBDir);

  const allIds: AngleId[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const caption =
    `Two lines cut by a transversal at ${fmt(tDir)}; the lines are ` +
    `${parallel ? "parallel" : "not parallel"}. ${VIEW_LABEL[view]} angles ` +
    `(highlighted) measure ${fmt(mA)} and ${fmt(mB)} — ` +
    (isEquality
      ? `${holds ? "equal" : "not equal"}`
      : `they ${holds ? "sum to 180° (supplementary)" : `sum to ${fmt(sum)}`}`) +
    `, ${parallel ? "because the lines are parallel" : "because the lines are not parallel"}. ` +
    `${VIEW_LABEL[view]} angles are ${isEquality ? "equal" : "supplementary"} exactly when the lines are parallel.`;

  return (
    <figure
      className={["cbmc-transversal-angles", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      <div
        className={["cbmc-graph-paper", holds && "cbmc-pulse"]
          .filter(Boolean)
          .join(" ")}
        style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}
      >
        <Mafs
          viewBox={{ x: [-VIEW, VIEW], y: [-VIEW, VIEW] }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />

          {/* The two lines and the transversal. */}
          <Line.Segment point1={segA[0]} point2={segA[1]} color={LINE_COLOR} />
          <Line.Segment point1={segB[0]} point2={segB[1]} color={LINE_COLOR} />
          <Line.Segment
            point1={lineSeg({ x: 0, y: 0 }, tDir)[0]}
            point2={lineSeg({ x: 0, y: 0 }, tDir)[1]}
            color={TRANSVERSAL_COLOR}
          />

          {/* Highlighted pair: filled wedges + arcs. Matching colour + arc means
              equal; distinct colours mean not-equal / supplementary. */}
          {[
            { id: idA, color: A_COLOR },
            { id: idB, color: holds && isEquality ? A_COLOR : B_COLOR },
          ].map(({ id, color }) => {
            const s = slots[id];
            return (
              <Polygon
                key={`hl-${id}`}
                points={wedge(s.center, s.a0, s.a1, FILL_R)}
                color={color}
                fillOpacity={0.3}
                weight={2}
                svgPolygonProps={{ style: { pointerEvents: "none" } }}
              />
            );
          })}
          {/* Congruence single-arc on BOTH when equal (matching marks = equal). */}
          {isEquality && holds
            ? [idA, idB].map((id) => {
                const s = slots[id];
                return (
                  <Polyline
                    key={`mk-${id}`}
                    points={arcPoints(s.center, s.a0, s.a1, MARK_R)}
                    color={A_COLOR}
                    fillOpacity={0}
                  />
                );
              })
            : null}

          {/* The two crossing points. */}
          <Point x={P1.x} y={P1.y} color={LINE_COLOR} />
          <Point x={P2.x} y={P2.y} color={LINE_COLOR} />

          {/* All eight measures: the highlighted pair bold + coloured, the rest
              small + muted for context. */}
          {allIds.map((id) => {
            const s = slots[id];
            const hl = id === idA || id === idB;
            const color = hl
              ? id === idA
                ? A_COLOR
                : holds && isEquality
                  ? A_COLOR
                  : B_COLOR
              : MUTED;
            const lp = arcLabel(s.center, s.a0, s.a1, hl ? LABEL_R : SMALL_R);
            return (
              <Text key={`m-${id}`} x={lp[0]} y={lp[1]} size={hl ? 16 : 12} color={color}>
                {fmt(s.measure)}
              </Text>
            );
          })}
        </Mafs>
      </div>

      <div className="cbmc-legend" aria-hidden="true">
        <span className="cbmc-legend-item">
          <span className="cbmc-swatch" style={{ background: A_COLOR, borderColor: A_COLOR }} />
          {isEquality ? (holds ? "Equal — matching arcs" : "First angle") : "First angle"}
        </span>
        <span className="cbmc-legend-item">
          <span
            className="cbmc-swatch"
            style={{
              background: holds && isEquality ? A_COLOR : B_COLOR,
              borderColor: holds && isEquality ? A_COLOR : B_COLOR,
            }}
          />
          {isEquality
            ? holds
              ? "its equal partner"
              : "Second angle — not equal"
            : "Second angle — together 180°"}
        </span>
      </div>

      <div className="cbmc-control-row" style={{ marginTop: "0.75rem" }}>
        <span className="cbmc-control-label" id={`${captionId}-par`}>
          The two lines
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={parallel}
          aria-labelledby={`${captionId}-par`}
          className="cbmc-btn"
          onClick={() => setParallel((p) => !p)}
        >
          {parallel ? "Parallel" : "Not parallel"}
        </button>
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <ControlSlider
          label="Transversal angle"
          value={tDir}
          min={25}
          max={155}
          onChange={setTDir}
          display={fmt(tDir)}
        />
      </div>

      {!parallel ? (
        <div style={{ marginTop: "0.5rem" }}>
          <ControlSlider
            label="Tilt of the second line"
            value={lineBSlider}
            min={5}
            max={40}
            onChange={setLineBSlider}
            display={`${Math.round(lineBSlider)}°`}
          />
        </div>
      ) : null}

      <ViewSwitcher<View>
        label="Angle relationship"
        value={view}
        options={[
          { value: "corresponding", label: "Corresponding" },
          { value: "alternate-interior", label: "Alt. interior" },
          { value: "alternate-exterior", label: "Alt. exterior" },
          { value: "co-interior", label: "Co-interior" },
        ]}
        onChange={setView}
      />

      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        Pick a relationship, slide the transversal, then toggle the lines between
        parallel and not — watch the relationship hold, then break.
      </p>

      <p
        className="cbmc-progress"
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.5rem" }}
      >
        <strong>{VIEW_LABEL[view]}</strong>:{" "}
        <span style={{ color: A_COLOR }}>{fmt(mA)}</span>
        {isEquality ? (
          <>
            {" "}
            {holds ? "=" : "≠"}{" "}
            <span style={{ color: holds ? A_COLOR : B_COLOR }}>{fmt(mB)}</span> —{" "}
            {holds ? "equal" : "not equal"}
          </>
        ) : (
          <>
            {" "}+ <span style={{ color: B_COLOR }}>{fmt(mB)}</span> = {fmt(sum)} —{" "}
            {holds ? "supplementary" : "not supplementary"}
          </>
        )}
        {", "}
        {parallel
          ? "because the lines are parallel."
          : "because the lines are not parallel."}
      </p>

      <figcaption
        id={captionId}
        style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: CAPTION }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
