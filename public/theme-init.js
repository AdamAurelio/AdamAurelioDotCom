/*
 * Applies the saved (or system-preferred) color theme to <html> before the app
 * renders, so there is no light/dark flash on load.
 *
 * Loaded from public/ as a same-origin script so it satisfies the strict CSP
 * (script-src 'self') — an inline <script> would be blocked. Kept tiny and
 * synchronous in <head> so it runs before first paint.
 */
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {
    /* localStorage unavailable (e.g. privacy mode) — default to light. */
  }
})();
