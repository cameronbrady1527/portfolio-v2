"use client";

/**
 * <AngleExplorer> — two lines crossed by a transversal, with the angle
 * relationships read straight off the pure `transversalAngles` module. The UI
 * never eyeballs an angle: every measure comes from angles.ts.
 *
 * This slice ships the VERTICAL-ANGLES lens, drawn in the language of equal
 * angles. The four angles around the crossing are selectable (click or keyboard);
 * the SELECTED angle and its vertical partner are highlighted with MATCHING
 * single-arc congruence marks (the other pair gets a double arc), so "these two
 * are equal" is shown the textbook way — by matching marks, not arbitrary slot
 * numbers, and color-independently (pattern + measure). "Show why" animates the
 * proof: a 180° half-turn about the crossing carries the selected angle exactly
 * onto its partner — the same rigid-motion argument the rest of the course uses
 * — narrated step by step, with a subtle completion pulse. Honors
 * prefers-reduced-motion. Zero-stakes: nothing is recorded.
 *
 * Performance: state holds the control value, the selection, and the animation
 * clock; the figure is useMemo-derived. The rAF loop runs only while it plays.
 */
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Line, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import { transversalAngles } from "./logic";
import type { Pt } from "./logic";

const D = Math.PI / 180;

const LINE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const TRANSVERSAL_COLOR = "var(--cbmc-target-color, #b4540a)";
const ACTIVE_COLOR = "var(--cbmc-image-color, #1f8a5b)"; // the selected vertical pair
const OTHER_COLOR = "var(--cbmc-muted, #6b6353)"; // the other vertical pair

// Cosmetic geometry only — positions never affect the math. For the
// vertical-angles lens we show ONE centered crossing of two lines (line1 + the
// transversal) — exactly the figure that forms vertical angles. The parallel
// second line belongs to the later transversal lenses, not here.
const ORIGIN: Pt = { x: 0, y: 0 };
const LINE1_THROUGH: Pt = ORIGIN;
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

export interface AngleExplorerProps {
  /** Direction angle of the first line, degrees. Default 0 (horizontal). */
  line1Dir?: number;
  /** Direction angle of the second line, degrees. Default 0 (horizontal). */
  line2Dir?: number;
  /** Initial transversal direction angle, degrees. Default 60. */
  transversalDir?: number;
  className?: string;
}

const fmt = (a: number) => `${Math.round(a * 10) / 10}°`;

/** A coarse compass word for a direction (degrees) — for angle aria-labels. */
function dirWord(deg: number): string {
  const a = ((deg % 360) + 360) % 360;
  const words = [
    "right",
    "upper-right",
    "top",
    "upper-left",
    "left",
    "lower-left",
    "bottom",
    "lower-right",
  ];
  return words[Math.round(a / 45) % 8];
}

/** Intersection of the transversal (through ORIGIN at tDir) with a line
 *  (through linePt at lineDir). Rendering only — never affects the math. */
function intersect(linePt: Pt, lineDir: number, tDir: number): Pt {
  const lu = { x: Math.cos(lineDir * D), y: Math.sin(lineDir * D) };
  const tu = { x: Math.cos(tDir * D), y: Math.sin(tDir * D) };
  const det = lu.x * -tu.y - lu.y * -tu.x;
  if (Math.abs(det) < 1e-9) return linePt; // parallel-to-transversal guard
  const rx = ORIGIN.x - linePt.x;
  const ry = ORIGIN.y - linePt.y;
  const s = (rx * -tu.y - ry * -tu.x) / det;
  return { x: linePt.x + s * lu.x, y: linePt.y + s * lu.y };
}

/** Sample an arc (radius r) from angle a0 to a1 (degrees) about c. */
function arcPoints(c: Pt, a0: number, a1: number, r: number): [number, number][] {
  const n = 20;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D;
    pts.push([c.x + r * Math.cos(a), c.y + r * Math.sin(a)]);
  }
  return pts;
}

/** A filled wedge: the center, then the bounding arc. */
function wedge(c: Pt, a0: number, a1: number, r: number): [number, number][] {
  return [[c.x, c.y], ...arcPoints(c, a0, a1, r)];
}

/** Label position out along a wedge's bisector. */
function arcLabel(c: Pt, a0: number, a1: number, r: number): [number, number] {
  const mid = ((a0 + a1) / 2) * D;
  return [c.x + r * Math.cos(mid), c.y + r * Math.sin(mid)];
}

/** Rotate a [x,y] point `deg` degrees about center c. */
function rotPt([x, y]: [number, number], deg: number, c: Pt): [number, number] {
  const a = deg * D;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = x - c.x;
  const dy = y - c.y;
  return [c.x + cos * dx - sin * dy, c.y + sin * dx + cos * dy];
}

