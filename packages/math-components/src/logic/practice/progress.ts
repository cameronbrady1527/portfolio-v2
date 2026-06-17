// Practice progress: a PURE core (no DOM) plus a THIN localStorage adapter.

export const PROGRESS_VERSION = 1 as const;

export type AnswerRecord = { answered: true; correct: boolean };

export type TopicProgress = {
  completedAt?: string;
  /** Set once the skill's mastery check is passed; the card shows ✓ mastered. */
  masteredAt?: string;
  best: { correct: number; total: number };
  answers: { [questionId: string]: AnswerRecord };
};

export type Progress = {
  version: 1;
  topics: { [slug: string]: TopicProgress };
};

// ---------------------------------------------------------------------------
// Pure core
// ---------------------------------------------------------------------------

export function emptyProgress(): Progress {
  return { version: PROGRESS_VERSION, topics: {} };
}

function emptyTopic(): TopicProgress {
  return { best: { correct: 0, total: 0 }, answers: {} };
}

// Score a topic's recorded answers.
export function scoreTopic(topic: TopicProgress | undefined): {
  correct: number;
  total: number;
} {
  if (!topic) return { correct: 0, total: 0 };
  const records = Object.values(topic.answers);
  return {
    correct: records.filter((r) => r.correct).length,
    total: records.length,
  };
}

// Record a single answered question for a topic, returning a NEW Progress.
// `best` always reflects the current set of answered questions; `completedAt`
// is set once every question id has been answered (and never cleared on
// re-recording an already-answered question — a refresh restores state).
export function recordAnswer(
  progress: Progress,
  slug: string,
  questionId: string,
  correct: boolean,
  totalQuestions: number,
  now: () => string = () => new Date().toISOString(),
): Progress {
  const prevTopic = progress.topics[slug] ?? emptyTopic();

  const answers = {
    ...prevTopic.answers,
    [questionId]: { answered: true as const, correct },
  };

  const nextTopic: TopicProgress = {
    ...prevTopic,
    answers,
    best: scoreTopic({ ...prevTopic, answers }),
  };

  const answeredCount = Object.keys(answers).length;
  if (
    totalQuestions > 0 &&
    answeredCount >= totalQuestions &&
    !nextTopic.completedAt
  ) {
    nextTopic.completedAt = now();
  }

  return {
    ...progress,
    topics: { ...progress.topics, [slug]: nextTopic },
  };
}

// Read a topic's stored state, always returning a usable object.
export function getTopic(progress: Progress, slug: string): TopicProgress {
  return progress.topics[slug] ?? emptyTopic();
}

// ---------------------------------------------------------------------------
// Mastery — a per-skill flag, separate from question-by-question answers. The
// drill is zero-stakes; only passing a skill's mastery check sets this.
// ---------------------------------------------------------------------------

// Mark a skill (keyed by its topic slug) mastered, returning a NEW Progress.
// Idempotent: the first mastery time is preserved (a refresh restores ✓), and
// any existing answer state for the topic is left untouched.
export function recordMastery(
  progress: Progress,
  slug: string,
  now: () => string = () => new Date().toISOString(),
): Progress {
  const prevTopic = progress.topics[slug] ?? emptyTopic();
  if (prevTopic.masteredAt) return progress;
  return {
    ...progress,
    topics: {
      ...progress.topics,
      [slug]: { ...prevTopic, masteredAt: now() },
    },
  };
}

/** True iff the skill at `slug` has been mastered. */
export function isMastered(progress: Progress, slug: string): boolean {
  return progress.topics[slug]?.masteredAt !== undefined;
}

/** How many of the given skill slugs have been mastered (for "N of M"). */
export function countMastered(progress: Progress, slugs: string[]): number {
  return slugs.filter((slug) => isMastered(progress, slug)).length;
}

// Validate / normalise an unknown value into a fresh-or-loaded Progress.
// Anything missing, corrupt, or version-mismatched yields a fresh object.
export function normalizeProgress(value: unknown): Progress {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { version?: unknown }).version !== PROGRESS_VERSION ||
    typeof (value as { topics?: unknown }).topics !== "object" ||
    (value as { topics?: unknown }).topics === null
  ) {
    return emptyProgress();
  }
  return value as Progress;
}

// ---------------------------------------------------------------------------
// Thin localStorage adapter (kept deliberately minimal)
// ---------------------------------------------------------------------------

function getStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// The caller supplies the storage key, so a consuming app picks its own
// namespace (the hub passes "resources:progress") and the package never
// hardcodes one app's namespace into another's bundle.
export function loadProgress(storageKey: string): Progress {
  const store = getStore();
  if (!store) return emptyProgress();
  try {
    const raw = store.getItem(storageKey);
    if (!raw) return emptyProgress();
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(storageKey: string, progress: Progress): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Quota / private-mode failures are non-fatal for an in-memory session.
  }
}
