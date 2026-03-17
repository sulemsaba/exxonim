import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
      "@exxonim/shared": resolve(rootDir, "../../packages/shared/src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    fs: {
      allow: [resolve(rootDir, "../..")],
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
