// Authored mastery deck for the "Order of Operations" skill.
//
// Regents/Honors-LEVEL items — the cases where precedence actually changes the
// answer: parentheses vs none, exponents, nested grouping, division bars, and a
// real-world expression. They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Genuinely exam-sourced items (tagged
// `regents-<exam>-q<n>`) can be appended later by someone working from the
// official PDFs — do NOT fabricate citations.
//
// Every stated answer follows correct order of operations (PEMDAS), is verified
// by hand AND asserted grade()-correct in decks.test.ts (the math mandate).
// Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "oo-mult-before-add",
    type: "numeric",
    prompt: "Evaluate 4 + 3 × 5.",
    answer: 19, // 3×5 = 15 first, then 4 + 15
    tolerance: 0,
    hints: ["Multiply before you add.", "3 × 5 = 15, then 4 + 15 = 19."],
    explanation: "4 + 3 × 5 = 4 + 15 = 19 (multiplication before addition).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-parens-change-it",
    type: "numeric",
    prompt: "Evaluate (4 + 3) × 5.",
    answer: 35, // parentheses first: 7 × 5
    tolerance: 0,
    hints: ["Parentheses first.", "4 + 3 = 7, then 7 × 5 = 35."],
    explanation: "(4 + 3) × 5 = 7 × 5 = 35 — the parentheses change the answer.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-exponent-then-add",
    type: "numeric",
    prompt: "Evaluate 2 + 3².",
    answer: 11, // 3² = 9, then 2 + 9
    tolerance: 0,
    hints: ["Exponents come before addition.", "3² = 9, then 2 + 9 = 11."],
    explanation: "2 + 3² = 2 + 9 = 11.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-divide-before-subtract",
    type: "numeric",
    prompt: "Evaluate 20 − 12 ÷ 4.",
    answer: 17, // 12÷4 = 3 first, then 20 − 3
    tolerance: 0,
    hints: ["Divide before you subtract.", "12 ÷ 4 = 3, then 20 − 3 = 17."],
    explanation: "20 − 12 ÷ 4 = 20 − 3 = 17.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-exponent-times",
    type: "numeric",
    prompt: "Evaluate 5 × 2³.",
    answer: 40, // 2³ = 8, then 5 × 8
    tolerance: 0,
    hints: ["Exponent before multiplication.", "2³ = 8, then 5 × 8 = 40."],
    explanation: "5 × 2³ = 5 × 8 = 40.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-two-groups",
    type: "numeric",
    prompt: "Evaluate (12 − 4) × (3 + 2).",
    answer: 40, // 8 × 5
    tolerance: 0,
    hints: ["Do each parenthesis first.", "12 − 4 = 8 and 3 + 2 = 5, then 8 × 5 = 40."],
    explanation: "(12 − 4) × (3 + 2) = 8 × 5 = 40.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-subtract-grouped-product",
    type: "numeric",
    prompt: "Evaluate 50 − 2 × (6 + 4).",
    answer: 30, // (6+4)=10, 2×10=20, 50−20
    tolerance: 0,
    hints: ["Parentheses, then multiply, then subtract.", "6 + 4 = 10; 2 × 10 = 20; 50 − 20 = 30."],
    explanation: "50 − 2 × (6 + 4) = 50 − 2 × 10 = 50 − 20 = 30.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "oo-division-bar",
    type: "numeric",
    prompt: "Evaluate (18 + 6) ÷ (2 × 3).",
    answer: 4, // 24 ÷ 6
    tolerance: 0,
    hints: ["Simplify top and bottom first.", "18 + 6 = 24 and 2 × 3 = 6, then 24 ÷ 6 = 4."],
    explanation: "(18 + 6) ÷ (2 × 3) = 24 ÷ 6 = 4.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "oo-nested-exponent",
    type: "numeric",
    prompt: "Evaluate 3 × (8 − 2)² ÷ 9.",
    answer: 12, // (8−2)=6, 6²=36, 3×36=108, 108÷9=12
    tolerance: 0,
    hints: [
      "Parentheses, then the exponent, then × and ÷ left to right.",
      "8 − 2 = 6; 6² = 36; 3 × 36 = 108; 108 ÷ 9 = 12.",
    ],
    explanation: "3 × (8 − 2)² ÷ 9 = 3 × 36 ÷ 9 = 108 ÷ 9 = 12.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "oo-square-minus-product",
    type: "numeric",
    prompt: "Evaluate 7² − 4 × 11.",
    answer: 5, // 49 − 44
    tolerance: 0,
    hints: ["Exponent and product before subtracting.", "7² = 49; 4 × 11 = 44; 49 − 44 = 5."],
    explanation: "7² − 4 × 11 = 49 − 44 = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "oo-precedence-negative",
    type: "numeric",
    prompt: "Evaluate 4 − 2 × 9.",
    answer: -14, // 2×9 = 18 first, then 4 − 18
    tolerance: 0,
    hints: ["Multiply first, even though subtraction comes earlier in reading.", "2 × 9 = 18, then 4 − 18 = −14."],
    explanation: "4 − 2 × 9 = 4 − 18 = −14 (multiply before subtracting).",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "oo-real-world-cost",
    type: "numeric",
    prompt:
      "A shop charges a $5 base fee plus $3 per item. The total for 4 items is 5 + 3 × 4. Evaluate it (in dollars).",
    answer: 17, // 3×4 = 12, then 5 + 12
    tolerance: 0,
    unit: "dollars",
    hints: ["The per-item charge multiplies first.", "3 × 4 = 12, then 5 + 12 = 17."],
    explanation: "5 + 3 × 4 = 5 + 12 = $17 (the $3 applies to each of the 4 items first).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "oo-all-four-operations",
    type: "numeric",
    prompt: "Evaluate 6 + 8 ÷ 2 − 3 × 2.",
    answer: 4, // 8÷2=4, 3×2=6; 6 + 4 − 6
    tolerance: 0,
    hints: [
      "Do all × and ÷ first (left to right), then + and −.",
      "8 ÷ 2 = 4 and 3 × 2 = 6, then 6 + 4 − 6 = 4.",
    ],
    explanation: "6 + 8 ÷ 2 − 3 × 2 = 6 + 4 − 6 = 4.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
