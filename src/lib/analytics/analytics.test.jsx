import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { init, trackEvent, trackPageview, isOptedOut, __reset } from "./index";
import Analytics from "../../components/Analytics";
import OutboundLink from "../../components/OutboundLink";

// The debug provider is the dev default and writes to window.__analytics.
const hits = () => window.__analytics?.hits ?? [];

describe("analytics facade", () => {
  beforeEach(() => {
    __reset();
    delete window.__analytics;
    window.localStorage.clear();
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the debug provider in dev and records events locally", () => {
    expect(init()).toBe("debug");

    trackPageview("/resume");
    trackEvent("resume_print");

    expect(hits()).toEqual([
      expect.objectContaining({ type: "pageview", path: "/resume" }),
      expect.objectContaining({ type: "event", name: "resume_print" }),
    ]);
  });

  it("is idempotent, so StrictMode's double-invoke cannot double-init", () => {
    init();
    const first = window.__analytics;
    init();
    expect(window.__analytics).toBe(first);
  });

  it("falls back to a no-op provider when the visitor has opted out", () => {
    window.localStorage.setItem("analytics:opt-out", "1");

    expect(isOptedOut()).toBe(true);
    expect(init()).toBe("none");

    trackEvent("resume_print");
    // No provider means no buffer at all — nothing was collected.
    expect(window.__analytics).toBeUndefined();
  });
});

describe("<Analytics />", () => {
  beforeEach(() => {
    __reset();
    delete window.__analytics;
    window.localStorage.clear();
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("records a page view for the route it mounts on", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Analytics />
        <Routes>
          <Route path="/projects" element={<p>projects</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(window.__analytics.pageviews).toEqual([
      expect.objectContaining({ path: "/projects" }),
    ]);
  });

  it("reports a route once even though StrictMode double-invokes effects", () => {
    render(
      <React.StrictMode>
        <MemoryRouter initialEntries={["/about"]}>
          <Analytics />
          <Routes>
            <Route path="/about" element={<p>about</p>} />
          </Routes>
        </MemoryRouter>
      </React.StrictMode>
    );

    expect(window.__analytics.pageviews).toHaveLength(1);
  });
});

describe("<OutboundLink />", () => {
  beforeEach(() => {
    __reset();
    delete window.__analytics;
    window.localStorage.clear();
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("records the click with the host only, and keeps the link hardened", () => {
    render(
      <OutboundLink href="https://github.com/AdamAurelio/repo?utm=x" label="site-source">
        View source
      </OutboundLink>
    );

    const link = screen.getByRole("link", { name: "View source" });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");

    fireEvent.click(link);

    const [hit] = window.__analytics.events;
    expect(hit).toMatchObject({
      name: "outbound_link",
      props: { host: "github.com", label: "site-source" },
    });
    // The path and query never travel — only the destination host.
    expect(JSON.stringify(hit)).not.toContain("utm=x");
  });
});
