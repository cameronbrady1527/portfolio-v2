// Authored mastery deck for the "Multiplication & Division Fluency" skill.
//
// Regents/Honors-LEVEL items — richer and more applied than the bare drill:
// multi-digit products, exact division, interpreting a remainder in context,
// unit rates, unit price, area, and gentle decimals. They are the "Prove it"
// gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Genuinely exam-sourced items (tagged
// `regents-<exam>-q<n>`) can be appended later by someone working from the
// official PDFs — do NOT fabricate citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "mdf-basic-product",
    type: "numeric",
    prompt: "What is 12 × 8?",
    answer: 96, // 12·8 = 96
    tolerance: 0,
    hints: ["10 × 8 = 80, and 2 × 8 = 16; add them.", "80 + 16 = 96."],
    explanation: "12 × 8 = (10 × 8) + (2 × 8) = 80 + 16 = 96.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-two-digit-product",
    type: "numeric",
    prompt: "Multiply 23 × 14.",
    answer: 322, // 23·14 = 230 + 92 = 322
    tolerance: 0,
    hints: ["23 × 10 = 230, and 23 × 4 = 92.", "230 + 92 = 322."],
    explanation: "23 × 14 = (23 × 10) + (23 × 4) = 230 + 92 = 322.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-exact-division",
    type: "numeric",
    prompt: "Divide 144 ÷ 9.",
    answer: 16, // 9·16 = 144
    tolerance: 0,
    hints: ["9 times what makes 144?", "9 × 16 = 144."],
    explanation: "144 ÷ 9 = 16, because 9 × 16 = 144.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-large-division",
    type: "numeric",
    prompt: "Divide 252 ÷ 7.",
    answer: 36, // 7·36 = 252
    tolerance: 0,
    hints: ["7 × 30 = 210, leaving 42; 7 × 6 = 42.", "30 + 6 = 36."],
    explanation: "252 ÷ 7 = 36, because 7 × 36 = 252.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-remainder-in-context",
    type: "numeric",
    prompt:
      "A baker packs 8 muffins in each box. She has 100 muffins. How many FULL boxes can she fill?",
    answer: 12, // floor(100 / 8) = 12 (4 muffins left over, not a full box)
    tolerance: 0,
    hints: [
      "100 ÷ 8 = 12 remainder 4.",
      "Only full boxes count, so drop the leftover.",
    ],
    explanation:
      "100 ÷ 8 = 12 remainder 4. The 4 leftover muffins don't fill a box, so 12 full boxes.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf-unit-rate-distance",
    type: "numeric",
    prompt: "A car travels 60 miles per hour. How far does it travel in 7 hours, in miles?",
    answer: 420, // 60·7 = 420
    tolerance: 0,
    unit: "miles",
    hints: ["Distance = rate × time.", "60 × 7 = 420."],
    explanation: "Distance = 60 mi/h × 7 h = 420 miles.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-unit-price",
    type: "numeric",
    prompt: "A pack of 12 pens costs $36. What is the cost of one pen, in dollars?",
    answer: 3, // 36 / 12 = 3
    tolerance: 0,
    unit: "dollars",
    hints: ["Unit price = total ÷ quantity.", "36 ÷ 12 = 3."],
    explanation: "$36 ÷ 12 pens = $3 per pen.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-rectangle-area",
    type: "numeric",
    prompt: "A rectangle is 15 cm by 6 cm. What is its area, in square centimeters?",
    answer: 90, // 15·6 = 90
    tolerance: 0,
    unit: "cm²",
    hints: ["Area of a rectangle = length × width.", "15 × 6 = 90."],
    explanation: "Area = 15 cm × 6 cm = 90 cm².",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-array-total",
    type: "numeric",
    prompt: "A theater has 24 rows with 18 seats in each row. How many seats are there in total?",
    answer: 432, // 24·18 = 432
    tolerance: 0,
    hints: ["Total = rows × seats per row.", "24 × 18 = (24 × 20) − (24 × 2) = 480 − 48 = 432."],
    explanation: "24 rows × 18 seats = 432 seats.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf-decimal-product",
    type: "numeric",
    prompt: "What is 2.5 × 4?",
    answer: 10, // 2.5·4 = 10
    tolerance: 0,
    hints: ["2.5 is two-and-a-half; four of them.", "2.5 × 4 = 10."],
    explanation: "2.5 × 4 = 10.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf-decimal-money",
    type: "numeric",
    prompt: "A notebook costs $1.25. How much do 6 notebooks cost, in dollars?",
    answer: 7.5, // 1.25·6 = 7.50
    tolerance: 0,
    unit: "dollars",
    hints: ["1.25 × 6: think 6 × $1 plus 6 × $0.25.", "$6.00 + $1.50 = $7.50."],
    explanation: "$1.25 × 6 = $7.50.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf-missing-factor",
    type: "numeric",
    prompt: "Two numbers multiply to 48, and one of them is 6. What is the other number?",
    answer: 8, // 48 / 6 = 8
    tolerance: 0,
    hints: ["6 times what makes 48?", "48 ÷ 6 = 8."],
    explanation: "6 × 8 = 48, so the missing factor is 8.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
