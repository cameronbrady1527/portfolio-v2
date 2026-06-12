/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SelfCheck } from "./SelfCheck";
import type { PracticeQuestion } from "@/lib/practice/grade";

const mcQuestion: PracticeQuestion = {
  id: "refresher-mc",
  type: "mc",
  prompt: "Which ratio is the same mix as 2 : 3?",
  choices: ["6 : 9", "6 : 7", "4 : 5"],
  answer: 0,
  hints: ["Multiply both parts by the same number."],
  explanation: "Multiplying both parts of 2 : 3 by 3 gives 6 : 9.",
};

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("SelfCheck", () => {
  it("gives encouraging feedback on a correct answer and records nothing", async () => {
    const user = userEvent.setup();
    render(<SelfCheck question={mcQuestion} />);

    await user.click(screen.getByLabelText("6 : 9"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    const feedback = screen.getByRole("status");
    expect(within(feedback).getByText(/That's it/)).toBeInTheDocument();
    expect(within(feedback).getByText(/6 : 9/)).toBeInTheDocument();

    // The untracked guarantee: a refresher self-check never writes progress.
    expect(window.localStorage.length).toBe(0);
  });

  it("supports retry after a wrong answer, with a hint and no storage writes", async () => {
    const user = userEvent.setup();
    render(<SelfCheck question={mcQuestion} />);

    await user.click(screen.getByLabelText("6 : 7"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    const feedback = screen.getByRole("status");
    expect(within(feedback).getByText(/Not quite — try again/)).toBeInTheDocument();
    expect(within(feedback).getByText(/Multiply both parts/)).toBeInTheDocument();

    // Retry is always possible: pick the right answer and check again.
    await user.click(screen.getByLabelText("6 : 9"));
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(within(screen.getByRole("status")).getByText(/That's it/)).toBeInTheDocument();

    expect(window.localStorage.length).toBe(0);
  });
});
