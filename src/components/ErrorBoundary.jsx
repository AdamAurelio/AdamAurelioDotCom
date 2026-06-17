/* eslint-disable react/prop-types */
import React from "react";

/**
 * Top-level error boundary (ADAM model, Frontend §8: errors must never fail
 * silently; show a safe, understandable message — never a stack trace).
 *
 * Catches render-time errors anywhere below it and shows a recoverable
 * fallback. React error boundaries must be class components.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Flip to the fallback UI on the next render.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Single place to report errors. For a static site this logs locally; when a
    // telemetry sink is added, send here (and widen CSP `connect-src` to it).
    // Never surface `error`/`info` to the user — they can contain internals.
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-6 text-center"
        >
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
