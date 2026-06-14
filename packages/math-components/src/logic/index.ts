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
export { translate } from "./geometry/translate";
export { rotate } from "./geometry/rotate";

// Practice — answer grading.
export { grade } from "./practice/grade";
export type { PracticeQuestion, GradeResult } from "./practice/grade";

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
} from "./practice/progress";
export type { Progress, TopicProgress, AnswerRecord } from "./practice/progress";
