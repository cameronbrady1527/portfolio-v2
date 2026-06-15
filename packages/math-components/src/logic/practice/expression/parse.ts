/**
 * Recursive-descent parser for school-math expressions and equations.
 *
 * Precedence, lowest to highest:
 *   add/sub  →  mul/div (and implicit multiplication)  →  unary minus  →
 *   power (^, right-associative)  →  primary (number | variable | (expr))
 *
 * Implicit multiplication: when one factor is directly followed by another
 * with no operator between them — 2x, 3(x+1), (x+1)(x-1), xy — the parser
 * inserts a multiplication. "^" binds tighter than unary minus, so -3^2 is
 * -(3^2) and 2x^2 is 2·(x^2), matching ordinary math convention.
 */
import type { Equation, Node } from "./ast";
import { tokenize, type Token } from "./tokenize";

/** Thrown when a token stream is not a well-formed expression/equation. */
export class ParseError extends Error {
  constructor(
    message: string,
    readonly pos: number,
  ) {
    super(message);
    this.name = "ParseError";
  }
}

class Parser {
  private i = 0;
  constructor(
    private readonly tokens: Token[],
    private readonly src: string,
  ) {}

  private peek(): Token | undefined {
    return this.tokens[this.i];
  }

  private next(): Token | undefined {
    return this.tokens[this.i++];
  }

  private eof(): boolean {
    return this.i >= this.tokens.length;
  }

  /** Parse a full expression and require all tokens to be consumed. */
  parseExpressionComplete(): Node {
    const node = this.parseAdd();
    if (!this.eof()) {
      const t = this.peek()!;
      throw new ParseError(`Unexpected "${t.value}"`, t.pos);
    }
    return node;
  }

  /** Parse "L = R" and require exactly one "=". */
  parseEquationComplete(): Equation {
    const left = this.parseAdd();
    const eq = this.next();
    if (!eq || eq.type !== "eq") {
      const pos = eq?.pos ?? this.src.length;
      throw new ParseError(`Expected "=" to form an equation`, pos);
    }
    const right = this.parseAdd();
    if (!this.eof()) {
      const t = this.peek()!;
      throw new ParseError(`Unexpected "${t.value}" after the equation`, t.pos);
    }
    return { left, right };
  }

  private parseAdd(): Node {
    let node = this.parseMul();
    for (;;) {
      const t = this.peek();
      if (t?.type === "plus") {
        this.next();
        node = { kind: "add", left: node, right: this.parseMul() };
      } else if (t?.type === "minus") {
        this.next();
        node = { kind: "sub", left: node, right: this.parseMul() };
      } else {
        return node;
      }
    }
  }

  private parseMul(): Node {
    let node = this.parseUnary();
    for (;;) {
      const t = this.peek();
      if (t?.type === "star") {
        this.next();
        node = { kind: "mul", left: node, right: this.parseUnary() };
      } else if (t?.type === "slash") {
        this.next();
        node = { kind: "div", left: node, right: this.parseUnary() };
      } else if (this.startsFactor(t)) {
        // Implicit multiplication: adjacent factors with no operator.
        node = { kind: "mul", left: node, right: this.parseUnary() };
      } else {
        return node;
      }
    }
  }

  /** A factor begins with a number, a variable, or an opening paren. */
  private startsFactor(t: Token | undefined): boolean {
    return (
      t?.type === "number" || t?.type === "ident" || t?.type === "lparen"
    );
  }

  private parseUnary(): Node {
    const t = this.peek();
    if (t?.type === "minus") {
      this.next();
      return { kind: "neg", operand: this.parseUnary() };
    }
    if (t?.type === "plus") {
      this.next();
      return this.parseUnary();
    }
    return this.parsePow();
  }

  private parsePow(): Node {
    const base = this.parsePrimary();
    const t = this.peek();
    if (t?.type === "caret") {
      this.next();
      // Right-associative, and the exponent may itself be unary (2^-3).
      return { kind: "pow", left: base, right: this.parseUnary() };
    }
    return base;
  }

  private parsePrimary(): Node {
    const t = this.next();
    if (!t) {
      throw new ParseError(`Unexpected end of input`, this.src.length);
    }
    if (t.type === "number") {
      return { kind: "num", value: Number.parseFloat(t.value) };
    }
    if (t.type === "ident") {
      return { kind: "var", name: t.value };
    }
    if (t.type === "lparen") {
      const inner = this.parseAdd();
      const close = this.next();
      if (!close || close.type !== "rparen") {
        throw new ParseError(`Expected a closing ")"`, close?.pos ?? this.src.length);
      }
      return inner;
    }
    throw new ParseError(`Unexpected "${t.value}"`, t.pos);
  }
}

/** Parse a standalone expression into an AST. Throws on malformed input. */
export function parseExpression(input: string): Node {
  return new Parser(tokenize(input), input).parseExpressionComplete();
}

/** Parse an "L = R" equation into a pair of ASTs. Throws on malformed input. */
export function parseEquation(input: string): Equation {
  return new Parser(tokenize(input), input).parseEquationComplete();
}
