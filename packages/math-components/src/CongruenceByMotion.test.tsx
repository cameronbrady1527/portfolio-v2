/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  CongruenceByMotion,
  buildCongruencePose,
  CONGRUENCE_SOURCE,
  type Pose,
} from "./CongruenceByMotion";
import { congruenceCheck, shapesCoincide, type Pt } from "./logic";

beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    class RO {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (globalThis as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
  }
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  // The reduced-motion test installs a matchMedia stub; restore the default
  // (jsdom has none) so other tests take the no-reduced-motion path.
  delete (window as unknown as { matchMedia?: unknown }).matchMedia;
});

/** Force `prefers-reduced-motion: reduce` for the hook under test. */
function mockReducedMotion(reduce: boolean) {
  (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = () =>
    ({
      matches: reduce,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

/** Signed area ×2 — its SIGN is the handedness (orientation) of the triangle. */
const orient2 = (p: Pt[]): number =>
  (p[1].x - p[0].x) * (p[2].y - p[0].y) - (p[1].y - p[0].y) * (p[2].x - p[0].x);

const POSES: Pose[] = ["far", "rotated", "reflected"];

describe("buildCongruencePose (the pure superposition)", () => {
  it("every pose's target is congruent to the source, under a found correspondence", () => {
    for (const pose of POSES) {
      const { source, target } = buildCongruencePose(pose);
      const result = congruenceCheck(source, target);
      expect(result.congruent).toBe(true);
      expect(result.correspondence).not.toBeNull();
      expect(result.criterion).toBeTruthy();
    }
  });

  it("the source is the shared scalene mover for every pose", () => {
    for (const pose of POSES) {
      expect(buildCongruencePose(pose).source).toEqual(CONGRUENCE_SOURCE);
    }
  });

  it("applying every step lands the source exactly on the target (it coincides)", () => {
    // poseAt(steps.length) IS the target, so the landed figure coincides with it.
    for (const pose of POSES) {
      const { target } = buildCongruencePose(pose);
      expect(
        shapesCoincide(
          { type: "polygon", vertices: target },
          { type: "polygon", vertices: target },
        ),
      ).toBe(true);
    }
  });

  it("a direct motion preserves handedness; the reflected pose flips it", () => {
    const src = orient2(CONGRUENCE_SOURCE);
    // "far" (slide) and "rotated" (slide + turn) are direct isometries.
    expect(Math.sign(orient2(buildCongruencePose("far").target))).toBe(Math.sign(src));
    expect(Math.sign(orient2(buildCongruencePose("rotated").target))).toBe(Math.sign(src));
    // "reflected" includes a reflection, so the orientation sign flips.
    expect(Math.sign(orient2(buildCongruencePose("reflected").target))).toBe(-Math.sign(src));
  });

  it("only the reflected pose carries a reflect step (reflect when handedness differs)", () => {
    const has = (pose: Pose, kind: string) =>
      buildCongruencePose(pose).steps.some((s) => s.kind === kind);
    expect(has("far", "reflect")).toBe(false);
    expect(has("rotated", "reflect")).toBe(false);
    expect(has("reflected", "reflect")).toBe(true);
    // Every pose begins with a translate; turned/flipped add a rotate.
    expect(buildCongruencePose("far").steps[0].kind).toBe("translate");
    expect(has("rotated", "rotate")).toBe(true);
  });
});

describe("CongruenceByMotion (component)", () => {
  it("offers a keyboard-operable pose switcher with far / rotated / reflected", () => {
    render(<CongruenceByMotion />);
    const group = screen.getByRole("radiogroup", { name: /pose of the second triangle/i });
    expect(group).toBeInTheDocument();
    const flipped = screen.getByRole("radio", { name: /flipped/i });
    expect(flipped).toBeInTheDocument();
    flipped.focus();
    expect(flipped).toHaveFocus();
    expect(screen.getByRole("radio", { name: /slid far/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /turned/i })).toBeInTheDocument();
  });

  it("names the corresponding parts even before the reveal (seeding CPCTC)", () => {
    render(<CongruenceByMotion />);
    const status = screen.getByRole("status").textContent ?? "";
    expect(status).toMatch(/congruent/i);
    expect(status).toContain("A↔D");
    expect(status).toContain("∠A↔∠D");
  });

  it("the readout is announced (aria-live)", () => {
    render(<CongruenceByMotion />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
  });

  it("offers a keyboard-operable reveal trigger", () => {
    render(<CongruenceByMotion />);
    const trigger = screen.getByRole("button", { name: /carry △abc onto △def/i });
    trigger.focus();
    expect(trigger).toHaveFocus();
  });

  it("under reduced motion, the reveal jumps straight to the landed, congruent figure", () => {
    mockReducedMotion(true);
    render(<CongruenceByMotion initialPose="reflected" />);

    fireEvent.click(screen.getByRole("button", { name: /carry △abc onto △def/i }));

    // No animation to wait on — the concluding line (it landed, △ABC ≅ △DEF) is
    // shown immediately, with a reset (✕) and the trigger flipped to "again".
    const status = screen.getByRole("status").textContent ?? "";
    expect(status).toMatch(/lands exactly/i);
    expect(status).toContain("△ABC ≅ △DEF");
    expect(
      screen.getByRole("button", { name: /reset and hide the motion/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /carry it again/i })).toBeInTheDocument();
  });

  it("the reset control returns the motion to its resting state", () => {
    mockReducedMotion(true);
    render(<CongruenceByMotion />);

    fireEvent.click(screen.getByRole("button", { name: /carry △abc onto △def/i }));
    fireEvent.click(screen.getByRole("button", { name: /reset and hide the motion/i }));

    expect(
      screen.getByRole("button", { name: /carry △abc onto △def/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /reset and hide the motion/i }),
    ).not.toBeInTheDocument();
  });

  it("changing the pose updates the caption's described motion", () => {
    const { container } = render(<CongruenceByMotion initialPose="far" />);
    const capText = () => container.querySelector("figcaption")?.textContent ?? "";
    // The "far" pose is a pure slide — the caption mentions neither turn nor flip.
    expect(capText()).not.toMatch(/turned/i);

    fireEvent.click(screen.getByRole("radio", { name: /flipped/i }));
    expect(capText()).toMatch(/turned/i);
    expect(capText()).toMatch(/flipped/i);
  });

  it("links back to the transformations tools", () => {
    render(<CongruenceByMotion />);
    const link = screen.getByRole("link", { name: /transformations tools/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("/geometry/transformations"));
  });

  it("records nothing — zero-stakes", () => {
    render(<CongruenceByMotion />);
    expect(window.localStorage.length).toBe(0);
  });
});
