/**
 * @cameronbrady/math-components — main entry.
 *
 * The interactive React components and their spec DSL. Pair this with the
 * stylesheet for the graph-paper background and theming surface:
 *
 *   import { Grapher } from "@cameronbrady/math-components";
 *   import { slider, choose } from "@cameronbrady/math-components/dsl";
 *   import "@cameronbrady/math-components/styles.css";
 *
 * This barrel re-exports the interactive components, so it carries a hoisted
 * "use client" boundary. The pure spec DSL (slider/choose) is ALSO re-exported
 * here for client-side convenience, but server-rendered content (MDX evaluated
 * at SSG time) must import it from the React-free `/dsl` subpath instead —
 * calling choose()/slider() obtained through this client-tainted barrel from
 * the server throws "Attempted to call choose() from the server".
 *
 * Framework-agnostic geometry / grading / progress logic lives at the `/logic`
 * subpath; the spec DSL at `/dsl`. Both carry no React or mafs.
 */
export { Grapher, slider, choose } from "./Grapher";
export {
  SymmetryExplorer,
  type SymmetryExplorerProps,
} from "./SymmetryExplorer";
export { TriangleLab, type TriangleLabProps } from "./TriangleLab";
export {
  AngleExplorer,
  type AngleExplorerProps,
} from "./AngleExplorer";
export {
  TransversalAngles,
  type TransversalAnglesProps,
} from "./TransversalAngles";
export {
  TriangleInequality,
  type TriangleInequalityProps,
} from "./TriangleInequality";
export {
  ExteriorAngle,
  type ExteriorAngleProps,
} from "./ExteriorAngle";
export {
  Midsegment,
  type MidsegmentProps,
} from "./Midsegment";
export {
  IsoscelesTriangle,
  type IsoscelesTriangleProps,
} from "./IsoscelesTriangle";
export { CPCTC, type CPCTCProps } from "./CPCTC";
export {
  ProofBuilder,
  type ProofBuilderProps,
  type ProofProgressSnapshot,
} from "./ProofBuilder";
export type {
  ProofSpec,
  ProofStatement,
  ProofDistractor,
  ProofFigure,
  ReasonId,
  ScaffoldLevel,
} from "./logic/geometry/proof";
export {
  CongruenceChecker,
  classifyCriterion,
  CHECKER_PRESETS,
  type CongruenceCheckerProps,
  type CheckerCriterion,
  type CheckerPreset,
  type Mark,
} from "./CongruenceChecker";
export {
  CongruenceCriteria,
  type CongruenceCriteriaProps,
} from "./CongruenceCriteria";
export {
  CongruenceByMotion,
  buildCongruencePose,
  CONGRUENCE_SOURCE,
  type CongruenceByMotionProps,
  type Pose,
} from "./CongruenceByMotion";
export {
  SequenceBuilder,
  type SequenceBuilderProps,
  type SequencePuzzle,
  type PaletteMove,
} from "./SequenceBuilder";
export type { TransformStep } from "./GrapherTypes";
export type {
  GrapherSpec,
  GrapherProps,
  GrapherChange,
  TransformSpec,
  ReflectLineSpec,
  Control,
  Param,
  Pt,
  Shape,
} from "./Grapher";
