// Authored mastery deck for the "Ratios & Proportions" skill.
//
// Regents/Honors-LEVEL items — solve a proportion for x by cross-multiplication,
// plus the real-world settings the exam leans on: unit rates, recipe/scaling,
// map and model scale, similar figures, and part-ratios. Answers are `numeric`.
// They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "rp-solve-num",
    type: "numeric",
    prompt: "Solve for x:  3/4 = x/12",
    answer: 9, // 3·12 = 4·x → x = 9
    tolerance: 0,
    hints: ["Cross-multiply: 3 × 12 = 4 × x.", "36 = 4x, so x = 9."],
    explanation: "3/4 = 9/12, because 3 × 12 = 4 × 9 = 36.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-solve-den",
    type: "numeric",
    prompt: "Solve for x:  2/5 = 6/x",
    answer: 15, // 2·x = 5·6 → x = 15
    tolerance: 0,
    hints: ["Cross-multiply: 2 × x = 5 × 6.", "2x = 30, so x = 15."],
    explanation: "2/5 = 6/15, because 2 × 15 = 5 × 6 = 30.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-solve-left",
    type: "numeric",
    prompt: "Solve for x:  x/8 = 9/12",
    answer: 6, // 12·x = 8·9 → x = 6
    tolerance: 0,
    hints: ["Cross-multiply: 12 × x = 8 × 9.", "12x = 72, so x = 6."],
    explanation: "x/8 = 9/12 gives 12x = 72, so x = 6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rp-unit-rate-apples",
    type: "numeric",
    prompt: "If 3 apples cost $1.50, how much do 8 apples cost, in dollars?",
    answer: 4, // $0.50 each × 8
    tolerance: 0,
    unit: "dollars",
    hints: ["Unit price: $1.50 ÷ 3 = $0.50 each.", "$0.50 × 8 = $4.00."],
    explanation: "$1.50 ÷ 3 = $0.50 per apple, so 8 apples cost $4.00.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-unit-price-notebooks",
    type: "numeric",
    prompt: "If 5 notebooks cost $20, what is the cost of one notebook, in dollars?",
    answer: 4, // 20 / 5
    tolerance: 0,
    unit: "dollars",
    hints: ["Unit price = total ÷ quantity.", "$20 ÷ 5 = $4."],
    explanation: "$20 ÷ 5 notebooks = $4 each.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-recipe-scale",
    type: "numeric",
    prompt: "A recipe for 4 people uses 6 eggs. How many eggs are needed for 10 people?",
    answer: 15, // 6/4 = x/10 → x = 15
    tolerance: 0,
    hints: ["Set up 6/4 = x/10.", "Cross-multiply: 4x = 60, so x = 15."],
    explanation: "6/4 = 15/10, so 10 people need 15 eggs.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-speed",
    type: "numeric",
    prompt: "A car travels 120 miles in 2 hours at a steady speed. How far does it travel in 5 hours, in miles?",
    answer: 300, // 60 mph × 5
    tolerance: 0,
    unit: "miles",
    hints: ["Speed = 120 ÷ 2 = 60 mph.", "60 × 5 = 300."],
    explanation: "120 mi ÷ 2 h = 60 mph, so in 5 h it goes 300 miles.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-ratio-parts",
    type: "numeric",
    prompt: "The ratio of boys to girls in a club is 2 to 3. If there are 12 boys, how many girls are there?",
    answer: 18, // 2/3 = 12/x → x = 18
    tolerance: 0,
    hints: ["Set up 2/3 = 12/x.", "Cross-multiply: 2x = 36, so x = 18."],
    explanation: "2/3 = 12/18, so there are 18 girls.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rp-pizza-scale",
    type: "numeric",
    prompt: "If 4 pizzas feed 10 people, how many pizzas are needed to feed 25 people?",
    answer: 10, // 4/10 = x/25 → x = 10
    tolerance: 0,
    hints: ["Set up 4/10 = x/25.", "Cross-multiply: 10x = 100, so x = 10."],
    explanation: "4/10 = 10/25, so 25 people need 10 pizzas.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rp-map-scale",
    type: "numeric",
    prompt: "On a map, 2 cm represents 5 km. How many km does 7 cm represent?",
    answer: 17.5, // 5/2 per cm × 7
    tolerance: 0,
    unit: "km",
    hints: ["Each cm is 5 ÷ 2 = 2.5 km.", "2.5 × 7 = 17.5."],
    explanation: "2 cm → 5 km means 2.5 km per cm, so 7 cm → 17.5 km.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rp-similar-rectangles",
    type: "numeric",
    prompt:
      "Two rectangles are similar. The small one is 3 by 5. The large one's shorter side is 12. What is its longer side?",
    answer: 20, // 3/5 = 12/x → x = 20
    tolerance: 0,
    hints: ["Matching sides keep the same ratio: 3/5 = 12/x.", "Cross-multiply: 3x = 60, so x = 20."],
    explanation: "3/5 = 12/20, so the longer side is 20.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rp-model-scale",
    type: "numeric",
    prompt: "A model is built at a scale of 1 to 50. If the model is 8 cm long, how long is the real object, in cm?",
    answer: 400, // 8 × 50
    tolerance: 0,
    unit: "cm",
    hints: ["Each model cm stands for 50 real cm.", "8 × 50 = 400."],
    explanation: "Scale 1:50 means real = 50 × model = 50 × 8 = 400 cm.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