/** Ease-out so the half-turn decelerates gently into its landing. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

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

export function AngleExplorer({
  line1Dir = 0,
  line2Dir = 0,
  transversalDir = 60,
  className,
}: AngleExplorerProps) {
  const [tDir, setTDir] = useState(transversalDir);
  const [selected, setSelected] = useState<Slot>(1);
  const [proofT, setProofT] = useState(0); // 0 … 1 — how far the angle has swung
  const [step, setStep] = useState(0); // 0 idle; 1/2/3 = the narrated proof steps
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sliderId = useId();
  const captionId = useId();
  const reduceMotion = usePrefersReducedMotion();

  // The whole figure is derived from the control value. Each slot carries its
  // wedge fill, congruence arcs (single + the two of a double), bisector label,
  // and the direction word for its aria-label.
  const figure = useMemo(() => {
    const result = transversalAngles({ line1Dir, line2Dir, transversalDir: tDir });
    const c1 = intersect(LINE1_THROUGH, line1Dir, tDir);
    const r = [line1Dir, tDir, line1Dir + 180, tDir + 180];
    const dirs: Record<Slot, [number, number]> = {
      1: [r[0], r[1]],
      2: [r[1], r[2]],
      4: [r[2], r[3]],
      3: [r[3], r[0] + 360],
    };
    const slots = {} as Record<
      Slot,
      {
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
        wedge: wedge(c1, a0, a1, FILL_R),
        single: arcPoints(c1, a0, a1, MARK_R),
        doubleIn: arcPoints(c1, a0, a1, MARK_R - 0.09),
        doubleOut: arcPoints(c1, a0, a1, MARK_R + 0.06),
        label: arcLabel(c1, a0, a1, LABEL_R),
        word: dirWord((a0 + a1) / 2),
      };
    }
    return { result, c1, slots };
  }, [line1Dir, line2Dir, tDir]);

  const { c1, slots } = figure;
  const theta = figure.result.angles[1].measure; // θ — the {1,4} pair
  const measureOf = (id: Slot) => (id === 1 || id === 4 ? theta : 180 - theta);
  const isActive = (id: Slot) => id === selected || id === PARTNER[selected];
  const activeMeasure = measureOf(selected);
  const otherMeasure = 180 - activeMeasure;

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
    setTDir(v);
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
  const seg1 = lineSeg(LINE1_THROUGH, line1Dir);

  const caption =
    `Two lines crossed by a transversal at ${fmt(tDir)}. The selected angle and ` +
    `its opposite (single-arc) form a vertical pair, each ${fmt(activeMeasure)}; ` +
    `the other pair (double-arc) each measure ${fmt(otherMeasure)}. Vertical ` +
    `angles are always equal — a half-turn about the crossing maps one exactly ` +
    `onto the other.`;

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
                color={act ? ACTIVE_COLOR : OTHER_COLOR}
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

          {/* Two lines crossing at the centre form the vertical angles. */}
          <Line.Segment point1={seg1[0]} point2={seg1[1]} color={LINE_COLOR} />
          <Line.PointAngle
            point={[ORIGIN.x, ORIGIN.y]}
            angle={tDir * D}
            color={TRANSVERSAL_COLOR}
          />

          {/* Congruence marks — MATCHING marks mean equal: a single arc on the
              selected vertical pair, a double arc on the other pair. */}
          {SLOT_ORDER.map((id) => {
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
          })}

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
          <Point x={c1.x} y={c1.y} color={LINE_COLOR} />

          {/* Measures only — equality is shown by the matching marks + colour. */}
          {SLOT_ORDER.map((id) => {
            const s = slots[id];
            return (
              <Text
                key={`lbl-${id}`}
                x={s.label[0]}
                y={s.label[1]}
                size={isActive(id) ? 15 : 14}
                color={isActive(id) ? ACTIVE_COLOR : OTHER_COLOR}
              >
                {fmt(measureOf(id))}
              </Text>
            );
          })}
        </Mafs>
      </div>

      {/* Legend — matching marks mean equal. */}
      <div className="cbmc-legend" aria-hidden="true">
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
      </div>

      {/* The marks' non-color encoding, surfaced to the DOM for a11y/tests. */}
      <span className="cbmc-sr-only" data-cbmc-angle-pattern="single-arc" data-cbmc-angle={selected} />
      <span className="cbmc-sr-only" data-cbmc-angle-pattern="double-arc" data-cbmc-angle={PARTNER[selected]} />

      <div className="cbmc-control-row" style={{ marginTop: "0.75rem" }}>
        <label htmlFor={sliderId} className="cbmc-control-label">
          Transversal angle
        </label>
        <input
          id={sliderId}
          className="cbmc-range"
          type="range"
          min={1}
          max={179}
          step={1}
          value={tDir}
          aria-valuetext={fmt(tDir)}
          onChange={(e) => onSlider(Number(e.target.value))}
        />
        <span className="cbmc-control-value">{fmt(tDir)}</span>
      </div>

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button
          type="button"
          className="cbmc-btn"
          aria-pressed={active}
          onClick={playProof}
        >
          {active ? "Replay the half-turn" : "Show why they're equal"}
        </button>
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
        Click an angle to choose it, slide the transversal, then press “Show why”.
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
        ) : (
          <p>
            The selected angle and its opposite are a vertical pair — {fmt(activeMeasure)}{" "}
            and {fmt(activeMeasure)} — and vertical angles are always equal. The other
            pair each measure {fmt(otherMeasure)}.
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
