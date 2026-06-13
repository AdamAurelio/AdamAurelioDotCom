module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react-refresh"],
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage",
    "playwright-report",
    "test-results",
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
        "playwright.config.js",
        "e2e/**/*.{js,jsx}",
        "src/test/**/*.{js,jsx}",
        "**/*.{test,spec}.{js,jsx}",
      ],
      env: { node: true, browser: true },
    },
  ],
};
