import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: [
    "./src/components/index.tsx",
    "./src/hooks/index.ts",
    "./src/utils/index.ts",
  ],
  format: ["cjs", "esm"],
  external: ["react"],
  banner: {
    js: "'use client'",
  },
  ...options,
}));

