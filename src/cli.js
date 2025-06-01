#!/usr/bin/env node

import fs from "fs"
import path from "path"
import sortImports from "./sort.js"

const args = process.argv.slice(2)
const filePath = args.find((arg) => !arg.startsWith("-"))
const logFlag = args.includes("-l") || args.includes("--log")
const replaceFlag = args.includes("-r") || args.includes("--replace")
const outputIndex = args.findIndex((arg) => arg === "-o" || arg === "--output")
const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null

if (!filePath) {
  console.error("Please provide a file path.")
  process.exit(1)
}

if (!logFlag && !replaceFlag && !outputPath) {
  console.error("Please provide at least one option: -l/--log, -r/--replace, or -o/--output with -r")
  process.exit(1)
}

if (outputPath && !replaceFlag) {
  console.error("The -o/--output option must be used with -r/--replace.")
  process.exit(1)
}

const fullPath = path.resolve(process.cwd(), filePath)
const fullOutputPath = outputPath
  ? path.resolve(process.cwd(), outputPath)
  : null

fs.readFile(fullPath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`)
    process.exit(1)
  }

  const sortedCode = sortImports(data)

  if (logFlag) {
    console.log(sortedCode)
  }

  if (replaceFlag) {
    const writePath = fullOutputPath || fullPath

    fs.writeFile(writePath, sortedCode, "utf8", (err2) => {
      if (err2) {
        console.error(`Error writing file: ${err2.message}`)
        process.exit(1)
      }
      console.log(`File sorted and saved to ${writePath}`)
    })
  }
})
