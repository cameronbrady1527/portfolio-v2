import { describe, expect, it } from "vitest";
import { grade, type PracticeQuestion } from "./grade";

const numeric = (
  overrides: Partial<Extract<PracticeQuestion, { type: "numeric" }>> = {},
): Extract<PracticeQuestion, { type: "numeric" }> => ({
  id: "n1",
  type: "numeric",
  prompt: "What is x?",
  answer: 10,
  tolerance: 0.5,
  hints: [],
  explanation: "x is 10",
  ...overrides,
});

const mc = (
  overrides: Partial<Extract<PracticeQuestion, { type: "mc" }>> = {},
): Extract<PracticeQuestion, { type: "mc" }> => ({
  id: "m1",
  type: "mc",
  prompt: "Pick one",
  choices: ["a", "b", "c"],
  answer: 1,
  hints: [],
  explanation: "b is right",
  ...overrides,
});

describe("grade — numeric", () => {
  it("answer=10 tolerance=0.5 graded with 10.4 is correct", () => {
    expect(grade(numeric(), 10.4).correct).toBe(true);
  });

  it("answer=10 tolerance=0.5 graded with 10.6 is incorrect", () => {
    expect(grade(numeric(), 10.6).correct).toBe(false);
  });

  it("is correct exactly at the upper tolerance boundary", () => {
    expect(grade(numeric(), 10.5).correct).toBe(true);
  });

  it("is correct exactly at the lower tolerance boundary", () => {
    expect(grade(numeric(), 9.5).correct).toBe(true);
  });

  it("is incorrect just outside the upper boundary", () => {
    expect(grade(numeric(), 10.5001).correct).toBe(false);
  });

  it("is incorrect just outside the lower boundary", () => {
    expect(grade(numeric(), 9.4999).correct).toBe(false);
  });

  it("is correct on an exact match", () => {
    expect(grade(numeric(), 10).correct).toBe(true);
  });

  it("treats NaN as incorrect", () => {
    expect(grade(numeric(), Number.NaN).correct).toBe(false);
  });

  it("handles zero tolerance as an exact match", () => {
    const q = numeric({ answer: 3, tolerance: 0 });
    expect(grade(q, 3).correct).toBe(true);
    expect(grade(q, 3.0001).correct).toBe(false);
  });
});

describe("grade — mc", () => {
  it("is correct when the chosen index equals the answer", () => {
    expect(grade(mc(), 1).correct).toBe(true);
  });

  it("is incorrect when the chosen index differs", () => {
    expect(grade(mc(), 0).correct).toBe(false);
    expect(grade(mc(), 2).correct).toBe(false);
  });
});

const expression = (
  overrides: Partial<Extract<PracticeQuestion, { type: "expression" }>> = {},
): Extract<PracticeQuestion, { type: "expression" }> => ({
  id: "e1",
  type: "expression",
  prompt: "Simplify 2x + 3x",
  answer: "5x",
  hints: [],
  explanation: "Combine like terms.",
  ...overrides,
});

const equation = (
  overrides: Partial<Extract<PracticeQuestion, { type: "equation" }>> = {},
): Extract<PracticeQuestion, { type: "equation" }> => ({
  id: "q1",
  type: "equation",
  prompt: "Write the equation of the line through (0,1) with slope 2",
  answer: "y = 2x + 1",
  hints: [],
  explanation: "Slope-intercept form.",
  ...overrides,
});

describe("grade — expression", () => {
  it("accepts an algebraically-equal form, not just a string match", () => {
    expect(grade(expression(), "x + 4x").correct).toBe(true);
    expect(grade(expression(), "5*x").correct).toBe(true);
  });

  it("rejects a different expression", () => {
    expect(grade(expression(), "6x").correct).toBe(false);
  });

  it("treats unparseable input as incorrect, not an error", () => {
    expect(grade(expression(), "5x +").correct).toBe(false);
    expect(grade(expression(), "%%%").correct).toBe(false);
  });

  it("treats blank input as incorrect", () => {
    expect(grade(expression(), "   ").correct).toBe(false);
  });
});

describe("grade — equation", () => {
  it("accepts a rearranged/rescaled equivalent equation", () => {
    expect(grade(equation(), "2y = 4x + 2").correct).toBe(true);
    expect(grade(equation(), "y - 2x - 1 = 0").correct).toBe(true);
  });

  it("rejects a different line", () => {
    expect(grade(equation(), "y = 2x + 3").correct).toBe(false);
  });

  it("treats input lacking an '=' as incorrect", () => {
    expect(grade(equation(), "2x + 1").correct).toBe(false);
  });
});
