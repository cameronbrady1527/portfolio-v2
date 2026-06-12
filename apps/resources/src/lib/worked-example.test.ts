import { describe, expect, it } from "vitest";
import { canReveal, init, reduce } from "./worked-example";

describe("worked-example reveal state", () => {
  it("starts with only the first step visible and reveals strictly in order", () => {
    let state = init([{ gated: false }, { gated: false }, { gated: false }]);
    expect(state.revealed).toBe(1);

    state = reduce(state, { type: "reveal" });
    expect(state.revealed).toBe(2);

    state = reduce(state, { type: "reveal" });
    state = reduce(state, { type: "reveal" }); // past the end: ignored
    expect(state.revealed).toBe(3);
    expect(canReveal(state)).toBe(false);
  });

  it("a gated step blocks the next reveal until attempted — and a wrong attempt unblocks (no deadlock)", () => {
    let state = init([{ gated: true }, { gated: false }]);

    expect(canReveal(state)).toBe(false);
    state = reduce(state, { type: "reveal" }); // blocked: ignored
    expect(state.revealed).toBe(1);

    state = reduce(state, { type: "answer", correct: false });
    expect(canReveal(state)).toBe(true);

    state = reduce(state, { type: "reveal" });
    expect(state.revealed).toBe(2);
  });
});
