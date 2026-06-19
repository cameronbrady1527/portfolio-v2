import { describe, expect, it } from "vitest";
import {
  countMastered,
  emptyProgress,
  getTopic,
  isMastered,
  normalizeProgress,
  PROGRESS_VERSION,
  recordAnswer,
  recordMastery,
  scoreTopic,
  type Progress,
} from "./progress";

const SLUG = "geometry/transformations/reflections";
const fixedNow = () => "2026-06-02T00:00:00.000Z";

describe("mastery flag", () => {
  const A = "foundations/geometry/adding-subtracting-signed-numbers";
  const B = "foundations/geometry/multiplication-division-fluency";

  it("isMastered is false until a skill is recorded as mastered", () => {
    expect(isMastered(emptyProgress(), A)).toBe(false);
  });

  it("recordMastery marks a skill mastered (with a timestamp)", () => {
    const next = recordMastery(emptyProgress(), A, fixedNow);
    expect(isMastered(next, A)).toBe(true);
    expect(getTopic(next, A).masteredAt).toBe(fixedNow());
  });

  it("recordMastery is idempotent — the first mastery time is kept", () => {
    const once = recordMastery(emptyProgress(), A, fixedNow);
    const twice = recordMastery(once, A, () => "2099-01-01T00:00:00.000Z");
    expect(getTopic(twice, A).masteredAt).toBe(fixedNow());
  });

  it("preserves existing answer state when marking mastery", () => {
    const answered = recordAnswer(emptyProgress(), A, "q1", true, 1, fixedNow);
    const mastered = recordMastery(answered, A, fixedNow);
    expect(getTopic(mastered, A).answers.q1).toEqual({
      answered: true,
      correct: true,
    });
    expect(isMastered(mastered, A)).toBe(true);
  });

  it("countMastered counts only the mastered slugs in a given set", () => {
    const p = recordMastery(emptyProgress(), A, fixedNow);
    expect(countMastered(p, [A, B])).toBe(1);
    expect(countMastered(p, [B])).toBe(0);
  });
});

describe("emptyProgress", () => {
  it("is a fresh versioned object with no topics", () => {
    expect(emptyProgress()).toEqual({ version: PROGRESS_VERSION, topics: {} });
  });
});

describe("recordAnswer (pure core)", () => {
  it("updates answers and best when recording a result", () => {
    const p = recordAnswer(emptyProgress(), SLUG, "q1", true, 3, fixedNow);
    const topic = getTopic(p, SLUG);
    expect(topic.answers.q1).toEqual({ answered: true, correct: true });
    expect(topic.best).toEqual({ correct: 1, total: 1 });
    expect(topic.completedAt).toBeUndefined();
  });

  it("counts an incorrect answer toward total but not correct", () => {
    let p = recordAnswer(emptyProgress(), SLUG, "q1", true, 3, fixedNow);
    p = recordAnswer(p, SLUG, "q2", false, 3, fixedNow);
    expect(getTopic(p, SLUG).best).toEqual({ correct: 1, total: 2 });
  });

  it("sets completedAt only once all questions are answered", () => {
    let p = recordAnswer(emptyProgress(), SLUG, "q1", true, 2, fixedNow);
    expect(getTopic(p, SLUG).completedAt).toBeUndefined();
    p = recordAnswer(p, SLUG, "q2", true, 2, fixedNow);
    expect(getTopic(p, SLUG).completedAt).toBe(fixedNow());
  });

  it("does not overwrite completedAt when re-recording after completion", () => {
    let p = recordAnswer(emptyProgress(), SLUG, "q1", true, 1, fixedNow);
    const first = getTopic(p, SLUG).completedAt;
    p = recordAnswer(p, SLUG, "q1", false, 1, () => "2099-01-01T00:00:00.000Z");
    expect(getTopic(p, SLUG).completedAt).toBe(first);
  });

  it("re-recording the same question (refresh) keeps the count stable", () => {
    let p = recordAnswer(emptyProgress(), SLUG, "q1", false, 3, fixedNow);
    p = recordAnswer(p, SLUG, "q1", true, 3, fixedNow);
    const topic = getTopic(p, SLUG);
    expect(topic.answers.q1).toEqual({ answered: true, correct: true });
    expect(topic.best).toEqual({ correct: 1, total: 1 });
  });

  it("does not mutate the input progress object", () => {
    const original = emptyProgress();
    recordAnswer(original, SLUG, "q1", true, 1, fixedNow);
    expect(original).toEqual({ version: PROGRESS_VERSION, topics: {} });
  });

  it("keeps topics independent", () => {
    let p = recordAnswer(emptyProgress(), "a", "q1", true, 1, fixedNow);
    p = recordAnswer(p, "b", "q1", false, 1, fixedNow);
    expect(getTopic(p, "a").best).toEqual({ correct: 1, total: 1 });
    expect(getTopic(p, "b").best).toEqual({ correct: 0, total: 1 });
  });
});

describe("scoreTopic", () => {
  it("returns zeros for a missing topic", () => {
    expect(scoreTopic(undefined)).toEqual({ correct: 0, total: 0 });
  });
});

describe("getTopic", () => {
  it("returns a fresh topic for an unknown slug", () => {
    expect(getTopic(emptyProgress(), "nope")).toEqual({
      best: { correct: 0, total: 0 },
      answers: {},
    });
  });
});

describe("normalizeProgress", () => {
  it("resets on undefined / null", () => {
    expect(normalizeProgress(undefined)).toEqual(emptyProgress());
    expect(normalizeProgress(null)).toEqual(emptyProgress());
  });

  it("resets on a version mismatch", () => {
    expect(normalizeProgress({ version: 0, topics: {} })).toEqual(
      emptyProgress(),
    );
  });

  it("resets on a corrupt shape", () => {
    expect(normalizeProgress({ version: 1 })).toEqual(emptyProgress());
    expect(normalizeProgress("garbage")).toEqual(emptyProgress());
  });

  it("passes through a valid object (restores answered state)", () => {
    const valid: Progress = {
      version: 1,
      topics: {
        [SLUG]: {
          best: { correct: 1, total: 1 },
          answers: { q1: { answered: true, correct: true } },
        },
      },
    };
    expect(normalizeProgress(valid)).toEqual(valid);
  });
});
