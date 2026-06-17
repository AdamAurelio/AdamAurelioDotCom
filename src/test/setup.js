// Vitest global setup: jest-dom matchers + jsdom polyfills.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests to avoid cross-test leakage.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia; theme code (ThemeToggle) reads it.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom lacks IntersectionObserver; Reveal/CountUp use it. No-op stub so
// components render without animating.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserverStub;
globalThis.IntersectionObserver = IntersectionObserverStub;
