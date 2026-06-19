// Maps a skill slug (as authored in MDX) to its pure problem generator. New
// Foundations skills register here. Resolution fails loud — an unknown skill is
// an authoring mistake we want to surface at build/render, never silently blank.
import {
  signedAddSub,
  multDiv,
  orderOfOperations,
  rounding,
  equivalentFractions,
  type ProblemGenerator,
} from "@cameronbrady/math-components/logic";

const GENERATORS: Record<string, ProblemGenerator> = {
  "adding-subtracting-signed-numbers": signedAddSub,
  "multiplication-division-fluency": multDiv,
  "order-of-operations": orderOfOperations,
  rounding,
  "equivalent-fractions": equivalentFractions,
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
