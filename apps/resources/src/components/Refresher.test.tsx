/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Refresher } from "./Refresher";

afterEach(cleanup);

describe("Refresher", () => {
  it("renders inline children over the id (escape hatch), collapsed by default", async () => {
    // The bogus id would make the library loader throw — children must win
    // without the loader ever being consulted.
    render(
      await Refresher({
        id: "does-not-exist",
        title: "Square roots, the quick version",
        children: <p>A bespoke refresher just for this topic.</p>,
      }),
    );

    const panel = screen.getByTestId("refresher");
    expect(panel).not.toHaveAttribute("open");
    expect(
      screen.getByText("A bespoke refresher just for this topic."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Need a refresher\? Square roots, the quick version/),
    ).toBeInTheDocument();
  });
});
