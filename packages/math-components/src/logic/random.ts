// Deterministic PRNG, shared across practice logic. Same seed → same stream on
// every machine, so anything built on it (answer-equivalence sampling in the
// expression engine, problem generators) is reproducible and unit-testable
// without touching Math.random.

/**
 * mulberry32 — a small, fast, well-distributed 32-bit seeded PRNG returning
 * floats in [0, 1). Deterministic: identical seeds yield identical sequences.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
