/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TermPopover } from "./TermPopover";

afterEach(cleanup);

function subject() {
  return (
    <p>
      Some prose with a{" "}
      <TermPopover term="preimage">
        <p>The shape you start with. Formal definition: the original figure.</p>
      </TermPopover>{" "}
      inside, and text after.
    </p>
  );
}

describe("TermPopover", () => {
  it("is closed by default and opens on click", async () => {
    const user = userEvent.setup();
    render(subject());

    const trigger = screen.getByRole("button", { name: /preimage/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/The shape you start with/)).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/The shape you start with/)).toBeInTheDocument();
  });

  it("closes on Escape and on outside interaction", async () => {
    const user = userEvent.setup();
    render(subject());

    const trigger = screen.getByRole("button", { name: /preimage/ });

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByText(/The shape you start with/)).not.toBeInTheDocument();

    await user.click(trigger);
    await user.click(screen.getByText(/text after/));
    expect(screen.queryByText(/The shape you start with/)).not.toBeInTheDocument();
  });
});
