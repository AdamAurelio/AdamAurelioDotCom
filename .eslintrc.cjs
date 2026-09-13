module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    // Static accessibility checks on JSX (Frontend Standards §9). Catches the
    // mechanical half — missing alt, labels, roles — so the axe scan in e2e
    // only has to find what a linter can't.
    "plugin:jsx-a11y/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react-refresh", "jsx-a11y"],
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage",
    "playwright-report",
    "test-results",
    // Separate sub-project with its own deps/runtime (runs on the NAS, not the SPA).
    "nas_data_tier",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // Config + E2E + test files run under Node / test runners, not the browser.
      files: [
        "*.config.js",
        "*.mjs",
        "playwright.config.js",
        "e2e/**/*.{js,jsx}",
        "src/test/**/*.{js,jsx}",
        "**/*.{test,spec}.{js,jsx}",
      ],
      env: { node: true, browser: true },
    },
  ],
};
