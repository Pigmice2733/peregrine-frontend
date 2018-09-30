const { createHash } = require('crypto')

const prod = process.env.NODE_ENV === 'production'

module.exports = {
  modules: true,
  plugins: {
    'postcss-modules': {
      generateScopedName: (local, path) => {
        const h = createHash('md5')
          .update(prod ? local + path : path)
          .digest('hex')
          .substr(0, prod ? 7 : 5)
        return prod ? h : `${local}-${h}`
      },
    },
    'postcss-nesting': {},
  },
}
