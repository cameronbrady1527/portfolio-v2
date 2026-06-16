/**
 * Transversal angles — the eight angles formed when two lines are crossed by a
 * transversal, classified by pair relationship and machine-checked for the
 * equalities the figure is supposed to teach (parallel-line angle theorems).
 *
 * The math is PURELY ANGULAR: each line and the transversal are given by their
 * direction angle in degrees; the lines' positions never enter the computation,
 * only the rendering. At an intersection the angle from the line to the
 * transversal is θ = normalize(transversalDir − lineDir), and the four angles
 * around that point are {θ, 180−θ} appearing twice (vertical + linear-pair
 * quartet). Measures are normalized into (0, 180].
 *
 * Slot layout (textbook numbering): intersection line1 = slots 1–4, line2 =
 * slots 5–8. Each slot is fixed by which side of the transversal it sits on
 * (left/right) and which way along the transversal it opens (toward the other
 * line = interior of the strip, or away = exterior):
 *
 *        1 \ 2                    L=left of transversal, R=right;
 *      ----X---- line1           "fwd" = toward line2 (interior side)
 *        3 \ 4
 *           \  (transversal)
 *        5 \ 6
 *      ----X---- line2
 *        7 \ 8
 *
 *   slots 1,2 (line1) and 7,8 (line2) are EXTERIOR; 3,4 and 5,6 are INTERIOR.
 *
 * The parallel relationships are tagged and verdicted regardless of whether the
 * lines are parallel, so the misses teach:
 *   - corresponding & alternate(-interior/-exterior) angles are equal IFF the
 *     two lines are parallel;
 *   - co-interior (same-side interior) angles sum to 180° IFF parallel.
 * Vertical angles are always equal; linear pairs always sum to 180°.
 *
 * Precondition: the transversal genuinely crosses each line (it is not parallel
 * to either). When θ ≡ 0 (mod 180) there is no crossing and the figure is
 * undefined; callers should not feed such configs.
 *
 * This module is shared: the angle-sum proof (slice C6) reuses the
 * alternate-interior classifier. Substrate-free; runs in the node vitest env.
 */

/** The eight angle slots, four at each intersection. */
export type AngleId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Which intersection an angle sits at: line1×transversal or line2×transversal. */
export type Intersection = "line1" | "line2";

/** Where an angle sits relative to the strip between the two lines. */
export type Region = "interior" | "exterior";

/** The relationships a pair of angles can stand in. */
export type PairRelationship =
  | "vertical"
  | "linear-pair"
  | "corresponding"
  | "alternate-interior"
  | "alternate-exterior"
  | "co-interior";

/** One of the eight angles, with its measure (degrees, (0,180]) and placement. */
export interface Angle {
  id: AngleId;
  /** Measure in degrees, normalized into (0, 180]. */
  measure: number;
  intersection: Intersection;
  region: Region;
}

/** A related pair of the eight angles, with an equality verdict. */
export interface AnglePair {
  angles: [AngleId, AngleId];
  relationship: PairRelationship;
  /** True when the two measures are equal within tolerance. */
  equal: boolean;
}

/** Input: the two lines' and the transversal's direction angles, in degrees. */
export interface TransversalConfig {
  line1Dir: number;
  line2Dir: number;
  transversalDir: number;
}

/** The full classified result. */
export interface TransversalAngles {
  angles: Record<AngleId, Angle>;
  pairs: AnglePair[];
  /** True when the two lines share a direction (are parallel). */
  parallel: boolean;
}

const DEFAULT_EPSILON = 1e-9;

/** Normalize an angle in degrees into (0, 180]. */
function normalize180(deg: number): number {
  let a = deg % 180;
  if (a <= 0) a += 180;
  return a;
}

/** Static placement of each slot (independent of the angles). */
const PLACEMENT: Record<AngleId, { intersection: Intersection; region: Region }> = {
  1: { intersection: "line1", region: "exterior" },
  2: { intersection: "line1", region: "exterior" },
  3: { intersection: "line1", region: "interior" },
  4: { intersection: "line1", region: "interior" },
  5: { intersection: "line2", region: "interior" },
  6: { intersection: "line2", region: "interior" },
  7: { intersection: "line2", region: "exterior" },
  8: { intersection: "line2", region: "exterior" },
};

/**
 * Compute the eight angles formed by two lines crossed by a transversal, each
 * tagged with its pair relationship and an equality verdict. See the module
 * header for the slot layout and the relationship invariants.
 */
export function transversalAngles(
  config: TransversalConfig,
  epsilon = DEFAULT_EPSILON,
): TransversalAngles {
  const { line1Dir, line2Dir, transversalDir } = config;

  const theta1 = normalize180(transversalDir - line1Dir);
  const supp1 = 180 - theta1;
  const theta2 = normalize180(transversalDir - line2Dir);
  const supp2 = 180 - theta2;

  // Measures per slot, derived from the (side, along-transversal) geometry:
  //   line1: 1=(L,bwd)=θ1  2=(R,bwd)=180−θ1  3=(L,fwd)=180−θ1  4=(R,fwd)=θ1
  //   line2: 5=(L,bwd)=θ2  6=(R,bwd)=180−θ2  7=(L,fwd)=180−θ2  8=(R,fwd)=θ2
  const measures: Record<AngleId, number> = {
    1: theta1,
    2: supp1,
    3: supp1,
    4: theta1,
    5: theta2,
    6: supp2,
    7: supp2,
    8: theta2,
  };

  const angles = {} as Record<AngleId, Angle>;
  for (const id of [1, 2, 3, 4, 5, 6, 7, 8] as AngleId[]) {
    angles[id] = {
      id,
      measure: measures[id],
      intersection: PLACEMENT[id].intersection,
      region: PLACEMENT[id].region,
    };
  }

  const eq = (a: AngleId, b: AngleId) =>
    Math.abs(measures[a] - measures[b]) <= epsilon;
  const pair = (a: AngleId, b: AngleId, relationship: PairRelationship): AnglePair => ({
    angles: [a, b],
    relationship,
    equal: eq(a, b),
  });

  const pairs: AnglePair[] = [
    // Vertical (within an intersection): opposite quadrants.
    pair(1, 4, "vertical"),
    pair(2, 3, "vertical"),
    pair(5, 8, "vertical"),
    pair(6, 7, "vertical"),
    // Linear pairs (within an intersection): adjacent quadrants.
    pair(1, 2, "linear-pair"),
    pair(1, 3, "linear-pair"),
    pair(2, 4, "linear-pair"),
    pair(3, 4, "linear-pair"),
    pair(5, 6, "linear-pair"),
    pair(5, 7, "linear-pair"),
    pair(6, 8, "linear-pair"),
    pair(7, 8, "linear-pair"),
    // Corresponding (across intersections): same side + same along-direction.
    pair(1, 5, "corresponding"),
    pair(2, 6, "corresponding"),
    pair(3, 7, "corresponding"),
    pair(4, 8, "corresponding"),
    // Alternate-interior: interior slots on opposite sides of the transversal.
    pair(3, 6, "alternate-interior"),
    pair(4, 5, "alternate-interior"),
    // Alternate-exterior: exterior slots on opposite sides of the transversal.
    pair(1, 8, "alternate-exterior"),
    pair(2, 7, "alternate-exterior"),
    // Co-interior (same-side interior): interior slots on the same side.
    pair(3, 5, "co-interior"),
    pair(4, 6, "co-interior"),
  ];

  const parallel = Math.abs(theta1 - theta2) <= epsilon;

  return { angles, pairs, parallel };
}
