import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

// router unit tests

export default defineConfig({
  test: {
    include: ["src/server/**/*.test.ts"],
    environment: "node",
    alias: {
      "@/": fileURLToPath(new URL("./src/", import.meta.url)),
    },
    threads: false,
  },
});
