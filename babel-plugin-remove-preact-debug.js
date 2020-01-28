/**
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value
        if (source === 'preact/debug') path.remove()
      },
    },
  }
}
