# js-imports-sort

A simple script to sort Javascript imports the way I want

## Rules

### Order

1. No names (side-effect)  
   `import "module"`
2. Everything  
   `import * from "module"`
3. Defaults  
   `import a from "module"`
4. Named  
   `import { a, b } from "module"`

### Sorting

- The source is prioritized over the import
- Special characters comes first
- Numbers comes second
- Lowercase letters comes third
- Uppercase letters comes fourth
- In case an import contains both defaults and named, the defaults are prioritized and put first

## Features

- Supports multiline imports
- Adds a newline between imports from different types

## Limitations

- Doesn't work yet with `require()` syntax
- Can't really sort the imports from a module (ex : `import {z, b}, s, a from "c"` becomes `import a, s, {b, z} from "c"`), due to how it perceives mixed imports
- Doesn't support semicolons at the end of the import
- Doesn't support comments
- Doesn't deduplicate imports
- Might consider wrongfully imports that are in the middle of the file (ex : `const a = await import("module")`) as imports to sort
- Doesn't support TypeScript imports (ex Types)
- ESLint plugin not yet implemented

## Example

```js
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

import * from "node:fs"

import js from "@eslint/js"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

import { defineNuxtPlugin } from "#app"
import { createVuetify } from "vuetify"
import {
  en,
  fr
} from "vuetify/locale"
```

## Usage

Install the package

```bash
npm install js-imports-sort
```

- In a javascript file

  ```js
  import sortImports from 'js-imports-sort'

  const code = `
  import { createVuetify } from "vuetify"
  import js from "@eslint/js"
  import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
  import * from "node:fs"
  import { defineNuxtPlugin } from "#app"
  import "vuetify/styles"
  import {
    en,
    fr
  } from "vuetify/locale"
  import "@mdi/font/css/materialdesignicons.css"
  `

  const sortedCode = sortImports(code)
  console.log(sortedCode)
  ```

- In a shell
  ```bash
  npx js-imports-sort@latest <file> -r
  ```
  Params available :
  - `-r` or `--replace` : Replace the file content with the sorted imports
  - `-o <path>` or `--output <path>` : Output the sorted imports in a different file. Have to be used with `-r`
  - `-l` or `--log` : Output the sorted imports in the console
  At least one of `-r` or `-l` has to be used
