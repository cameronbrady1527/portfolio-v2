import { describe, expect, it } from "vitest";
import { parseExpression } from "./parse";
import { evaluate, UnboundVariableError } from "./evaluate";

const at = (input: string, bindings: Record<string, number> = {}) =>
  evaluate(parseExpression(input), bindings);

describe("evaluate", () => {
  it("evaluates arithmetic with precedence", () => {
    expect(at("1 + 2 * 3")).toBe(7);
    expect(at("(1 + 2) * 3")).toBe(9);
  });

  it("substitutes a variable", () => {
    expect(at("2x + 1", { x: 3 })).toBe(7);
  });

  it("handles powers and unary minus together", () => {
    expect(at("-3^2")).toBe(-9);
    expect(at("2^-3")).toBeCloseTo(0.125);
  });

  it("evaluates implicit products of variables", () => {
    expect(at("xy", { x: 4, y: 5 })).toBe(20);
  });

  it("returns Infinity for division by zero rather than throwing", () => {
    expect(at("1 / x", { x: 0 })).toBe(Infinity);
  });

  it("returns NaN for an undefined real result (sqrt of a negative)", () => {
    // (-1)^0.5 is not a real number
    expect(Number.isNaN(at("x^0.5", { x: -1 }))).toBe(true);
  });

  it("throws for a variable with no binding", () => {
    expect(() => at("x + 1")).toThrow(UnboundVariableError);
  });
});
