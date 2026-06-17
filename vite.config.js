/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static SPA build. Output goes to dist/ which is uploaded to S3 (prod)
// or served by nginx (qa). See docs/ARCHITECTURE.md.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
    // In a Docker bind mount (especially on Windows/macOS) native filesystem
    // events don't reach the container, so HMR needs polling. Enabled only
    // inside the dev container — docker-compose.dev.yml sets VITE_DOCKER=1 —
    // so native `npm run dev` is unaffected.
    watch: process.env.VITE_DOCKER ? { usePolling: true } : undefined,
  },
  // Unit/component tests (Vitest). E2E lives in e2e/ and runs via Playwright.
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.{test,spec}.{js,jsx}", "src/test/**", "src/main.jsx"],
    },
  },
});
