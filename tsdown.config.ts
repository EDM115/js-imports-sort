import { defineConfig } from "tsdown"

export default defineConfig([
  {
    entry: [ "./src/cli.ts" ],
    platform: "neutral",
    dts: true,
  },
])
