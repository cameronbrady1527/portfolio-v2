/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { PredictThenCheck } from "./PredictThenCheck";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function subject() {
  return (
    <PredictThenCheck
      prompt="Reflect (3, 1) over the y-axis. Where does it land?"
      choices={["(−3, 1)", "(3, −1)", "(−3, −1)"]}
    >
      <p>The image is (−3, 1): the x-coordinate flips, the y stays.</p>
    </PredictThenCheck>
  );
}

describe("PredictThenCheck", () => {
  it("hides the reveal until a prediction is committed, then shows it beside the prediction", async () => {
    const user = userEvent.setup();
    render(subject());

    expect(screen.queryByText(/The image is/)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("(−3, 1)"));
    await user.click(screen.getByRole("button", { name: "Lock in my prediction" }));

    expect(screen.getByText(/The image is/)).toBeInTheDocument();
    expect(screen.getByText(/You predicted: \(−3, 1\)/)).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });

  it("soft skip reveals without a prediction and records nothing", async () => {
    const user = userEvent.setup();
    render(subject());

    await user.click(screen.getByRole("button", { name: "Skip to the answer" }));

    expect(screen.getByText(/The image is/)).toBeInTheDocument();
    expect(screen.queryByText(/You predicted/)).not.toBeInTheDocument();
    expect(screen.getByText(/No prediction — see for yourself/)).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });
});
