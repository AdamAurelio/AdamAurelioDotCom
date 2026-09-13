import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router";
import Layout from "./Layout";

const PageA = () => (
  <div>
    <h1>Page A</h1>
    <Link to="/b">go to b</Link>
  </div>
);
const PageB = () => <h1>Page B</h1>;

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageA />} />
          <Route path="b" element={<PageB />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("Layout", () => {
  let scrollTo;

  beforeEach(() => {
    // jsdom has no layout, so scrollTo is a stub that logs "not implemented".
    scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("offers a skip link that targets the main landmark", () => {
    renderApp();
    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("leaves scroll and focus alone on the initial load", () => {
    renderApp();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(screen.getByRole("main"));
  });

  it("scrolls to the top and focuses main on navigation", async () => {
    renderApp();
    await act(async () => {
      fireEvent.click(screen.getByRole("link", { name: "go to b" }));
    });

    expect(screen.getByRole("heading", { name: "Page B" })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    expect(document.activeElement).toBe(screen.getByRole("main"));
  });
});
