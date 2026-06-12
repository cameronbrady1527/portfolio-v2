/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Step, WorkedExample } from "./WorkedExample";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("WorkedExample", () => {
  it("shows only the first step, then reveals the next on demand", async () => {
    const user = userEvent.setup();
    render(
      <WorkedExample title="Rotate the point">
        <Step>Write down the rule.</Step>
        <Step>Substitute the coordinates.</Step>
      </WorkedExample>,
    );

    expect(screen.getByText("Write down the rule.")).toBeInTheDocument();
    expect(screen.queryByText("Substitute the coordinates.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByText("Substitute the coordinates.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
  });

  it("gates the next reveal behind a self-check; a wrong attempt gives feedback and unblocks", async () => {
    const user = userEvent.setup();
    render(
      <WorkedExample title="Rotate the point">
        <Step
          check={{
            id: "gate-1",
            type: "mc",
            prompt: "What does (x, y) map to under a 90° CCW rotation?",
            choices: ["(−y, x)", "(y, −x)"],
            answer: 0,
            hints: ["Counter-clockwise sends (1, 0) to (0, 1)."],
            explanation: "A 90° CCW rotation about the origin sends (x, y) to (−y, x).",
          }}
        >
          Recall the rule.
        </Step>
        <Step>Apply it.</Step>
      </WorkedExample>,
    );

    expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();

    await user.click(screen.getByLabelText("(y, −x)"));
    await user.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();

    const next = screen.getByRole("button", { name: "Next step" });
    expect(next).toBeEnabled();
    await user.click(next);
    expect(screen.getByText("Apply it.")).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });
});
