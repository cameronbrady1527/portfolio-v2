"use client";

import { ProofBuilder } from "@cameronbrady/math-components";
import { CPCTC_PROOFS } from "@/lib/proofs/cpctc-proofs";

// A single worked CPCTC proof rendered as a live (figureless) builder: the
// student supplies the reason for each pre-placed statement. `fixed` keeps it a
// one-off illustration — no fade, no "Next proof", no progress persistence
// (unlike the drill-to-mastery <ProofPractice> on the dedicated proof pages).

export interface CpctcProofProps {
  /** Key into {@link CPCTC_PROOFS}: "sss-isosceles" | "sas-bisect" | "asa-parallelogram". */
  id: keyof typeof CPCTC_PROOFS | string;
  className?: string;
}

export function CpctcProof({ id, className }: CpctcProofProps) {
  const spec = CPCTC_PROOFS[id];
  if (!spec) return null;
  return <ProofBuilder spec={spec} level={1} fixed className={className} />;
}
