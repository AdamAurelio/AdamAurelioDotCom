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
  },
});
