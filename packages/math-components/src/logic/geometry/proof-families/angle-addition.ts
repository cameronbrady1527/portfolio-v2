/**
 * The `angle-addition` proof family — two-column proofs about rays sharing a
 * vertex, driven by the Angle Addition Postulate (and its neighbours: the
 * definitions of angle bisector / congruent angles / right angle / perpendicular,
 * the equality properties, substitution, all-right-angles-are-congruent, and the
 * transitive property of congruence).
 *
 * Pure and seeded: `(level, rng) => ProofSpec`. A given seed reproduces the same
 * proof; the family varies the template (build-up, break-down, perpendicular
 * right angles, or a transitive bisector chain), the vertex + ray labels, and
 * which relation is given vs proved. Distractors — plausible but false tiles that
 * must never seat — appear only at level ≥ 3.
 *
 * Every emitted proof is a valid DAG that reaches its goal under any topological
 * order (property-tested in `angle-addition.test.ts`); the maths is flagged for
 * SME ratification. Companion of `segment-addition.ts`.
 */
import type {
  ProofDistractor,
  ProofFamily,
  ProofFigure,
  ProofSpec,
  ProofStatement,
} from "../proof";

function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** A labelled figure: the shared vertex plus four rays fanning across the top,
 *  named so the vertex letter always sits in the middle of an angle name. */
interface Config {
  V: string;
  /** The four outer ray labels, in angular order across the fan. */
  rays: [string, string, string, string];
}
const CONFIGS: readonly Config[] = [
  { V: "B", rays: ["A", "D", "E", "C"] },
  { V: "Q", rays: ["P", "R", "S", "T"] },
  { V: "K", rays: ["J", "L", "M", "N"] },
];

/** Even 40°-apart fan for the four-ray templates. */
const FAN4: readonly number[] = [150, 110, 70, 30];
/** 90°-apart rays for the three-ray right-angle template. */
const FAN3: readonly number[] = [180, 90, 0];

type Built = {
  statements: ProofStatement[];
  distractors: ProofDistractor[];
  given: string;
  prove: string;
  figure: ProofFigure;
};

/**
 * Build-up (overlapping angles, additive). Adding the shared middle angle to the
 * congruent outer angles makes the two overlapping angles equal.
 * Given ∠ABD ≅ ∠EBC  ⇒  Prove ∠ABE ≅ ∠DBC.  (rays A, D, E, C about vertex B)
 */
