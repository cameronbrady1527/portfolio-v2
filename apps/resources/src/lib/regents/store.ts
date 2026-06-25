// Regents bank progress: the self-scored credit a student has recorded per item,
// persisted so readiness survives a reload. A PURE core plus a THIN localStorage
// adapter, mirroring the Foundations progress module — but separate, because
// Regents items earn PARTIAL credit (0..max) rather than a binary correct flag.
// Kept in the app (like bank.ts / readiness.ts), so nothing new ships in the
// published package.

import type { CreditAttempt } from "./readiness";

export const REGENTS_PROGRESS_VERSION = 1 as const;

export type RegentsProgress = {
  version: 1;
  /** Latest self-scored attempt per item id. */
  attempts: Record<string, CreditAttempt>;
};

// ---------------------------------------------------------------------------
// Pure core
// ---------------------------------------------------------------------------

export function emptyRegentsProgress(): RegentsProgress {
  return { version: REGENTS_PROGRESS_VERSION, attempts: {} };
}

/** Record (or overwrite) one item's attempt, returning a NEW RegentsProgress. */
export function recordAttempt(
  progress: RegentsProgress,
  attempt: CreditAttempt,
): RegentsProgress {
  return {
    ...progress,
    attempts: { ...progress.attempts, [attempt.itemId]: attempt },
  };
}

function isAttempt(value: unknown): value is CreditAttempt {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.itemId === "string" &&
    typeof a.standard === "string" &&
    typeof a.earned === "number" &&
    typeof a.max === "number"
  );
}

// Normalise unknown (parsed JSON) into a usable RegentsProgress. Anything
// missing, corrupt, or version-mismatched yields a fresh object; individual
// malformed attempts are dropped rather than poisoning the whole store.
export function normalizeRegentsProgress(value: unknown): RegentsProgress {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { version?: unknown }).version !== REGENTS_PROGRESS_VERSION ||
    typeof (value as { attempts?: unknown }).attempts !== "object" ||
    (value as { attempts?: unknown }).attempts === null
  ) {
    return emptyRegentsProgress();
  }
  const raw = (value as { attempts: Record<string, unknown> }).attempts;
  const attempts: Record<string, CreditAttempt> = {};
  for (const [id, a] of Object.entries(raw)) {
    if (isAttempt(a)) attempts[id] = a;
  }
  return { version: REGENTS_PROGRESS_VERSION, attempts };
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

export function loadRegentsProgress(storageKey: string): RegentsProgress {
  const store = getStore();
  if (!store) return emptyRegentsProgress();
  try {
    const raw = store.getItem(storageKey);
    if (!raw) return emptyRegentsProgress();
    return normalizeRegentsProgress(JSON.parse(raw));
  } catch {
    return emptyRegentsProgress();
  }
}

export function saveRegentsProgress(
  storageKey: string,
  progress: RegentsProgress,
): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Quota / private-mode failures are non-fatal for an in-memory session.
  }
}
