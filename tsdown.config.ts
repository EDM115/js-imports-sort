import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: {
    cli: "./src/cli.ts",
    main: "./src/sort.ts",
  },
  exports: true,
  format: [ "cjs", "esm" ],
  minify: true,
  platform: "node",
  shims: true,
  target: [ "esnext", "node20" ],
  unused: true,
})
