/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { isMastered, loadProgress } from "@cameronbrady/math-components/logic";
import { MasteryCheck } from "./MasteryCheck";
import type { DeckItem } from "@/lib/foundations/decks";

const KEY = "resources:progress";

const deck: DeckItem[] = [
  {
    id: "m1",
    type: "numeric",
    prompt: "Evaluate -4 + 7.",
    answer: 3,
    tolerance: 0,
    hints: ["Move 7 right from -4."],
    explanation: "-4 + 7 = 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "m2",
    type: "numeric",
    prompt: "Evaluate -6 - (-9).",
    answer: 3,
    tolerance: 0,
    hints: ["Subtracting -9 adds 9."],
    explanation: "-6 + 9 = 3.",
    difficulty: "stretch",
    source: "authored",
  },
];

// Mock the registry so the test drives a tiny, fully-known deck.
vi.mock("@/lib/foundations/decks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/foundations/decks")>();
  return {
    ...actual,
    resolveDeck: (skill: string) => {
      if (skill === "test-skill") return deck;
      return actual.resolveDeck(skill);
    },
  };
});

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("MasteryCheck", () => {
  it("presents items one at a time and records mastery once all are cleared", async () => {
    const user = userEvent.setup();
    render(<MasteryCheck skill="test-skill" />);

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(false);
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(
      /question 1 of 2/i,
    );
    // Only the first item is shown.
    expect(
      screen.queryByLabelText(/answer to evaluate -6 - \(-9\)/i),
    ).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/answer to evaluate -4 \+ 7/i), "3");
    await user.click(screen.getByRole("button", { name: /check/i }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    // Now on the second (last) item.
    await user.type(
      screen.getByLabelText(/answer to evaluate -6 - \(-9\)/i),
      "3",
    );
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(true);
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(/mastered/i);
  });

  it("a wrong answer does not advance or record, and nothing locks", async () => {
    const user = userEvent.setup();
    render(<MasteryCheck skill="test-skill" />);

    await user.type(screen.getByLabelText(/answer to evaluate -4 \+ 7/i), "99");
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText(/not yet/i)).toBeInTheDocument();
    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(false);
    // Still on item 1 — a miss never advances.
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(
      /question 1 of 2/i,
    );

    // Nothing locks: try again, correctly, and proceed to mastery.
    await user.click(screen.getByRole("button", { name: /try again/i }));
    await user.type(screen.getByLabelText(/answer to evaluate -4 \+ 7/i), "3");
    await user.click(screen.getByRole("button", { name: /check/i }));
    await user.click(screen.getByRole("button", { name: /next question/i }));
    await user.type(
      screen.getByLabelText(/answer to evaluate -6 - \(-9\)/i),
      "3",
    );
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(true);
  });

  it("renders the mastered state on mount when already passed", () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        topics: {
          "test-skill": {
            masteredAt: "2026-01-01T00:00:00.000Z",
            best: { correct: 0, total: 0 },
            answers: {},
          },
        },
      }),
    );
    render(<MasteryCheck skill="test-skill" />);
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(/mastered/i);
  });
});
