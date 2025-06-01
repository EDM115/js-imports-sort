import { expect, test } from "vitest"

import sortImports from "../src/sort"

test("sortImports - full", () => {
  expect(sortImports(`import { createVuetify } from "vuetify";
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
}`)).toBe(`import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

import * from "node:fs"

import js from "@eslint/js"

import { defineNuxtPlugin } from "#app"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import { createVuetify } from "vuetify"
import {
  en,
  fr
} from "vuetify/locale"`)
})

test("sortImports - small", () => {
  expect(sortImports(`// This is a comment
import { createVuetify } from "vuetify"

import "@mdi/font/css/materialdesignicons.css" // oh a comment

/* a */
import js from '@eslint/js'

import { defineNuxtPlugin } from "#app"; /* another comment */

import * from "node:fs"
import {z, b}, s, a from "c"`)).toBe(`import "@mdi/font/css/materialdesignicons.css"

import * from "node:fs"

import js from '@eslint/js'

import { defineNuxtPlugin } from "#app"
import { createVuetify } from "vuetify"`)
})
