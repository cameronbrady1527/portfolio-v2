"use client";

/**
 * <ProofBuilder> — the Proofs unit's flagship interaction. A student meets a
 * Regents-style figure beside a two-column table and CONSTRUCTS the proof by
 * placing tiles. The scaffold DIAL fades support as the student succeeds:
 *
 *   • Level 1 — statements pre-printed in order; supply each reason.
 *   • Level 2 — Parsons: order the statements AND pair each with its reason.
 *   • Level 3 — same, but the banks now include plausible DISTRACTOR tiles
 *     (statements the proof never makes); a distractor is rejected on placement.
 *   • Level 4 (mastery) — full bank, minimal scaffold: the coordinated figure
 *     highlight turns OFF and feedback goes HOLISTIC — assemble the whole proof
 *     (rows seat without per-row gating), press Submit, get one verdict against
 *     the full DAG with the wrong rows flagged; retry is allowed. A clean pass
 *     marks the family "comfortable".
 *
 * Every judgement is read from the pure engine — {@link gradeProof} on the
 * arrangement — never from a positional answer-key, so ANY valid topological
 * order is accepted. Within a practice set the difficulty AUTO-FADES: two clean
 * completions at a level advance the next generated proof (fresh seed) to the
 * level above, until the unaided Level-4 experience.
 *
 * The figure is machine-drawn from the spec (`internal/proof-figure.ts`) and
 * (below Level 4) coordinated with the table both ways. Fully keyboard/tap
 * operable (tile-then-slot; drag is never required), reduced-motion aware, and
 * colour-independent. The component itself records NOTHING — persistence is the
 * host's job, wired through {@link ProofBuilderProps.onProgressChange} /
 * {@link ProofBuilderProps.onStartOver}, so the published package stays pure.
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
  type ProofVerdict,
  type ReasonId,
  type ScaffoldLevel,
} from "./logic";
import { ACCENT, IMAGE, MUTED, PREIMAGE } from "./internal/colors";
import { usePrefersReducedMotion } from "./internal/usePrefersReducedMotion";
import {
  buildIntersectingLines,
  buildTrianglePair,
  // --- points-on-line / rays-from-point figures (segment/angle-addition) ---
  buildPointsOnLine,
  buildRaysFromPoint,
  segmentKey,
  angleKey,
} from "./internal/proof-figure";
import { wedge } from "./internal/geometry";
import { MathText } from "./internal/mathText";
import { VertexLabels } from "./VertexLabels";

/** A default seed so a bare <ProofBuilder /> is deterministic across SSR/CSR —
 *  never Math.random at module or render top level. */
const DEFAULT_SEED = 20250701;

/** Clean completions at a level before the next generated proof fades one step. */
const COMPLETIONS_TO_ADVANCE = 2;

/** Odd stride so each generated proof in a set draws a distinct seed. */
const SEED_STRIDE = 0x9e3779b9;

/** Plausible-but-wrong reasons mixed into the bank so even Level 1 is a real
 *  choice. Filtered against the proof's actual reasons, so none can collide with
 *  a correct answer; drawn from the angle-proof neighbourhood. */
const REASON_DISTRACTOR_POOL: ReasonId[] = [
  "vertical-angles",
  "def-supplementary",
  "def-linear-pair",
  "congr-supplements",
  "add-eq",
  "reflexive-eq",
];

/** For triangle-congruence proofs, tempting wrong reasons live in the criterion
 *  neighbourhood (a rival criterion, a property that doesn't apply here). */
const TRIANGLE_REASON_DISTRACTOR_POOL: ReasonId[] = [
  "aas",
  "hl",
  "sss",
  "sas",
  "asa",
  "reflexive-congr",
  "all-right-angles-congr",
  "def-congr-segments",
];

/** Reasons that only ever appear in a triangle-congruence proof. */
const TRIANGLE_REASONS: ReasonId[] = ["sss", "sas", "asa", "aas", "hl", "cpctc"];

const NUDGE_MS = 2600;

/** A snapshot of the family's fade/mastery state, emitted for the host to persist. */
export interface ProofProgressSnapshot {
  /** The scaffold level of the proof now on screen. */
  level: ScaffoldLevel;
  /** Clean completions banked at that level (toward the next fade step). */
  completions: number;
  /** Set once a clean pass lands at the minimal scaffold (Level 4). */
  comfortable: boolean;
}

