/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Breadcrumbs } from "./Breadcrumbs";
import type { Crumb } from "@/lib/content/derive";

afterEach(cleanup);

describe("Breadcrumbs", () => {
  it("renders an ancestor crumb with an href as a link to that href", () => {
    const crumbs: Crumb[] = [
      { label: "Geometry", href: "/geometry" },
      { label: "Transformations", href: "/geometry/transformations" },
      { label: "Reflections", href: "/geometry/transformations/reflections" },
    ];
    render(<Breadcrumbs crumbs={crumbs} />);

    const link = screen.getByRole("link", { name: "Geometry" });
    expect(link).toHaveAttribute("href", "/geometry");
  });

  it("renders the leaf crumb as plain text, not a link, even when it has an href", () => {
    const crumbs: Crumb[] = [
      { label: "Geometry", href: "/geometry" },
      { label: "Reflections", href: "/geometry/transformations/reflections" },
    ];
    render(<Breadcrumbs crumbs={crumbs} />);

    expect(screen.queryByRole("link", { name: "Reflections" })).toBeNull();
    expect(screen.getByText("Reflections")).toBeInTheDocument();
  });

  it("renders an ancestor crumb without an href as plain text", () => {
    const crumbs: Crumb[] = [
      { label: "Geometry" },
      { label: "Transformations" },
      { label: "Reflections", href: "/geometry/transformations/reflections" },
    ];
    render(<Breadcrumbs crumbs={crumbs} />);

    expect(screen.queryByRole("link", { name: "Geometry" })).toBeNull();
    expect(screen.getByText("Geometry")).toBeInTheDocument();
  });

  it("exposes a breadcrumb navigation landmark", () => {
    render(<Breadcrumbs crumbs={[{ label: "Geometry", href: "/geometry" }]} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders nothing when there are no crumbs (e.g. the home page)", () => {
    const { container } = render(<Breadcrumbs crumbs={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
