import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// The real SDK is never loaded in tests — that's the point of the lazy import.
const init = vi.fn();
const captureException = vi.fn();
vi.mock("@sentry/browser", () => ({ init, captureException }));

// VITE_SENTRY_DSN is read once at module scope, so each case has to stub the
// environment and then re-import to get a module built against it.
const loadModule = async (dsn) => {
  vi.resetModules();
  if (dsn) vi.stubEnv("VITE_SENTRY_DSN", dsn);
  return import("./monitoring");
};

const DSN = "https://abc123@o0.ingest.us.sentry.io/0";

describe("monitoring", () => {
  beforeEach(() => {
    init.mockClear();
    captureException.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does nothing at all without a DSN", async () => {
    const { reportError, initMonitoring } = await loadModule(null);

    initMonitoring();
    reportError(new Error("boom"));
    await vi.waitFor(() => {}); // let any stray promise settle

    expect(init).not.toHaveBeenCalled();
    expect(captureException).not.toHaveBeenCalled();
  });

  it("loads the SDK only once an error is reported, then flushes the queue", async () => {
    const { reportError } = await loadModule(DSN);

    // Nothing loaded yet — a healthy visit must not fetch the chunk.
    expect(init).not.toHaveBeenCalled();

    reportError(new Error("boom"), { componentStack: "<Resume />" });

    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(captureException).toHaveBeenCalledTimes(1));

    const [err, ctx] = captureException.mock.calls[0];
    expect(err.message).toBe("boom");
    expect(ctx.contexts.react.componentStack).toBe("<Resume />");
  });

  it("initialises the SDK once no matter how many errors arrive", async () => {
    const { reportError } = await loadModule(DSN);

    reportError(new Error("first"));
    reportError(new Error("second"));

    await vi.waitFor(() => expect(captureException).toHaveBeenCalledTimes(2));
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("stays silent when the visitor has explicitly opted out", async () => {
    window.localStorage.setItem("analytics:opt-out", "1");
    const { reportError, initMonitoring } = await loadModule(DSN);

    initMonitoring();
    reportError(new Error("boom"));
    await vi.waitFor(() => {});

    expect(init).not.toHaveBeenCalled();
  });

  it("reports unhandled promise rejections, which no error boundary can see", async () => {
    const { initMonitoring } = await loadModule(DSN);
    initMonitoring();

    window.dispatchEvent(
      Object.assign(new Event("unhandledrejection"), { reason: new Error("async boom") })
    );

    await vi.waitFor(() => expect(captureException).toHaveBeenCalledTimes(1));
    expect(captureException.mock.calls[0][0].message).toBe("async boom");
  });
});
