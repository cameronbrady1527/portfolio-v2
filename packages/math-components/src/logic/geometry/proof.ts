/**
 * Two-column proof engine — the pure core behind the Proofs unit.
 *
 * Everything the proof builder displays and grades (which orderings are valid,
 * which reason justifies a step, whether a construction reaches the goal) is
 * read from here, never hardcoded in a component. Pure and free of any
 * rendering/client dependency so it stays statically renderable and
 * property-testable in a plain node environment. Mirrors `congruence.ts`.
 */

/** A justification from the controlled, SME-ratified reason bank. Properties of
 *  Equality (`-eq`, for `=` on measures/lengths) are kept distinct from
 *  Properties of Congruence (`-congr`, for `≅`). */
export type ReasonId =
  | "given"
  // Properties of Equality
  | "add-eq"
  | "sub-eq"
  | "mul-eq"
  | "div-eq"
  | "subst"
  | "distrib"
  | "reflexive-eq"
  | "symmetric-eq"
  | "transitive-eq"
  // Properties of Congruence
  | "reflexive-congr"
  | "symmetric-congr"
  | "transitive-congr"
  // Postulates
  | "seg-add"
  | "angle-add"
  // Definitions
  | "def-midpoint"
  | "def-seg-bisector"
  | "def-angle-bisector"
  | "def-congr-segments"
  | "def-congr-angles"
  | "def-right-angle"
  | "def-perp"
  | "def-supplementary"
  | "def-linear-pair"
  // Theorems
  | "vertical-angles"
  | "linear-pair-supp"
  | "congr-supplements"
  | "all-right-angles-congr"
  | "alt-interior-angles"
  // Triangle congruence criteria
  | "sss"
  | "sas"
  | "asa"
  | "aas"
  | "hl"
  // Corollary
  | "cpctc";

/**
 * Human-readable labels for the reason bank — the tile text students pick.
 * Typed `Record<ReasonId, string>` so adding a `ReasonId` without a label is a
 * compile error. Equality vs Congruence properties read distinctly, per the
 * SME-ratified bank.
 */
export const REASON_LABELS: Record<ReasonId, string> = {
  given: "Given",
  "add-eq": "Addition Property of Equality",
  "sub-eq": "Subtraction Property of Equality",
  "mul-eq": "Multiplication Property of Equality",
  "div-eq": "Division Property of Equality",
  subst: "Substitution",
  distrib: "Distributive Property",
  "reflexive-eq": "Reflexive Property of Equality",
  "symmetric-eq": "Symmetric Property of Equality",
  "transitive-eq": "Transitive Property of Equality",
  "reflexive-congr": "Reflexive Property of Congruence",
  "symmetric-congr": "Symmetric Property of Congruence",
  "transitive-congr": "Transitive Property of Congruence",
  "seg-add": "Segment Addition Postulate",
  "angle-add": "Angle Addition Postulate",
  "def-midpoint": "Definition of Midpoint",
  "def-seg-bisector": "Definition of Segment Bisector",
  "def-angle-bisector": "Definition of Angle Bisector",
  "def-congr-segments": "Definition of Congruent Segments",
  "def-congr-angles": "Definition of Congruent Angles",
  "def-right-angle": "Definition of Right Angle",
  "def-perp": "Definition of Perpendicular Lines",
  "def-supplementary": "Definition of Supplementary Angles",
  "def-linear-pair": "Definition of Linear Pair",
  "vertical-angles": "Vertical Angles are Congruent",
  "linear-pair-supp": "Linear Pair Postulate",
  "congr-supplements": "Congruent Supplements Theorem",
  "all-right-angles-congr": "All Right Angles are Congruent",
  "alt-interior-angles": "Alternate Interior Angles are Congruent",
  sss: "SSS",
  sas: "SAS",
  asa: "ASA",
  aas: "AAS",
  hl: "HL",
  cpctc: "CPCTC",
};

