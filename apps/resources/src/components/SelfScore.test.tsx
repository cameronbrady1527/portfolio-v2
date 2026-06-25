/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SelfScore } from "./SelfScore";
import type { RegentsItem } from "@/lib/regents/bank";

const testBank: RegentsItem[] = [
  {
    id: "mc1",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics",
    examCitation: "regents-algI-0624-q1",
    part: "I",
    credits: 2,
    prompt: "What are the solutions to x² = 9?",
    choices: ["±3", "3 only"],
    answer: 0,
    explanation: "x = ±3.",
  },
  {
    id: "ss1",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Quadratic formula",
    examCitation: "regents-algI-0624-q33",
    part: "III",
    credits: 4,
    prompt: "Solve 3x² − 10x + 5 = 0.",
    answerSummary: "x = (5 ± √10)/3",
    modelSolution: "Apply the quadratic formula with a=3, b=−10, c=5.",
    rubric: [
      { credits: 4, criteria: "Correct answer with correct work." },
      { credits: 0, criteria: "No relevant work." },
    ],
  },
];

vi.mock("@/lib/regents/bank", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/regents/bank")>();
  return {
    ...actual,
    resolveBank: (slug: string) =>
      slug === "test" ? testBank : actual.resolveBank(slug),
  };
});

afterEach(cleanup);

describe("SelfScore — multiple choice", () => {
  it("auto-grades a chosen answer and shows the explanation", async () => {
    const user = userEvent.setup();
    render(<SelfScore bank="test" />);

    await user.click(screen.getByLabelText("±3"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("x = ±3.")).toBeInTheDocument();
  });
});

describe("SelfScore — constructed response", () => {
  it("gates the model solution behind a reveal, then records a self-score", async () => {
    const user = userEvent.setup();
    render(<SelfScore bank="test" />);

    // Move to the self-score item.
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Attempt gate: the model solution is NOT shown yet.
    expect(screen.queryByText(/Apply the quadratic formula/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Reveal rubric/ }));

    // Now the rubric + model solution are visible.
    expect(screen.getByText(/Apply the quadratic formula/)).toBeInTheDocument();
    expect(screen.getByText("x = (5 ± √10)/3")).toBeInTheDocument();

    // Self-score full credit → it's recorded and readiness appears.
    await user.click(screen.getByRole("button", { name: "4" }));
    expect(screen.getByTestId("self-score-recorded")).toHaveTextContent("Recorded 4 of 4");
    expect(screen.getByTestId("readiness")).toHaveTextContent("Mastery");
  });
});
