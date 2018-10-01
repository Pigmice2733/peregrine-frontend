const node = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const postcssConfig = require('./postcss.config')
const cssModulesConfig = postcssConfig.plugins['postcss-modules']

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx', '.css']

module.exports = {
  input: './src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    node({
      extensions,
      jsnext: true,
    }),
    postcss({
      extract: 'dist/style.css',
      modules: cssModulesConfig,
      plugins: Object.entries(postcssConfig.plugins).reduce(
        (plugins, [key, value]) =>
          key === 'postcss-modules'
            ? plugins
            : plugins.concat(require(key)(value)),
        [],
      ),
      config: false,
      minimize: true,
    }),
    babel({ extensions }),
    terser({
      compress: {
        passes: 4,
        unsafe: true,
        pure_getters: true,
      },
    }),
  ],
}
