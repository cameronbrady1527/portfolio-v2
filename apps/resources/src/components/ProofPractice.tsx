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

// Thin host that wires the app-local proofs store to the pure <ProofBuilder>.
// The builder itself records NOTHING; this wrapper hydrates the family's fade +
// "comfortable" state on mount and persists every change, so drilling a family
// to mastery survives a reload. Renders a stable default on the server / first
// paint (progress lives only in localStorage), then remounts the builder with
// the hydrated state via `key` — no hydration mismatch, nothing gated.

export interface ProofPracticeProps {
  /** Registered proof family. Default "vertical-angles". */
  familyId?: string;
  className?: string;
}

export function ProofPractice({
  familyId = "vertical-angles",
  className,
}: ProofPracticeProps) {
  const [hydrated, setHydrated] = useState<FamilyProgress | null>(null);

  useEffect(() => {
    const fam = loadProofsProgress(PROOFS_PROGRESS_KEY).families[familyId];
    setHydrated(
      fam ?? { familyId, level: 1, completions: 0, comfortable: false },
    );
  }, [familyId]);

  const onProgressChange = (snapshot: ProofProgressSnapshot) => {
    const progress = loadProofsProgress(PROOFS_PROGRESS_KEY);
    const next = snapshot.comfortable
      ? markComfortable(
          recordFamilyResult(progress, {
            familyId,
            level: snapshot.level,
            completions: snapshot.completions,
            comfortable: true,
          }),
          familyId,
        )
      : recordFamilyResult(progress, {
          familyId,
          level: snapshot.level,
          completions: snapshot.completions,
          comfortable: false,
        });
    saveProofsProgress(PROOFS_PROGRESS_KEY, next);
  };

  const onStartOver = () => {
    const progress = loadProofsProgress(PROOFS_PROGRESS_KEY);
    saveProofsProgress(PROOFS_PROGRESS_KEY, resetFamily(progress, familyId));
  };

  // Before hydration, render the builder at its Level-1 default so the server
  // and first client paint agree; after hydration, remount with saved state.
  return (
    <ProofBuilder
      key={hydrated ? `${familyId}:hydrated` : `${familyId}:initial`}
      familyId={familyId}
      className={className}
      level={hydrated?.level ?? 1}
      initialCompletions={hydrated?.completions ?? 0}
      initialComfortable={hydrated?.comfortable ?? false}
      onProgressChange={onProgressChange}
      onStartOver={onStartOver}
    />
  );
}
