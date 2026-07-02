"use client";

import { useEffect, useState } from "react";
import {
  ProofBuilder,
  type ProofProgressSnapshot,
} from "@cameronbrady/math-components";
import {
  loadProofsProgress,
  markComfortable,
  PROOFS_PROGRESS_KEY,
  recordFamilyResult,
  resetFamily,
  saveProofsProgress,
  type FamilyProgress,
} from "@/lib/proofs/store";

// The unit capstone: interleaved practice across EVERY proof family. Each round
// draws a random proof type, so the student cannot lean on "this page is always
// SAS" — they must read the givens and pick the strategy, the whole point of the
// unit. Same fade + persistence as <ProofPractice>, under a synthetic "mixed"
// family key so its drill state is tracked separately from the per-topic pages.

const MIXED_KEY = "mixed";

// Every proof family, ordered easy → hard; ProofBuilder draws one per round.
const FAMILY_POOL = [
  "what-is-a-proof",
  "vertical-angles",
  "segment-addition",
  "angle-addition",
  "congruence-cpctc",
];

export interface MixedProofPracticeProps {
  className?: string;
}

export function MixedProofPractice({ className }: MixedProofPracticeProps) {
  const [hydrated, setHydrated] = useState<FamilyProgress | null>(null);

  useEffect(() => {
    const fam = loadProofsProgress(PROOFS_PROGRESS_KEY).families[MIXED_KEY];
    setHydrated(
      fam ?? { familyId: MIXED_KEY, level: 1, completions: 0, comfortable: false },
    );
  }, []);

  const onProgressChange = (snapshot: ProofProgressSnapshot) => {
    const progress = loadProofsProgress(PROOFS_PROGRESS_KEY);
    const next = snapshot.comfortable
      ? markComfortable(
          recordFamilyResult(progress, {
            familyId: MIXED_KEY,
            level: snapshot.level,
            completions: snapshot.completions,
            comfortable: true,
          }),
          MIXED_KEY,
        )
      : recordFamilyResult(progress, {
          familyId: MIXED_KEY,
          level: snapshot.level,
          completions: snapshot.completions,
          comfortable: false,
        });
    saveProofsProgress(PROOFS_PROGRESS_KEY, next);
  };

  const onStartOver = () => {
    const progress = loadProofsProgress(PROOFS_PROGRESS_KEY);
    saveProofsProgress(PROOFS_PROGRESS_KEY, resetFamily(progress, MIXED_KEY));
  };

  return (
    <ProofBuilder
      key={hydrated ? "mixed:hydrated" : "mixed:initial"}
      familyPool={FAMILY_POOL}
      className={className}
      level={hydrated?.level ?? 1}
      initialCompletions={hydrated?.completions ?? 0}
      initialComfortable={hydrated?.comfortable ?? false}
      onProgressChange={onProgressChange}
      onStartOver={onStartOver}
    />
  );
}
