/**
 * Expression/equation answer checking — public surface.
 *
 * The two `check*` helpers are the runtime entry points used by grading: they
 * parse the AUTHOR'S answer eagerly (a malformed answer throws, so bad content
 * fails loudly in dev/build), but catch parse errors in the STUDENT'S input and
 * report them as simply "incorrect" — a student typo is a wrong answer, not a
 * crash.
 */
export type { Node, Equation, BinaryOp } from "./ast";
export { tokenize, TokenizeError } from "./tokenize";
export type { Token, TokenType } from "./tokenize";
export { parseExpression, parseEquation, ParseError } from "./parse";
export { evaluate, UnboundVariableError } from "./evaluate";
export type { Bindings } from "./evaluate";
export {
  expressionsEquivalent,
  equationsEquivalent,
  freeVars,
} from "./equivalent";

import { parseEquation, parseExpression } from "./parse";
import { equationsEquivalent, expressionsEquivalent } from "./equivalent";

/**
 * True iff the student's expression is equivalent to the author's `answer`.
 * Returns false (not throws) if the student's input cannot be parsed.
 */
export function checkExpressionAnswer(
  studentInput: string,
  answer: string,
  variables: string[] = [],
): boolean {
  const answerAst = parseExpression(answer); // author error → throws
  let studentAst;
  try {
    studentAst = parseExpression(studentInput);
  } catch {
    return false;
  }
  return expressionsEquivalent(studentAst, answerAst, variables);
}

/**
 * True iff the student's equation is equivalent (same solution set up to
 * rescaling) to the author's `answer`. Returns false if the student's input
 * cannot be parsed as an equation.
 */
export function checkEquationAnswer(
  studentInput: string,
  answer: string,
  variables: string[] = [],
): boolean {
  const answerEq = parseEquation(answer); // author error → throws
  let studentEq;
  try {
    studentEq = parseEquation(studentInput);
  } catch {
    return false;
  }
  return equationsEquivalent(studentEq, answerEq, variables);
}
