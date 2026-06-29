/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

beforeEach(() => localStorage.clear());
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

    // Self-score full credit → it's recorded.
    await user.click(screen.getByRole("button", { name: "4 of 4 credits" }));
    expect(screen.getByTestId("self-score-recorded")).toHaveTextContent("Recorded 4 of 4");

    // The score is gated (only 1 of 2 answered); reveal it to see readiness.
    expect(screen.queryByTestId("readiness")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show score" }));
    expect(screen.getByTestId("readiness")).toHaveTextContent("Mastery");
  });
});

describe("SelfScore — score gating", () => {
  it("hides the projected score until it is revealed", async () => {
    const user = userEvent.setup();
    render(<SelfScore items={items} />);

    // Answer the first MC item.
    await user.click(screen.getByLabelText("plus or minus 3"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    // With items unfinished, the projected level is gated behind "Show score".
    expect(screen.queryByTestId("readiness")).not.toBeInTheDocument();
    expect(screen.getByTestId("readiness-gate")).toHaveTextContent("1 of 2 answered");

    await user.click(screen.getByRole("button", { name: "Show score" }));
    expect(screen.getByTestId("readiness")).toBeInTheDocument();
    expect(screen.queryByTestId("readiness-gate")).not.toBeInTheDocument();
  });
});

describe("SelfScore — persistence", () => {
  async function scoreSelfScoreItem() {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: /Reveal rubric/ }));
    await user.click(screen.getByRole("button", { name: "4 of 4 credits" }));
    return user;
  }

  it("restores recorded readiness after a reload (remount)", async () => {
    const first = render(<SelfScore items={items} />);
    const user = await scoreSelfScoreItem();
    await user.click(screen.getByRole("button", { name: "Show score" }));
    expect(screen.getByTestId("readiness")).toHaveTextContent("Mastery");
    first.unmount();

    // Remount = a fresh page load; the attempt is rehydrated from localStorage,
    // and the score is re-gated until revealed again.
    render(<SelfScore items={items} />);
    await userEvent.setup().click(
      await screen.findByRole("button", { name: "Show score" }),
    );
    expect(screen.getByTestId("readiness")).toHaveTextContent("Mastery");
  });

  it("clears this bank's progress on Start over (from the gate)", async () => {
    render(<SelfScore items={items} />);
    const user = await scoreSelfScoreItem();
    // "Start over" is offered on the gate even before the score is revealed.
    await user.click(screen.getByRole("button", { name: "Start over" }));
    expect(screen.queryByTestId("readiness")).not.toBeInTheDocument();
    expect(screen.queryByTestId("readiness-gate")).not.toBeInTheDocument();
  });
});
