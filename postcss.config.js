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

const config = {
  modules: true,
  plugins: {
    'postcss-nesting': {},
    'postcss-css-variables': { variables },
    'postcss-calc': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
    'postcss-color-mod-function': {},
  },
}
export default config
