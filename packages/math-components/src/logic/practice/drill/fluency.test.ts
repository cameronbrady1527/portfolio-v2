import { describe, expect, it } from "vitest";
import { fluencyReducer, initFluency } from "./fluency";

describe("fluency reducer", () => {
  it("a correct answer increments the streak", () => {
    const s0 = initFluency();
    const s1 = fluencyReducer(s0, { type: "correct" });
    expect(s1.streak).toBe(1);
  });

  it("an incorrect answer resets the streak to zero", () => {
    let s = initFluency();
    s = fluencyReducer(s, { type: "correct" });
    s = fluencyReducer(s, { type: "correct" });
    expect(s.streak).toBe(2);
    s = fluencyReducer(s, { type: "incorrect" });
    expect(s.streak).toBe(0);
  });

  it("tracks total attempts and total correct (for accuracy)", () => {
    let s = initFluency();
    s = fluencyReducer(s, { type: "correct" });
    s = fluencyReducer(s, { type: "incorrect" });
    s = fluencyReducer(s, { type: "correct" });
    expect(s.attempts).toBe(3);
    expect(s.correct).toBe(2);
  });

  it("becomes fluent once the streak reaches the threshold", () => {
    let s = initFluency(3);
    expect(s.fluent).toBe(false);
    s = fluencyReducer(s, { type: "correct" });
    s = fluencyReducer(s, { type: "correct" });
    expect(s.fluent).toBe(false);
    s = fluencyReducer(s, { type: "correct" });
    expect(s.fluent).toBe(true);
  });

  it("stays fluent for the session even after a later miss", () => {
    let s = initFluency(2);
    s = fluencyReducer(s, { type: "correct" });
    s = fluencyReducer(s, { type: "correct" });
    expect(s.fluent).toBe(true);
    s = fluencyReducer(s, { type: "incorrect" });
    expect(s.streak).toBe(0);
    expect(s.fluent).toBe(true);
  });

  it("reset returns to a fresh state, preserving the threshold", () => {
    let s = initFluency(4);
    s = fluencyReducer(s, { type: "correct" });
    s = fluencyReducer(s, { type: "incorrect" });
    s = fluencyReducer(s, { type: "reset" });
    expect(s).toEqual(initFluency(4));
  });
});
