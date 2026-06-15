/**
 * Public, substrate-agnostic types + control constructors for <Grapher>.
 *
 * NONE of these leak mafs types. The Grapher consumes the geometry module's
 * `Shape`/`Pt`/`ReflectLine` and exposes a small `Control<T>` DSL so a spec can
 * declare which parameters are interactive.
 */
import type { Pt, Shape, TransformStep } from "./logic";

export type { TransformStep };

export type { Pt, Shape };

/** A slider control wrapping a numeric value. */
export interface SliderControl {
  readonly control: "slider";
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly label?: string;
}

/** A choose (select) control over a finite set of options. */
export interface ChooseControl<T extends string | number> {
  readonly control: "choose";
  readonly value: T;
  readonly options: readonly T[];
  readonly label?: string;
}

/**
 * A control over a value of type T.
 *  - `Control<number>` renders a slider.
 *  - `Control<'x'|'y'>` (or any string/number-literal union) renders a select.
 */
// `[T] extends [...]` is intentionally NON-distributive so a literal *union*
// like `'x' | 'y'` maps to a single `ChooseControl<'x' | 'y'>` rather than a
// union of single-option controls.
export type Control<T> = [T] extends [number]
  ? SliderControl | ChooseControl<Extract<T, number>>
  : [T] extends [string]
    ? ChooseControl<Extract<T, string>>
    : never;

/** A spec parameter that is either a fixed literal or an interactive Control. */
export type Param<T> = T | Control<T>;

/** Construct a slider control for a numeric param. */
export function slider(
  value: number,
  min: number,
  max: number,
  o?: { step?: number; label?: string },
): SliderControl {
  return {
    control: "slider",
    value,
    min,
    max,
    step: o?.step ?? 1,
    label: o?.label,
  };
}

/** Construct a choose (select) control over a finite option set. */
export function choose<T extends string | number>(
  value: T,
  options: readonly T[],
  label?: string,
): ChooseControl<T> {
  return { control: "choose", value, options, label };
}

/** Narrowing guard: is a Param an interactive Control? */
export function isControl<T>(p: Param<T>): p is Extract<Control<T>, object> {
  return (
    typeof p === "object" &&
    p !== null &&
    "control" in (p as Record<string, unknown>)
  );
}

/** A line of reflection where each field may be fixed or interactive. */
export type ReflectLineSpec =
  | { kind: "axis"; axis: Param<"x" | "y"> }
  | { kind: "diagonal"; slope: Param<1 | -1> }
  | { kind: "linear"; m: number; b: number };

/** The transform a Grapher applies. Only `reflection` is functional in #7. */
export type TransformSpec =
  | { kind: "reflection"; over: ReflectLineSpec }
  | { kind: "translation"; by: { dx: Param<number>; dy: Param<number> } }
  | { kind: "rotation"; about: Pt; angle: Param<90 | 180 | 270 | -90> }
  | { kind: "dilation"; about: Pt; factor: Param<number> }
  | { kind: "stretch"; axis: Param<"x" | "y">; factor: Param<number> };

/** A full Grapher specification. */
export type GrapherSpec = {
  preimage: Shape | Shape[];
  /** One transform (params may be interactive) or a FIXED ordered sequence. */
  transform: TransformSpec | TransformStep[];
  /** Coordinate bounds; defaults to an auto-fit around pre/image. */
  bounds?: { x: [number, number]; y: [number, number] };
  /** Override the auto-generated a11y caption. */
  caption?: string;
  /** A one-line "try this →" instruction shown above the figure. */
  instruction?: string;
  /** Whether to render the computed image. Default true. */
  showImage?: boolean;
  /** Show the original-vs-image legend. Default true. */
  showLegend?: boolean;
  /** INITIAL state of the student "Show side lengths" toggle. Default false. */
  showMeasurements?: boolean;
  /** Optional enhancement: allow dragging the preimage. Default false. */
  draggablePreimage?: boolean;
};

/** Payload passed to `onChange`. */
export interface GrapherChange {
  params: Readonly<Record<string, number | string>>;
  image: Shape | Shape[];
}

export interface GrapherProps {
  spec: GrapherSpec;
  onChange?: (s: GrapherChange) => void;
  className?: string;
}
