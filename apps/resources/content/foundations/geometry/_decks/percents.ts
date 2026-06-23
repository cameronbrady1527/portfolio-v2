// Authored mastery deck for the "Percents" skill.
//
// Regents/Honors-LEVEL items — percent of a number, "what percent", "percent of
// what", and the everyday settings: discount, sale price, tax, tip, and percent
// increase. Answers are `numeric` (a count, an amount, or a percent). They are
// the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "pct-of-30-60",
    type: "numeric",
    prompt: "What is 30% of 60?",
    answer: 18, // 0.30 × 60
    tolerance: 0,
    hints: ["30% = 30/100.", "(30/100) × 60 = 18."],
    explanation: "30% of 60 = 0.30 × 60 = 18.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-of-15-200",
    type: "numeric",
    prompt: "What is 15% of 200?",
    answer: 30, // 0.15 × 200
    tolerance: 0,
    hints: ["15% = 15/100.", "(15/100) × 200 = 30."],
    explanation: "15% of 200 = 0.15 × 200 = 30.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-of-75-80",
    type: "numeric",
    prompt: "What is 75% of 80?",
    answer: 60, // 0.75 × 80
    tolerance: 0,
    hints: ["75% = 3/4.", "3/4 of 80 = 60."],
    explanation: "75% of 80 = 0.75 × 80 = 60.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-what-12-48",
    type: "numeric",
    prompt: "12 is what percent of 48?",
    answer: 25, // 12/48 = 0.25
    tolerance: 0,
    unit: "%",
    hints: ["Percent = part ÷ whole × 100.", "12 ÷ 48 = 0.25, ×100 = 25%."],
    explanation: "12/48 = 1/4 = 25%.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-what-9-30",
    type: "numeric",
    prompt: "9 is what percent of 30?",
    answer: 30, // 9/30 = 0.30
    tolerance: 0,
    unit: "%",
    hints: ["9 ÷ 30 = 0.30.", "×100 → 30%."],
    explanation: "9/30 = 0.30 = 30%.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-whole-20-30",
    type: "numeric",
    prompt: "20% of what number is 30?",
    answer: 150, // 30 ÷ 0.20
    tolerance: 0,
    hints: ["part/whole = 20/100, with part = 30.", "30 ÷ 0.20 = 150."],
    explanation: "20% of 150 is 30, since 30/150 = 20/100.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pct-whole-40-24",
    type: "numeric",
    prompt: "40% of what number is 24?",
    answer: 60, // 24 ÷ 0.40
    tolerance: 0,
    hints: ["part/whole = 40/100, with part = 24.", "24 ÷ 0.40 = 60."],
    explanation: "40% of 60 is 24, since 24/60 = 40/100.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pct-discount",
    type: "numeric",
    prompt: "A $80 jacket is marked 25% off. How much is the discount, in dollars?",
    answer: 20, // 0.25 × 80
    tolerance: 0,
    unit: "dollars",
    hints: ["The discount is 25% of $80.", "0.25 × 80 = 20."],
    explanation: "25% of $80 = $20 off.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-sale-price",
    type: "numeric",
    prompt: "A $50 item is 10% off. What is the sale price, in dollars?",
    answer: 45, // 50 − 5
    tolerance: 0,
    unit: "dollars",
    hints: ["10% of $50 = $5 off.", "$50 − $5 = $45."],
    explanation: "10% of $50 is $5, so the sale price is $50 − $5 = $45.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pct-tip",
    type: "numeric",
    prompt: "Find a 20% tip on a $35 bill, in dollars.",
    answer: 7, // 0.20 × 35
    tolerance: 0,
    unit: "dollars",
    hints: ["20% = 1/5.", "1/5 of $35 = $7."],
    explanation: "20% of $35 = 0.20 × 35 = $7.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pct-tax-total",
    type: "numeric",
    prompt: "A $40 meal has 8% sales tax added. What is the total cost, in dollars?",
    answer: 43.2, // 40 + 3.20
    tolerance: 0,
    unit: "dollars",
    hints: ["Tax is 8% of $40 = $3.20.", "$40 + $3.20 = $43.20."],
    explanation: "8% of $40 = $3.20, so the total is $40 + $3.20 = $43.20.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pct-increase",
    type: "numeric",
    prompt: "A town's population grows from 200 to 250. What is the percent increase?",
    answer: 25, // change 50 over original 200
    tolerance: 0,
    unit: "%",
    hints: ["Percent change = increase ÷ original × 100.", "50 ÷ 200 = 0.25 → 25%."],
    explanation: "Increase = 50; 50/200 = 0.25 = 25%.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
