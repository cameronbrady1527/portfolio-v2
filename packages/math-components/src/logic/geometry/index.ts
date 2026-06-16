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
} from "./triangle";