/** How many scaffolds are showing. Level 4 is the unaided Regents experience. */
export type ScaffoldLevel = 1 | 2 | 3 | 4;

/**
 * One line of the proof. `deps` is disjunctive normal form — an OR of AND-groups
 * of prior statement ids — so a step reachable more than one way (alternative
 * derivation paths) lists each satisfying group. A lone required group is
 * `[[...]]`; a root (a Given) is `[[]]`.
 */
export interface ProofStatement {
  id: string;
  /** Statement text; may contain LaTeX (`$…$`). */
  text: string;
  /** The SET of acceptable reasons (≥1). */
  reasons: ReasonId[];
  /** OR of AND-groups of prior statement ids this step follows from. */
  deps: string[][];
  /** A Given — always a root, obviously first. */
  given?: boolean;
  /** The conclusion the proof must reach. */
  goal?: boolean;
}

/** A plausible-but-wrong tile that must never seat (present at higher levels). */
export interface ProofDistractor {
  id: string;
  text: string;
  reason?: ReasonId;
}

/** A concrete generated proof: figure (optional), the DAG of statements, and the
 *  distractors in play at this scaffold level. */
export interface ProofSpec {
  figure?: ProofFigure;
  givenText: string;
  proveText: string;
  statements: ProofStatement[];
  distractors?: ProofDistractor[];
  level: ScaffoldLevel;
}

/** Figure descriptor carried by the spec. The engine never interprets it — the
 *  renderer (a later slice) draws it. Discriminated on `kind`. */
export type ProofFigure = {
  kind: "intersecting-lines";
  /** Direction (degrees) of the two crossing lines. */
  line1Deg: number;
  line2Deg: number;
  /** Labels for the four rays, clockwise from `line1Deg`. */
  rayLabels: [string, string, string, string];
};

/** What the student built: statement rows in the order they placed them. */
export interface ProofArrangement {
  rows: { statementId: string; reason: ReasonId }[];
}

/** Per-row grading result; `problem` names the first fault found on that row. */
export interface RowVerdict {
  index: number;
  ok: boolean;
  problem?: "distractor" | "bad-reason" | "premature" | "unknown";
}

/** The whole-proof verdict. `ok` iff every row is sound, the goal is present,
 *  and the goal's dependencies are satisfied. */
export interface ProofVerdict {
  ok: boolean;
  reachesGoal: boolean;
  complete: boolean;
  rows: RowVerdict[];
}

/**
 * Grade a student's arrangement against the spec's DAG. A row is sound iff its
 * statement exists, the chosen reason is in that statement's acceptable set, and
 * at least one of its dependency AND-groups is fully present in EARLIER rows.
 * Any valid topological order passes; a positional answer-key is never assumed.
 */
export function gradeProof(spec: ProofSpec, arrangement: ProofArrangement): ProofVerdict {
  const byId = new Map(spec.statements.map((s) => [s.id, s]));
  const placedSoFar = new Set<string>();

  const rows: RowVerdict[] = arrangement.rows.map((row, index) => {
    const stmt = byId.get(row.statementId);
    if (!stmt) {
      // Unknown id → a distractor if the spec declares it, else just unknown.
      const isDistractor = spec.distractors?.some((d) => d.id === row.statementId);
      return { index, ok: false, problem: isDistractor ? "distractor" : "unknown" };
    }
    if (!stmt.reasons.includes(row.reason)) {
      placedSoFar.add(stmt.id);
      return { index, ok: false, problem: "bad-reason" };
    }
    const satisfied = stmt.deps.some((group) => group.every((d) => placedSoFar.has(d)));
    placedSoFar.add(stmt.id);
    if (!satisfied) return { index, ok: false, problem: "premature" };
    return { index, ok: true };
  });

  const goal = spec.statements.find((s) => s.goal);
  const goalPlaced = goal ? placedSoFar.has(goal.id) : false;
  const goalRow = goal ? rows.find((r, i) => arrangement.rows[i]?.statementId === goal.id) : undefined;
  const reachesGoal = goalPlaced && goalRow?.ok === true;
  const complete = reachesGoal;
  const ok = rows.every((r) => r.ok) && reachesGoal;

  return { ok, reachesGoal, complete, rows };
}

