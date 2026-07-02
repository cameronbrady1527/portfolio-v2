/**
 * @cameronbrady/math-components/logic — framework-agnostic logic entry.
 *
 * Pure geometry (reflect/translate/rotate/applyTransform) and practice logic
 * (answer grading + progress). This entry carries NO React and NO mafs in its
 * import graph, so consumers who only need the math don't pull a UI runtime.
 */

// Geometry — pure transform math + canonical types.
export type {
  Pt,
  Shape,
  ReflectLine,
  Transform,
  TranslateParams,
  RotateParams,
} from "./geometry/types";
export { reflect, applyTransform } from "./geometry/reflect";
export { dilate, type DilateParams } from "./geometry/dilate";
export { stretch, type StretchParams } from "./geometry/stretch";
export { applySequence, applyStep, type TransformStep } from "./geometry/sequence";
export { pointsCoincide, shapesCoincide } from "./geometry/coincide";
export {
  allSymmetries,
  applyProposal,
  checkSymmetry,
  reflectPtAcross,
  rotatePtBy,
  vertexCentroid,
  type PolygonShape,
  type SymmetryProposal,
} from "./geometry/symmetry";
export { translate } from "./geometry/translate";
export { rotate } from "./geometry/rotate";
export {
  transversalAngles,
  type AngleId,
  type Intersection,
  type Region,
  type PairRelationship,
  type Angle,
  type AnglePair,
  type TransversalConfig,
  type TransversalAngles,
} from "./geometry/angles";
export {
  triangleFromSAS,
  triangleFromSSS,
  triangleAngles,
  roundAnglesToSum,
  angleSumAssembly,
  midsegment,
  type AngleSumAssembly,
  type TriangleSide,
  type Midsegment,
  type SSSTriangle,
} from "./geometry/triangle";
export {
  solutionCount,
  solveTriangles,
  congruenceCheck,
  type Criterion,
  type Parts,
  type Determinacy,
  type CongruenceResult,
} from "./geometry/congruence";
export { segmentAddition } from "./geometry/proof-families/segment-addition";
export { angleAddition } from "./geometry/proof-families/angle-addition";
export { congruenceCpctc } from "./geometry/proof-families/congruence-cpctc";
export {
  gradeProof,
  generateProof,
  verticalAngles,
  whatIsAProof,
  PROOF_FAMILIES,
  REASON_LABELS,
  type ReasonId,
  type ScaffoldLevel,
  type ProofStatement,
  type ProofDistractor,
  type ProofSpec,
  type ProofFigure,
  type TriangleFigureMark,
  type ProofArrangement,
  type RowVerdict,
  type ProofVerdict,
  type ProofFamily,
} from "./geometry/proof";

// Deterministic PRNG — shared seeded randomness for reproducible practice.
export { mulberry32 } from "./random";

// Practice — seeded problem generators (pure (level, rng) => Problem).
export { signedAddSub } from "./practice/generators";
export { multDiv } from "./practice/generators";
export { orderOfOperations } from "./practice/generators";
export { rounding } from "./practice/generators";
export { equivalentFractions } from "./practice/generators";
export { addSubtractFractions } from "./practice/generators";
export { multiplyDivideFractions } from "./practice/generators";
export { solveProportion } from "./practice/generators";
export { percents } from "./practice/generators";
export { substituteFormula } from "./practice/generators";
export { simplifyExpression } from "./practice/generators";
export { solveLinearEquation } from "./practice/generators";
export { powers } from "./practice/generators";
export { squareRoots } from "./practice/generators";
export { exponentRules } from "./practice/generators";
export { pointsAndQuadrants } from "./practice/generators";
export { distanceOnPlane } from "./practice/generators";
export { midpoint } from "./practice/generators";
export { slope } from "./practice/generators";
export type { Problem, ProblemGenerator } from "./practice/generators";

// Practice — drill fluency state machine (pure (state, event) => state).
export {
  DEFAULT_FLUENCY_THRESHOLD,
  initFluency,
  fluencyReducer,
} from "./practice/drill";
export type { FluencyState, FluencyEvent } from "./practice/drill";

// Practice — answer grading.
export { grade } from "./practice/grade";
export type { PracticeQuestion, GradeResult } from "./practice/grade";

// Practice — expression/equation parsing & equivalence (machine-checkable,
// dependency-free). Exposed for authors/tooling that want to validate content.
export {
  parseExpression,
  parseEquation,
  evaluate,
  expressionsEquivalent,
  equationsEquivalent,
  checkExpressionAnswer,
  checkEquationAnswer,
  ParseError,
  TokenizeError,
} from "./practice/expression";
export type {
  Node as ExpressionNode,
  Equation as ParsedEquation,
} from "./practice/expression";

// Practice — progress: a key-agnostic pure core plus a storage-key-parameterized
// localStorage adapter. Callers supply their own storage key.
export {
  PROGRESS_VERSION,
  emptyProgress,
  scoreTopic,
  recordAnswer,
  getTopic,
  normalizeProgress,
  loadProgress,
  saveProgress,
  recordMastery,
  isMastered,
  countMastered,
} from "./practice/progress";
export type { Progress, TopicProgress, AnswerRecord } from "./practice/progress";
