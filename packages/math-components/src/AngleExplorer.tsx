"use client";

/**
 * <AngleExplorer> — TWO LINES CROSSING AT A POINT, and the angle relationships
 * that live at a single intersection: VERTICAL ANGLES (opposite angles are
 * equal) and LINEAR PAIRS (adjacent angles make a straight angle, 180°). Two
 * clean views of the same one-crossing figure.
 *
 * There is deliberately no "transversal" and no parallel-line concept here —
 * those belong to the separate two-lines-cut-by-a-transversal tool, where a
 * second line is actually drawn. This tool stays focused on one crossing so a
 * student meets vertical angles and linear pairs without extraneous controls.
 *
 * Every measure is read from the pure `transversalAngles` module (never
 * eyeballed). The four angles are selectable (click or keyboard). Vertical view:
 * the selected angle and its opposite carry MATCHING single-arc congruence marks
 * (the other pair a double arc) — "equal" shown the textbook way — and "Show why"
 * animates the rigid-motion proof (a 180° half-turn about the crossing carries
 * the angle onto its opposite), narrated step by step with a completion pulse.
 * Linear-pair view: the selected angle and its neighbour are drawn in DISTINCT
 * colours (they are unequal) under one 180° sweep — the language of "these fill
 * a straight angle". Honors prefers-reduced-motion. Zero-stakes: nothing recorded.
 */
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Line, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { transversalAngles } from "./logic";
import type { Pt } from "./logic";
import {
  D,
  arcLabel,
  arcPoints,
  dirWord,
  easeOut,
  lineIntersect,
  rotPt,
  wedge,
} from "./internal/geometry";
import { ANGLE_B, IMAGE, MUTED, PREIMAGE, TARGET } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { ControlSlider, ViewSwitcher } from "./internal/controls";

const LINE1_COLOR = PREIMAGE; // the fixed line
const LINE2_COLOR = TARGET; // the line you rotate
const ACTIVE_COLOR = IMAGE; // the selected vertical pair
const OTHER_COLOR = MUTED; // the other vertical pair
const PARTNER_COLOR = ANGLE_B; // a linear pair's OTHER angle (unequal ⇒ distinct hue)

// Cosmetic geometry only — positions never affect the math. Two lines cross at
// the origin; the four angles around that single crossing are the whole lesson.
const ORIGIN: Pt = { x: 0, y: 0 };
const VIEW = 4.5;

const FILL_R = 1.5; // wedge fill radius
const MARK_R = 0.95; // congruence arc radius (the double arc offsets around it)
const LABEL_R = 2.05; // measure-label radius
const START_DELAY_MS = 1000; // a beat to read step 1 before the half-turn
const ANIM_MS = 3000; // the half-turn — slow enough to follow
const DISMISS_MS = 5000; // auto-clear the proof a few seconds after it lands

// The four angles, in CCW order, and each one's vertical (opposite) partner.
type Slot = 1 | 2 | 3 | 4;
const SLOT_ORDER: Slot[] = [1, 2, 4, 3];
const PARTNER: Record<Slot, Slot> = { 1: 4, 4: 1, 2: 3, 3: 2 };
// Each slot's LINEAR-PAIR neighbour (adjacent angle summing to 180°).
const NEIGHBOUR: Record<Slot, Slot> = { 1: 2, 2: 1, 4: 3, 3: 4 };

/** The angle relationship currently in view — both live on the one crossing. */
type Lens = "vertical" | "linear-pair";

export interface AngleExplorerProps {
  /** Direction angle of the first (fixed) line, degrees. Default 0 (horizontal). */
  line1Dir?: number;
  /** Initial direction angle of the second (rotatable) line, degrees. Default 60. */
  line2Dir?: number;
  className?: string;
}

const fmt = (a: number) => `${Math.round(a * 10) / 10}°`;

