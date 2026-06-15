/**
 * Abstract syntax tree for parsed expressions.
 *
 * A deliberately tiny node set: literals, variables, unary negation, and the
 * five binary arithmetic operators. The evaluator walks this; the equivalence
 * checker never inspects structure (it samples numerically), so the AST stays
 * a pure intermediate representation.
 */

export type BinaryOp = "add" | "sub" | "mul" | "div" | "pow";

export type Node =
  | { kind: "num"; value: number }
  | { kind: "var"; name: string }
  | { kind: "neg"; operand: Node }
  | { kind: BinaryOp; left: Node; right: Node };

/** An equation is a pair of expression trees, one per side of the "=". */
export type Equation = { left: Node; right: Node };
