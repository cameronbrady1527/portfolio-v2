// Authored mastery deck for the "Exponent Rules" skill.
//
// Regents/Honors-LEVEL items — the product rule (add exponents), quotient rule
// (subtract), and power-of-a-power (multiply), asked for the resulting exponent
// so grading is exact; plus one "evaluate as a number" and one multiple choice
// targeting the add-vs-multiply confusion. They are the "Prove it" gate on the
// Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "er-product",
    type: "numeric",
    prompt: "Write 3⁴ × 3² as a single power of 3. What is the exponent?",
    answer: 6, // 4 + 2
    tolerance: 0,
    hints: ["Same base, multiplication → add the exponents.", "4 + 2 = 6."],
    explanation: "3⁴ × 3² = 3⁶ (add exponents); the exponent is 6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-product-var",
    type: "numeric",
    prompt: "Write a² · a⁶ as a single power of a. What is the exponent?",
    answer: 8, // 2 + 6
    tolerance: 0,
    hints: ["Add the exponents.", "2 + 6 = 8."],
    explanation: "a² · a⁶ = a⁸; the exponent is 8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-product-equal",
    type: "numeric",
    prompt: "Write 4³ × 4³ as a single power of 4. What is the exponent?",
    answer: 6, // 3 + 3
    tolerance: 0,
    hints: ["Add the exponents: 3 + 3.", "= 6."],
    explanation: "4³ × 4³ = 4⁶; the exponent is 6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-quotient",
    type: "numeric",
    prompt: "Write 5⁷ ÷ 5³ as a single power of 5. What is the exponent?",
    answer: 4, // 7 − 3
    tolerance: 0,
    hints: ["Same base, division → subtract the exponents.", "7 − 3 = 4."],
    explanation: "5⁷ ÷ 5³ = 5⁴ (subtract exponents); the exponent is 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-quotient-7",
    type: "numeric",
    prompt: "Write 7⁶ ÷ 7² as a single power of 7. What is the exponent?",
    answer: 4, // 6 − 2
    tolerance: 0,
    hints: ["Subtract the exponents: 6 − 2.", "= 4."],
    explanation: "7⁶ ÷ 7² = 7⁴; the exponent is 4.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "er-quotient-8",
    type: "numeric",
    prompt: "Write 8⁹ ÷ 8⁵ as a single power of 8. What is the exponent?",
    answer: 4, // 9 − 5
    tolerance: 0,
    hints: ["Subtract: 9 − 5.", "= 4."],
    explanation: "8⁹ ÷ 8⁵ = 8⁴; the exponent is 4.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "er-power",
    type: "numeric",
    prompt: "Write (2³)² as a single power of 2. What is the exponent?",
    answer: 6, // 3 × 2
    tolerance: 0,
    hints: ["A power raised to a power → multiply the exponents.", "3 × 2 = 6."],
    explanation: "(2³)² = 2⁶ (multiply exponents); the exponent is 6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-power-10",
    type: "numeric",
    prompt: "Write (10²)³ as a single power of 10. What is the exponent?",
    answer: 6, // 2 × 3
    tolerance: 0,
    hints: ["Multiply the exponents: 2 × 3.", "= 6."],
    explanation: "(10²)³ = 10⁶; the exponent is 6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "er-power-5",
    type: "numeric",
    prompt: "Write (5²)⁴ as a single power of 5. What is the exponent?",
    answer: 8, // 2 × 4
    tolerance: 0,
    hints: ["Multiply: 2 × 4.", "= 8."],
    explanation: "(5²)⁴ = 5⁸; the exponent is 8.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "er-evaluate-product",
    type: "numeric",
    prompt: "Evaluate 2³ × 2² as a single number.",
    answer: 32, // 2⁵ = 32
    tolerance: 0,
    hints: ["Add exponents: 2³ × 2² = 2⁵.", "2⁵ = 32."],
    explanation: "2³ × 2² = 2⁵ = 32.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "er-product-x",
    type: "numeric",
    prompt: "Write x⁵ · x⁴ as a single power of x. What is the exponent?",
    answer: 9, // 5 + 4
    tolerance: 0,
    hints: ["Add the exponents: 5 + 4.", "= 9."],
    explanation: "x⁵ · x⁴ = x⁹; the exponent is 9.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "er-rule-mc",
    type: "mc",
    prompt: "Which is equal to 3² × 3⁴?",
    choices: ["3⁶", "3⁸", "9⁶", "3²"],
    answer: 0, // add exponents, keep base
    hints: ["Same base: add the exponents, keep the base.", "2 + 4 = 6, base stays 3."],
    explanation: "3² × 3⁴ = 3⁶. You add exponents (not multiply them) and the base stays 3 (not 9).",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
