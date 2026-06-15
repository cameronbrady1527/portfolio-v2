/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { PracticeSet } from "./PracticeSet";
import type { PracticeQuestion } from "@cameronbrady/math-components/logic";

const mcQuestion: PracticeQuestion = {
  id: "mc1",
  type: "mc",
  prompt: "What is 2 + 2?",
  choices: ["3", "4", "5"],
  answer: 1,
  hints: ["Count on your fingers.", "It is even."],
  explanation: "2 + 2 = 4.",
};

const numericQuestion: PracticeQuestion = {
  id: "num1",
  type: "numeric",
  prompt: "What is the square root of 100?",
  answer: 10,
  tolerance: 0.5,
  unit: "units",
  hints: ["It is between 9 and 11."],
  explanation: "sqrt(100) = 10.",
};

const expressionQuestion: PracticeQuestion = {
  id: "expr1",
  type: "expression",
  prompt: "Simplify 2x + 3x.",
  answer: "5x",
  hints: ["Combine like terms."],
  explanation: "2x + 3x = 5x.",
};

const equationQuestion: PracticeQuestion = {
  id: "eqn1",
  type: "equation",
  prompt: "Write the line through (0, 1) with slope 2.",
  answer: "y = 2x + 1",
  hints: ["Use slope-intercept form."],
  explanation: "y = 2x + 1.",
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("PracticeSet", () => {
  it("grades a correct MC answer and advances the score", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[mcQuestion]} topic="t/score" />);

    expect(screen.getByTestId("practice-score")).toHaveTextContent("Score: 0/1");

    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    const feedback = screen.getByTestId("feedback");
    expect(within(feedback).getByText("Correct")).toBeInTheDocument();
    expect(within(feedback).getByText(/2 \+ 2 = 4/)).toBeInTheDocument();
    expect(screen.getByTestId("practice-score")).toHaveTextContent("Score: 1/1");
  });

  it("marks an incorrect MC answer as incorrect", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[mcQuestion]} topic="t/wrong" />);

    await user.click(screen.getByLabelText("3"));
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(within(screen.getByTestId("feedback")).getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByTestId("practice-score")).toHaveTextContent("Score: 0/1");
  });

  it("grades a numeric answer within tolerance as correct", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[numericQuestion]} topic="t/num" />);

    await user.type(screen.getByLabelText("Answer"), "10.4");
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(within(screen.getByTestId("feedback")).getByText("Correct")).toBeInTheDocument();
  });

  it("accepts an equivalent (non-string-match) expression answer", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[expressionQuestion]} topic="t/expr" />);

    await user.type(screen.getByLabelText("Your answer"), "x + 4x");
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(
      within(screen.getByTestId("feedback")).getByText("Correct"),
    ).toBeInTheDocument();
  });

  it("marks a wrong expression as incorrect", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[expressionQuestion]} topic="t/expr-x" />);

    await user.type(screen.getByLabelText("Your answer"), "6x");
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(
      within(screen.getByTestId("feedback")).getByText("Incorrect"),
    ).toBeInTheDocument();
  });

  it("accepts a rearranged equivalent equation answer", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[equationQuestion]} topic="t/eqn" />);

    await user.type(screen.getByLabelText("Your answer"), "2y = 4x + 2");
    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(
      within(screen.getByTestId("feedback")).getByText("Correct"),
    ).toBeInTheDocument();
  });

  it("reveals a hint on request, one at a time", async () => {
    const user = userEvent.setup();
    render(<PracticeSet questions={[mcQuestion]} topic="t/hint" />);

    expect(screen.queryByText("Count on your fingers.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show a hint/i }));
    expect(screen.getByText("Count on your fingers.")).toBeInTheDocument();
    expect(screen.queryByText("It is even.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /another hint/i }));
    expect(screen.getByText("It is even.")).toBeInTheDocument();
  });

  it("restores answered state from storage on mount (refresh-safe)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <PracticeSet questions={[mcQuestion]} topic="t/persist" />,
    );

    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByTestId("practice-score")).toHaveTextContent("Score: 1/1");

    unmount();
    render(<PracticeSet questions={[mcQuestion]} topic="t/persist" />);

    expect(screen.getByTestId("practice-score")).toHaveTextContent("Score: 1/1");
    expect(within(screen.getByTestId("feedback")).getByText("Correct")).toBeInTheDocument();
  });
});
