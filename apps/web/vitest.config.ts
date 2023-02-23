import { fileURLToPath } from "url";
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["src/test/helpers/setup.ts"],
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "**/e2e/**", "src/server"],
    alias: {
      "@/": fileURLToPath(new URL("./src/", import.meta.url)),
    },
    deps: {
      inline: ["vitest-canvas-mock"],
    },
    // For this config, check https://github.com/vitest-dev/vitest/issues/740
    threads: false,
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
  },
});