// ── Proof families ───────────────────────────────────────────────────────────

/** A pure, seeded proof generator: `level` gates scaffolds (chiefly distractors);
 *  `rng` (see {@link mulberry32}) makes a given seed reproduce the same proof. */
export type ProofFamily = (level: ScaffoldLevel, rng: () => number) => ProofSpec;

/** Integer in [lo, hi] from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function choose<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)];
}

/**
 * Vertical angles are congruent — the rigorous linear-pair proof. Given two
 * lines crossing, the two angles either side of a shared ray are a linear pair
 * (sum 180°); subtracting the shared angle from the two linear-pair equations
 * leaves the vertical angles equal. Structural variation: which vertical pair is
 * proven, the angle numbering, and the figure orientation — the labels move so
 * no fixed position can be memorised.
 */
export const verticalAngles: ProofFamily = (level, rng) => {
  // Four angle numbers around the crossing, clockwise. Rotate the start so the
  // "∠1" is not always the same corner.
  const start = pick(rng, 0, 3);
  const n = (k: number) => ((start + k) % 4) + 1; // n(0)=top … clockwise
  const [a, shared, c] = [n(0), n(1), n(2)]; // prove ∠a ≅ ∠c; ∠shared is between
  const line1Deg = choose(rng, [0, 10, 20, 170, 160]);
  const line2Deg = line1Deg + choose(rng, [60, 70, 110, 120]);

  const statements: ProofStatement[] = [
    { id: "g", text: `Lines intersect, forming ∠${a}, ∠${shared}, ∠${c}`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `m∠${a} + m∠${shared} = 180°`, reasons: ["linear-pair-supp"], deps: [["g"]] },
    { id: "s2", text: `m∠${shared} + m∠${c} = 180°`, reasons: ["linear-pair-supp"], deps: [["g"]] },
    { id: "s3", text: `m∠${a} + m∠${shared} = m∠${shared} + m∠${c}`, reasons: ["subst", "transitive-eq"], deps: [["s1", "s2"]] },
    { id: "s4", text: `m∠${a} = m∠${c}`, reasons: ["sub-eq"], deps: [["s3"]] },
    { id: "s5", text: `∠${a} ≅ ∠${c}`, reasons: ["def-congr-angles"], deps: [["s4"]], goal: true },
  ];

  // Distractors — plausible but wrong — appear only once the student is past the
  // guided levels. Each is a statement the proof never makes.
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `m∠${a} = m∠${shared}`, reason: "sub-eq" },
          { id: "d2", text: `∠${a} ≅ ∠${shared}`, reason: "def-congr-angles" },
        ]
      : [];

  return {
    figure: {
      kind: "intersecting-lines",
      line1Deg,
      line2Deg,
      rayLabels: [`${n(0)}`, `${n(1)}`, `${n(2)}`, `${n(3)}`],
    },
    givenText: `Two lines intersect, forming ∠${a}, ∠${shared}, and ∠${c}`,
    proveText: `∠${a} ≅ ∠${c}`,
    statements,
    distractors,
    level,
  };
};

const FAMILIES: Record<string, ProofFamily> = {
  "vertical-angles": verticalAngles,
};

/** The registered proof-family ids. */
export const PROOF_FAMILIES: readonly string[] = Object.keys(FAMILIES);

/** Generate a concrete proof from a registered family. Throws on unknown id. */
export function generateProof(
  familyId: string,
  level: ScaffoldLevel,
  rng: () => number,
): ProofSpec {
  const family = FAMILIES[familyId];
  if (!family) throw new Error(`unknown proof family: ${familyId}`);
  return family(level, rng);
}
