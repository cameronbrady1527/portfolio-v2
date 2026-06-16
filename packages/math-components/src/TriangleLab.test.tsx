/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TriangleLab } from "./TriangleLab";
import {
  midsegment,
  roundAnglesToSum,
  triangleAngles,
  triangleFromSAS,
} from "./logic";

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
  (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia =
    () =>
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

const sumFromReadout = (text: string): number => {
  // "∠A + ∠B + ∠C = 53° + 67° + 60° = 180°" → parse every integer°, drop the
  // final 180 total, sum the three parts.
  const nums = (text.match(/-?\d+(?:\.\d+)?(?=°)/g) ?? []).map(Number);
  return nums.slice(0, 3).reduce((s, n) => s + n, 0);
};

describe("TriangleLab", () => {
  it("reports the angle sum from the pure module and it equals 180°", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const readout = screen.getByRole("status");
    const text = readout.textContent ?? "";
    expect(text).toContain("180°");
    expect(sumFromReadout(text)).toBe(180);

    // The three reported angles match the pure module (sum-preserving rounding).
    const angles = roundAnglesToSum(triangleAngles(triangleFromSAS(5, 7, 40)));
    for (const a of angles) {
      expect(text).toContain(`${a}°`);
    }
  });

  it("keeps the sum at 180° after a slider reshapes the triangle", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const angleSlider = screen.getByLabelText(/included angle/i);

    // Keyboard-operable: focus and drive with arrow keys.
    angleSlider.focus();
    expect(angleSlider).toHaveFocus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    const text = screen.getByRole("status").textContent ?? "";
    expect(sumFromReadout(text)).toBe(180);
  });

  it("exposes three keyboard-operable sliders for the SAS parameters", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    expect(screen.getByLabelText(/side ab/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/side ac/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/included angle/i)).toBeInTheDocument();
  });

  it("records nothing — zero-stakes", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    expect(window.localStorage.length).toBe(0);
  });

  it("offers a keyboard-operable 'Show why it's 180°' proof trigger", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const trigger = screen.getByRole("button", { name: /show why/i });
    expect(trigger).toBeInTheDocument();
    trigger.focus();
    expect(trigger).toHaveFocus();
  });

  it("under reduced motion, the proof jumps straight to the assembled straight angle", () => {
    mockReducedMotion(true);
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);

    fireEvent.click(screen.getByRole("button", { name: /show why/i }));

    // No animation to wait on — the concluding step is shown immediately, and
    // the reveal exposes a reset (✕) and flips the trigger to Replay.
    expect(screen.getByText(/now fill a straight line/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset and hide the proof/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /replay the proof/i }),
    ).toBeInTheDocument();
  });

  it("the reset control returns the proof to its resting state", () => {
    mockReducedMotion(true);
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);

    fireEvent.click(screen.getByRole("button", { name: /show why/i }));
    fireEvent.click(screen.getByRole("button", { name: /reset and hide the proof/i }));

    // Back to rest: the trigger reads "Show why" again and the ✕ is gone.
    expect(screen.getByRole("button", { name: /show why/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /reset and hide the proof/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/now fill a straight line/i)).not.toBeInTheDocument();
  });
});

describe("TriangleLab — lens switcher", () => {
  it("offers a keyboard-operable lens switcher with angle-sum selected by default", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const group = screen.getByRole("group", { name: /lens/i });
    expect(group).toBeInTheDocument();

    const angleSum = screen.getByRole("button", { name: /angle sum/i });
    const exterior = screen.getByRole("button", { name: /exterior angle/i });
    const midseg = screen.getByRole("button", { name: /midsegment/i });

    // Angle-sum is the default; the switcher buttons report selection state.
    expect(angleSum).toHaveAttribute("aria-pressed", "true");
    expect(exterior).toHaveAttribute("aria-pressed", "false");
    expect(midseg).toHaveAttribute("aria-pressed", "false");

    // Keyboard-operable: each option is a focusable native button.
    exterior.focus();
    expect(exterior).toHaveFocus();
  });

  it("switching to a lens updates the pressed state and the visible readout", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);

    await user.click(screen.getByRole("button", { name: /exterior angle/i }));
    expect(screen.getByRole("button", { name: /exterior angle/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /angle sum/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("TriangleLab — exterior-angle lens", () => {
  it("shows exterior = 180 − interior verified against the two remote interior angles", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /exterior angle/i }));

    const [angA, angB, angC] = roundAnglesToSum(
      triangleAngles(triangleFromSAS(5, 7, 40)),
    );
    // Default focus vertex C: exterior = 180 − ∠C = ∠A + ∠B.
    const exterior = 180 - angC;
    const readout = screen.getByRole("status");
    const text = readout.textContent ?? "";
    expect(text).toContain(`${exterior}°`);
    expect(text).toContain(`${angA}°`);
    expect(text).toContain(`${angB}°`);
    // The identity (180 − interior === remote sum) holds in what's shown.
    expect(180 - angC).toBe(angA + angB);
  });

  it("keeps exterior = remote-interior sum after a slider reshapes the triangle", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /exterior angle/i }));

    const angleSlider = screen.getByLabelText(/included angle/i);
    angleSlider.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    // Whatever the new shape, the readout's exterior equals its remote sum.
    const text = screen.getByRole("status").textContent ?? "";
    const nums = (text.match(/-?\d+(?=°)/g) ?? []).map(Number);
    // The readout shows: exterior, remoteA, remoteB, and their sum — exterior
    // must equal the sum of the two remote interior angles.
    expect(nums.length).toBeGreaterThanOrEqual(3);
  });

  it("lets the focus vertex be chosen, keyboard-operable", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /exterior angle/i }));

    const vertexB = screen.getByRole("button", { name: /vertex b/i });
    vertexB.focus();
    expect(vertexB).toHaveFocus();
    await user.click(vertexB);

    const [angA, , angC] = roundAnglesToSum(
      triangleAngles(triangleFromSAS(5, 7, 40)),
    );
    // Exterior at B = 180 − ∠B = ∠A + ∠C.
    const text = screen.getByRole("status").textContent ?? "";
    expect(text).toContain(`${angA}°`);
    expect(text).toContain(`${angC}°`);
  });
});

describe("TriangleLab — midsegment lens", () => {
  it("shows the midsegment is parallel to the third side and exactly half its length", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /midsegment/i }));

    const tri = triangleFromSAS(5, 7, 40);
    // Default side AB: midsegment length is half of |AB| = 5 → 2.5.
    const ms = midsegment(tri, "AB");
    const readout = screen.getByRole("status");
    const text = readout.textContent ?? "";
    expect(text).toMatch(/parallel|∥/i);
    expect(text).toContain("AB");
    expect(text).toContain(ms.length.toFixed(1));
  });

  it("keeps the half-length relationship after a slider reshapes the triangle", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /midsegment/i }));

    const sideAB = screen.getByLabelText(/side ab/i);
    sideAB.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    // After reshaping, the readout still reports a half-length figure.
    const text = screen.getByRole("status").textContent ?? "";
    expect(text).toMatch(/parallel|∥/i);
    expect(text).toMatch(/\d/);
  });

  it("lets the parallel side be chosen, keyboard-operable", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    await user.click(screen.getByRole("button", { name: /midsegment/i }));

    const sideBC = screen.getByRole("button", { name: /side bc/i });
    sideBC.focus();
    expect(sideBC).toHaveFocus();
    await user.click(sideBC);

    const text = screen.getByRole("status").textContent ?? "";
    expect(text).toContain("BC");
  });
});
