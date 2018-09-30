const node = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')

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
    postcss({ extract: 'dist/style.css', minimize: true }),
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
