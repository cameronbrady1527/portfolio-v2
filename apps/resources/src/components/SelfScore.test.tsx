/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SelfScore } from "./SelfScore";
import type { PreparedRegentsItem } from "@/lib/regents/prepare";

// Prepared items carry pre-rendered HTML; plain text stands in for the math here.
const items: PreparedRegentsItem[] = [
  {
    id: "mc1",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics",
    examCitation: "regents-algI-0624-q1",
    part: "I",
    credits: 2,
    promptHtml: "What are the solutions to x squared = 9?",
    choicesHtml: ["plus or minus 3", "3 only"],
    answer: 0,
    explanationHtml: "x = plus or minus 3.",
  },
  {
    id: "ss1",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Quadratic formula",
    examCitation: "regents-algI-0624-q33",
    part: "III",
    credits: 4,
    promptHtml: "Solve the quadratic.",
    answerSummaryHtml: "x = five plus root ten over three",
    modelSolutionHtml: "Apply the quadratic formula with a, b, c.",
    rubric: [
      { credits: 4, criteriaHtml: "Correct answer with correct work." },
      { credits: 0, criteriaHtml: "No relevant work." },
    ],
  },
];

afterEach(cleanup);

describe("SelfScore — multiple choice", () => {
  it("auto-grades a chosen answer and shows the explanation", async () => {
    const user = userEvent.setup();
    render(<SelfScore items={items} />);

    await user.click(screen.getByLabelText("plus or minus 3"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("x = plus or minus 3.")).toBeInTheDocument();
  });
});

describe("SelfScore — constructed response", () => {
  it("gates the model solution behind a reveal, then records a self-score", async () => {
    const user = userEvent.setup();
    render(<SelfScore items={items} />);

    // Move to the self-score item.
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Attempt gate: the model solution is NOT shown yet.
    expect(screen.queryByText(/Apply the quadratic formula/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Reveal rubric/ }));

    // Now the rubric + model solution are visible.
    expect(screen.getByText(/Apply the quadratic formula/)).toBeInTheDocument();
    expect(screen.getByText("x = five plus root ten over three")).toBeInTheDocument();

    // Self-score full credit → it's recorded and readiness appears.
    await user.click(screen.getByRole("button", { name: "4 of 4 credits" }));
    expect(screen.getByTestId("self-score-recorded")).toHaveTextContent("Recorded 4 of 4");
    expect(screen.getByTestId("readiness")).toHaveTextContent("Mastery");
  });
});
