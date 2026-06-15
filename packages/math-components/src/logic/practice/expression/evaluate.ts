/**
 * Evaluate an AST at a given variable assignment.
 *
 * Returns a number; points where the expression is undefined (division by
 * zero, an even root of a negative, etc.) surface as NaN or ±Infinity rather
 * than throwing. The equivalence checker treats such points as "not defined
 * here" and samples elsewhere, so non-finite results are a normal signal, not
 * an error.
 */
import type { Node } from "./ast";

export type Bindings = Record<string, number>;

/** Thrown only for a free variable with no binding — a checker bug, not bad input. */
export class UnboundVariableError extends Error {
  constructor(readonly name: string) {
    super(`No value provided for variable "${name}"`);
    this.name = "UnboundVariableError";
  }
}

export function evaluate(node: Node, bindings: Bindings): number {
  switch (node.kind) {
    case "num":
      return node.value;
    case "var": {
      const v = bindings[node.name];
      if (v === undefined) throw new UnboundVariableError(node.name);
      return v;
    }
    case "neg":
      return -evaluate(node.operand, bindings);
    case "add":
      return evaluate(node.left, bindings) + evaluate(node.right, bindings);
    case "sub":
      return evaluate(node.left, bindings) - evaluate(node.right, bindings);
    case "mul":
      return evaluate(node.left, bindings) * evaluate(node.right, bindings);
    case "div":
      return evaluate(node.left, bindings) / evaluate(node.right, bindings);
    case "pow":
      return Math.pow(
        evaluate(node.left, bindings),
        evaluate(node.right, bindings),
      );
  }
}
