const { createHash } = require('crypto')

const prod = process.env.NODE_ENV === 'production'

const variables = {
  '--pigmice-purple': '#800080',
  '--light-grey': '#E8E8E8',
  '--alliance-blue': '#6890DD',
  '--alliance-red': '#DE6363',
}

module.exports = {
  modules: true,
  plugins: {
    'postcss-nesting': {},
    'postcss-css-variables': { variables },
    'postcss-calc': {},
    'postcss-modules': {
      generateScopedName: (local, path) => {
        const h = createHash('md5')
          .update(prod ? local + path : path)
          .digest('hex')
          .substr(0, prod ? 7 : 5)
        // we must start with an underscore, otherwise it might start with a number
        return prod ? '_' + h : `${local}-${h}`
      },
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
}
