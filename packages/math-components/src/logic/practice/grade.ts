// Pure grading for practice questions. No DOM, no side effects.

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
    };

export type GradeResult = {
  correct: boolean;
};

// A response is the chosen index (mc) or the entered number (numeric).
export function grade(
  question: PracticeQuestion,
  response: number,
): GradeResult {
  if (question.type === "mc") {
    return { correct: response === question.answer };
  }
  // numeric: correct iff within tolerance (inclusive).
  if (!Number.isFinite(response)) {
    return { correct: false };
  }
  return {
    correct: Math.abs(response - question.answer) <= question.tolerance,
  };
}
