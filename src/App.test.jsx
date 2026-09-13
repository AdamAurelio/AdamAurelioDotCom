import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { routes } from "./routes";
import { pages } from "./pages";

describe("App", () => {
  it("renders the layout with banner, main, and contentinfo landmarks", () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument(); // <header>
    expect(screen.getByRole("main")).toBeInTheDocument(); // <main>
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // <footer>
  });

  it("has a page component for every route in the manifest, and nothing extra", () => {
    const manifest = routes.map((r) => r.path).sort();
    const implemented = Object.keys(pages).sort();
    expect(implemented).toEqual(manifest);
  });

  it("renders the home page for /", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: /hi, i'm adam/i })).toBeInTheDocument();
  });
});
