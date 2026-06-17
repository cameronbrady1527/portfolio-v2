/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { signedAddSub } from "@cameronbrady/math-components/logic";
import { Drill } from "./Drill";

afterEach(cleanup);

// Re-derive the right answer from the rendered prompt ("−7 − (−3) = ?") so the
// smoke test never hardcodes a seed's output — it just exercises the wiring.
function answerFromPrompt(prompt: string): number {
  const core = prompt.replace(/\s*=\s*\?$/, "").trim();
  const m = core.match(/^(.+?)\s*([+−])\s*(.+)$/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const toInt = (s: string) => Number(s.replace(/[()]/g, "").replace(/−/g, "-"));
  const a = toInt(m[1]);
  const b = toInt(m[3]);
  return m[2] === "+" ? a + b : a - b;
}

describe("Drill", () => {
  it("renders a generated problem and an answer input", () => {
    render(<Drill generator={signedAddSub} level={1} seed={42} />);
    expect(screen.getByTestId("drill-prompt")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("accepts a correct answer: shows Correct and advances the streak", async () => {
    const user = userEvent.setup();
    render(<Drill generator={signedAddSub} level={1} seed={42} />);

    const answer = answerFromPrompt(screen.getByTestId("drill-prompt").textContent ?? "");
    await user.type(screen.getByRole("textbox"), String(answer));
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId("drill-streak")).toHaveTextContent("1");
  });

  it("a wrong answer shows Incorrect and resets the streak to zero", async () => {
    const user = userEvent.setup();
    render(<Drill generator={signedAddSub} level={1} seed={42} />);

    const answer = answerFromPrompt(screen.getByTestId("drill-prompt").textContent ?? "");
    await user.type(screen.getByRole("textbox"), String(answer + 100));
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText(/not quite|incorrect/i)).toBeInTheDocument();
    expect(screen.getByTestId("drill-streak")).toHaveTextContent("0");
  });
});
