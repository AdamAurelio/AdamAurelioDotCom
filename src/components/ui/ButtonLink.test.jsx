import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ButtonLink from "./ButtonLink";

describe("ButtonLink", () => {
  it("renders an internal route as a client-side link", () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/projects">Projects</ButtonLink>
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders an external URL hardened for a new tab", () => {
    render(<ButtonLink href="https://example.com/x">Source</ButtonLink>);
    const link = screen.getByRole("link", { name: "Source" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to the primary variant for an unknown name", () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/" variant="nope">
          Home
        </ButtonLink>
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Home" }).className).toContain("bg-teal-700");
  });
});
