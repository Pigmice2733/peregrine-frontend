const { createHash } = require('crypto')

module.exports = {
  modules: true,
  plugins: {
    'postcss-modules': {
      generateScopedName: (local, path) => {
        const h = createHash('md5')
          .update(path)
          .digest('hex')
          .substr(0, 8)
        return `${local}-${h}`
      },
    },
    'postcss-nesting': {},
  },
}
