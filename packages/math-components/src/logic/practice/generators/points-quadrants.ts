import type { Problem, ProblemGenerator } from "./types";

/** Nonzero integer in [-mag, mag] drawn from the seeded stream. */
function pickNonzero(rng: () => number, mag: number): number {
  const v = 1 + Math.floor(rng() * mag); // 1..mag
  return rng() < 0.5 ? v : -v;
}

function quadrant(x: number, y: number): number {
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4; // x > 0 && y < 0
}

/**
 * Points & quadrants — identify which quadrant a point lies in from the signs of
 * its coordinates, and (at level 3) the quadrant of a point's image after a
 * reflection over an axis. Points never sit on an axis, so the answer is always
 * 1–4. Emits a `numeric` question graded with tolerance 0. Pure and seeded.
 */
export const pointsAndQuadrants: ProblemGenerator = (level, rng): Problem => {
  const mag = level <= 1 ? 5 : 9;
  const x = pickNonzero(rng, mag);
  const y = pickNonzero(rng, mag);

  // Level 3 sometimes reflects the point and asks for the image's quadrant.
  if (level >= 3 && rng() < 0.5) {
    const overX = rng() < 0.5;
    const axis = overX ? "x" : "y";
    const ix = overX ? x : -x;
    const iy = overX ? -y : y;
    const ans = quadrant(ix, iy);
    return {
      id: `points-quadrants:refl-${x}-${y}-${axis}`,
      type: "numeric",
      prompt: `The point (${x}, ${y}) is reflected over the ${axis}-axis. In which quadrant is its image? Enter 1, 2, 3, or 4.`,
      answer: ans,
      tolerance: 0,
      hints: [
        overX
          ? "Reflecting over the x-axis flips the sign of y."
          : "Reflecting over the y-axis flips the sign of x.",
        "Then read the quadrant from the new signs: (+,+)=I, (−,+)=II, (−,−)=III, (+,−)=IV.",
      ],
      explanation: `Reflecting (${x}, ${y}) over the ${axis}-axis gives (${ix}, ${iy}), which is in Quadrant ${ans}.`,
    };
  }

  const ans = quadrant(x, y);
  return {
    id: `points-quadrants:${x}-${y}`,
    type: "numeric",
    prompt: `Which quadrant contains the point (${x}, ${y})? Enter 1, 2, 3, or 4.`,
    answer: ans,
    tolerance: 0,
    hints: [
      "Check the signs: is x positive or negative? Is y?",
      "(+,+)=I, (−,+)=II, (−,−)=III, (+,−)=IV — counterclockwise from the top right.",
    ],
    explanation: `(${x}, ${y}) has ${x > 0 ? "positive" : "negative"} x and ${y > 0 ? "positive" : "negative"} y, so it is in Quadrant ${ans}.`,
  };
};