export interface ProofBuilderProps {
  /** Which registered proof family to generate from. Default "vertical-angles". */
  familyId?: string;
  /** A pool of family ids to INTERLEAVE: each generated proof (initial + every
   *  "Next proof") is drawn from the pool by seed, so the student meets a random
   *  proof type each round — the anti-gaming, strategy-selection drill. Overrides
   *  `familyId` when non-empty. */
  familyPool?: string[];
  /** An explicit spec to build (overrides `familyId`/`familyPool`/fade generation). */
  spec?: ProofSpec;
  /** Seed for the deterministic generator + tile shuffles. Default is fixed. */
  seed?: number;
  /** STARTING scaffold level (1–4); the fade may advance from here. Default 1. */
  level?: ScaffoldLevel;
  /** A single, illustrative proof: no fade, no "Next proof", no progress emitted.
   *  For a fixed `spec` embedded in content (e.g. worked proofs), not a drill. */
  fixed?: boolean;
  className?: string;
  /** Hydration: clean completions already banked at the starting level. */
  initialCompletions?: number;
  /** Hydration: this family has already reached mastery. */
  initialComfortable?: boolean;
  /** Fired (in an event handler, never during render) when the fade pointer,
   *  completion count, or comfortable flag changes — the host persists it. */
  onProgressChange?: (snapshot: ProofProgressSnapshot) => void;
  /** Fired when the student presses "Start over" — the host clears this family. */
  onStartOver?: () => void;
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

/** The vertex-letter labels a statement cites that belong to the figure (used to
 *  coordinate highlighting for the triangle-pair figure). Only letters in `known`
 *  count, so ordinary prose in a statement never lights the figure up. */
function lettersIn(text: string, known: Set<string>): string[] {
  const out = new Set<string>();
  for (const ch of text) if (known.has(ch)) out.add(ch);
  return [...out];
}

/** The named parts a statement cites, for the points-on-line / rays figures:
 *  two-letter segments ("AB", "AC") and three-letter angles ("∠ABD"), each as a
 *  canonical, order-independent key so it matches the figure's parts. Segment
 *  and angle keys never collide (2 vs 3 chars). */
function partsIn(text: string): string[] {
  const out = new Set<string>();
  const seg = /\b([A-Z])([A-Z])\b/g;
  let m: RegExpExecArray | null;
  while ((m = seg.exec(text)) !== null) out.add(segmentKey(m[1], m[2]));
  const ang = /∠\s*([A-Z])([A-Z])([A-Z])/g;
  while ((m = ang.exec(text)) !== null) out.add(angleKey(m[1], m[2], m[3]));
  return [...out];
}

type Placed = { statementId: string; reason: ReasonId };

/** The current generation: which proof (level + seed) is on screen. Only changes
 *  when we deliberately produce a new proof (Next / fade / hydration / reset). */
type Generation = { level: ScaffoldLevel; seed: number };

export function ProofBuilder({
  familyId = "vertical-angles",
  familyPool,
  spec: specProp,
  seed = DEFAULT_SEED,
  level: levelProp,
  fixed = false,
  className,
  initialCompletions = 0,
  initialComfortable = false,
  onProgressChange,
  onStartOver,
}: ProofBuilderProps) {
  const startLevel: ScaffoldLevel = levelProp ?? specProp?.level ?? 1;

  // The proof currently displayed. The fade pointer lives in `completions`; the
  // level here is the level of THIS proof (drives gating/highlight/banks).
  const [gen, setGen] = useState<Generation>(() => ({ level: startLevel, seed }));
  const [completions, setCompletions] = useState(initialCompletions);
  const [comfortable, setComfortable] = useState(initialComfortable);

  const curLevel = gen.level;
  const gated = curLevel <= 3; // per-row correctness gating on placement
  const highlightOn = curLevel <= 3; // coordinated figure ↔ table highlight
  const holistic = curLevel >= 4; // assemble-then-Submit, whole-DAG verdict

  // Generate once per (family, level, seed). A supplied spec wins outright; a
  // non-empty `familyPool` interleaves — the family is drawn from the pool by an
  // independent hash of the seed, so consecutive proofs vary in type.
  const spec = useMemo<ProofSpec>(() => {
    if (specProp) return specProp;
    const pool = familyPool && familyPool.length > 0 ? familyPool : null;
    const fam = pool
      ? pool[Math.floor(mulberry32((gen.seed ^ 0x85ebca6b) >>> 0)() * pool.length)]
      : familyId;
    return generateProof(fam, gen.level, mulberry32(gen.seed));
  }, [specProp, familyPool, familyId, gen.level, gen.seed]);

  const statements = spec.statements;
  const distractors = useMemo(() => spec.distractors ?? [], [spec]);
  const total = statements.length;
  const byId = useMemo(() => new Map(statements.map((s) => [s.id, s])), [statements]);

  // Vertex letters the triangle-pair figure knows about (empty for other figures)
  // — the alphabet the letter-based coordinated highlight matches against.
  const figLetters = useMemo(() => {
    const f = spec.figure;
    return f?.kind === "triangle-pair" ? new Set(f.labels.flat()) : new Set<string>();
  }, [spec]);

  // Text for any placeable tile — real statements AND distractors (level ≥ 3).
  // `textById` is the plain form (matching, aria, fallback); `texById` is the
  // `$…$` display form rendered by <MathText> (falls back to plain when unset).
  const textById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of statements) m.set(s.id, s.text);
    for (const d of distractors) m.set(d.id, d.text);
    return m;
  }, [statements, distractors]);

  const texById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of statements) m.set(s.id, s.tex ?? s.text);
    for (const d of distractors) m.set(d.id, d.tex ?? d.text);
    return m;
  }, [statements, distractors]);

  // The reason bank: every reason the proof uses, the distractors' reasons
  // (level ≥ 3), and a few tempting wrong ones — shuffled deterministically.
  const reasonBank = useMemo<ReasonId[]>(() => {
    const correct = Array.from(new Set(statements.flatMap((s) => s.reasons)));
    const distractorReasons = distractors
      .map((d) => d.reason)
      .filter((r): r is ReasonId => r != null);
    // Draw the wrong-reason tiles from the neighbourhood the proof lives in.
    const isTriangle = correct.some((r) => TRIANGLE_REASONS.includes(r));
    const pool = isTriangle ? TRIANGLE_REASON_DISTRACTOR_POOL : REASON_DISTRACTOR_POOL;
    const extras = pool.filter((r) => !correct.includes(r)).slice(0, 4);
    const all = Array.from(new Set([...correct, ...distractorReasons, ...extras]));
    return shuffle(all, mulberry32(gen.seed ^ SEED_STRIDE));
  }, [statements, distractors, gen.seed]);

  // The statement bank (levels ≥ 2): statement tiles plus any distractor tiles,
  // shuffled together so a distractor is not obviously "the extra one".
  const statementOrder = useMemo(
    () =>
      shuffle(
        [...statements.map((s) => s.id), ...distractors.map((d) => d.id)],
        mulberry32(gen.seed ^ 0x51ed),
      ),
    [statements, distractors, gen.seed],
  );

  const [placed, setPlaced] = useState<Placed[]>([]);
  const [pendingStatement, setPendingStatement] = useState<string | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [nudgeRow, setNudgeRow] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<number[]>([]);
  // Letter-based highlight (triangle-pair figure) + part-key highlight
  // (points-on-line / rays-from-point figures). Kept beside the numeric angle
  // highlight so no figure kind disturbs another.
  const [hlLetters, setHlLetters] = useState<string[]>([]);
  const [partHl, setPartHl] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<ProofVerdict | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const captionId = useId();

  // Reset the interaction whenever the underlying proof changes (a new
  // generation). Fade/mastery state (completions, comfortable, flash) is NOT
  // touched here — only the per-proof working state.
  useEffect(() => {
    setPlaced([]);
    setPendingStatement(null);
    setNudge(null);
    setNudgeRow(null);
    setHighlight([]);
    setHlLetters([]);
    setPartHl([]);
    setSubmitted(null);
  }, [spec]);
  useEffect(
    () => () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    },
    [],
  );

  const filled = placed.length === total; // every slot has a tile
  const done = holistic ? submitted?.ok === true : filled; // "proof stands"
  const activeIndex = placed.length; // the row currently being built

  // Level 1: the active row's statement is fixed (proof order). Levels ≥ 2: the
  // student chooses it (pendingStatement), so it starts unset.
  const activeStatementId =
    curLevel === 1 ? statements[activeIndex]?.id ?? null : pendingStatement;

  const placedIds = useMemo(() => new Set(placed.map((p) => p.statementId)), [placed]);
  const remainingStatements = statementOrder.filter((id) => !placedIds.has(id));

  const clearNudge = () => {
    setNudge(null);
    setNudgeRow(null);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
  };
  const flashNudge = (msg: string, row: number) => {
    setNudge(msg);
    setNudgeRow(row);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => {
      setNudge(null);
      setNudgeRow(null);
    }, NUDGE_MS);
  };

  // Coordinated figure ↔ table highlight — glow the parts a piece of text cites
  // in WHICHEVER figure kind is on screen: angle numbers (intersecting-lines),
  // vertex letters (triangle-pair), or segment/angle part-keys (points-on-line /
  // rays-from-point). No-op above the guided levels, where highlight is off.
  const focusAll = (text: string) => {
    if (!highlightOn) return;
    setHighlight(anglesIn(text));
    setHlLetters(lettersIn(text, figLetters));
    setPartHl(partsIn(text));
  };

  const notify = (snapshot: ProofProgressSnapshot) => onProgressChange?.(snapshot);

  // A clean completion of the CURRENT proof. Below Level 4 it banks a completion
  // toward the fade; at Level 4 a clean pass is mastery ("comfortable").
  const registerCompletion = () => {
    // A fixed, illustrative proof is terminal: no fade, no nudge, no persistence
    // (the `done` instruction already reads "Proof complete — every step…").
    if (fixed) {
      setFlash(null);
      return;
    }
    if (holistic) {
      setComfortable(true);
      setFlash(null);
      notify({ level: curLevel, completions, comfortable: true });
      return;
    }
    const next = completions + 1;
    setCompletions(next);
    setFlash(
      next >= COMPLETIONS_TO_ADVANCE && curLevel < 4
        ? "Proof complete — you've got this level. The next one eases the support off."
        : "Proof complete. Here's the next step: press “Next proof” to keep going.",
    );
    notify({ level: curLevel, completions: next, comfortable });
  };

  /** Grade a candidate row against the seated prefix; seat it or nudge. At Level
   *  4 (holistic) a row seats unconditionally — correctness is judged on Submit. */
  const tryPlace = (statementId: string, reason: ReasonId) => {
    if (filled) return;
    setFlash(null);
    const candidate: Placed = { statementId, reason };

    if (!gated) {
      // Holistic: seat locally, no per-row correctness feedback.
      setPlaced((p) => [...p, candidate]);
      setPendingStatement(null);
      clearNudge();
      return;
    }

    const verdict = gradeProof(spec, { rows: [...placed, candidate] });
    const row = verdict.rows[placed.length];
    if (row?.ok) {
      const newPlaced = [...placed, candidate];
      setPlaced(newPlaced);
      setPendingStatement(null);
      clearNudge();
      focusAll(textById.get(statementId) ?? "");
      if (newPlaced.length === total) registerCompletion();
      return;
    }
    // Wrong — nudge, do NOT seat.
    const problem = row?.problem;
    if (problem === "bad-reason") {
      flashNudge("That reason doesn't justify this step — try another.", activeIndex);
    } else if (problem === "premature") {
      flashNudge(
        "Not yet — this step relies on something that hasn't been stated above it.",
        activeIndex,
      );
      setPendingStatement(null);
    } else if (problem === "distractor") {
      flashNudge(
        "That statement isn't part of this proof — it doesn't follow from the givens.",
        activeIndex,
      );
      setPendingStatement(null);
    } else {
      flashNudge("That doesn't belong in the proof.", activeIndex);
      setPendingStatement(null);
    }
  };

  const onPickReason = (reason: ReasonId) => {
    if (filled) return;
    if (!activeStatementId) {
      flashNudge("Choose a statement for this row first.", activeIndex);
      return;
    }
    tryPlace(activeStatementId, reason);
  };

  const onPickStatement = (id: string) => {
    if (filled || curLevel === 1) return;
    setPendingStatement((cur) => (cur === id ? null : id));
    focusAll(textById.get(id) ?? "");
  };

  // Level 4: one verdict against the whole DAG. A clean pass is mastery; wrong
  // rows are flagged and the student may retry.
  const submit = () => {
    const verdict = gradeProof(spec, { rows: placed });
    setSubmitted(verdict);
    if (verdict.ok) registerCompletion();
    else
      setFlash(
        "Not quite — the flagged rows don't hold up. Fix them from the first one down and submit again.",
      );
  };

  // Retry after a failed Submit: keep the sound prefix, clear from the first
  // wrong row so the student re-places from their first mistake.
  const retry = () => {
    if (!submitted) return;
    const firstWrong = submitted.rows.find((r) => !r.ok)?.index ?? placed.length;
    setPlaced((p) => p.slice(0, firstWrong));
    setSubmitted(null);
    setPendingStatement(null);
    setFlash(null);
    clearNudge();
  };

  // Produce the next proof in the practice set, fading one level if enough clean
  // completions have banked at the current level.
  const nextProof = () => {
    let level = gen.level;
    if (completions >= COMPLETIONS_TO_ADVANCE && level < 4) {
      level = (level + 1) as ScaffoldLevel;
      setCompletions(0);
    }
    const nextSeed = (gen.seed + SEED_STRIDE) | 0;
    setGen({ level, seed: nextSeed });
    setFlash(null);
    notify({
      level,
      completions: completions >= COMPLETIONS_TO_ADVANCE && level < 4 ? 0 : completions,
      comfortable,
    });
  };

  // Start over — clears THIS family's state back to the starting scaffold.
  const reset = () => {
    setPlaced([]);
    setPendingStatement(null);
    clearNudge();
    setHighlight([]);
    setHlLetters([]);
    setPartHl([]);
    setSubmitted(null);
    setFlash(null);
    setCompletions(0);
    setComfortable(false);
    setGen({ level: startLevel, seed });
    onStartOver?.();
  };

  const focusRowAngles = (text: string) => focusAll(text);
  const toggleAngle = (n: number) => {
    if (!highlightOn) return;
    setHighlight((h) => (h.length === 1 && h[0] === n ? [] : [n]));
  };
  // Toggle a single vertex letter (triangle-pair figure → table).
  const toggleLetter = (letter: string) => {
    if (!highlightOn) return;
    setHlLetters((h) => (h.length === 1 && h[0] === letter ? [] : [letter]));
  };
  // Toggle a segment/angle part-key (points-on-line / rays figure → table).
  const togglePart = (key: string) => {
    if (!highlightOn) return;
    setPartHl((h) => (h.length === 1 && h[0] === key ? [] : [key]));
  };

  const isRowHighlighted = (text: string) => {
    if (highlight.length > 0 && anglesIn(text).some((a) => highlight.includes(a))) return true;
    if (hlLetters.length > 0 && lettersIn(text, figLetters).some((l) => hlLetters.includes(l)))
      return true;
    if (partHl.length > 0 && partsIn(text).some((k) => partHl.includes(k))) return true;
    return false;
  };

  // ── Figure ─────────────────────────────────────────────────────────────────
  const fig = spec.figure;
  const geom = useMemo(
    () => (fig?.kind === "intersecting-lines" ? buildIntersectingLines(fig) : null),
    [fig],
  );
  // --- triangle-pair figure (congruence-cpctc) ---
  const triGeom = useMemo(
    () => (fig?.kind === "triangle-pair" ? buildTrianglePair(fig) : null),
    [fig],
  );
  // --- points-on-line / rays-from-point figures (segment/angle-addition) ---
  const geomLine = useMemo(
    () => (fig?.kind === "points-on-line" ? buildPointsOnLine(fig) : null),
    [fig],
  );
  const geomRays = useMemo(
    () => (fig?.kind === "rays-from-point" ? buildRaysFromPoint(fig) : null),
    [fig],
  );

  // ── Table rows model ─────────────────────────────────────────────────────────
  const wrongRows = useMemo(
    () => (submitted ? submitted.rows.filter((r) => !r.ok).map((r) => r.index) : []),
    [submitted],
  );

  type RowVerdictKind = "ok" | "wrong" | "placed";
  type RowModel = {
    key: string;
    n: number;
    statementText: string | null;
    /** Display form for the statement, mirroring `statementText` (null when the
     *  row shows no statement yet). */
    statementTex: string | null;
    reason: ReasonId | null;
    state: "seated" | "active" | "empty";
    verdict: RowVerdictKind | null;
  };
  const rows: RowModel[] = [];
  for (let i = 0; i < total; i++) {
    const p = placed[i];
    if (p) {
      // A seated row's verdict: gated levels are green-on-seat; holistic rows are
      // neutral until Submit, then ✓ / ✕.
      let verdict: RowVerdictKind;
      if (!holistic) verdict = "ok";
      else if (!submitted) verdict = "placed";
      else verdict = wrongRows.includes(i) ? "wrong" : "ok";
      rows.push({
        key: `r-${i}`,
        n: i + 1,
        statementText: textById.get(p.statementId) ?? "",
        statementTex: texById.get(p.statementId) ?? "",
        reason: p.reason,
        state: "seated",
        verdict,
      });
    } else if (i === activeIndex) {
      const id = curLevel === 1 ? statements[i].id : activeStatementId;
      const t = id ? textById.get(id) ?? "" : null;
      const tex = id ? texById.get(id) ?? "" : null;
      rows.push({ key: `r-${i}`, n: i + 1, statementText: t, statementTex: tex, reason: null, state: "active", verdict: null });
    } else {
      const id = curLevel === 1 ? statements[i].id : null;
      const t = id ? textById.get(id) ?? "" : null;
      const tex = id ? texById.get(id) ?? "" : null;
      rows.push({ key: `r-${i}`, n: i + 1, statementText: t, statementTex: tex, reason: null, state: "empty", verdict: null });
    }
  }

  const instruction = done
    ? holistic
      ? "Proof complete — you assembled the whole argument and every row holds up."
      : "Proof complete — every step follows from the ones above it."
    : holistic
      ? filled
        ? "Every row is filled — press Submit to check the whole proof at once."
        : activeStatementId
          ? `Row ${activeIndex + 1}: choose the reason, then keep building. Nothing is checked until you Submit.`
          : `Row ${activeIndex + 1}: pick a statement, then its reason. Assemble the whole proof, then Submit.`
      : curLevel === 1
        ? `Row ${activeIndex + 1}: choose the reason that justifies this statement.`
        : activeStatementId
          ? `Row ${activeIndex + 1}: now choose the reason that justifies it.`
          : `Row ${activeIndex + 1}: pick the next statement that follows from what's already proved, then its reason.`;

  const showStatementBank = curLevel >= 2 && !filled;
  const showBanks = !filled;

  return (
    <figure
      className={["cbmc-proof-builder", className].filter(Boolean).join(" ")}
      style={{ margin: 0 }}
      aria-describedby={captionId}
    >
      {/* Given / Prove header. */}
      <div className="cbmc-proof-head">
        <p style={{ margin: 0 }}>
          <strong>Given:</strong> <MathText source={spec.givenText} />
        </p>
        <p style={{ margin: "0.15rem 0 0" }}>
          <strong>Prove:</strong> <MathText source={spec.proveText} />
        </p>
      </div>

      {/* Figure — machine-drawn. Coordinated with the table below Level 4; at
          Level 4 it is a plain reference (no highlight). */}
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

            {/* Angle regions — clickable/focusable only while highlight is on. */}
            {geom.regions.map((r) => {
              const on = highlightOn && highlight.includes(Number(r.label));
              return (
                <Polygon
                  key={`reg-${r.label}`}
                  points={r.wedge}
                  color={on ? IMAGE : MUTED}
                  fillOpacity={on ? 0.24 : 0.07}
                  weight={on ? 1.5 : 0}
                  svgPolygonProps={
                    highlightOn
                      ? {
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
                        }
                      : { "aria-hidden": true }
                  }
                />
              );
            })}

            {/* The two crossing lines. */}
            {geom.lines.map((seg, i) => (
              <Line.Segment key={`ln-${i}`} point1={seg[0]} point2={seg[1]} color={PREIMAGE} />
            ))}

            {/* Standard angle markings — a small arc per region. */}
            {geom.regions.map((r) => {
              const on = highlightOn && highlight.includes(Number(r.label));
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
              const on = highlightOn && highlight.includes(Number(r.label));
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

      {/* --- triangle-pair figure (congruence-cpctc) --- */}
      {triGeom ? (
        <div
          className={["cbmc-graph-paper", done && "cbmc-pulse"].filter(Boolean).join(" ")}
          style={{ borderRadius: "var(--cbmc-radius, 0.5rem)", marginBottom: "0.75rem" }}
        >
          <Mafs
            viewBox={{ x: triGeom.bounds.x, y: triGeom.bounds.y }}
            preserveAspectRatio="contain"
            pan={false}
            zoom={false}
          >
            {/* No coordinate axes — a triangle pair reads as a blank-background
                Regents diagram, not a figure sitting on the plane. */}

            {/* Triangle bodies + every edge as its own segment, so any side (even
                an unmarked goal side) can glow when its row is focused. */}
            {triGeom.triangles.map((t, ti) => {
              const litBody = t.labels.every((l) => hlLetters.includes(l));
              return (
                <Polygon
                  key={`body-${ti}`}
                  points={t.verts.map((p) => [p.x, p.y] as [number, number])}
                  color={litBody ? IMAGE : PREIMAGE}
                  fillOpacity={litBody ? 0.14 : 0.04}
                  weight={0}
                  svgPolygonProps={{ style: { pointerEvents: "none" } }}
                />
              );
            })}
            {triGeom.triangles.flatMap((t, ti) =>
              ([[0, 1], [1, 2], [2, 0]] as [number, number][]).map(([i, j]) => {
                const lit = hlLetters.includes(t.labels[i]) && hlLetters.includes(t.labels[j]);
                return (
                  <Polyline
                    key={`edge-${ti}-${i}${j}`}
                    points={[
                      [t.verts[i].x, t.verts[i].y],
                      [t.verts[j].x, t.verts[j].y],
                    ]}
                    color={lit ? IMAGE : PREIMAGE}
                    fillOpacity={0}
                    weight={lit ? 4 : 2}
                  />
                );
              }),
            )}

            {/* Congruent-angle arcs. */}
            {triGeom.angleMarks.map((m, k) => {
              const lit = hlLetters.includes(m.letter);
              return m.arcs.map((arc, ai) => (
                <Polyline
                  key={`ang-${k}-${ai}`}
                  points={arc}
                  color={lit ? IMAGE : PREIMAGE}
                  fillOpacity={0}
                  weight={lit ? 3 : 2}
                />
              ));
            })}

            {/* Right-angle squares. */}
            {triGeom.rightMarks.map((m, k) => {
              const lit = hlLetters.includes(m.letter);
              return (
                <Polyline
                  key={`right-${k}`}
                  points={m.square}
                  color={lit ? IMAGE : PREIMAGE}
                  fillOpacity={0}
                  weight={lit ? 3 : 1.8}
                />
              );
            })}

            {/* Congruent-side tick marks. */}
            {triGeom.sideMarks.map((m, k) => {
              const lit = m.letters.every((l) => hlLetters.includes(l));
              return m.ticks.map((seg, si) => (
                <Polyline
                  key={`tick-${k}-${si}`}
                  points={seg}
                  color={lit ? IMAGE : PREIMAGE}
                  fillOpacity={0}
                  weight={lit ? 3 : 2}
                />
              ));
            })}

            {/* Clickable / focusable vertices — select one to find it in the proof. */}
            {triGeom.triangles.flatMap((t, ti) =>
              t.verts.map((v, vi) => {
                const letter = t.labels[vi];
                const on = hlLetters.includes(letter);
                const r = 0.34;
                const diamond: [number, number][] = [
                  [v.x, v.y + r],
                  [v.x + r, v.y],
                  [v.x, v.y - r],
                  [v.x - r, v.y],
                ];
                return (
                  <Polygon
                    key={`vtx-${ti}-${vi}`}
                    points={diamond}
                    color={on ? IMAGE : MUTED}
                    fillOpacity={on ? 0.3 : 0}
                    weight={on ? 1.5 : 0}
                    svgPolygonProps={{
                      tabIndex: 0,
                      role: "button",
                      "aria-pressed": on,
                      "aria-label": `Vertex ${letter}${on ? ", highlighted" : ""} — select to find it in the proof`,
                      className: "cbmc-angle-hit",
                      style: { cursor: "pointer" },
                      onClick: () => toggleLetter(letter),
                      onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                          e.preventDefault();
                          toggleLetter(letter);
                        }
                      },
                    }}
                  />
                );
              }),
            )}
            {triGeom.triangles.map((t, ti) => (
              <VertexLabels
                key={`vl-${ti}`}
                vertices={t.verts}
                label={t.labels.join("")}
                color={PREIMAGE}
              />
            ))}
          </Mafs>
        </div>
      ) : null}

      {/* --- points-on-line figure (segment-addition family) --- */}
      {geomLine ? (
        <div
          className={["cbmc-graph-paper", done && "cbmc-pulse"].filter(Boolean).join(" ")}
          style={{ borderRadius: "var(--cbmc-radius, 0.5rem)", marginBottom: "0.75rem" }}
        >
          <Mafs
            viewBox={{ x: [-geomLine.view, geomLine.view], y: [-geomLine.view, geomLine.view] }}
            preserveAspectRatio="contain"
            pan={false}
            zoom={false}
          >
            {/* the collinear line */}
            <Polyline points={geomLine.line} color={PREIMAGE} weight={2} fillOpacity={0} />

            {/* glow the sub-segments the focused row cites */}
            {partHl
              .filter((k) => k.length === 2 && geomLine.coordOf[k[0]] && geomLine.coordOf[k[1]])
              .map((k) => (
                <Polyline
                  key={`seg-hl-${k}`}
                  points={[geomLine.coordOf[k[0]], geomLine.coordOf[k[1]]]}
                  color={IMAGE}
                  weight={7}
                  fillOpacity={0}
                  svgPolylineProps={{ strokeOpacity: 0.4, strokeLinecap: "round" }}
                />
              ))}

            {/* congruence tick marks */}
            {geomLine.ticks.flatMap((g) => {
              const on = partHl.includes(g.key);
              return g.segs.map((s, i) => (
                <Polyline
                  key={`tick-${g.key}-${i}`}
                  points={s}
                  color={on ? IMAGE : PREIMAGE}
                  weight={on ? 3 : 2}
                  fillOpacity={0}
                />
              ));
            })}

            {/* the points */}
            {geomLine.points.map((p) => (
              <Point key={`pt-${p.label}`} x={p.pt[0]} y={p.pt[1]} color={PREIMAGE} />
            ))}

            {/* point labels, accented when part of a cited segment */}
            {geomLine.points.map((p) => {
              const lit = partHl.some((k) => k.length === 2 && (k[0] === p.label || k[1] === p.label));
              return (
                <Text
                  key={`lbl-${p.label}`}
                  x={p.labelPt[0]}
                  y={p.labelPt[1]}
                  size={18}
                  color={lit ? ACCENT : PREIMAGE}
                >
                  {p.label}
                </Text>
              );
            })}

            {/* transparent clickable band per marked segment (figure → table) */}
            {geomLine.ticks.map((g) => {
              const on = partHl.includes(g.key);
              return (
                <Polyline
                  key={`tick-hit-${g.key}`}
                  points={[geomLine.coordOf[g.a], geomLine.coordOf[g.b]]}
                  color={IMAGE}
                  weight={16}
                  fillOpacity={0}
                  svgPolylineProps={{
                    strokeOpacity: 0,
                    tabIndex: 0,
                    role: "button",
                    "aria-pressed": on,
                    "aria-label": `Segment ${g.a}${g.b}${on ? ", highlighted" : ""} — select to find it in the proof`,
                    className: "cbmc-angle-hit",
                    style: { cursor: "pointer", pointerEvents: "all" },
                    onClick: () => togglePart(g.key),
                    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                        e.preventDefault();
                        togglePart(g.key);
                      }
                    },
                  }}
                />
              );
            })}
          </Mafs>
        </div>
      ) : null}

      {/* --- rays-from-point figure (angle-addition family) --- */}
      {geomRays ? (
        <div
          className={["cbmc-graph-paper", done && "cbmc-pulse"].filter(Boolean).join(" ")}
          style={{ borderRadius: "var(--cbmc-radius, 0.5rem)", marginBottom: "0.75rem" }}
        >
          <Mafs
            viewBox={{ x: [-geomRays.view, geomRays.view], y: [-geomRays.view, geomRays.view] }}
            preserveAspectRatio="contain"
            pan={false}
            zoom={false}
          >
            {/* glow the cited angle wedges (handles overlapping/unmarked angles too) */}
            {partHl
              .filter(
                (k) =>
                  k.length === 3 &&
                  k[1] === geomRays.vertexLabel &&
                  geomRays.dirOf[k[0]] != null &&
                  geomRays.dirOf[k[2]] != null,
              )
              .map((k) => {
                const d0 = geomRays.dirOf[k[0]];
                const d2 = geomRays.dirOf[k[2]];
                const c = { x: geomRays.vertex[0], y: geomRays.vertex[1] };
                return (
                  <Polygon
                    key={`ang-hl-${k}`}
                    points={wedge(c, Math.min(d0, d2), Math.max(d0, d2), 1.3)}
                    color={IMAGE}
                    fillOpacity={0.22}
                    weight={0}
                  />
                );
              })}

            {/* the rays */}
            {geomRays.rays.map((r) => (
              <Line.Segment key={`ray-${r.label}`} point1={geomRays.vertex} point2={r.pt} color={PREIMAGE} />
            ))}

            {/* congruence arcs */}
            {geomRays.arcs.flatMap((g) => {
              const on = partHl.includes(g.key);
              return g.polylines.map((pl, i) => (
                <Polyline
                  key={`arc-${g.key}-${i}`}
                  points={pl}
                  color={on ? IMAGE : PREIMAGE}
                  weight={on ? 2.5 : 1.6}
                  fillOpacity={0}
                />
              ));
            })}

            {/* right-angle squares */}
            {geomRays.rightAngles.map((g) => {
              const on = partHl.includes(g.key);
              return (
                <Polyline
                  key={`sq-${g.key}`}
                  points={g.square}
                  color={on ? IMAGE : PREIMAGE}
                  weight={on ? 2.5 : 1.6}
                  fillOpacity={0}
                />
              );
            })}

            {/* vertex + ray labels */}
            <Point x={geomRays.vertex[0]} y={geomRays.vertex[1]} color={PREIMAGE} />
            <Text x={geomRays.vertex[0]} y={geomRays.vertex[1] - 0.42} size={18} color={PREIMAGE}>
              {geomRays.vertexLabel}
            </Text>
            {geomRays.rays.map((r) => {
              const lit = partHl.some(
                (k) => k.length === 3 && k[1] === geomRays.vertexLabel && (k[0] === r.label || k[2] === r.label),
              );
              return (
                <Text key={`rlbl-${r.label}`} x={r.labelPt[0]} y={r.labelPt[1]} size={18} color={lit ? ACCENT : PREIMAGE}>
                  {r.label}
                </Text>
              );
            })}

            {/* transparent clickable wedge per marked angle (figure → table) */}
            {[...geomRays.arcs, ...geomRays.rightAngles].map((g) => {
              const d0 = geomRays.dirOf[g.key[0]];
              const d2 = geomRays.dirOf[g.key[2]];
              const c = { x: geomRays.vertex[0], y: geomRays.vertex[1] };
              const on = partHl.includes(g.key);
              return (
                <Polygon
                  key={`hit-${g.key}`}
                  points={wedge(c, Math.min(d0, d2), Math.max(d0, d2), 1.4)}
                  color={IMAGE}
                  fillOpacity={0}
                  weight={0}
                  svgPolygonProps={{
                    tabIndex: 0,
                    role: "button",
                    "aria-pressed": on,
                    "aria-label": `Angle ${g.key[0]}${g.key[1]}${g.key[2]}${on ? ", highlighted" : ""} — select to find it in the proof`,
                    className: "cbmc-angle-hit",
                    style: { cursor: "pointer" },
                    onClick: () => togglePart(g.key),
                    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                        e.preventDefault();
                        togglePart(g.key);
                      }
                    },
                  }}
                />
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
            const hot = highlightOn && row.statementText ? isRowHighlighted(row.statementText) : false;
            const nudging = nudgeRow === row.n - 1 && nudge != null;
            const cls = [
              row.state === "active" && "cbmc-proof-row-active",
              row.verdict === "ok" && "cbmc-proof-row-seated",
              row.verdict === "placed" && "cbmc-proof-row-placed",
              row.verdict === "wrong" && "cbmc-proof-row-wrong",
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
                    highlightOn ? (
                      <button
                        type="button"
                        className="cbmc-proof-stmt"
                        onClick={() => focusRowAngles(row.statementText!)}
                        onFocus={() => focusRowAngles(row.statementText!)}
                        aria-label={`Statement ${row.n}: ${row.statementText}. Select to highlight its angles in the figure.`}
                      >
                        <MathText source={row.statementTex ?? row.statementText} ariaHidden />
                      </button>
                    ) : (
                      <span className="cbmc-proof-stmt-static">
                        <MathText source={row.statementTex ?? row.statementText} />
                      </span>
                    )
                  ) : (
                    <span className="cbmc-proof-slot" aria-hidden="true">
                      choose a statement
                    </span>
                  )}
                </td>
                <td>
                  {row.reason ? (
                    row.verdict === "wrong" ? (
                      <span className="cbmc-proof-reason-wrong">
                        <span aria-hidden="true">✕ </span>
                        {REASON_LABELS[row.reason]}
                      </span>
                    ) : row.verdict === "placed" ? (
                      <span className="cbmc-proof-reason">{REASON_LABELS[row.reason]}</span>
                    ) : (
                      <span className="cbmc-proof-reason-ok">
                        <span aria-hidden="true">✓ </span>
                        {REASON_LABELS[row.reason]}
                      </span>
                    )
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

      {/* Statement bank (levels ≥ 2). */}
      {showStatementBank ? (
        <div role="group" aria-label="Statement tiles">
          <p className="cbmc-group-label" style={{ margin: "0.25rem 0" }}>
            Statements
          </p>
          <div className="cbmc-controls">
            {remainingStatements.map((id) => {
              const picked = pendingStatement === id;
              return (
                <button
                  key={id}
                  type="button"
                  className={["cbmc-chip", picked && "cbmc-chip-found"].filter(Boolean).join(" ")}
                  aria-pressed={picked}
                  aria-label={textById.get(id)}
                  onClick={() => onPickStatement(id)}
                  onFocus={() => focusAll(textById.get(id) ?? "")}
                >
                  <MathText source={texById.get(id) ?? textById.get(id) ?? ""} ariaHidden />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Reason bank (all levels, while a row is open). */}
      {showBanks ? (
        <div role="group" aria-label="Reason tiles">
          <p className="cbmc-group-label" style={{ margin: "0.5rem 0 0.25rem" }}>
            Reasons
          </p>
          <div className="cbmc-controls">
            {reasonBank.map((r) => (
              <button key={r} type="button" className="cbmc-chip" onClick={() => onPickReason(r)}>
                {REASON_LABELS[r]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Level 4: holistic Submit / Try again. */}
      {holistic && filled && !done ? (
        <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
          {submitted ? (
            <button type="button" className="cbmc-btn" onClick={retry}>
              Try again
            </button>
          ) : (
            <button type="button" className="cbmc-btn cbmc-btn-primary" onClick={submit}>
              Submit proof
            </button>
          )}
        </div>
      ) : null}

      {/* Live feedback — nudges + completion, announced politely. */}
      <div role="status" aria-live="polite" style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
        {done ? (
          <p style={{ fontWeight: 600, color: "var(--cbmc-accent, #176844)" }}>
            <span aria-hidden="true">✓ </span>
            You built the whole proof — <MathText source={spec.proveText} />.{" "}
            {comfortable
              ? "Unaided, at the Regents standard — you're comfortable with this one."
              : "Every row is justified by the reason you chose and follows from the steps above it."}
          </p>
        ) : flash ? (
          <p style={{ color: "var(--cbmc-accent, #176844)", fontWeight: 600 }}>{flash}</p>
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

      {/* Comfortable / readiness indicator — minimal, no scores. */}
      {comfortable ? (
        <p className="cbmc-proof-comfortable">
          <span aria-hidden="true">★ </span>Comfortable with this proof
        </p>
      ) : null}

      {/* Machine-sourced state, surfaced for AT / tests. */}
      <span
        className="cbmc-sr-only"
        data-cbmc-proof-complete={done ? "true" : "false"}
        data-cbmc-seated-count={placed.length}
        data-cbmc-highlight={highlight.join(",")}
        data-cbmc-highlight-letters={hlLetters.join(",")}
        data-cbmc-parthl={partHl.join(",")}
        data-cbmc-level={curLevel}
        data-cbmc-completions={completions}
        data-cbmc-comfortable={comfortable ? "true" : "false"}
        data-cbmc-submitted={submitted ? "true" : "false"}
        data-cbmc-wrong-rows={wrongRows.join(",")}
      />

      <div className="cbmc-controls" style={{ marginTop: "0.5rem" }}>
        {done && !fixed ? (
          <button type="button" className="cbmc-btn cbmc-btn-primary" onClick={nextProof}>
            Next proof
          </button>
        ) : null}
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
        {triGeom
          ? "Two triangles with their given congruent parts marked (matching ticks on congruent sides, matching arcs on congruent angles, a square at a right angle). "
          : fig?.kind === "points-on-line"
            ? "Points sit on a line, with congruent segments tick-marked. "
            : fig?.kind === "rays-from-point"
              ? "Rays share a vertex, with congruent angles arc-marked. "
              : fig?.kind === "intersecting-lines"
                ? "Two lines cross, forming the numbered angles shown. "
                : ""}
        Build a two-column proof that <MathText source={spec.proveText} />:{" "}
        {holistic
          ? "assemble the whole argument in a valid order, then submit it to be checked all at once — the unaided standard"
          : curLevel === 1
            ? "each statement is given in order and you supply the reason that justifies it"
            : "place the statements in a valid order and pair each with its reason"}
        .{" "}
        {holistic
          ? "Wrong rows are flagged so you can fix and resubmit."
          : "Each row is checked against the logic of the proof, so only a step that genuinely follows will seat."}
      </figcaption>
    </figure>
  );
}
