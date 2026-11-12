import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { siteTarget } from "./src/content/site-target.ts";

export default defineConfig(({ isPreview }) => ({
  base: siteTarget.basePath,
  appType: isPreview && siteTarget.basePath === "/" ? "mpa" : "spa",
  define: { __RECIPE_SITE_TARGET__: JSON.stringify(siteTarget) },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
}));
