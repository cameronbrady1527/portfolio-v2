import { describe, expect, it } from "vitest";
import { transversalAngles } from "./angles";

const norm180 = (d: number) => {
  let a = d % 180;
  if (a <= 0) a += 180;
  return a;
};

/**
 * A spread of (line1, line2, transversal) direction-angle triples in degrees.
 * Skips degenerate configs where the transversal is parallel to a line (no
 * genuine crossing — the eight-angle figure is undefined there).
 */
function* triples() {
  for (let l1 = 0; l1 < 180; l1 += 23) {
    for (let l2 = 0; l2 < 180; l2 += 31) {
      for (let t = 1; t < 180; t += 17) {
        if (norm180(t - l1) === 180 || norm180(t - l2) === 180) continue;
        if (norm180(t - l1) === 0 || norm180(t - l2) === 0) continue;
        yield { line1Dir: l1, line2Dir: l2, transversalDir: t };
      }
    }
  }
}

const APPROX = 1e-9;

describe("transversalAngles — vertical angles", () => {
  it("vertical-angle pairs are ALWAYS equal, across many configurations", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      for (const pair of result.pairs) {
        if (pair.relationship !== "vertical") continue;
        const [a, b] = pair.angles;
        expect(result.angles[a].measure).toBeCloseTo(
          result.angles[b].measure,
          9,
        );
        expect(pair.equal).toBe(true);
      }
    }
  });
});

describe("transversalAngles — linear pairs", () => {
  it("linear-pair measures ALWAYS sum to 180°", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      const linearPairs = result.pairs.filter((p) => p.relationship === "linear-pair");
      expect(linearPairs.length).toBeGreaterThan(0);
      for (const p of linearPairs) {
        const [a, b] = p.angles;
        expect(result.angles[a].measure + result.angles[b].measure).toBeCloseTo(
          180,
          9,
        );
      }
    }
  });
});

describe("transversalAngles — corresponding angles", () => {
  it("corresponding angles are equal IFF the lines are parallel", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      const parallel = norm180(cfg.line1Dir) === norm180(cfg.line2Dir);
      const corr = result.pairs.filter((p) => p.relationship === "corresponding");
      expect(corr.length).toBe(4);
      for (const p of corr) {
        const [a, b] = p.angles;
        const equal =
          Math.abs(result.angles[a].measure - result.angles[b].measure) < APPROX;
        expect(equal).toBe(parallel);
        expect(p.equal).toBe(equal);
      }
    }
  });
});

describe("transversalAngles — alternate angles", () => {
  it("alternate-interior angles are equal IFF the lines are parallel", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      const parallel = norm180(cfg.line1Dir) === norm180(cfg.line2Dir);
      const alt = result.pairs.filter((p) => p.relationship === "alternate-interior");
      expect(alt.length).toBe(2);
      for (const p of alt) {
        const [a, b] = p.angles;
        expect(result.angles[a].region).toBe("interior");
        expect(result.angles[b].region).toBe("interior");
        const equal =
          Math.abs(result.angles[a].measure - result.angles[b].measure) < APPROX;
        expect(equal).toBe(parallel);
        expect(p.equal).toBe(equal);
      }
    }
  });

  it("alternate-exterior angles are equal IFF the lines are parallel", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      const parallel = norm180(cfg.line1Dir) === norm180(cfg.line2Dir);
      const alt = result.pairs.filter((p) => p.relationship === "alternate-exterior");
      expect(alt.length).toBe(2);
      for (const p of alt) {
        const [a, b] = p.angles;
        expect(result.angles[a].region).toBe("exterior");
        expect(result.angles[b].region).toBe("exterior");
        const equal =
          Math.abs(result.angles[a].measure - result.angles[b].measure) < APPROX;
        expect(equal).toBe(parallel);
        expect(p.equal).toBe(equal);
      }
    }
  });
});

describe("transversalAngles — co-interior (same-side interior)", () => {
  it("co-interior angles sum to 180° IFF the lines are parallel", () => {
    for (const cfg of triples()) {
      const result = transversalAngles(cfg);
      const parallel = norm180(cfg.line1Dir) === norm180(cfg.line2Dir);
      const co = result.pairs.filter((p) => p.relationship === "co-interior");
      expect(co.length).toBe(2);
      for (const p of co) {
        const [a, b] = p.angles;
        expect(result.angles[a].region).toBe("interior");
        expect(result.angles[b].region).toBe("interior");
        const sum = result.angles[a].measure + result.angles[b].measure;
        expect(Math.abs(sum - 180) < APPROX).toBe(parallel);
      }
    }
  });
});

describe("transversalAngles — shape & concrete values", () => {
  it("returns eight angles, all normalized into (0,180)", () => {
    const r = transversalAngles({ line1Dir: 0, line2Dir: 40, transversalDir: 70 });
    const ids = [1, 2, 3, 4, 5, 6, 7, 8] as const;
    expect(Object.keys(r.angles).map(Number).sort()).toEqual([...ids]);
    for (const id of ids) {
      expect(r.angles[id].id).toBe(id);
      expect(r.angles[id].measure).toBeGreaterThan(0);
      expect(r.angles[id].measure).toBeLessThan(180);
    }
  });

  it("reports parallel exactly when the two line directions coincide (mod 180)", () => {
    expect(transversalAngles({ line1Dir: 0, line2Dir: 0, transversalDir: 90 }).parallel).toBe(true);
    expect(transversalAngles({ line1Dir: 10, line2Dir: 190, transversalDir: 90 }).parallel).toBe(true);
    expect(transversalAngles({ line1Dir: 0, line2Dir: 30, transversalDir: 90 }).parallel).toBe(false);
  });

  it("computes a known horizontal-lines / 70°-transversal config", () => {
    // Both lines horizontal (0°), transversal at 70°: θ = 70 at each → vertical
    // pairs 70°, linear-pair partners 110°; all corresponding pairs equal.
    const r = transversalAngles({ line1Dir: 0, line2Dir: 0, transversalDir: 70 });
    expect(r.angles[1].measure).toBeCloseTo(70, 9);
    expect(r.angles[4].measure).toBeCloseTo(70, 9); // vertical to 1
    expect(r.angles[2].measure).toBeCloseTo(110, 9); // linear pair with 1
    for (const p of r.pairs.filter((x) => x.relationship === "corresponding")) {
      expect(p.equal).toBe(true);
    }
  });
});
