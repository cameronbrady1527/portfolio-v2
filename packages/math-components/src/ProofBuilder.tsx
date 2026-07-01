"use client";

/**
 * <ProofBuilder> — the Proofs unit's flagship interaction. A student meets a
 * Regents-style figure beside a two-column table and CONSTRUCTS the proof by
 * placing tiles: at Level 1 the statements are pre-printed and the student
 * supplies each reason; at Level 2 (Parsons) both statement and reason tiles
 * start shuffled and the student orders and pairs them.
 *
 * Every judgement is read from the pure engine — {@link gradeProof} on the
 * arrangement so far — never from a positional answer-key, so ANY valid
 * topological order is accepted and a step placed before its supports is nudged
 * back. The proof is built top-to-bottom: the next row is the "active" slot, a
 * candidate (statement + reason) is graded against the rows already seated, and
 * it only seats when that row's verdict is sound.
 *
 * The figure is machine-drawn from the spec (`internal/proof-figure.ts`) and
 * coordinated with the table both ways: focusing a proof row glows the angle
 * regions its text cites, and clicking an angle region highlights the rows that
 * mention it. Fully keyboard/tap operable (tile-then-slot; drag is never
 * required), reduced-motion aware, and colour-independent (icon + text, not hue
 * alone). Zero-stakes: nothing is recorded.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Coordinates, Line, Mafs, Point, Polygon, Polyline, Text } from "mafs";
import "mafs/core.css";
import {
  generateProof,
  gradeProof,
  mulberry32,
  REASON_LABELS,
  type ProofSpec,
  type ReasonId,
  type ScaffoldLevel,
} from "./logic";
import { ACCENT, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import { buildIntersectingLines } from "./internal/proof-figure";

/** A default seed so a bare <ProofBuilder /> is deterministic across SSR/CSR —
 *  never Math.random at module or render top level. */
const DEFAULT_SEED = 20250701;

/** Plausible-but-wrong reasons mixed into the bank so Level 1 is a real choice.
 *  Filtered against the proof's actual reasons, so none can collide with a
 *  correct answer; drawn from the angle-proof neighbourhood. */
const REASON_DISTRACTOR_POOL: ReasonId[] = [
  "vertical-angles",
  "def-supplementary",
  "def-linear-pair",
  "congr-supplements",
  "add-eq",
  "reflexive-eq",
];

const NUDGE_MS = 2600;

export interface ProofBuilderProps {
  /** Which registered proof family to generate from. Default "vertical-angles". */
  familyId?: string;
  /** An explicit spec to build (overrides `familyId`/`seed` generation). */
  spec?: ProofSpec;
  /** Seed for the deterministic generator + tile shuffles. Default is fixed. */
  seed?: number;
  /** Scaffold: 1 = reason-only, 2 = Parsons (order + pair). Default 1. */
  level?: ScaffoldLevel;
  className?: string;
}

/** Deterministic Fisher–Yates using a seeded stream. */
function shuffle<T>(xs: readonly T[], rng: () => number): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The angle numbers a statement's text cites, e.g. "m∠1 + m∠2 = 180°" → [1,2]. */
function anglesIn(text: string): number[] {
  const out = new Set<number>();
  const re = /∠\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.add(Number(m[1]));
  return [...out];
}

type Placed = { statementId: string; reason: ReasonId };

