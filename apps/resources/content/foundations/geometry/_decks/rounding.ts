// Authored mastery deck for the "Rounding" skill.
//
// Regents/Honors-LEVEL items — place-value rounding (ten / hundred / thousand),
// rounding decimals, estimation, and the real-world cases that decide the
// DIRECTION: "how many buses/boxes" rounds UP (ceiling), while "how many can you
// buy/fit" rounds DOWN (floor). They are the "Prove it" gate on the Skill Card.
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
    id: "rd-nearest-ten-up",
    type: "numeric",
    prompt: "Round 47 to the nearest ten.",
    answer: 50, // ones digit 7 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the ones digit: 7.", "7 is 5 or more, so round up to 50."],
    explanation: "47 → the ones digit 7 is ≥ 5, so round up to 50.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-nearest-ten-down",
    type: "numeric",
    prompt: "Round 832 to the nearest ten.",
    answer: 830, // ones digit 2 < 5 → down
    tolerance: 0,
    hints: ["Look at the ones digit: 2.", "2 is less than 5, so round down to 830."],
    explanation: "832 → the ones digit 2 is < 5, so round down to 830.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-nearest-hundred",
    type: "numeric",
    prompt: "Round 3472 to the nearest hundred.",
    answer: 3500, // tens digit 7 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the tens digit: 7.", "7 is ≥ 5, so the hundreds round up to 3500."],
    explanation: "3472 → the tens digit 7 is ≥ 5, so round up to 3500.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-nearest-thousand-up",
    type: "numeric",
    prompt: "Round 28617 to the nearest thousand.",
    answer: 29000, // hundreds digit 6 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the hundreds digit: 6.", "6 is ≥ 5, so the thousands round up to 29000."],
    explanation: "28617 → the hundreds digit 6 is ≥ 5, so round up to 29000.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-nearest-thousand-down",
    type: "numeric",
    prompt: "Round 7851 to the nearest thousand.",
    answer: 8000, // hundreds digit 8 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the hundreds digit: 8.", "8 is ≥ 5, so round up to 8000."],
    explanation: "7851 → the hundreds digit 8 is ≥ 5, so round up to 8000.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-decimal-whole",
    type: "numeric",
    prompt: "Round 6.7 to the nearest whole number.",
    answer: 7, // tenths digit 7 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the tenths digit: 7.", "7 is ≥ 5, so round up to 7."],
    explanation: "6.7 → the tenths digit 7 is ≥ 5, so round up to 7.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-decimal-tenth",
    type: "numeric",
    prompt: "Round 3.48 to the nearest tenth.",
    answer: 3.5, // hundredths digit 8 ≥ 5 → up
    tolerance: 0,
    hints: ["Look at the hundredths digit: 8.", "8 is ≥ 5, so the tenths round up to 3.5."],
    explanation: "3.48 → the hundredths digit 8 is ≥ 5, so round up to 3.5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rd-estimate-sum",
    type: "numeric",
    prompt:
      "Estimate 412 + 589 by first rounding each number to the nearest hundred, then adding.",
    answer: 1000, // 400 + 600
    tolerance: 0,
    hints: ["412 rounds to 400; 589 rounds to 600.", "400 + 600 = 1000."],
    explanation: "412 → 400 and 589 → 600, so the estimate is 400 + 600 = 1000.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rd-buses-up",
    type: "numeric",
    prompt:
      "A school bus seats 44 students. 310 students are going on a trip. How many buses are needed?",
    answer: 8, // 310 ÷ 44 = 7 r 2 → round UP to 8
    tolerance: 0,
    hints: ["310 ÷ 44 = 7 remainder 2.", "The leftover 2 students still need a bus, so round up to 8."],
    explanation:
      "310 ÷ 44 = 7 remainder 2. The 2 extra students need their own bus, so 8 buses.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "rd-boxes-up",
    type: "numeric",
    prompt: "Each box holds 12 cans. You need to pack 100 cans. How many boxes are needed?",
    answer: 9, // 100 ÷ 12 = 8 r 4 → round UP to 9
    tolerance: 0,
    hints: ["100 ÷ 12 = 8 remainder 4.", "The leftover 4 cans need a 9th box."],
    explanation: "100 ÷ 12 = 8 remainder 4, and the leftover cans need one more box → 9 boxes.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-vans-up",
    type: "numeric",
    prompt: "Each van holds 9 people. A team of 50 needs rides. How many vans are needed?",
    answer: 6, // 50 ÷ 9 = 5 r 5 → round UP to 6
    tolerance: 0,
    hints: ["50 ÷ 9 = 5 remainder 5.", "The leftover 5 people need a 6th van."],
    explanation: "50 ÷ 9 = 5 remainder 5, and the leftover people need one more van → 6 vans.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "rd-budget-down",
    type: "numeric",
    prompt:
      "Pens cost $3 each. With $20 to spend, how many whole pens can you buy?",
    answer: 6, // 20 ÷ 3 = 6 r 2 → round DOWN (can't afford a 7th)
    tolerance: 0,
    hints: ["20 ÷ 3 = 6 remainder 2.", "You can't afford a 7th pen, so round DOWN to 6."],
    explanation:
      "20 ÷ 3 = 6 remainder 2. A 7th pen would cost more than you have, so round down → 6 pens. (Not every real-world rounding goes up.)",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
