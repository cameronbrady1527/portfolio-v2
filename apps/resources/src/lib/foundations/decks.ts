// Typed registry + validator for authored mastery decks. A deck is a hand-built
// set of Regents/Honors-level items used by the Skill Card's "Prove it" step;
// it lives as code under content/foundations/geometry/_decks/<skill>.ts and is
// imported here (no fs — these are static authored modules).
//
// Like generators.ts and lib/content/support.ts, resolution and validation FAIL
// LOUD: a malformed item or an unknown skill is an authoring mistake we surface
// at build/render with a named error, never a silently-blank or wrong card.

import type { PracticeQuestion } from "@cameronbrady/math-components/logic";
import signedAddSubDeck from "../../../content/foundations/geometry/_decks/adding-subtracting-signed-numbers";
import multDivDeck from "../../../content/foundations/geometry/_decks/multiplication-division-fluency";
import orderOfOperationsDeck from "../../../content/foundations/geometry/_decks/order-of-operations";
import roundingDeck from "../../../content/foundations/geometry/_decks/rounding";
import equivalentFractionsDeck from "../../../content/foundations/geometry/_decks/equivalent-fractions";
import addSubtractFractionsDeck from "../../../content/foundations/geometry/_decks/add-subtract-fractions";
import multiplyDivideFractionsDeck from "../../../content/foundations/geometry/_decks/multiply-divide-fractions";
import ratiosProportionsDeck from "../../../content/foundations/geometry/_decks/ratios-proportions";
import percentsDeck from "../../../content/foundations/geometry/_decks/percents";
import substitutingIntoFormulasDeck from "../../../content/foundations/geometry/_decks/substituting-into-formulas";
import simplifyingExpressionsDeck from "../../../content/foundations/geometry/_decks/simplifying-expressions";
import solvingLinearEquationsDeck from "../../../content/foundations/geometry/_decks/solving-linear-equations";
import powersAndExponentsDeck from "../../../content/foundations/geometry/_decks/powers-and-exponents";
import squareRootsDeck from "../../../content/foundations/geometry/_decks/square-roots";
import exponentRulesDeck from "../../../content/foundations/geometry/_decks/exponent-rules";

/** Authoring difficulty tag. "core" = on-grade; "stretch" = harder/applied. */
export type Difficulty = "core" | "stretch";

/**
 * Provenance tag. "authored" is hub-written; a `regents-<exam>-q<n>` string
 * cites a real released exam item (only ever set by someone working from the
 * actual PDF — never fabricated).
 */
export type DeckSource = "authored" | (string & {});

/** A practice question plus the deck-only authoring tags. */
export type DeckItem = PracticeQuestion & {
  difficulty: Difficulty;
  source: DeckSource;
};

const QUESTION_TYPES = new Set(["mc", "numeric", "expression", "equation"]);

function isQuestionShaped(value: unknown): value is PracticeQuestion {
  if (!value || typeof value !== "object") return false;
  const q = value as Record<string, unknown>;
  if (typeof q.id !== "string" || q.id.trim() === "") return false;
  if (typeof q.type !== "string" || !QUESTION_TYPES.has(q.type)) return false;
  if (typeof q.prompt !== "string") return false;
  if (!Array.isArray(q.hints)) return false;
  if (typeof q.explanation !== "string") return false;
  if (q.type === "mc") {
    return Array.isArray(q.choices) && typeof q.answer === "number";
  }
  if (q.type === "numeric") {
    return typeof q.answer === "number" && typeof q.tolerance === "number";
  }
  // expression | equation
  return typeof q.answer === "string";
}

/**
 * Validate a raw deck for a skill, throwing a descriptive error (naming the
 * skill and the offending item) on any malformed item or an empty deck.
 * Returns the deck unchanged on success.
 */
export function validateDeck(items: unknown, skill: string): DeckItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `Mastery deck for skill "${skill}" is empty or not an array — author at least one item.`,
    );
  }

  items.forEach((item, i) => {
    const where = `item ${i} in deck "${skill}"`;
    if (!isQuestionShaped(item)) {
      throw new Error(
        `Malformed ${where}: not a usable practice question (check id, type, prompt, answer, hints, explanation).`,
      );
    }
    const tagged = item as Record<string, unknown>;
    if (tagged.difficulty !== "core" && tagged.difficulty !== "stretch") {
      throw new Error(
        `Malformed ${where} (id "${(item as DeckItem).id}"): difficulty must be "core" or "stretch".`,
      );
    }
    if (typeof tagged.source !== "string" || tagged.source.trim() === "") {
      throw new Error(
        `Malformed ${where} (id "${(item as DeckItem).id}"): source tag is required (e.g. "authored").`,
      );
    }
  });

  return items as DeckItem[];
}

// Validated at module load so an authoring mistake breaks the build immediately.
const DECKS: Record<string, DeckItem[]> = {
  "adding-subtracting-signed-numbers": validateDeck(
    signedAddSubDeck,
    "adding-subtracting-signed-numbers",
  ),
  "multiplication-division-fluency": validateDeck(
    multDivDeck,
    "multiplication-division-fluency",
  ),
  "order-of-operations": validateDeck(
    orderOfOperationsDeck,
    "order-of-operations",
  ),
  rounding: validateDeck(roundingDeck, "rounding"),
  "equivalent-fractions": validateDeck(
    equivalentFractionsDeck,
    "equivalent-fractions",
  ),
  "add-subtract-fractions": validateDeck(
    addSubtractFractionsDeck,
    "add-subtract-fractions",
  ),
  "multiply-divide-fractions": validateDeck(
    multiplyDivideFractionsDeck,
    "multiply-divide-fractions",
  ),
  "ratios-proportions": validateDeck(
    ratiosProportionsDeck,
    "ratios-proportions",
  ),
  percents: validateDeck(percentsDeck, "percents"),
  "substituting-into-formulas": validateDeck(
    substitutingIntoFormulasDeck,
    "substituting-into-formulas",
  ),
  "simplifying-expressions": validateDeck(
    simplifyingExpressionsDeck,
    "simplifying-expressions",
  ),
  "solving-linear-equations": validateDeck(
    solvingLinearEquationsDeck,
    "solving-linear-equations",
  ),
  "powers-and-exponents": validateDeck(
    powersAndExponentsDeck,
    "powers-and-exponents",
  ),
  "square-roots": validateDeck(squareRootsDeck, "square-roots"),
  "exponent-rules": validateDeck(exponentRulesDeck, "exponent-rules"),
};

/** Resolve a skill's validated mastery deck, failing loud if none is registered. */
export function resolveDeck(skill: string): DeckItem[] {
  const deck = DECKS[skill];
  if (!deck) {
    const known = Object.keys(DECKS).join(", ") || "(none)";
    throw new Error(
      `No mastery deck registered for skill "${skill}". Known skills: ${known}.`,
    );
  }
  return deck;
}
