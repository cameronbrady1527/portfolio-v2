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
  it("records the mastery flag once every item is answered correctly", async () => {
    const user = userEvent.setup();
    render(<MasteryCheck skill="test-skill" />);

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(false);

    const checks = screen.getAllByRole("button", { name: /check/i });
    await user.type(screen.getByLabelText(/answer to evaluate -4 \+ 7/i), "3");
    await user.click(checks[0]);
    await user.type(
      screen.getByLabelText(/answer to evaluate -6 - \(-9\)/i),
      "3",
    );
    await user.click(
      screen.getAllByRole("button", { name: /check/i })[0],
    );

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(true);
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(/mastered/i);
  });

  it("does NOT record mastery when an item is wrong (and nothing locks)", async () => {
    const user = userEvent.setup();
    render(<MasteryCheck skill="test-skill" />);

    await user.type(screen.getByLabelText(/answer to evaluate -4 \+ 7/i), "3");
    await user.click(screen.getAllByRole("button", { name: /check/i })[0]);
    await user.type(
      screen.getByLabelText(/answer to evaluate -6 - \(-9\)/i),
      "99",
    );
    await user.click(screen.getAllByRole("button", { name: /check/i })[0]);

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(false);

    // Nothing locks: the wrong item is re-answerable. Try again, correctly.
    await user.click(screen.getByRole("button", { name: /try again/i }));
    await user.type(
      screen.getByLabelText(/answer to evaluate -6 - \(-9\)/i),
      "3",
    );
    await user.click(screen.getAllByRole("button", { name: /check/i })[0]);

    expect(isMastered(loadProgress(KEY), "test-skill")).toBe(true);
  });

  it("renders the mastered state on mount when already passed", () => {
    render(<MasteryCheck skill="adding-subtracting-signed-numbers" />);
    // Pre-seed mastery and re-render.
    cleanup();
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        topics: { "test-skill": { masteredAt: "2026-01-01T00:00:00.000Z", best: { correct: 0, total: 0 }, answers: {} } },
      }),
    );
    render(<MasteryCheck skill="test-skill" />);
    expect(screen.getByTestId("mastery-status")).toHaveTextContent(/mastered/i);
  });
});
