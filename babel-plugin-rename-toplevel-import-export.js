/**
 * This babel plugin replaces terser's top-level name minification
 * Terser's top-level name minification doesn't try to make the single-letter variable names match the imported/exported names
 * This plugin makes them match, so that instead of `export {Z as A}` it renames the Z variable to A and writes `export {A}`
 * Terser must have mangling set to topLevel: false otherwise terser will re-rename all the variables, defeating the purpose
 */

// THIS IS BUGGY RIGHT NOW SO IT IS NOT BEING USED

/**
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = () => {
  /**
   * @param {babel.NodePath<babel.types.Program>} programPath
   */
  const visitor = (programPath) => {
    // @ts-ignore
    programPath.scope.crawl()
    const rootScope = programPath.scope
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lastName = ''
    const getNextName = () => {
      for (let charIndex = lastName.length - 1; charIndex >= 0; charIndex--) {
        const lastUsedChar = lastName[charIndex]
        const nextChar = chars[chars.indexOf(lastUsedChar) + 1]
        if (nextChar) {
          // Update that character
          lastName =
            lastName.slice(0, charIndex) +
            nextChar +
            lastName.slice(charIndex + 1)
          return lastName
        }
        // Reset that digit to the first character before advancing to the next digit
        lastName =
          lastName.slice(0, charIndex) +
          chars[0] +
          lastName.slice(charIndex + 1)
      }
      lastName = chars[0] + lastName
      return lastName
    }
    const getNextAvailableName = () => {
      let name
      while ((name = getNextName())) {
        if (!rootScope.hasBinding(name)) {
          return name
        }
      }
    }
    /** @type {[string, import('@babel/traverse').Binding][]} */
    const allBindings = Object.entries(rootScope.getAllBindings())
    allBindings.forEach(([, binding]) => {
      // it is from an import statement
      if (binding.kind === 'module') {
        if (binding.path.isImportSpecifier()) {
          const desiredName = binding.path.node.imported.name
          // There is already something with this name
          if (rootScope.hasBinding(desiredName)) {
            // Rename it to something else (auto-generated) to free up this name
            rootScope.rename(desiredName, getNextAvailableName())
          }
          rootScope.rename(binding.path.node.local.name, desiredName)
        }
      } else {
        // Finds a place where the binding is referenced in an export
        // If there are multiple, it chooses the first one
        // There is no reason to choose the shortest or longest one
        // Since they all have to exist in the output anyways
        // and gzip will cancel the differences
        const exportPath = binding.referencePaths
          .map((identifierPath) => identifierPath.parentPath)
          .find((exportPath) => exportPath.isExportSpecifier())

        if (exportPath && exportPath.isExportSpecifier()) {
          const desiredName = exportPath.node.exported.name
          // There is already something with this name
          if (rootScope.hasBinding(desiredName)) {
            // Rename it to something else (auto-generated) to free up this name
            rootScope.rename(desiredName, getNextAvailableName())
          }
          rootScope.rename(exportPath.node.local.name, desiredName)
          return
        }
        rootScope.rename(binding.identifier.name, getNextAvailableName())
      }
    })
  }
  return {
    name: 'rename-toplevel-import-export',
    visitor: {
      Program: {
        exit(path) {
          visitor(path)
        },
      },
    },
  }
}
