/**
 * The `segment-addition` proof family — two-column proofs about collinear points,
 * driven by the Segment Addition Postulate (and its neighbours: the definitions
 * of midpoint / segment bisector / congruent segments, the equality properties,
 * substitution, and the transitive property of congruence).
 *
 * Pure and seeded: `(level, rng) => ProofSpec`. A given seed reproduces the same
 * proof; the family varies the template (build-up, break-down, or a transitive
 * midpoint chain), the four point labels, and which relation is given vs proved,
 * so no fixed position or wording can be memorised. Distractors — plausible but
 * false tiles that must never seat — appear only at level ≥ 3.
 *
 * Every emitted proof is a valid DAG that reaches its goal under any topological
 * order (property-tested in `segment-addition.test.ts`); the maths is flagged for
 * SME ratification. Companion of `angle-addition.ts`; both draw the new
 * points-on-line / rays-from-point figures added in `internal/proof-figure.ts`.
 */
import type {
  ProofDistractor,
  ProofFamily,
  ProofFigure,
  ProofSpec,
  ProofStatement,
} from "../proof";

/** Integer in [lo, hi] from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function choose<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)];
}

/** Windows of four distinct labels; the points sit in this order along the line. */
const LABEL_WINDOWS: readonly [string, string, string, string][] = [
  ["A", "B", "C", "D"],
  ["P", "Q", "R", "S"],
  ["W", "X", "Y", "Z"],
  ["J", "K", "L", "M"],
  ["R", "S", "T", "U"],
];

/** Four evenly-spaced positions (fractions along the drawn line). */
const POS4: readonly number[] = [0, 1 / 3, 2 / 3, 1];

/**
 * Build-up (overlapping segments, additive). Given the two outer pieces are
 * congruent, adding the shared middle piece makes the two overlapping segments
 * equal.  Given AB ≅ CD  ⇒  Prove AC ≅ BD.
 */