export function ProofBuilder({
  familyId = "vertical-angles",
  spec: specProp,
  seed = DEFAULT_SEED,
  level: levelProp,
  className,
}: ProofBuilderProps) {
  const level: ScaffoldLevel = levelProp ?? specProp?.level ?? 1;

  // Generate once per (family, level, seed). A supplied spec wins outright.
  const spec = useMemo<ProofSpec>(
    () => specProp ?? generateProof(familyId, level, mulberry32(seed)),
    [specProp, familyId, level, seed],
  );

  const statements = spec.statements;
  const total = statements.length;
  const byId = useMemo(
    () => new Map(statements.map((s) => [s.id, s])),
    [statements],
  );

  // The reason bank: every reason the proof actually uses, plus a few tempting
  // wrong ones — shuffled deterministically. Reasons are a reusable palette
  // (one reason can justify more than one step).
  const reasonBank = useMemo<ReasonId[]>(() => {
    const correct = Array.from(new Set(statements.flatMap((s) => s.reasons)));
    const extras = REASON_DISTRACTOR_POOL.filter((r) => !correct.includes(r)).slice(0, 4);
    return shuffle([...correct, ...extras], mulberry32(seed ^ 0x9e3779b9));
  }, [statements, seed]);

  // The statement bank (Level 2 only): the statement tiles, shuffled.
  const statementOrder = useMemo(
    () => shuffle(statements, mulberry32(seed ^ 0x51ed)).map((s) => s.id),
    [statements, seed],
  );

  const [placed, setPlaced] = useState<Placed[]>([]);
  const [pendingStatement, setPendingStatement] = useState<string | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [nudgeRow, setNudgeRow] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<number[]>([]);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  // Reset all interaction when the underlying proof changes.
  useEffect(() => {
    setPlaced([]);
    setPendingStatement(null);
    setNudge(null);
    setNudgeRow(null);
    setHighlight([]);
  }, [spec]);
  useEffect(() => () => {
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
  }, []);

  const done = placed.length === total;
  const activeIndex = placed.length; // the row currently being built

  // Level 1: the active row's statement is fixed (proof order). Level 2: the
  // student chooses it (pendingStatement), so it starts unset.
  const activeStatementId =
    level === 1 ? statements[activeIndex]?.id ?? null : pendingStatement;

  const placedIds = useMemo(() => new Set(placed.map((p) => p.statementId)), [placed]);
  const remainingStatements = statementOrder.filter((id) => !placedIds.has(id));

  const flashNudge = (msg: string, row: number) => {
    setNudge(msg);
    setNudgeRow(row);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => {
      setNudge(null);
      setNudgeRow(null);
    }, NUDGE_MS);
  };

  /** Grade a candidate row against the seated prefix; seat it or nudge. */
  const tryPlace = (statementId: string, reason: ReasonId) => {
    if (done) return;
    const candidate: Placed = { statementId, reason };
    const verdict = gradeProof(spec, { rows: [...placed, candidate] });
    const row = verdict.rows[placed.length];
    if (row?.ok) {
      setPlaced((p) => [...p, candidate]);
      setPendingStatement(null);
      setNudge(null);
      setNudgeRow(null);
      // Glow what the freshly-placed step is about.
      setHighlight(anglesIn(byId.get(statementId)?.text ?? ""));
      return;
    }
    // Wrong — nudge, do NOT seat. A bad reason keeps the statement in place so
    // the student can try another reason; a premature/foreign statement clears.
    const problem = row?.problem;
    if (problem === "bad-reason") {
      flashNudge("That reason doesn't justify this step — try another.", activeIndex);
    } else if (problem === "premature") {
      flashNudge(
        "Not yet — this step relies on something that hasn't been stated above it.",
        activeIndex,
      );
      setPendingStatement(null);
    } else {
      flashNudge("That doesn't belong in the proof.", activeIndex);
      setPendingStatement(null);
    }
  };

  const onPickReason = (reason: ReasonId) => {
    if (done) return;
    if (!activeStatementId) {
      flashNudge("Choose a statement for this row first.", activeIndex);
      return;
    }
    tryPlace(activeStatementId, reason);
  };

  const onPickStatement = (id: string) => {
    if (done || level === 1) return;
    setPendingStatement((cur) => (cur === id ? null : id));
    setHighlight(anglesIn(byId.get(id)?.text ?? ""));
  };

  const reset = () => {
    setPlaced([]);
    setPendingStatement(null);
    setNudge(null);
    setNudgeRow(null);
    setHighlight([]);
  };

  const focusRowAngles = (text: string) => setHighlight(anglesIn(text));
  const toggleAngle = (n: number) =>
    setHighlight((h) => (h.length === 1 && h[0] === n ? [] : [n]));

  const isRowHighlighted = (text: string) => {
    if (highlight.length === 0) return false;
    const rowAngles = anglesIn(text);
    return rowAngles.some((a) => highlight.includes(a));
  };

  // ── Figure ─────────────────────────────────────────────────────────────────
  const fig = spec.figure;
  const geom = useMemo(
    () => (fig?.kind === "intersecting-lines" ? buildIntersectingLines(fig) : null),
    [fig],
  );

  // ── Table rows model ─────────────────────────────────────────────────────────
  type RowModel = {
    key: string;
    n: number;
    statementText: string | null;
    reason: ReasonId | null;
    state: "seated" | "active" | "empty";
  };
  const rows: RowModel[] = [];
  for (let i = 0; i < total; i++) {
    const p = placed[i];
    if (p) {
      rows.push({
        key: `r-${i}`,
        n: i + 1,
        statementText: byId.get(p.statementId)?.text ?? "",
        reason: p.reason,
        state: "seated",
      });
    } else if (i === activeIndex) {
      const t =
        level === 1
          ? byId.get(statements[i].id)?.text ?? ""
          : activeStatementId
            ? byId.get(activeStatementId)?.text ?? ""
            : null;
      rows.push({ key: `r-${i}`, n: i + 1, statementText: t, reason: null, state: "active" });
    } else {
      const t = level === 1 ? byId.get(statements[i].id)?.text ?? "" : null;
      rows.push({ key: `r-${i}`, n: i + 1, statementText: t, reason: null, state: "empty" });
    }
  }

  const instruction = done
    ? "Proof complete — every step follows from the ones above it."
    : level === 1
      ? `Row ${activeIndex + 1}: choose the reason that justifies this statement.`
      : activeStatementId
        ? `Row ${activeIndex + 1}: now choose the reason that justifies it.`
        : `Row ${activeIndex + 1}: pick the next statement that follows from what's already proved, then its reason.`;

  return (
    <figure
      className={["cbmc-proof-builder", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      {/* Given / Prove header. */}
      <div className="cbmc-proof-head">
        <p style={{ margin: 0 }}>
          <strong>Given:</strong> {spec.givenText}
        </p>
        <p style={{ margin: "0.15rem 0 0" }}>
          <strong>Prove:</strong> {spec.proveText}
        </p>
      </div>

      {/* Figure — machine-drawn, coordinated with the table. */}
      {geom ? (
        <div
          className={["cbmc-graph-paper", done && "cbmc-pulse"].filter(Boolean).join(" ")}
          style={{ borderRadius: "var(--cbmc-radius, 0.5rem)", marginBottom: "0.75rem" }}
        >
          <Mafs
            viewBox={{ x: [-geom.view, geom.view], y: [-geom.view, geom.view] }}
            preserveAspectRatio="contain"
            pan={false}
            zoom={false}
          >
            <Coordinates.Cartesian
              xAxis={{ lines: 1, labels: () => "" }}
              yAxis={{ lines: 1, labels: () => "" }}
            />

            {/* Clickable / focusable angle regions. */}
            {geom.regions.map((r) => {
              const on = highlight.includes(Number(r.label));
              return (
                <Polygon
                  key={`reg-${r.label}`}
                  points={r.wedge}
                  color={on ? IMAGE : MUTED}
                  fillOpacity={on ? 0.24 : 0.07}
                  weight={on ? 1.5 : 0}
                  svgPolygonProps={{
                    tabIndex: 0,
                    role: "button",
                    "aria-pressed": on,
                    "aria-label": `Angle ${r.label}${on ? ", highlighted" : ""} — select to find it in the proof`,
                    className: "cbmc-angle-hit",
                    style: { cursor: "pointer" },
                    onClick: () => toggleAngle(Number(r.label)),
                    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                        e.preventDefault();
                        toggleAngle(Number(r.label));
                      }
                    },
                  }}
                />
              );
            })}

            {/* The two crossing lines. */}
            {geom.lines.map((seg, i) => (
              <Line.Segment
                key={`ln-${i}`}
                point1={seg[0]}
                point2={seg[1]}
                color={PREIMAGE}
              />
            ))}

            {/* Standard angle markings — a small arc per region, brightened when
                that angle is highlighted. */}
            {geom.regions.map((r) => {
              const on = highlight.includes(Number(r.label));
              return (
                <Polyline
                  key={`arc-${r.label}`}
                  points={r.arc}
                  color={on ? IMAGE : MUTED}
                  fillOpacity={0}
                  weight={on ? 2.5 : 1.5}
                />
              );
            })}

            <Point x={geom.center.x} y={geom.center.y} color={PREIMAGE} />

            {/* Region number labels. */}
            {geom.regions.map((r) => {
              const on = highlight.includes(Number(r.label));
              return (
                <Text
                  key={`lbl-${r.label}`}
                  x={r.labelPos[0]}
                  y={r.labelPos[1]}
                  size={16}
                  color={on ? ACCENT : PREIMAGE}
                >
                  {r.label}
                </Text>
              );
            })}
          </Mafs>
        </div>
      ) : null}

      {/* The two-column proof table. */}
      <table className="cbmc-proof-table">
        <thead>
          <tr>
            <th style={{ width: "56%" }}>Statements</th>
            <th>Reasons</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const hot = row.statementText ? isRowHighlighted(row.statementText) : false;
            const nudging = nudgeRow === row.n - 1 && nudge != null;
            const cls = [
              row.state === "active" && "cbmc-proof-row-active",
              row.state === "seated" && "cbmc-proof-row-seated",
              hot && "cbmc-proof-row-hot",
              nudging && !reduceMotion && "cbmc-nudge",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <tr key={row.key} className={cls || undefined}>
                <td>
                  <span className="cbmc-proof-num">{row.n}.</span>
                  {row.statementText ? (
                    <button
                      type="button"
                      className="cbmc-proof-stmt"
                      onClick={() => focusRowAngles(row.statementText!)}
                      onFocus={() => focusRowAngles(row.statementText!)}
                      aria-label={`Statement ${row.n}: ${row.statementText}. Select to highlight its angles in the figure.`}
                    >
                      {row.statementText}
                    </button>
                  ) : (
                    <span className="cbmc-proof-slot" aria-hidden="true">
                      choose a statement
                    </span>
                  )}
                </td>
                <td>
                  {row.reason ? (
                    <span className="cbmc-proof-reason-ok">
                      <span aria-hidden="true">✓ </span>
                      {REASON_LABELS[row.reason]}
                    </span>
                  ) : row.state === "active" ? (
                    <span className="cbmc-proof-slot" aria-hidden="true">
                      choose a reason
                    </span>
                  ) : (
                    <span className="cbmc-proof-slot" aria-hidden="true">
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="cbmc-instruction" style={{ marginTop: "0.75rem" }}>
        {instruction}
      </p>

      {/* Statement bank (Level 2). */}
      {level === 2 && !done ? (
        <div role="group" aria-label="Statement tiles">
          <p className="cbmc-group-label" style={{ margin: "0.25rem 0" }}>
            Statements
          </p>
          <div className="cbmc-controls">
            {remainingStatements.map((id) => {
              const s = byId.get(id)!;
              const picked = pendingStatement === id;
              return (
                <button
                  key={id}
                  type="button"
                  className={["cbmc-chip", picked && "cbmc-chip-found"].filter(Boolean).join(" ")}
                  aria-pressed={picked}
                  onClick={() => onPickStatement(id)}
                  onFocus={() => setHighlight(anglesIn(s.text))}
                >
                  {s.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Reason bank (both levels). */}
      {!done ? (
        <div role="group" aria-label="Reason tiles">
          <p className="cbmc-group-label" style={{ margin: "0.5rem 0 0.25rem" }}>
            Reasons
          </p>
          <div className="cbmc-controls">
            {reasonBank.map((r) => (
              <button
                key={r}
                type="button"
                className="cbmc-chip"
                onClick={() => onPickReason(r)}
              >
                {REASON_LABELS[r]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Live feedback — nudges + completion, announced politely. */}
      <div
        role="status"
        aria-live="polite"
        style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}
      >
        {done ? (
          <p style={{ fontWeight: 600, color: "var(--cbmc-accent, #176844)" }}>
            <span aria-hidden="true">✓ </span>
            You built the whole proof — {spec.proveText}. Every row is justified by
            the reason you chose and follows from the steps above it.
          </p>
        ) : nudge ? (
          <p style={{ color: "var(--cbmc-muted, #6b6353)" }}>
            <span aria-hidden="true">↻ </span>
            {nudge}
          </p>
        ) : (
          <p style={{ color: "var(--cbmc-muted, #6b6353)" }}>
            Placed {placed.length} of {total} steps.
          </p>
        )}
      </div>

      {/* Machine-sourced state, surfaced for AT / tests. */}
      <span
        className="cbmc-sr-only"
        data-cbmc-proof-complete={done ? "true" : "false"}
        data-cbmc-seated-count={placed.length}
        data-cbmc-highlight={highlight.join(",")}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="cbmc-btn" onClick={reset}>
          Start over
        </button>
      </div>

      <figcaption
        id={captionId}
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--cbmc-caption-color, #43564b)",
        }}
      >
        Two lines cross, forming the numbered angles shown. Build a two-column proof
        that {spec.proveText}: {level === 1
          ? "each statement is given in order and you supply the reason that justifies it"
          : "place the statements in a valid order and pair each with its reason"}
        . Each row is checked against the logic of the proof, so only a step that
        genuinely follows will seat.
      </figcaption>
    </figure>
  );
}
