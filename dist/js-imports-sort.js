function sortImports(code) {
  // Regular expression to capture complete import statements, including multiline
  var importRegex = /import\s+(?:(\*\s+from\s+['"][^'"]+['"])|(['"][^'"]+['"])|(\w+\s*,?\s*\{[\w\s,]*\}\s*from\s*['"][^'"]+['"])|(\w+\s+from\s*['"][^'"]+['"])|(\{[\w\s,]*\}\s*from\s*['"][^'"]+['"]))/g;

  // Function to get import order based on type
  var getOrder = function getOrder(imp) {
    // No names
    if (imp.match(/^import\s+['"]/)) {
      return 1;
    }

    // Everything
    if (imp.includes('* from')) {
      return 2;
    }

    // Defaults
    if (imp.match(/\w+\s+from/)) {
      return 3;
    }

    // Named
    if (imp.match(/\{[\w\s,]*\}\s*from/)) {
      return 4;
    }
  };

  // Normalize and prepare imports for sorting
  var normalizeImport = function normalizeImport(imp) {
    var fromMatch = imp.match(/from\s+['"]([^'"]+)['"]/);
    var source = fromMatch ? fromMatch[1] : '';
    // Remove the 'from' part to isolate what's imported
    var imported = imp.replace(/from\s+['"][^'"]+['"]/, '');
    return {
      original: imp,
      source: source,
      imported: imported,
      order: getOrder(imp)
    };
  };

  // Extract all import statements from the code
  var match;
  var imports = [];
  while ((match = importRegex.exec(code)) !== null) {
    imports.push(normalizeImport(match[0]));
  }

  // Custom comparison function for sorting imports
  function customCompare(a, b) {
    // Regular expression to extract leading characters that are not alphanumeric (special characters)
    var regex = /^[\W_]+/;
    var specialA = (a.match(regex) || [''])[0];
    var specialB = (b.match(regex) || [''])[0];

    // Compare special characters by their Unicode values
    if (specialA !== specialB) {
      return specialA < specialB ? -1 : 1;
    }

    // If special characters are the same, compare the entire string
    // Here we need to sort numerically if possible and consider case sensitivity
    if (a !== b) {
      // Check if both strings are purely numeric
      if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(a) - Number(b);
      }

      // If not numeric, compare alphabetically with case sensitivity
      return a.localeCompare(b, undefined, {
        numeric: true,
        caseFirst: "lower"
      });
    }
    return 0;
  }

  // Sorting imports
  imports.sort(function (a, b) {
    // First by order type
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    // Then by source using custom compare function (we coule have used Intl.Collator, but our rules are more complex)
    var compareResult = customCompare(a.source, b.source);
    if (compareResult !== 0) {
      return compareResult;
    }

    // Lastly by what's imported using custom compare function
    return customCompare(a.imported, b.imported);
  });

  // Join sorted imports back to a single string with a blank line between types
  var result = '';
  var lastOrder = null;
  imports.forEach(function (imp) {
    if (lastOrder !== null && lastOrder !== imp.order) {
      // Add an extra newline to separate types
      result += '\n';
    }

    // Add the current import line
    result += imp.original + '\n';
    // Update last order to current
    lastOrder = imp.order;
  });

  // Trim to remove any extra newline at the end
  return result.trim();
}

export { sortImports as default };
