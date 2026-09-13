import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Header from "./Header";
import { navRoutes } from "../routes";

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>
  );

describe("Header", () => {
  it("lists every nav route from the manifest", () => {
    renderAt("/");
    const primary = screen.getByRole("navigation", { name: "Primary" });
    for (const { label } of navRoutes) {
      expect(primary).toHaveTextContent(label);
    }
  });

  it("marks the current route with aria-current", () => {
    renderAt("/projects");
    const primary = screen.getByRole("navigation", { name: "Primary" });
    const active = primary.querySelector('[aria-current="page"]');
    expect(active).toHaveTextContent("Projects");
    expect(primary.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it("toggles the mobile menu and its accessible state", () => {
    renderAt("/");
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    // Choosing a destination closes the menu.
    const mobile = screen.getByRole("navigation", { name: "Primary, mobile" });
    fireEvent.click(mobile.querySelector("a"));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
