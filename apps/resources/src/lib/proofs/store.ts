// Proofs progress: the per-family readiness a student builds in the two-column
// proof builder, persisted so the scaffold dial and "comfortable" flag survive a
// reload. A PURE core plus a THIN localStorage adapter, mirroring the Regents and
// Foundations progress modules — but separate, because a proof family carries
// WITHIN-SET fade state (the current scaffold level + clean completions at that
// level) alongside a binary "comfortable" mastery flag. Kept in the app, so
// nothing new ships in the published package.

export const PROOFS_PROGRESS_VERSION = 1 as const;

/** The localStorage key for the whole proofs store. */
export const PROOFS_PROGRESS_KEY = "resources:proofs";

/** How many scaffolds are showing, 1 (most support) … 4 (unaided Regents). */
export type ScaffoldLevel = 1 | 2 | 3 | 4;

/**
 * One proof family's saved state: where the adaptive fade currently sits (which
 * scaffold `level`, and how many clean `completions` the student has banked at
 * that level) plus whether they have reached `comfortable` — a clean pass at the
 * minimal scaffold (Level 4).
 */
export type FamilyProgress = {
  familyId: string;
  level: ScaffoldLevel;
  completions: number;
  comfortable: boolean;
};

export type ProofsProgress = {
  version: 1;
  /** State per proof-family id. */
  families: Record<string, FamilyProgress>;
  /** Whether the student has seen (and dismissed) the how-to-use intro. Shown
   *  once on first encounter; afterwards it stays collapsed but re-openable. */
  tutorialSeen?: boolean;
};

// ---------------------------------------------------------------------------
// Pure core
// ---------------------------------------------------------------------------

export function emptyProofsProgress(): ProofsProgress {
  return { version: PROOFS_PROGRESS_VERSION, families: {} };
}

/** Record (or overwrite) one family's fade state, returning NEW progress. */
export function recordFamilyResult(
  progress: ProofsProgress,
  family: FamilyProgress,
): ProofsProgress {
  return {
    ...progress,
    families: { ...progress.families, [family.familyId]: family },
  };
}

/**
 * Mark a family `comfortable` (a clean pass at the minimal scaffold), preserving
 * its fade state. Creates a sensible default entry if the family is unseen.
 */
export function markComfortable(
  progress: ProofsProgress,
  familyId: string,
): ProofsProgress {
  const prev = progress.families[familyId] ?? {
    familyId,
    level: 4 as ScaffoldLevel,
    completions: 0,
  };
  return {
    ...progress,
    families: {
      ...progress.families,
      [familyId]: { ...prev, familyId, comfortable: true },
    },
  };
}

/** Mark the how-to-use intro as seen, returning NEW progress. */
export function markTutorialSeen(progress: ProofsProgress): ProofsProgress {
  return { ...progress, tutorialSeen: true };
}

/** Per-family reset: drop this family's state entirely, returning NEW progress. */
export function resetFamily(
  progress: ProofsProgress,
  familyId: string,
): ProofsProgress {
  if (!(familyId in progress.families)) return progress;
  const families = { ...progress.families };
  delete families[familyId];
  return { ...progress, families };
}

function isScaffoldLevel(value: unknown): value is ScaffoldLevel {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function isFamilyProgress(value: unknown): value is FamilyProgress {
  if (!value || typeof value !== "object") return false;
  const f = value as Record<string, unknown>;
  return (
    typeof f.familyId === "string" &&
    isScaffoldLevel(f.level) &&
    typeof f.completions === "number" &&
    Number.isFinite(f.completions) &&
    f.completions >= 0 &&
    typeof f.comfortable === "boolean"
  );
}

// Normalise unknown (parsed JSON) into a usable ProofsProgress. Anything missing,
// corrupt, or version-mismatched yields a fresh object; individual malformed
// family entries are dropped rather than poisoning the whole store.
export function normalizeProofsProgress(value: unknown): ProofsProgress {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { version?: unknown }).version !== PROOFS_PROGRESS_VERSION ||
    typeof (value as { families?: unknown }).families !== "object" ||
    (value as { families?: unknown }).families === null
  ) {
    return emptyProofsProgress();
  }
  const raw = (value as { families: Record<string, unknown> }).families;
  const families: Record<string, FamilyProgress> = {};
  for (const [id, f] of Object.entries(raw)) {
    // Trust the map key as the family id, but only if the entry is otherwise
    // well-formed for THAT id (a mismatched inner familyId is malformed).
    if (isFamilyProgress(f) && f.familyId === id) families[id] = f;
  }
  const tutorialSeen =
    (value as { tutorialSeen?: unknown }).tutorialSeen === true ? true : undefined;
  return { version: PROOFS_PROGRESS_VERSION, families, tutorialSeen };
}

// ---------------------------------------------------------------------------
// Thin localStorage adapter (SSR-safe; failures are non-fatal)
// ---------------------------------------------------------------------------

function getStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadProofsProgress(storageKey: string): ProofsProgress {
  const store = getStore();
  if (!store) return emptyProofsProgress();
  try {
    const raw = store.getItem(storageKey);
    if (!raw) return emptyProofsProgress();
    return normalizeProofsProgress(JSON.parse(raw));
  } catch {
    return emptyProofsProgress();
  }
}

export function saveProofsProgress(
  storageKey: string,
  progress: ProofsProgress,
): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Quota / private-mode failures are non-fatal for an in-memory session.
  }
}
