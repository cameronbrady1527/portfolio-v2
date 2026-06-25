import { describe, expect, it } from "vitest";
import { resolveBank, validateBank, type RegentsItem } from "./bank";

const mcItem: RegentsItem = {
  id: "t-mc",
  mode: "mc",
  standard: "AI-A.REI.4",
  topic: "Solving quadratics",
  examCitation: "regents-algI-0624-q1",
  part: "I",
  credits: 2,
  prompt: "What are the solutions to x² = 9?",
  choices: ["±3", "3 only", "±9", "9 only"],
  answer: 0,
  explanation: "x = ±3.",
};

describe("validateBank", () => {
  it("accepts a well-formed bank", () => {
    expect(validateBank([mcItem], "test")).toHaveLength(1);
  });

  it("rejects an mc answer index out of range (naming the bank)", () => {
    const bad = { ...mcItem, answer: 9 };
    expect(() => validateBank([bad], "test")).toThrowError(/test/);
  });

  it("rejects a self-score item whose top rubric level ≠ its credits", () => {
    const bad: RegentsItem = {
      id: "t-ss",
      mode: "self-score",
      standard: "AI-A.REI.4",
      topic: "Solving quadratics",
      examCitation: "regents-algI-0624-q33",
      part: "III",
      credits: 4,
      prompt: "Solve.",
      answerSummary: "x = 1",
      modelSolution: "…",
      rubric: [
        { credits: 2, criteria: "top is wrong" },
        { credits: 0, criteria: "none" },
      ],
    };
    expect(() => validateBank([bad], "test")).toThrowError(/rubric/i);
  });

  it("rejects a malformed citation", () => {
    const bad = { ...mcItem, examCitation: "june-2024-q1" };
    expect(() => validateBank([bad], "test")).toThrowError(/examCitation/);
  });

  it("throws loud for an empty bank", () => {
    expect(() => validateBank([], "test")).toThrowError(/test/);
  });
});

describe("solving-quadratics bank", () => {
  const bank = resolveBank("solving-quadratics");

  it("resolves and has the 12 ratified items", () => {
    expect(bank).toHaveLength(12);
  });

  it("fails loud for an unknown bank", () => {
    expect(() => resolveBank("nope")).toThrowError(/nope/);
  });

  it("has unique ids and well-formed NYSED citations", () => {
    const ids = bank.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const it of bank) {
      expect(it.examCitation, it.id).toMatch(/^regents-algI-\d{4}-q\d+$/);
    }
  });

  it("every mc item's correct choice index is in range", () => {
    for (const it of bank) {
      if (it.mode !== "mc") continue;
      expect(it.answer, it.id).toBeGreaterThanOrEqual(0);
      expect(it.answer, it.id).toBeLessThan(it.choices.length);
    }
  });

  it("every self-score item carries a model solution and a top-credit rubric", () => {
    for (const it of bank) {
      if (it.mode !== "self-score") continue;
      expect(it.modelSolution.length, it.id).toBeGreaterThan(0);
      expect(it.rubric[0].credits, it.id).toBe(it.credits);
    }
  });

  it("covers both delivery modes and both standards", () => {
    expect(bank.some((i) => i.mode === "self-score")).toBe(true);
    expect(bank.some((i) => i.mode === "mc")).toBe(true);
    const standards = new Set(bank.map((i) => i.standard));
    expect(standards.has("AI-A.REI.4")).toBe(true);
    expect(standards.has("AI-A.REI.1")).toBe(true);
  });
});
