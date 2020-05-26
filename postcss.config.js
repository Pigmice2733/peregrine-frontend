const { createHash } = require('crypto')

const prod = process.env.NODE_ENV === 'production'

const variables = {
  '--pigmice-purple': '#800080',
  '--light-grey': '#E8E8E8',
  '--alliance-blue': '#295dc0',
  '--alliance-red': '#c30000',
  '--grey-text': 'rgba(0, 0, 0, 0.6)',
  '--off-black': '#333',
  '--card-shadow': '0 0.2rem 0.3rem rgba(0, 0, 0, 0.25)',
  '--focus-ring': '#0044ff40',
}

module.exports = {
  modules: true,
  plugins: {
    'postcss-nesting': {},
    'postcss-css-variables': { variables },
    'postcss-calc': {},
    'postcss-modules': {
      generateScopedName: (local, path) => {
        // ignore linaria classes
        if (
          /\.[jt]sx?_[\da-z]*\.css/.test(path) ||
          /\.linaria\.css$/.test(path)
        ) {
          return local
        }
        const h = createHash('sha256')
          .update(prod ? local + path : path)
          .digest('hex')
          .slice(0, 4)
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
    'postcss-font-magician': {
      variants: {
        'Roboto Condensed': { '400': [] },
        Roboto: { '400': [], '700': [], '500': [] },
      },
      foundries: ['google'],
      display: 'swap',
    },
    'postcss-color-mod-function': {},
  },
}
