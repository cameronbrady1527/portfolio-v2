import { describe, expect, it } from "vitest";
import { parseEquation, parseExpression } from "./parse";
import { equationsEquivalent, expressionsEquivalent } from "./equivalent";

const eqExpr = (a: string, b: string, vars: string[] = []) =>
  expressionsEquivalent(parseExpression(a), parseExpression(b), vars);

const eqEqn = (a: string, b: string, vars: string[] = []) =>
  equationsEquivalent(parseEquation(a), parseEquation(b), vars);

describe("expressionsEquivalent", () => {
  it("accepts commutative reorderings: 1 + 2x ≡ 2x + 1", () => {
    expect(eqExpr("1 + 2x", "2x + 1")).toBe(true);
  });

  it("accepts collected like terms: x + x + 1 ≡ 2x + 1", () => {
    expect(eqExpr("x + x + 1", "2x + 1")).toBe(true);
  });

  it("accepts a factored form: (x+1)(x-1) ≡ x^2 - 1", () => {
    expect(eqExpr("(x+1)(x-1)", "x^2 - 1")).toBe(true);
  });

  it("accepts equal constants written differently: 1/2 ≡ 0.5", () => {
    expect(eqExpr("1/2", "0.5")).toBe(true);
  });

  it("rejects a genuinely different expression: 2x + 1 vs 2x + 2", () => {
    expect(eqExpr("2x + 1", "2x + 2")).toBe(false);
  });

  it("rejects a wrong coefficient: 3x vs 2x", () => {
    expect(eqExpr("3x", "2x")).toBe(false);
  });

  it("treats an unused variable as a difference: x + y vs x", () => {
    expect(eqExpr("x + y", "x")).toBe(false);
  });

  it("handles multivariable equality: 2(x + y) ≡ 2x + 2y", () => {
    expect(eqExpr("2(x + y)", "2x + 2y")).toBe(true);
  });
});

describe("equationsEquivalent", () => {
  it("accepts a rearrangement: x - 2 = 0 ≡ x = 2", () => {
    expect(eqEqn("x - 2 = 0", "x = 2")).toBe(true);
  });

  it("accepts a side swap: 0 = 2 - x ≡ x = 2", () => {
    expect(eqEqn("0 = 2 - x", "x = 2")).toBe(true);
  });

  it("accepts a rescaling: 2x = 4 ≡ x = 2", () => {
    expect(eqEqn("2x = 4", "x = 2")).toBe(true);
  });

  it("accepts a rescaled line: 2y = 4x + 2 ≡ y = 2x + 1", () => {
    expect(eqEqn("2y = 4x + 2", "y = 2x + 1")).toBe(true);
  });

  it("rejects a different line: y = 2x + 1 vs y = 2x + 3", () => {
    expect(eqEqn("y = 2x + 1", "y = 2x + 3")).toBe(false);
  });

  it("rejects a different slope: y = 3x vs y = 2x", () => {
    expect(eqEqn("y = 3x", "y = 2x")).toBe(false);
  });

  it("equates degenerate identities: x = x ≡ 2x = 2x", () => {
    expect(eqEqn("x = x", "2x = 2x")).toBe(true);
  });

  it("rejects a real equation against a degenerate one: x = x vs x = 2", () => {
    expect(eqEqn("x = x", "x = 2")).toBe(false);
  });
});
