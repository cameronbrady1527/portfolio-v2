export type {
  Pt,
  Shape,
  ReflectLine,
  Transform,
  TranslateParams,
  RotateParams,
} from "./types";
export { reflect, applyTransform } from "./reflect";
export { dilate, type DilateParams } from "./dilate";
export { stretch, type StretchParams } from "./stretch";
export { applySequence, applyStep, type TransformStep } from "./sequence";
export { pointsCoincide, shapesCoincide } from "./coincide";
export {
  allSymmetries,
  applyProposal,
  checkSymmetry,
  reflectPtAcross,
  rotatePtBy,
  vertexCentroid,
  type PolygonShape,
  type SymmetryProposal,
} from "./symmetry";
export { translate } from "./translate";
export { rotate } from "./rotate";
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
} from "./angles";
export {
  triangleFromSAS,
  triangleAngles,
  roundAnglesToSum,
  midsegment,
  type TriangleSide,
  type Midsegment,
} from "./triangle";
export {
  solutionCount,
  solveTriangles,
  congruenceCheck,
  type Criterion,
  type Parts,
  type Determinacy,
  type CongruenceResult,
} from "./congruence";
export {
  gradeProof,
  generateProof,
  verticalAngles,
  PROOF_FAMILIES,
  REASON_LABELS,
  type ReasonId,
  type ScaffoldLevel,
  type ProofStatement,
  type ProofDistractor,
  type ProofSpec,
  type ProofFigure,
  type ProofArrangement,
  type RowVerdict,
  type ProofVerdict,
  type ProofFamily,
} from "./proof";
