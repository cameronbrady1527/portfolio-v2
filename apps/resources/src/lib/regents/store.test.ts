/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  emptyRegentsProgress,
  loadRegentsProgress,
  normalizeRegentsProgress,
  recordAttempt,
  saveRegentsProgress,
} from "./store";
import type { CreditAttempt } from "./readiness";

const attempt: CreditAttempt = {
  itemId: "x",
  standard: "AI-A.REI.4",
  earned: 3,
  max: 4,
};
const KEY = "test:regents";

beforeEach(() => localStorage.clear());

describe("recordAttempt", () => {
  it("adds an attempt and overwrites it by item id", () => {
    let p = recordAttempt(emptyRegentsProgress(), attempt);
    expect(p.attempts.x.earned).toBe(3);
    p = recordAttempt(p, { ...attempt, earned: 4 });
    expect(p.attempts.x.earned).toBe(4);
    expect(Object.keys(p.attempts)).toHaveLength(1);
  });
});

describe("normalizeRegentsProgress", () => {
  it("returns empty for corrupt or wrong-version data", () => {
    expect(normalizeRegentsProgress(null).attempts).toEqual({});
    expect(
      normalizeRegentsProgress({ version: 99, attempts: {} }).attempts,
    ).toEqual({});
  });

  it("drops malformed attempts but keeps the valid ones", () => {
    const p = normalizeRegentsProgress({
      version: 1,
      attempts: { x: attempt, bad: { itemId: 1 } },
    });
    expect(Object.keys(p.attempts)).toEqual(["x"]);
  });
});

describe("localStorage round-trip", () => {
  it("loads empty for a missing key, then saves and reloads", () => {
    expect(loadRegentsProgress(KEY).attempts).toEqual({});
    saveRegentsProgress(KEY, recordAttempt(emptyRegentsProgress(), attempt));
    expect(loadRegentsProgress(KEY).attempts.x).toEqual(attempt);
  });

  it("recovers (empty) from corrupt JSON in storage", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadRegentsProgress(KEY).attempts).toEqual({});
  });
});
