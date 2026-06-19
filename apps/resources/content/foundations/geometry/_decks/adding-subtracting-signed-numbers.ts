// Authored mastery deck for the "Adding & Subtracting Signed Numbers" skill.
//
// These are Regents/Honors-LEVEL items — richer and more applied than the bare
// drill (evaluate an expression at given values, chained signed add/sub in a
// real context, "find the change"). They are the "Prove it" gate on the Skill
// Card.
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
    id: "asn-eval-x-minus-y",
    type: "numeric",
    prompt: "Evaluate x − y when x = −4 and y = 7.",
    answer: -11, // -4 - 7 = -11
    tolerance: 0,
    hints: [
      "Substitute carefully: (−4) − (7).",
      "Subtracting a positive moves you left on the number line.",
    ],
    explanation: "x − y = (−4) − 7 = −11.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-eval-a-minus-b-negatives",
    type: "numeric",
    prompt: "Evaluate a − b when a = −6 and b = −9.",
    answer: 3, // -6 - (-9) = -6 + 9 = 3
    tolerance: 0,
    hints: [
      "Subtracting a negative is adding its opposite.",
      "(−6) − (−9) = (−6) + 9.",
    ],
    explanation: "a − b = (−6) − (−9) = −6 + 9 = 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-eval-p-minus-q-plus-r",
    type: "numeric",
    prompt: "Evaluate p − q + r when p = −3, q = 8, and r = −5.",
    answer: -16, // -3 - 8 + (-5) = -16
    tolerance: 0,
    hints: [
      "Work left to right: (−3) − 8, then add (−5).",
      "(−3) − 8 = −11; −11 + (−5) = −16.",
    ],
    explanation: "p − q + r = (−3) − 8 + (−5) = −11 − 5 = −16.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-double-negative",
    type: "numeric",
    prompt: "Find the value of −7 − (−12).",
    answer: 5, // -7 + 12 = 5
    tolerance: 0,
    hints: ["Subtracting −12 is the same as adding 12."],
    explanation: "−7 − (−12) = −7 + 12 = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-add-two-negatives",
    type: "numeric",
    prompt: "Find the value of −9 + (−5).",
    answer: -14, // both negative, sizes add
    tolerance: 0,
    hints: ["Two moves left: 9 left, then 5 more left."],
    explanation: "−9 + (−5) = −14.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-cross-zero",
    type: "numeric",
    prompt: "Find the value of 12 + (−15).",
    answer: -3, // crosses zero
    tolerance: 0,
    hints: ["Start at 12 and move 15 left; you pass 0."],
    explanation: "12 + (−15) = −3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-chained-four",
    type: "numeric",
    prompt: "Simplify −3 + 8 − 11 + 4.",
    answer: -2, // -3+8=5; 5-11=-6; -6+4=-2
    tolerance: 0,
    hints: [
      "Work left to right, one step at a time.",
      "−3 + 8 = 5; 5 − 11 = −6; −6 + 4 = −2.",
    ],
    explanation: "−3 + 8 − 11 + 4 = 5 − 11 + 4 = −6 + 4 = −2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-temperature-change",
    type: "numeric",
    prompt:
      "At dawn the temperature was 5°. By night it had fallen to −8°. What was the change in temperature (final − initial), in degrees?",
    answer: -13, // -8 - 5 = -13
    tolerance: 0,
    unit: "degrees",
    hints: [
      "Change = final − initial.",
      "(−8) − 5: subtracting a positive moves you further left.",
    ],
    explanation:
      "Change = final − initial = (−8) − 5 = −13°, a drop of 13 degrees.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-elevation-diver",
    type: "numeric",
    prompt:
      "A diver is at −18 m (18 m below sea level). She descends 7 m more, then rises 12 m. What is her elevation now, in meters?",
    answer: -13, // -18 - 7 + 12 = -13
    tolerance: 0,
    unit: "m",
    hints: [
      "Descending lowers elevation (subtract); rising raises it (add).",
      "−18 − 7 + 12.",
    ],
    explanation: "−18 − 7 + 12 = −25 + 12 = −13 m.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-account-balance",
    type: "numeric",
    prompt:
      "An account starts at −$25 (overdrawn). A $40 deposit goes in, then a $30 withdrawal comes out. What is the new balance, in dollars?",
    answer: -15, // -25 + 40 - 30 = -15
    tolerance: 0,
    hints: [
      "Deposits add; withdrawals subtract.",
      "−25 + 40 − 30.",
    ],
    explanation: "−25 + 40 − 30 = 15 − 30 = −15 dollars.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-find-the-change",
    type: "numeric",
    prompt:
      "A submarine moves from a depth of −6 m to a depth of −20 m. What is the change in its depth (final − initial), in meters?",
    answer: -14, // -20 - (-6) = -20 + 6 = -14
    tolerance: 0,
    unit: "m",
    hints: [
      "Change = final − initial = (−20) − (−6).",
      "Subtracting −6 is adding 6.",
    ],
    explanation: "(−20) − (−6) = −20 + 6 = −14 m.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-gains-losses",
    type: "numeric",
    prompt:
      "On three plays a team loses 5 yards, gains 12 yards, then loses 8 yards. What is the net yardage?",
    answer: -1, // -5 + 12 - 8 = -1
    tolerance: 0,
    unit: "yards",
    hints: ["A loss is negative, a gain is positive: −5 + 12 − 8."],
    explanation: "−5 + 12 − 8 = 7 − 8 = −1 yard (a net loss of 1).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asn-eval-difference-expr",
    type: "numeric",
    prompt: "Evaluate m − n − k when m = −2, n = −10, and k = 6.",
    answer: 2, // -2 - (-10) - 6 = -2 + 10 - 6 = 2
    tolerance: 0,
    hints: [
      "(−2) − (−10) − 6; subtracting −10 adds 10.",
      "−2 + 10 − 6.",
    ],
    explanation: "m − n − k = (−2) − (−10) − 6 = −2 + 10 − 6 = 2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asn-temp-rise-from-negative",
    type: "numeric",
    prompt:
      "The temperature was −11° and rose 4°, then fell 9°. What is the temperature now, in degrees?",
    answer: -16, // -11 + 4 - 9 = -16
    tolerance: 0,
    unit: "degrees",
    hints: ["A rise adds, a fall subtracts: −11 + 4 − 9."],
    explanation: "−11 + 4 − 9 = −7 − 9 = −16°.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
