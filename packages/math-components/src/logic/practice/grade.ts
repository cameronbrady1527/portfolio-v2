// Pure grading for practice questions. No DOM, no side effects.

import {
  checkEquationAnswer,
  checkExpressionAnswer,
} from "./expression";

export type PracticeQuestion =
  | {
      id: string;
      type: "mc";
      prompt: string;
      choices: string[];
      answer: number;
      hints: string[];
      explanation: string;
    }
  | {
      id: string;
      type: "numeric";
      prompt: string;
      answer: number;
      tolerance: number;
      unit?: string;
      hints: string[];
      explanation: string;
    }
  | {
      id: string;
      type: "expression";
      prompt: string;
      /** The canonical correct expression, e.g. "5x" or "x^2 - 1". */
      answer: string;
      /** Variables to sample over (union with those in the answer is used). */
      variables?: string[];
      hints: string[];
      explanation: string;
    }
  | {
      id: string;
      type: "equation";
      prompt: string;
      /** The canonical correct equation, e.g. "y = 2x + 1". */
      answer: string;
      variables?: string[];
      hints: string[];
      explanation: string;
    };

export type GradeResult = {
  correct: boolean;
};

/**
 * Grade a response against a question.
 *
 * The response shape depends on the question type:
 *   - "mc"        → the chosen choice index (number)
 *   - "numeric"   → the entered number
 *   - "expression"/"equation" → the raw text the student typed (string)
 *
 * Expression/equation answers are judged by parse + numeric-equivalence, never
 * string match, so any algebraically-equal form is accepted. A student input
 * that fails to parse is simply incorrect.
 */
export function grade(
  question: PracticeQuestion,
  response: number | string,
): GradeResult {
  switch (question.type) {
    case "mc":
      return { correct: response === question.answer };

    case "numeric": {
      const value = typeof response === "number" ? response : Number.NaN;
      if (!Number.isFinite(value)) return { correct: false };
      return {
        correct: Math.abs(value - question.answer) <= question.tolerance,
      };
    }

    case "expression": {
      const text = typeof response === "string" ? response : String(response);
      if (text.trim() === "") return { correct: false };
      return {
        correct: checkExpressionAnswer(
          text,
          question.answer,
          question.variables ?? [],
        ),
      };
    }

    case "equation": {
      const text = typeof response === "string" ? response : String(response);
      if (text.trim() === "") return { correct: false };
      return {
        correct: checkEquationAnswer(
          text,
          question.answer,
          question.variables ?? [],
        ),
      };
    }
  }
}
