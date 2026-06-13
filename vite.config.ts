import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// NOTE: when merged into the SPS monorepo, this app becomes a lazy-loaded
// route module; keep this config minimal and self-contained.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@game": path.resolve(__dirname, "src/game"),
      "@shell": path.resolve(__dirname, "src/shell"),
      "@server": path.resolve(__dirname, "src/server"),
    },
  },
});
