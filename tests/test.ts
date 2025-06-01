import sortImports from "../src/sort"

const code = `
import { createVuetify } from "vuetify";
import js from "@eslint/js";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import {z, b}, s, a from "c"
import * from "node:fs";
import { defineNuxtPlugin } from "#app"
import "vuetify/styles"
import {
  en,
  fr
} from "vuetify/locale"
import "@mdi/font/css/materialdesignicons.css";

var a = 1
for (let i = 0; i < 10; i++) {
  console.log(i)
}
`

const sortedCode = sortImports(code)

console.log(sortedCode)

console.log("\n---\n")

const code2 = `
// This is a comment
import { createVuetify } from "vuetify"

import "@mdi/font/css/materialdesignicons.css" // oh a comment

/* a */
import js from '@eslint/js'

import { defineNuxtPlugin } from "#app"; /* another comment */

import * from "node:fs"
import {z, b}, s, a from "c"
`

const sortedCode2 = sortImports(code2)

console.log(sortedCode2)

console.log("\n---\n")
