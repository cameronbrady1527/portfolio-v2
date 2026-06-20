// Maps a skill slug (as authored in MDX) to its pure problem generator. New
// Foundations skills register here. Resolution fails loud — an unknown skill is
// an authoring mistake we want to surface at build/render, never silently blank.
import {
  signedAddSub,
  multDiv,
  orderOfOperations,
  rounding,
  equivalentFractions,
  addSubtractFractions,
  multiplyDivideFractions,
  solveProportion,
  percents,
  substituteFormula,
  simplifyExpression,
  solveLinearEquation,
  powers,
  squareRoots,
  exponentRules,
  type ProblemGenerator,
} from "@cameronbrady/math-components/logic";

const GENERATORS: Record<string, ProblemGenerator> = {
  "adding-subtracting-signed-numbers": signedAddSub,
  "multiplication-division-fluency": multDiv,
  "order-of-operations": orderOfOperations,
  rounding,
  "equivalent-fractions": equivalentFractions,
  "add-subtract-fractions": addSubtractFractions,
  "multiply-divide-fractions": multiplyDivideFractions,
  "ratios-proportions": solveProportion,
  percents,
  "substituting-into-formulas": substituteFormula,
  "simplifying-expressions": simplifyExpression,
  "solving-linear-equations": solveLinearEquation,
  "powers-and-exponents": powers,
  "square-roots": squareRoots,
  "exponent-rules": exponentRules,
};

export function resolveGenerator(skill: string): ProblemGenerator {
  const generator = GENERATORS[skill];
  if (!generator) {
    const known = Object.keys(GENERATORS).join(", ") || "(none)";
    throw new Error(
      `No problem generator registered for skill "${skill}". Known skills: ${known}.`,
    );
  }
  return generator;
}