function buildUp(V: string, r: [string, string, string, string], level: number): Built {
  const [A, D, E, C] = r;
  const statements: ProofStatement[] = [
    { id: "g0", text: `Rays ${V}${A}, ${V}${D}, ${V}${E}, ${V}${C} in order, with ${D} and ${E} in the interior of ∠${A}${V}${C}`, tex: `Rays $\\overrightarrow{${V}${A}}$, $\\overrightarrow{${V}${D}}$, $\\overrightarrow{${V}${E}}$, $\\overrightarrow{${V}${C}}$ in order, with $${D}$ and $${E}$ in the interior of $\\angle ${A}${V}${C}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "g1", text: `∠${A}${V}${D} ≅ ∠${E}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `m∠${A}${V}${D} = m∠${E}${V}${C}`, tex: `$m\\angle ${A}${V}${D} = m\\angle ${E}${V}${C}$`, reasons: ["def-congr-angles"], deps: [["g1"]] },
    { id: "s2", text: `m∠${A}${V}${D} + m∠${D}${V}${E} = m∠${E}${V}${C} + m∠${D}${V}${E}`, tex: `$m\\angle ${A}${V}${D} + m\\angle ${D}${V}${E} = m\\angle ${E}${V}${C} + m\\angle ${D}${V}${E}$`, reasons: ["add-eq"], deps: [["s1"]] },
    { id: "s3", text: `m∠${A}${V}${D} + m∠${D}${V}${E} = m∠${A}${V}${E}`, tex: `$m\\angle ${A}${V}${D} + m\\angle ${D}${V}${E} = m\\angle ${A}${V}${E}$`, reasons: ["angle-add"], deps: [["g0"]] },
    { id: "s4", text: `m∠${E}${V}${C} + m∠${D}${V}${E} = m∠${D}${V}${C}`, tex: `$m\\angle ${E}${V}${C} + m\\angle ${D}${V}${E} = m\\angle ${D}${V}${C}$`, reasons: ["angle-add"], deps: [["g0"]] },
    { id: "s5", text: `m∠${A}${V}${E} = m∠${D}${V}${C}`, tex: `$m\\angle ${A}${V}${E} = m\\angle ${D}${V}${C}$`, reasons: ["subst", "transitive-eq"], deps: [["s2", "s3", "s4"]] },
    { id: "s6", text: `∠${A}${V}${E} ≅ ∠${D}${V}${C}`, tex: `$\\angle ${A}${V}${E} \\cong \\angle ${D}${V}${C}$`, reasons: ["def-congr-angles"], deps: [["s5"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `m∠${A}${V}${D} = m∠${A}${V}${C}`, tex: `$m\\angle ${A}${V}${D} = m\\angle ${A}${V}${C}$`, reason: "angle-add" },
          { id: "d2", text: `∠${A}${V}${C} ≅ ∠${D}${V}${C}`, tex: `$\\angle ${A}${V}${C} \\cong \\angle ${D}${V}${C}$`, reason: "def-congr-angles" },
        ]
      : [];
  const figure: ProofFigure = {
    kind: "rays-from-point",
    vertex: V,
    rays: [A, D, E, C].map((label, i) => ({ label, deg: FAN4[i] })),
    arcs: [
      { a: A, b: D, count: 1 },
      { a: E, b: C, count: 1 },
    ],
  };
  return { statements, distractors, given: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, prove: `$\\angle ${A}${V}${E} \\cong \\angle ${D}${V}${C}$`, figure };
}

/**
 * Break-down (overlapping angles, subtractive). Subtracting the shared middle
 * angle from the congruent overlapping angles leaves the outer angles equal.
 * Given ∠ABE ≅ ∠DBC  ⇒  Prove ∠ABD ≅ ∠EBC.
 */
function breakDown(V: string, r: [string, string, string, string], level: number): Built {
  const [A, D, E, C] = r;
  const statements: ProofStatement[] = [
    { id: "g0", text: `Rays ${V}${A}, ${V}${D}, ${V}${E}, ${V}${C} in order, with ${D} and ${E} in the interior of ∠${A}${V}${C}`, tex: `Rays $\\overrightarrow{${V}${A}}$, $\\overrightarrow{${V}${D}}$, $\\overrightarrow{${V}${E}}$, $\\overrightarrow{${V}${C}}$ in order, with $${D}$ and $${E}$ in the interior of $\\angle ${A}${V}${C}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "g1", text: `∠${A}${V}${E} ≅ ∠${D}${V}${C}`, tex: `$\\angle ${A}${V}${E} \\cong \\angle ${D}${V}${C}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `m∠${A}${V}${E} = m∠${D}${V}${C}`, tex: `$m\\angle ${A}${V}${E} = m\\angle ${D}${V}${C}$`, reasons: ["def-congr-angles"], deps: [["g1"]] },
    { id: "s2", text: `m∠${A}${V}${D} + m∠${D}${V}${E} = m∠${A}${V}${E}`, tex: `$m\\angle ${A}${V}${D} + m\\angle ${D}${V}${E} = m\\angle ${A}${V}${E}$`, reasons: ["angle-add"], deps: [["g0"]] },
    { id: "s3", text: `m∠${D}${V}${E} + m∠${E}${V}${C} = m∠${D}${V}${C}`, tex: `$m\\angle ${D}${V}${E} + m\\angle ${E}${V}${C} = m\\angle ${D}${V}${C}$`, reasons: ["angle-add"], deps: [["g0"]] },
    { id: "s4", text: `m∠${A}${V}${D} + m∠${D}${V}${E} = m∠${D}${V}${E} + m∠${E}${V}${C}`, tex: `$m\\angle ${A}${V}${D} + m\\angle ${D}${V}${E} = m\\angle ${D}${V}${E} + m\\angle ${E}${V}${C}$`, reasons: ["subst", "transitive-eq"], deps: [["s1", "s2", "s3"]] },
    { id: "s5", text: `m∠${A}${V}${D} = m∠${E}${V}${C}`, tex: `$m\\angle ${A}${V}${D} = m\\angle ${E}${V}${C}$`, reasons: ["sub-eq"], deps: [["s4"]] },
    { id: "s6", text: `∠${A}${V}${D} ≅ ∠${E}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, reasons: ["def-congr-angles"], deps: [["s5"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `m∠${A}${V}${D} = m∠${A}${V}${C}`, tex: `$m\\angle ${A}${V}${D} = m\\angle ${A}${V}${C}$`, reason: "angle-add" },
          { id: "d2", text: `∠${A}${V}${D} ≅ ∠${A}${V}${E}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${A}${V}${E}$`, reason: "def-congr-angles" },
        ]
      : [];
  const figure: ProofFigure = {
    kind: "rays-from-point",
    vertex: V,
    rays: [A, D, E, C].map((label, i) => ({ label, deg: FAN4[i] })),
    arcs: [],
  };
  return { statements, distractors, given: `$\\angle ${A}${V}${E} \\cong \\angle ${D}${V}${C}$`, prove: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, figure };
}

/**
 * Two right angles at a vertex are congruent. Rays BA, BD, BC at right angles;
 * either given as perpendicular rays (def-perp) or as 90° angles
 * (def-right-angle), then closed with all-right-angles-are-congruent.
 * Prove ∠ABD ≅ ∠DBC.
 */
function rightAngles(V: string, r: [string, string, string, string], level: number, viaPerp: boolean): Built {
  const A = r[0], D = r[1], C = r[3]; // three rays: outer, middle, outer
  const statements: ProofStatement[] = viaPerp
    ? [
        { id: "g1", text: `${V}${A} ⊥ ${V}${D}`, tex: `$\\overrightarrow{${V}${A}} \\perp \\overrightarrow{${V}${D}}$`, reasons: ["given"], deps: [[]], given: true },
        { id: "g2", text: `${V}${D} ⊥ ${V}${C}`, tex: `$\\overrightarrow{${V}${D}} \\perp \\overrightarrow{${V}${C}}$`, reasons: ["given"], deps: [[]], given: true },
        { id: "s1", text: `∠${A}${V}${D} is a right angle`, tex: `$\\angle ${A}${V}${D}$ is a right angle`, reasons: ["def-perp"], deps: [["g1"]] },
        { id: "s2", text: `∠${D}${V}${C} is a right angle`, tex: `$\\angle ${D}${V}${C}$ is a right angle`, reasons: ["def-perp"], deps: [["g2"]] },
        { id: "s3", text: `∠${A}${V}${D} ≅ ∠${D}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${D}${V}${C}$`, reasons: ["all-right-angles-congr"], deps: [["s1", "s2"]], goal: true },
      ]
    : [
        { id: "g1", text: `m∠${A}${V}${D} = 90°`, tex: `$m\\angle ${A}${V}${D} = 90^\\circ$`, reasons: ["given"], deps: [[]], given: true },
        { id: "g2", text: `m∠${D}${V}${C} = 90°`, tex: `$m\\angle ${D}${V}${C} = 90^\\circ$`, reasons: ["given"], deps: [[]], given: true },
        { id: "s1", text: `∠${A}${V}${D} is a right angle`, tex: `$\\angle ${A}${V}${D}$ is a right angle`, reasons: ["def-right-angle"], deps: [["g1"]] },
        { id: "s2", text: `∠${D}${V}${C} is a right angle`, tex: `$\\angle ${D}${V}${C}$ is a right angle`, reasons: ["def-right-angle"], deps: [["g2"]] },
        { id: "s3", text: `∠${A}${V}${D} ≅ ∠${D}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${D}${V}${C}$`, reasons: ["all-right-angles-congr"], deps: [["s1", "s2"]], goal: true },
      ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `∠${A}${V}${C} is a right angle`, tex: `$\\angle ${A}${V}${C}$ is a right angle`, reason: viaPerp ? "def-perp" : "def-right-angle" },
          { id: "d2", text: `∠${A}${V}${D} ≅ ∠${A}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${A}${V}${C}$`, reason: "all-right-angles-congr" },
        ]
      : [];
  const figure: ProofFigure = {
    kind: "rays-from-point",
    vertex: V,
    rays: [A, D, C].map((label, i) => ({ label, deg: FAN3[i] })),
    rightAngles: [
      { a: A, b: D },
      { a: D, b: C },
    ],
  };
  const given = viaPerp
    ? `$\\overrightarrow{${V}${A}} \\perp \\overrightarrow{${V}${D}}$ and $\\overrightarrow{${V}${D}} \\perp \\overrightarrow{${V}${C}}$`
    : `$m\\angle ${A}${V}${D} = 90^\\circ$ and $m\\angle ${D}${V}${C} = 90^\\circ$`;
  return { statements, distractors, given, prove: `$\\angle ${A}${V}${D} \\cong \\angle ${D}${V}${C}$`, figure };
}

/**
 * Transitive bisector chain. BD bisects ∠ABE (so ∠ABD ≅ ∠DBE); with a given
 * ∠DBE ≅ ∠EBC, the transitive property carries the congruence across.
 * Prove ∠ABD ≅ ∠EBC.  (rays A, D, E, C about vertex B)
 */
function bisectorChain(V: string, r: [string, string, string, string], level: number): Built {
  const [A, D, E, C] = r;
  const statements: ProofStatement[] = [
    { id: "g1", text: `${V}${D} bisects ∠${A}${V}${E}`, tex: `$\\overline{${V}${D}}$ bisects $\\angle ${A}${V}${E}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "g2", text: `∠${D}${V}${E} ≅ ∠${E}${V}${C}`, tex: `$\\angle ${D}${V}${E} \\cong \\angle ${E}${V}${C}$`, reasons: ["given"], deps: [[]], given: true },
    { id: "s1", text: `∠${A}${V}${D} ≅ ∠${D}${V}${E}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${D}${V}${E}$`, reasons: ["def-angle-bisector"], deps: [["g1"]] },
    { id: "s2", text: `∠${A}${V}${D} ≅ ∠${E}${V}${C}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, reasons: ["transitive-congr"], deps: [["s1", "g2"]], goal: true },
  ];
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          { id: "d1", text: `∠${A}${V}${D} ≅ ∠${A}${V}${E}`, tex: `$\\angle ${A}${V}${D} \\cong \\angle ${A}${V}${E}$`, reason: "def-angle-bisector" },
          { id: "d2", text: `∠${A}${V}${E} ≅ ∠${E}${V}${C}`, tex: `$\\angle ${A}${V}${E} \\cong \\angle ${E}${V}${C}$`, reason: "transitive-congr" },
        ]
      : [];
  const figure: ProofFigure = {
    kind: "rays-from-point",
    vertex: V,
    rays: [A, D, E, C].map((label, i) => ({ label, deg: FAN4[i] })),
    // ∠ADV≅∠DVE (bisector) and ∠DVE≅∠EVC (given) ⇒ three equal adjacent angles.
    arcs: [
      { a: A, b: D, count: 1 },
      { a: D, b: E, count: 1 },
      { a: E, b: C, count: 1 },
    ],
  };
  return { statements, distractors, given: `$\\overline{${V}${D}}$ bisects $\\angle ${A}${V}${E}$, and $\\angle ${D}${V}${E} \\cong \\angle ${E}${V}${C}$`, prove: `$\\angle ${A}${V}${D} \\cong \\angle ${E}${V}${C}$`, figure };
}

export const angleAddition: ProofFamily = (level, rng) => {
  const cfg = CONFIGS[pick(rng, 0, CONFIGS.length - 1)];
  const template = pick(rng, 0, 3);

  let built: Built;
  if (template === 0) built = buildUp(cfg.V, cfg.rays, level);
  else if (template === 1) built = breakDown(cfg.V, cfg.rays, level);
  else if (template === 2) built = rightAngles(cfg.V, cfg.rays, level, pick(rng, 0, 1) === 1);
  else built = bisectorChain(cfg.V, cfg.rays, level);

  const spec: ProofSpec = {
    figure: built.figure,
    givenText: built.given,
    proveText: built.prove,
    statements: built.statements,
    distractors: built.distractors,
    level,
  };
  return spec;
};
