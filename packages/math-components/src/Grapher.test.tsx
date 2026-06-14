/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi, beforeAll } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Grapher, choose } from "./Grapher";
import type { GrapherSpec, GrapherChange } from "./Grapher";
import type { Shape } from "./logic";

// mafs measures its container with ResizeObserver; jsdom lacks it.
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

// Vitest runs without `globals: true`, so RTL's automatic afterEach cleanup is
// not registered. Unmount between tests so the shared figcaption id is unique.
afterEach(() => cleanup());

const triangle: Shape = {
  type: "polygon",
  label: "T",
  vertices: [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 4 },
  ],
};

function reflectionSpec(): GrapherSpec {
  return {
    preimage: triangle,
    transform: {
      kind: "reflection",
      over: { kind: "axis", axis: choose<"x" | "y">("x", ["x", "y"], "Axis") },
    },
  };
}

describe("<Grapher> — reflection", () => {
  it("renders a keyboard-operable control and an auto a11y caption", () => {
    render(<Grapher spec={reflectionSpec()} />);

    // controls-first: the choose() renders a labeled native <select>
    const select = screen.getByLabelText("Axis");
    expect(select.tagName).toBe("SELECT");

    // auto caption describes preimage + transform + current param
    const caption = document.getElementById("grapher-caption");
    expect(caption).toHaveTextContent(/reflected across the x-axis/i);
  });

  it("updates caption + fires onChange with a correctly reflected image when the control changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(c: GrapherChange) => void>();
    render(<Grapher spec={reflectionSpec()} onChange={onChange} />);

    const caption = () => document.getElementById("grapher-caption");
    // initial caption: reflecting over x-axis
    expect(caption()).toHaveTextContent(/across the x-axis/i);

    // switch the axis to y
    await user.selectOptions(screen.getByLabelText("Axis"), "y");

    // caption updates to the y-axis
    expect(caption()).toHaveTextContent(/across the y-axis/i);

    // onChange fired with the y-axis reflection of the triangle (x -> -x)
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const last = onChange.mock.calls.at(-1)![0];
    expect(last.params.Axis).toBe("y");
    const img = Array.isArray(last.image) ? last.image[0] : last.image;
    expect(img.type).toBe("polygon");
    if (img.type === "polygon") {
      expect(img.vertices).toEqual([
        { x: -1, y: 1 },
        { x: -3, y: 1 },
        { x: -2, y: 4 },
      ]);
    }
  });
});
