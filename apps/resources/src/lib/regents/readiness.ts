// Regents readiness — the "mastery as levels, not a binary flag" model.
//
// Unlike a Foundations skill (one ✓ once the mastery check is cleared), a Regents
// standard is assessed across items that earn PARTIAL credit (0..max). Readiness
// aggregates the credit fraction a student has self-scored and reports two things:
//   - a per-standard BAND (what to practice next — the most useful signal), and
//   - an overall PROJECTED PERFORMANCE LEVEL 1–5 (mirroring how the real exam
//     reports), shown as a projection, never a verdict.
//
// Pure (no DOM). Thresholds below are a transparent FIRST-PASS calibration —
// flagged for SME tuning (Level 3 ≈ 65 "proficient/pass"; mastery ≈ 85%+).

/** What a student has self-scored on one bank item. */
export interface CreditAttempt {
  itemId: string;
  /** Standard code, e.g. "AI-A.REI.4". */
  standard: string;
  /** Credits the student awarded themselves, 0..max. */
  earned: number;
  /** The item's credit value (2 / 4 / 6, or 2 for MC). */
  max: number;
}

export type ReadinessBand =
  | "not-started"
  | "developing"
  | "approaching"
  | "proficient"
  | "mastery";

export type ProjectedLevel = 1 | 2 | 3 | 4 | 5;

export interface StandardReadiness {
  standard: string;
  earned: number;
  max: number;
  /** earned / max over attempted items, or 0 when nothing is attempted. */
  fraction: number;
  band: ReadinessBand;
  itemCount: number;
}

// Credit-fraction cutoffs — the whole calibration lives here (flagged for SME
// tuning). 0.65 = the Regents pass line; 0.85 = "mastery". Bands and projected
// levels share these so the two never drift apart.
const APPROACHING = 0.5;
const PROFICIENT = 0.65; // also Level 3 (pass)
const MASTERY = 0.85; // also Level 5
const LEVEL2 = 0.4;
const LEVEL4 = 0.7;

function bandFor(fraction: number, attempted: boolean): ReadinessBand {
  if (!attempted) return "not-started";
  if (fraction >= MASTERY) return "mastery";
  if (fraction >= PROFICIENT) return "proficient";
  if (fraction >= APPROACHING) return "approaching";
  return "developing";
}

/** Aggregate a student's attempts for ONE standard into a readiness summary. */
export function standardReadiness(
  attempts: CreditAttempt[],
  standard: string,
): StandardReadiness {
  const mine = attempts.filter((a) => a.standard === standard);
  const earned = mine.reduce((s, a) => s + a.earned, 0);
  const max = mine.reduce((s, a) => s + a.max, 0);
  const fraction = max > 0 ? earned / max : 0;
  return {
    standard,
    earned,
    max,
    fraction,
    band: bandFor(fraction, mine.length > 0),
    itemCount: mine.length,
  };
}

// Overall credit-fraction → projected performance level. A transparent practice
// projection (not the exam's nonlinear scale), labelled as such in the UI.
export function projectedLevel(attempts: CreditAttempt[]): ProjectedLevel {
  const earned = attempts.reduce((s, a) => s + a.earned, 0);
  const max = attempts.reduce((s, a) => s + a.max, 0);
  const f = max > 0 ? earned / max : 0;
  if (f >= MASTERY) return 5;
  if (f >= LEVEL4) return 4;
  if (f >= PROFICIENT) return 3;
  if (f >= LEVEL2) return 2;
  return 1;
}

export interface OverallReadiness {
  earned: number;
  max: number;
  fraction: number;
  level: ProjectedLevel;
  byStandard: StandardReadiness[];
}

/** Roll attempts up into an overall projection plus a per-standard breakdown. */
export function overallReadiness(attempts: CreditAttempt[]): OverallReadiness {
  const earned = attempts.reduce((s, a) => s + a.earned, 0);
  const max = attempts.reduce((s, a) => s + a.max, 0);
  const standards = [...new Set(attempts.map((a) => a.standard))].sort();
  return {
    earned,
    max,
    fraction: max > 0 ? earned / max : 0,
    level: projectedLevel(attempts),
    byStandard: standards.map((s) => standardReadiness(attempts, s)),
  };
}
