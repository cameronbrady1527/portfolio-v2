import { describe, expect, it } from "vitest";
import { parseEquation, parseExpression, ParseError } from "./parse";
import type { Node } from "./ast";

// Render an AST to a fully-parenthesized string so tests can assert structure
// (precedence/associativity) without depending on object shape.
function show(n: Node): string {
  switch (n.kind) {
    case "num":
      return String(n.value);
    case "var":
      return n.name;
    case "neg":
      return `(-${show(n.operand)})`;
    case "add":
      return `(${show(n.left)} + ${show(n.right)})`;
    case "sub":
      return `(${show(n.left)} - ${show(n.right)})`;
    case "mul":
      return `(${show(n.left)} * ${show(n.right)})`;
    case "div":
      return `(${show(n.left)} / ${show(n.right)})`;
    case "pow":
      return `(${show(n.left)} ^ ${show(n.right)})`;
  }
}

const s = (input: string) => show(parseExpression(input));

describe("parseExpression — structure & precedence", () => {
  it("parses a number and a variable", () => {
    expect(s("3")).toBe("3");
    expect(s("x")).toBe("x");
  });

  it("multiplication binds tighter than addition", () => {
    expect(s("1 + 2 * 3")).toBe("(1 + (2 * 3))");
  });

  it("reads 2x as implicit multiplication", () => {
    expect(s("2x")).toBe("(2 * x)");
  });

  it("reads xy and (x+1)(x-1) as implicit products", () => {
    expect(s("xy")).toBe("(x * y)");
    expect(s("(x+1)(x-1)")).toBe("((x + 1) * (x - 1))");
  });

  it("treats 2x^2 as 2 * (x^2), not (2x)^2", () => {
    expect(s("2x^2")).toBe("(2 * (x ^ 2))");
  });

  it("makes ^ bind tighter than unary minus: -3^2 is -(3^2)", () => {
    expect(s("-3^2")).toBe("(-(3 ^ 2))");
  });

  it("allows a unary exponent: 2^-3", () => {
    expect(s("2^-3")).toBe("(2 ^ (-3))");
  });

  it("addition is left-associative", () => {
    expect(s("1 - 2 - 3")).toBe("((1 - 2) - 3)");
  });

  it("respects parentheses over precedence", () => {
    expect(s("(1 + 2) * 3")).toBe("((1 + 2) * 3)");
  });

  it("throws on an unclosed paren", () => {
    expect(() => parseExpression("(1 + 2")).toThrow(ParseError);
  });

  it("throws on a trailing operator", () => {
    expect(() => parseExpression("1 +")).toThrow(ParseError);
  });

  it("throws when an expression is given a stray '='", () => {
    expect(() => parseExpression("x = 2")).toThrow(ParseError);
  });
});

describe("parseEquation", () => {
  it("splits an equation into left and right ASTs", () => {
    const eq = parseEquation("2x = 4");
    expect(show(eq.left)).toBe("(2 * x)");
    expect(show(eq.right)).toBe("4");
  });

  it("throws when there is no '='", () => {
    expect(() => parseEquation("2x + 4")).toThrow(ParseError);
  });

  it("throws on a second '='", () => {
    expect(() => parseEquation("x = 2 = 3")).toThrow(ParseError);
  });
});
