/**
 * @cameronbrady/math-components — main entry.
 *
 * The interactive React components and their spec DSL. Pair this with the
 * stylesheet for the graph-paper background and theming surface:
 *
 *   import { Grapher, slider, choose } from "@cameronbrady/math-components";
 *   import "@cameronbrady/math-components/styles.css";
 *
 * Framework-agnostic geometry / grading / progress logic lives at the `/logic`
 * subpath and carries no React or mafs.
 */
export { Grapher, slider, choose } from "./Grapher";
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
