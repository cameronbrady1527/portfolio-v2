import { describe, expect, it } from "vitest";
import { grade } from "../grade";
import { mulberry32 } from "../../random";
import { signedAddSub } from "./signed-add-sub";

// Recover the two operands and the operation from a prompt like "−7 − (−3) = ?"
// so the test can re-derive the answer independently of the generator's own
// arithmetic — this is what actually verifies the MATH, not just the plumbing.
function recompute(prompt: string): number {
  const core = prompt.replace(/\s*=\s*\?$/, "").trim();
  const m = core.match(/^(.+?)\s*([+−])\s*(.+)$/u);
  if (!m) throw new Error(`unparseable prompt: ${prompt}`);
  const toInt = (s: string) =>
    Number(s.replace(/[()]/g, "").replace(/−/g, "-"));
  const a = toInt(m[1]);
  const b = toInt(m[3]);
  return m[2] === "+" ? a + b : a - b;
}

describe("signedAddSub generator — determinism", () => {
  it("the same seed reproduces the same problem sequence", () => {
    const a = mulberry32(2024);
    const b = mulberry32(2024);
    const seqA = Array.from({ length: 12 }, () => signedAddSub(1, a));
    const seqB = Array.from({ length: 12 }, () => signedAddSub(1, b));
    expect(seqA).toEqual(seqB);
  });
});

describe("signedAddSub generator — math correctness", () => {
  it("every generated problem's stated answer is the true arithmetic result", () => {
    const rng = mulberry32(7);
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 200; i++) {
        const q = signedAddSub(level, rng);
        expect(q.type).toBe("numeric");
        if (q.type !== "numeric") continue;
        expect(q.answer).toBe(recompute(q.prompt));
      }
    }
  });

  it("is shaped to feed grade() — answering with the stated answer grades correct", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 100; i++) {
      const q = signedAddSub(2, rng);
      if (q.type !== "numeric") continue;
      expect(grade(q, q.answer).correct).toBe(true);
      // A deliberately wrong response grades incorrect (sanity on tolerance 0).
      expect(grade(q, q.answer + 1).correct).toBe(false);
    }
  });
});

describe("signedAddSub generator — difficulty scales with level", () => {
  it("level 1 stays single-digit (|operands| ≤ 9, so |answer| ≤ 18)", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 300; i++) {
      const q = signedAddSub(1, rng);
      if (q.type !== "numeric") continue;
      expect(Math.abs(q.answer)).toBeLessThanOrEqual(18);
    }
  });

  it("higher levels produce larger problems than level 1 ever can", () => {
    const rng = mulberry32(5);
    let sawBig = false;
    for (let i = 0; i < 300; i++) {
      const q = signedAddSub(3, rng);
      if (q.type !== "numeric") continue;
      if (Math.abs(q.answer) > 18) sawBig = true;
    }
    expect(sawBig).toBe(true);
  });
});
