function sortImports(code: string): string {
  // Regular expression to capture complete import statements, including multiline
  const importRegex
    = /import\s+(?:(\*\s+from\s+['"][^'"]+['"])|(['"][^'"]+['"])|(\w+\s*,?\s*\{[\w\s,]*\}\s*from\s*['"][^'"]+['"])|(\w+\s+from\s*['"][^'"]+['"])|(\{[\w\s,]*\}\s*from\s*['"][^'"]+['"]))/gs

  // Function to get import order based on type
  const getOrder = (imp: string) => {
    // No names
    if (imp.match(/^import\s+['"]/)) {
      return 1
    }

    // Everything
    if (imp.includes("* from")) {
      return 2
    }

    // Defaults
    if (imp.match(/\w+\s+from/)) {
      return 3
    }

    // Named
    if (imp.match(/\{[\w\s,]*\}\s*from/)) {
      return 4
    }

    // Default order for unknown patterns
    return 5
  }

  // Normalize and prepare imports for sorting
  const normalizeImport = (imp: string) => {
    const fromMatch = imp.match(/from\s+['"]([^'"]+)['"]/)
    const source = fromMatch ? fromMatch[1] : ""
    // Remove the 'from' part to isolate what's imported
    const imported = imp.replace(/from\s+['"][^'"]+['"]/, "")

    return { original: imp, source, imported, order: getOrder(imp) }
  }

  // Extract all import statements from the code
  let match
  const imports = []

  while ((match = importRegex.exec(code)) !== null) {
    imports.push(normalizeImport(match[0]))
  }

  // Custom comparison function for sorting imports
  function customCompare(a: string, b: string) {
    // Extract the leading special characters or first characters if not special
    const regex = /^[\W_]+|^\w/
    const [specialA = ""] = a.match(regex) || []
    const [specialB = ""] = b.match(regex) || []

    // Convert to ASCII values and compare
    if (specialA !== specialB) {
      if (specialA.match(/[\W_]/) && specialB.match(/[\W_]/)) {
        return specialA.charCodeAt(0) - specialB.charCodeAt(0)
      }

      return specialA.match(/[\W_]/) ? -1 : 1
    }

    // If special characters are the same or absent, check full comparison including numerics and case sensitivity
    if (a !== b) {
      // Check if both strings are purely numeric
      if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(a) - Number(b)
      }

      // Compare alphabetically with sensitivity to case and numeric values
      return a.localeCompare(b, undefined, {
        numeric: true,
        caseFirst: "lower",
      })
    }

    return 0
  }

  // Sorting imports
  imports.sort((a, b) => {
    // First by order type with null safety
    const orderA = a.order ?? 5
    const orderB = b.order ?? 5

    if (orderA !== orderB) {
      return orderA - orderB
    }

    // Then by source using custom compare function (we coule have used Intl.Collator, but our rules are more complex)
    const compareResult = customCompare(a.source, b.source)

    if (compareResult !== 0) {
      return compareResult
    }

    // Lastly by what's imported using custom compare function
    return customCompare(a.imported, b.imported)
  })

  // Join sorted imports back to a single string with a blank line between types
  let result = ""
  let lastOrder: number | undefined

  imports.forEach((imp) => {
    if (lastOrder !== undefined && lastOrder !== imp.order) {
      // Add an extra newline to separate types
      result += "\n"
    }

    // Add the current import line
    result += `${imp.original}\n`
    lastOrder = imp.order
  })

  // Trim to remove any extra newline at the end
  return result.trim()
}

export default sortImports
