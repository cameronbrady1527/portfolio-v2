import { describe, expect, it } from "vitest";
import { applySequence, type TransformStep } from "./sequence";
import type { Shape } from "./types";

const point: Shape = { type: "point", at: { x: 1, y: 2 } };

describe("applySequence", () => {
  it("returns one intermediate image per step, in order", () => {
    const steps: TransformStep[] = [
      { kind: "translation", by: { dx: 2, dy: 0 } },
      { kind: "rotation", about: { x: 0, y: 0 }, angle: 90 },
    ];
    const images = applySequence(point, steps);
    expect(images).toHaveLength(2);
    expect(images[0]).toMatchObject({ at: { x: 3, y: 2 } }); // after translate
    expect(images[1]).toMatchObject({ at: { x: -2, y: 3 } }); // then rotate 90° CCW
  });

  it("an empty sequence yields no images (the preimage is already the result)", () => {
    expect(applySequence(point, [])).toEqual([]);
  });

  it("order matters: rotate∘translate ≠ translate∘rotate in general", () => {
    const t: TransformStep = { kind: "translation", by: { dx: 2, dy: 0 } };
    const r: TransformStep = { kind: "rotation", about: { x: 0, y: 0 }, angle: 90 };

    const translateThenRotate = applySequence(point, [t, r]).at(-1);
    const rotateThenTranslate = applySequence(point, [r, t]).at(-1);

    expect(translateThenRotate).toMatchObject({ at: { x: -2, y: 3 } });
    expect(rotateThenTranslate).toMatchObject({ at: { x: 0, y: 1 } });
    expect(translateThenRotate).not.toEqual(rotateThenTranslate);
  });
});
