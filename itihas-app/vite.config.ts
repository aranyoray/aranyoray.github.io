import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/itihas/" : "./",
  build: {
    outDir: "../itihas",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: { manualChunks: { map: ["maplibre-gl"], fallback: ["leaflet"] } },
    },
  },
}));