function buildUp(
  A: string,
  B: string,
  C: string,
  D: string,
  level: number,
): { statements: ProofStatement[]; distractors: ProofDistractor[]; given: string; prove: string } {
  const statements: ProofStatement[] = [
    { id: "g0", text: `Points ${A}, ${B}, ${C}, ${D} are collinear, in that order`, tex: `Points $${A}$, $${B}$, $${C}$, $${D}$ are collinear, in that order`, reasons: ["given"], deps: [[]], given: true },
    { id: "g1", text: `${A}${B} ≅ ${C}${D}`, tex: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `${A}${B} = ${C}${D}`, tex: `$${A}${B} = ${C}${D}$`, reasons: ["def-congr-segments"], deps: [["g1"]] },
    { id: "s2", text: `${A}${B} + ${B}${C} = ${C}${D} + ${B}${C}`, tex: `$${A}${B} + ${B}${C} = ${C}${D} + ${B}${C}$`, reasons: ["add-eq"], deps: [["s1"]] },
    { id: "s3", text: `${A}${B} + ${B}${C} = ${A}${C}`, tex: `$${A}${B} + ${B}${C} = ${A}${C}$`, reasons: ["seg-add"], deps: [["g0"]] },
    { id: "s4", text: `${C}${D} + ${B}${C} = ${B}${D}`, tex: `$${C}${D} + ${B}${C} = ${B}${D}$`, reasons: ["seg-add"], deps: [["g0"]] },
    { id: "s5", text: `${A}${C} = ${B}${D}`, tex: `$${A}${C} = ${B}${D}$`, reasons: ["subst", "transitive-eq"], deps: [["s2", "s3", "s4"]] },
    { id: "s6", text: `${A}${C} ≅ ${B}${D}`, tex: `$\\overline{${A}${C}} \\cong \\overline{${B}${D}}$`, reasons: ["def-congr-segments"], deps: [["s5"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `${A}${B} = ${A}${C}`, tex: `$${A}${B} = ${A}${C}$`, reason: "seg-add" },
          { id: "d2", text: `${A}${C} ≅ ${A}${B}`, tex: `$\\overline{${A}${C}} \\cong \\overline{${A}${B}}$`, reason: "def-congr-segments" },
        ]
      : [];
  return { statements, distractors, given: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$`, prove: `$\\overline{${A}${C}} \\cong \\overline{${B}${D}}$` };
}

/**
 * Break-down (overlapping segments, subtractive). Given the two overlapping
 * segments are congruent, subtracting the shared middle piece leaves the outer
 * pieces equal.  Given AC ≅ BD  ⇒  Prove AB ≅ CD.
 */
function breakDown(
  A: string,
  B: string,
  C: string,
  D: string,
  level: number,
): { statements: ProofStatement[]; distractors: ProofDistractor[]; given: string; prove: string } {
  const statements: ProofStatement[] = [
    { id: "g0", text: `Points ${A}, ${B}, ${C}, ${D} are collinear, in that order`, tex: `Points $${A}$, $${B}$, $${C}$, $${D}$ are collinear, in that order`, reasons: ["given"], deps: [[]], given: true },
    { id: "g1", text: `${A}${C} ≅ ${B}${D}`, tex: `$\\overline{${A}${C}} \\cong \\overline{${B}${D}}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `${A}${C} = ${B}${D}`, tex: `$${A}${C} = ${B}${D}$`, reasons: ["def-congr-segments"], deps: [["g1"]] },
    { id: "s2", text: `${A}${B} + ${B}${C} = ${A}${C}`, tex: `$${A}${B} + ${B}${C} = ${A}${C}$`, reasons: ["seg-add"], deps: [["g0"]] },
    { id: "s3", text: `${B}${C} + ${C}${D} = ${B}${D}`, tex: `$${B}${C} + ${C}${D} = ${B}${D}$`, reasons: ["seg-add"], deps: [["g0"]] },
    { id: "s4", text: `${A}${B} + ${B}${C} = ${B}${C} + ${C}${D}`, tex: `$${A}${B} + ${B}${C} = ${B}${C} + ${C}${D}$`, reasons: ["subst", "transitive-eq"], deps: [["s1", "s2", "s3"]] },
    { id: "s5", text: `${A}${B} = ${C}${D}`, tex: `$${A}${B} = ${C}${D}$`, reasons: ["sub-eq"], deps: [["s4"]] },
    { id: "s6", text: `${A}${B} ≅ ${C}${D}`, tex: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$`, reasons: ["def-congr-segments"], deps: [["s5"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `${A}${B} = ${A}${C}`, tex: `$${A}${B} = ${A}${C}$`, reason: "seg-add" },
          { id: "d2", text: `${A}${B} + ${C}${D} = ${A}${D}`, tex: `$${A}${B} + ${C}${D} = ${A}${D}$`, reason: "seg-add" },
        ]
      : [];
  return { statements, distractors, given: `$\\overline{${A}${C}} \\cong \\overline{${B}${D}}$`, prove: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$` };
}

/**
 * Transitive midpoint chain. B halves AC and C halves BD, so the four points are
 * evenly spaced and the two end pieces are congruent through the shared middle
 * piece.  Given B is the midpoint of AC and C is the midpoint of BD  ⇒  AB ≅ CD.
 * With `bisector`, the halving is phrased as a segment bisector instead.
 */
function midpointChain(
  A: string,
  B: string,
  C: string,
  D: string,
  level: number,
  bisector: boolean,
): { statements: ProofStatement[]; distractors: ProofDistractor[]; given: string; prove: string } {
  const g1text = bisector
    ? `A segment bisector meets ${A}${C} at its midpoint ${B}`
    : `${B} is the midpoint of ${A}${C}`;
  const g2text = bisector
    ? `A segment bisector meets ${B}${D} at its midpoint ${C}`
    : `${C} is the midpoint of ${B}${D}`;
  const g1tex = bisector
    ? `A segment bisector meets $\\overline{${A}${C}}$ at its midpoint $${B}$`
    : `$${B}$ is the midpoint of $\\overline{${A}${C}}$`;
  const g2tex = bisector
    ? `A segment bisector meets $\\overline{${B}${D}}$ at its midpoint $${C}$`
    : `$${C}$ is the midpoint of $\\overline{${B}${D}}$`;
  const halfReason = bisector ? "def-seg-bisector" : "def-midpoint";
  const statements: ProofStatement[] = [
    { id: "g1", text: g1text, tex: g1tex, reasons: ["given"], deps: [[]], given: true },
    { id: "g2", text: g2text, tex: g2tex, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `${A}${B} ≅ ${B}${C}`, tex: `$\\overline{${A}${B}} \\cong \\overline{${B}${C}}$`, reasons: [halfReason], deps: [["g1"]] },
    { id: "s2", text: `${B}${C} ≅ ${C}${D}`, tex: `$\\overline{${B}${C}} \\cong \\overline{${C}${D}}$`, reasons: [halfReason], deps: [["g2"]] },
    { id: "s3", text: `${A}${B} ≅ ${C}${D}`, tex: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$`, reasons: ["transitive-congr"], deps: [["s1", "s2"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `${A}${B} ≅ ${A}${D}`, tex: `$\\overline{${A}${B}} \\cong \\overline{${A}${D}}$`, reason: halfReason },
          { id: "d2", text: `${A}${C} ≅ ${B}${D}`, tex: `$\\overline{${A}${C}} \\cong \\overline{${B}${D}}$`, reason: "transitive-congr" },
        ]
      : [];
  const given = bisector
    ? `A segment bisector meets $\\overline{${A}${C}}$ at its midpoint $${B}$, and a second meets $\\overline{${B}${D}}$ at its midpoint $${C}$`
    : `$${B}$ is the midpoint of $\\overline{${A}${C}}$, and $${C}$ is the midpoint of $\\overline{${B}${D}}$`;
  return { statements, distractors, given, prove: `$\\overline{${A}${B}} \\cong \\overline{${C}${D}}$` };
}

export const segmentAddition: ProofFamily = (level, rng) => {
  const [A, B, C, D] = LABEL_WINDOWS[pick(rng, 0, LABEL_WINDOWS.length - 1)];
  const template = pick(rng, 0, 2);

  let built: ReturnType<typeof buildUp>;
  let ticks: { a: string; b: string; count: number }[];

  if (template === 0) {
    built = buildUp(A, B, C, D, level);
    // Given congruent outer pieces AB and CD — one tick each.
    ticks = [
      { a: A, b: B, count: 1 },
      { a: C, b: D, count: 1 },
    ];
  } else if (template === 1) {
    built = breakDown(A, B, C, D, level);
    // The equal segments (AC, BD) overlap, so marking them with ticks would
    // collide; leave the figure unticked and let the proof carry the relation.
    ticks = [];
  } else {
    const bisector = pick(rng, 0, 1) === 1;
    built = midpointChain(A, B, C, D, level, bisector);
    // Evenly spaced: AB ≅ BC ≅ CD, one tick each.
    ticks = [
      { a: A, b: B, count: 1 },
      { a: B, b: C, count: 1 },
      { a: C, b: D, count: 1 },
    ];
  }

  const figure: ProofFigure = {
    kind: "points-on-line",
    points: [A, B, C, D].map((label, i) => ({ label, at: POS4[i] })),
    ticks,
  };

  const spec: ProofSpec = {
    figure,
    givenText: built.given,
    proveText: built.prove,
    statements: built.statements,
    distractors: built.distractors,
    level,
  };
  return spec;
};
