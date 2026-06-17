import { describe, expect, it } from "vitest";
import { grade } from "@cameronbrady/math-components/logic";
import {
  resolveDeck,
  validateDeck,
  type DeckItem,
} from "./decks";

const validItem: DeckItem = {
  id: "valid-1",
  type: "numeric",
  prompt: "Evaluate -4 + 7.",
  answer: 3,
  tolerance: 0,
  hints: ["Start at -4 and move 7 right."],
  explanation: "-4 + 7 = 3.",
  difficulty: "core",
  source: "authored",
};

describe("validateDeck", () => {
  it("accepts a well-formed deck and preserves its tags", () => {
    const deck = validateDeck([validItem], "test-skill");
    expect(deck).toHaveLength(1);
    expect(deck[0].difficulty).toBe("core");
    expect(deck[0].source).toBe("authored");
  });

  it("throws loud (naming the skill) when an item is missing its difficulty tag", () => {
    const { difficulty: _omit, ...noDifficulty } = validItem;
    expect(() =>
      validateDeck([noDifficulty as unknown as DeckItem], "test-skill"),
    ).toThrowError(/test-skill/);
  });

  it("throws loud when an item is missing its source tag", () => {
    const { source: _omit, ...noSource } = validItem;
    expect(() =>
      validateDeck([noSource as unknown as DeckItem], "test-skill"),
    ).toThrowError(/source/i);
  });

  it("throws loud when the item is not a usable practice question", () => {
    const broken = { ...validItem, id: 42 } as unknown as DeckItem;
    expect(() => validateDeck([broken], "test-skill")).toThrow();
  });

  it("throws loud when the deck is empty", () => {
    expect(() => validateDeck([], "test-skill")).toThrowError(/test-skill/);
  });
});

describe("resolveDeck (registry)", () => {
  it("resolves the signed-numbers deck by slug", () => {
    const deck = resolveDeck("adding-subtracting-signed-numbers");
    expect(deck.length).toBeGreaterThanOrEqual(10);
  });

  it("fails loud for an unknown skill", () => {
    expect(() => resolveDeck("no-such-skill")).toThrowError(/no-such-skill/);
  });
});

describe("adding-subtracting-signed-numbers deck — math mandate", () => {
  const deck = resolveDeck("adding-subtracting-signed-numbers");

  it("has a grade()-correct stated answer for every item", () => {
    for (const item of deck) {
      const result = grade(item, item.answer);
      expect(result.correct, `item ${item.id} (${item.prompt})`).toBe(true);
    }
  });

  it("mixes core and stretch difficulty", () => {
    const difficulties = new Set(deck.map((i) => i.difficulty));
    expect(difficulties.has("core")).toBe(true);
    expect(difficulties.has("stretch")).toBe(true);
  });

  it("has unique item ids", () => {
    const ids = deck.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
