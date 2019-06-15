const linaria = require('linaria-preact/rollup')
const node = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const postcssConfig = require('./postcss.config')
const cssModulesConfig = postcssConfig.plugins['postcss-modules']
const babelConfig = require('./.babelrc')

const extensions = ['.js', '.jsx', '.es', '.mjs', '.ts', '.tsx', '.css']

const prod = process.env.NODE_ENV === 'production'
const rollupNodeOptions = { extensions }

const terserOptions = prod => ({
  ecma: 8,
  module: true,
  compress: {
    passes: 4,
    unsafe: true,
    pure_getters: true,
    join_vars: prod,
  },
  mangle: prod,
  output: {
    beautify: !prod,
  },
})

module.exports = {
  systemEntry: {
    input: './src/systemjs-entry.js',
    output: { file: 'dist/systemjs-entry.js', format: 'iife' },
    plugins: [node(rollupNodeOptions), terser(terserOptions(true))],
  },
  main: {
    input: './src/index.tsx',
    output: {
      dir: 'dist',
      format: 'system',
      preferConst: true,
      sourcemap: true,
    },
    experimentalOptimizeChunks: true,
    chunkGroupingSize: 2000,
    plugins: [
      node(rollupNodeOptions),
      linaria({
        sourceMap: true,
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
        minimize: {
          zindex: false,
        },
      }),
      babel({ extensions, babelrc: false, ...babelConfig }),
      terser(terserOptions(prod)),
    ],
  },
}