export function AngleExplorer({
  line1Dir = 0,
  line2Dir = 60,
  className,
}: AngleExplorerProps) {
  // The rotatable second line's direction (the only quantitative control).
  const [line2, setLine2] = useState(line2Dir);
  const [selected, setSelected] = useState<Slot>(1);
  const [lens, setLens] = useState<Lens>("vertical");
  const [proofT, setProofT] = useState(0); // 0 … 1 — how far the angle has swung
  const [step, setStep] = useState(0); // 0 idle; 1/2/3 = the narrated proof steps
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const captionId = useId();
  const reduceMotion = usePrefersReducedMotion();

  // The whole figure is derived from the control value. Each slot carries its
  // wedge fill, congruence arcs (single + the two of a double), bisector label,
  // and the direction word for its aria-label.
  const figure = useMemo(() => {
    // A single crossing has no second parallel line, so collapse the module's
    // two-crossing model by setting its second line ≡ line1; the four angles at
    // the line1 × line2 crossing are then exactly result.angles 1–4. (Here the
    // module's "transversal" plays the role of our rotatable second line.)
    const result = transversalAngles({
      line1Dir,
      line2Dir: line1Dir,
      transversalDir: line2,
    });
    const c1 = lineIntersect(ORIGIN, line1Dir, ORIGIN, line2);
    const r = [line1Dir, line2, line1Dir + 180, line2 + 180];
    const dirs: Record<Slot, [number, number]> = {
      1: [r[0], r[1]],
      2: [r[1], r[2]],
      4: [r[2], r[3]],
      3: [r[3], r[0] + 360],
    };
    const slots = {} as Record<
      Slot,
      {
        a0: number;
        a1: number;
        wedge: [number, number][];
        single: [number, number][];
        doubleIn: [number, number][];
        doubleOut: [number, number][];
        label: [number, number];
        word: string;
      }
    >;
    for (const id of [1, 2, 3, 4] as Slot[]) {
      const [a0, a1] = dirs[id];
      slots[id] = {
        a0,
        a1,
        wedge: wedge(c1, a0, a1, FILL_R),
        single: arcPoints(c1, a0, a1, MARK_R),
        doubleIn: arcPoints(c1, a0, a1, MARK_R - 0.09),
        doubleOut: arcPoints(c1, a0, a1, MARK_R + 0.06),
        label: arcLabel(c1, a0, a1, LABEL_R),
        word: dirWord((a0 + a1) / 2),
      };
    }
    return { result, c1, slots };
  }, [line1Dir, line2]);

  const { c1, slots } = figure;
  const theta = figure.result.angles[1].measure; // θ — the {1,4} pair
  const measureOf = (id: Slot) => (id === 1 || id === 4 ? theta : 180 - theta);
  // The slot the active view pairs the selected angle WITH: its vertical opposite
  // (vertical view) or its adjacent neighbour (linear-pairs view).
  const partner = lens === "vertical" ? PARTNER[selected] : NEIGHBOUR[selected];
  const isActive = (id: Slot) => id === selected || id === partner;
  const activeMeasure = measureOf(selected);
  const partnerMeasure = measureOf(partner);
  const otherMeasure = 180 - activeMeasure;
  // The linear-pair sum (the two adjacent measures), machine-sourced: every
  // linear-pair in the module sums to 180°, so this reads it rather than asserting.
  const linearPairSum = activeMeasure + partnerMeasure;

  // Per-slot fill/label colour. Vertical: the equal pair shares ACTIVE_COLOR.
  // Linear-pair: the two angles are UNEQUAL, so they get DISTINCT colours (never
  // matching marks, which would falsely signal equality).
  const colorOf = (id: Slot) =>
    lens === "linear-pair"
      ? id === selected
        ? ACTIVE_COLOR
        : id === partner
          ? PARTNER_COLOR
          : OTHER_COLOR
      : isActive(id)
        ? ACTIVE_COLOR
        : OTHER_COLOR;

  // The straight-angle sweep for the linear-pairs view: the selected wedge and
  // its neighbour together span a straight line through the crossing — one arc
  // across both, labelled 180°, is the language of "these fill a straight angle".
  const straightAngle = useMemo(() => {
    if (lens !== "linear-pair") return null;
    const sel = slots[selected];
    const par = slots[partner];
    const adjacent = (a: number, b: number) =>
      Math.abs(((a - b + 540) % 360) - 180) < 1e-6;
    const [u0, u1] = adjacent(sel.a1, par.a0)
      ? [sel.a0, par.a1]
      : [par.a0, sel.a1];
    return {
      arc: arcPoints(c1, u0, u1, MARK_R),
      label: arcLabel(c1, u0, u1, MARK_R + 0.7),
    };
  }, [lens, slots, selected, partner, c1]);

  // The moving wedge for the proof: the SELECTED wedge rotated 180·proofT about
  // c1. It appears as soon as the proof starts (step 1, at proofT = 0, sitting on
  // its start position so the angle visibly "lifts" before it swings).
  const movingWedge = useMemo(
    () => (step > 0 ? slots[selected].wedge.map((p) => rotPt(p, 180 * proofT, c1)) : null),
    [step, proofT, slots, selected, c1],
  );

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

  const playProof = () => {
    clearProofTimers();
    setProofT(0);
    setStep(1); // step 1 narrates while we hold a beat
    if (reduceMotion) {
      setProofT(1);
      setStep(3);
      timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
      return;
    }
    timersRef.current.push(
      setTimeout(() => {
        setStep(2); // step 2: the half-turn itself
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / ANIM_MS);
          setProofT(easeOut(t));
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            rafRef.current = null;
            setStep(3); // step 3: it landed — equal
            timersRef.current.push(setTimeout(resetProof, DISMISS_MS));
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      }, START_DELAY_MS),
    );
  };

  const onSlider = (v: number) => {
    resetProof(); // the figure changed — drop any running proof
    setLine2(v);
  };

  const selectAngle = (id: Slot) => {
    resetProof(); // changing the subject drops any running proof
    setSelected(id);
  };
  const onWedgeKey = (e: { key: string; preventDefault: () => void }, id: Slot) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      selectAngle(id);
    }
  };
  const selectLens = (l: Lens) => {
    resetProof();
    setLens(l);
  };

  const active = step > 0;
  const landed = step >= 3;

  const lineSeg = (
    through: Pt,
    dir: number,
  ): [[number, number], [number, number]] => {
    const u = { x: Math.cos(dir * D), y: Math.sin(dir * D) };
    const L = VIEW * 2;
    return [
      [through.x - L * u.x, through.y - L * u.y],
      [through.x + L * u.x, through.y + L * u.y],
    ];
  };
  const seg1 = lineSeg(ORIGIN, line1Dir);

  const caption =
    lens === "vertical"
      ? `Two lines crossing, with the angle between them ${fmt(theta)}. The ` +
        `selected angle and its opposite (single-arc) form a vertical pair, each ` +
        `${fmt(activeMeasure)}; the other pair (double-arc) each measure ` +
        `${fmt(otherMeasure)}. Vertical angles are always equal — a half-turn about ` +
        `the crossing maps one exactly onto the other.`
      : `Two lines crossing, with the angle between them ${fmt(theta)}. The ` +
        `selected angle (${fmt(activeMeasure)}) and the angle beside it ` +
        `(${fmt(partnerMeasure)}) form a linear pair along a straight line, so ` +
        `together they make a straight angle: ${fmt(activeMeasure)} + ` +
        `${fmt(partnerMeasure)} = ${fmt(linearPairSum)}.`;

  // The proof, narrated line by line — revealed step-by-step as it plays.
  const proofSteps = [
    `Start with the selected angle — it measures ${fmt(activeMeasure)}.`,
    "Rotate it a half-turn (180°) about the crossing point.",
    `It lands exactly on the opposite angle, so both are ${fmt(activeMeasure)} — vertical angles are always equal.`,
  ];

  return (
    <figure
      className={["cbmc-angle-explorer", className].filter(Boolean).join(" ")}
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
          viewBox={{ x: [-VIEW, VIEW], y: [-VIEW, VIEW] }}
          preserveAspectRatio="contain"
          pan={false}
          zoom={false}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />

          {/* Filled, SELECTABLE wedges — click or focus + Enter/Space to choose
              the subject angle. The selected pair is the focus; the other muted. */}
          {SLOT_ORDER.map((id) => {
            const s = slots[id];
            const act = isActive(id);
            const sel = id === selected;
            return (
              <Polygon
                key={`fill-${id}`}
                points={s.wedge}
                color={colorOf(id)}
                fillOpacity={sel && step > 0 ? 0.06 : act ? 0.2 : 0.08}
                weight={sel ? 1.4 : 0}
                svgPolygonProps={{
                  tabIndex: 0,
                  role: "button",
                  "aria-pressed": sel,
                  "aria-label": `${s.word} angle, ${fmt(measureOf(id))} — select to make it the subject`,
                  className: "cbmc-angle-hit",
                  style: { cursor: "pointer" },
                  onClick: () => selectAngle(id),
                  onKeyDown: (e) => onWedgeKey(e, id),
                }}
              />
            );
          })}

          {/* The two lines crossing at the centre. */}
          <Line.Segment point1={seg1[0]} point2={seg1[1]} color={LINE1_COLOR} />
          <Line.PointAngle
            point={[ORIGIN.x, ORIGIN.y]}
            angle={line2 * D}
            color={LINE2_COLOR}
          />

          {/* Vertical view — congruence marks: MATCHING marks mean equal (a single
              arc on the selected vertical pair, a double arc on the other pair). */}
          {lens === "vertical"
            ? SLOT_ORDER.map((id) => {
                const s = slots[id];
                const color = isActive(id) ? ACTIVE_COLOR : OTHER_COLOR;
                return isActive(id) ? (
                  <Polyline key={`mk-${id}`} points={s.single} color={color} fillOpacity={0} />
                ) : (
                  <Fragment key={`mk-${id}`}>
                    <Polyline points={s.doubleIn} color={color} fillOpacity={0} />
                    <Polyline points={s.doubleOut} color={color} fillOpacity={0} />
                  </Fragment>
                );
              })
            : null}

          {/* Linear-pairs view — ONE arc sweeping the selected angle and its
              neighbour: together they fill a straight line, so the sweep is a
              straight angle (180°). NOT congruence marks: the two are unequal. */}
          {lens === "linear-pair" && straightAngle ? (
            <>
              <Polyline points={straightAngle.arc} color={ACTIVE_COLOR} fillOpacity={0} weight={2} />
              <Text
                x={straightAngle.label[0]}
                y={straightAngle.label[1]}
                size={15}
                color={ACTIVE_COLOR}
              >
                180°
              </Text>
            </>
          ) : null}

          {/* The proof in motion: the selected angle swung around the crossing. */}
          {movingWedge ? (
            <Polygon
              points={movingWedge}
              color={ACTIVE_COLOR}
              fillOpacity={0.5}
              weight={2}
              svgPolygonProps={{ style: { pointerEvents: "none" } }}
            />
          ) : null}

          {/* The crossing point — where the lesson happens. */}
          <Point x={c1.x} y={c1.y} color={LINE1_COLOR} />

          {/* Measures only — equality is shown by the matching marks + colour. */}
          {SLOT_ORDER.map((id) => {
            const s = slots[id];
            return (
              <Text
                key={`lbl-${id}`}
                x={s.label[0]}
                y={s.label[1]}
                size={isActive(id) ? 15 : 14}
                color={colorOf(id)}
              >
                {fmt(measureOf(id))}
              </Text>
            );
          })}
        </Mafs>
      </div>

      {/* Legend — view-aware. Vertical: matching marks mean equal. Linear pair:
          two unequal angles that together fill a straight angle. */}
      <div className="cbmc-legend" aria-hidden="true">
        {lens === "vertical" ? (
          <>
            <span className="cbmc-legend-item">
              <span
                className="cbmc-swatch"
                style={{ background: ACTIVE_COLOR, borderColor: ACTIVE_COLOR }}
              />
              Selected pair — single arc
            </span>
            <span className="cbmc-legend-item">
              <span
                className="cbmc-swatch"
                style={{ background: OTHER_COLOR, borderColor: OTHER_COLOR }}
              />
              Other pair — double arc
            </span>
          </>
        ) : (
          <>
            <span className="cbmc-legend-item">
              <span
                className="cbmc-swatch"
                style={{ background: ACTIVE_COLOR, borderColor: ACTIVE_COLOR }}
              />
              Selected angle
            </span>
            <span className="cbmc-legend-item">
              <span
                className="cbmc-swatch"
                style={{ background: PARTNER_COLOR, borderColor: PARTNER_COLOR }}
              />
              Its neighbour — together a straight angle (180°)
            </span>
          </>
        )}
      </div>

      {/* The marks' non-color encoding, surfaced to the DOM for a11y/tests — one
          marker per slot, tagging the pattern it carries so the active pair is
          distinguishable without relying on color. */}
      {SLOT_ORDER.map((id) => (
        <span
          key={`pat-${id}`}
          className="cbmc-sr-only"
          data-cbmc-angle-pattern={
            lens === "vertical"
              ? isActive(id)
                ? "single-arc"
                : "double-arc"
              : isActive(id)
                ? "straight-angle"
                : "none"
          }
          data-cbmc-angle={id}
          data-cbmc-lens={lens}
        />
      ))}

      <div style={{ marginTop: "0.75rem" }}>
        <ControlSlider
          label="Angle between the lines"
          value={line2}
          min={1}
          max={179}
          onChange={onSlider}
          display={fmt(theta)}
          valueText={fmt(theta)}
        />
      </div>

      <ViewSwitcher<Lens>
        label="Angle relationship"
        value={lens}
        options={[
          { value: "vertical", label: "Vertical angles" },
          { value: "linear-pair", label: "Linear pairs" },
        ]}
        onChange={selectLens}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        {lens === "vertical" ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-pressed={active}
            onClick={playProof}
          >
            {active ? "Replay the half-turn" : "Show why they're equal"}
          </button>
        ) : null}
        {active ? (
          <button
            type="button"
            className="cbmc-btn"
            aria-label="Reset and hide the proof"
            title="Press to reset and hide the half-turn"
            onClick={resetProof}
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="cbmc-instruction" style={{ marginTop: "0.5rem" }}>
        {lens === "vertical"
          ? "Click an angle to choose it, drag the slider to rotate the second line, then press “Show why”."
          : "Click an angle to choose it and rotate the second line — its neighbour completes the straight line."}
      </p>

      <div
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
      >
        {active ? (
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
        ) : lens === "vertical" ? (
          <p>
            The selected angle and its opposite are a vertical pair — {fmt(activeMeasure)}{" "}
            and {fmt(activeMeasure)} — and vertical angles are always equal. The other
            pair each measure {fmt(otherMeasure)}.
          </p>
        ) : (
          <p>
            The selected angle and its neighbour form a linear pair — {fmt(activeMeasure)}{" "}
            and {fmt(partnerMeasure)} — and a linear pair always sums to a straight
            angle: {fmt(activeMeasure)} + {fmt(partnerMeasure)} = {fmt(linearPairSum)}.
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
