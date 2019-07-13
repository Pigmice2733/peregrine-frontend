import linaria from 'linaria-preact/rollup'
import node from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import netlifyPush, { printPush } from 'rollup-plugin-netlify-push'
import parseRoutes from 'rollup-plugin-netlify-push/parse-routes'
import { apiUrl } from './src/api/api-url.ts'
import { promisify } from 'util'
import { writeFile, readFile } from 'fs'
import { join } from 'path'
import cpy from 'cpy'
import templite from 'templite'
const postcssPlugins = require('./postcss.config').plugins
const babelConfig = require('./.babelrc')

const writeFileAsync = promisify(writeFile)
const readFileAsync = promisify(readFile)

const cssModulesConfig = postcssPlugins['postcss-modules']

const extensions = ['.js', '.jsx', '.es', '.mjs', '.ts', '.tsx', '.css']

process.env.ROLLUP = 'true'
const prod = process.env.NODE_ENV === 'production'
const rollupNodeOptions = { extensions }

/** @param {boolean} prod */
const terserOptions = prod => ({
  ecma: /** @type {8} */ (8),
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

const outDir = 'dist'

const babelOptions = { extensions, babelrc: false, ...babelConfig }

export default [
  {
    input: './src/systemjs-entry.js',
    output: { file: join(outDir, 'systemjs-entry.js'), format: 'iife' },
    plugins: [node(rollupNodeOptions), terser(terserOptions(true))],
  },
  {
    input: './src/sw.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [babel(babelOptions), terser(terserOptions(prod))],
  },
  {
    input: './src/index.tsx',
    output: {
      dir: 'dist',
      format: 'system',
      preferConst: true,
      sourcemap: false,
    },
    experimentalOptimizeChunks: true,
    chunkGroupingSize: 25000,
    plugins: [
      node(rollupNodeOptions),
      linaria({ sourceMap: false }),
      postcss({
        extract: 'dist/style.css',
        modules: cssModulesConfig,
        plugins: Object.entries(postcssPlugins).reduce(
          (plugins, [key, value]) =>
            key === 'postcss-modules'
              ? plugins
              : plugins.concat(require(key)(value)),
          [],
        ),
        config: false,
        minimize: { zindex: false },
      }),
      babel(babelOptions),
      terser(terserOptions(prod)),
      netlifyPush({
        getRoutes: () => parseRoutes('./src/routes.ts'),
        from: './src/routes.ts',
        everyRouteHeaders: [
          printPush({ path: '/style.css', as: 'style' }),
          printPush({ path: '/systemjs-entry.js', as: 'script' }),
          printPush({ path: '/index.js', as: 'script', crossOrigin: true }),
        ],
      }),
      {
        name: 'rollup-write-html',
        async writeBundle() {
          const htmlSrc = await readFileAsync('rollup-index.html', 'utf8')
          const htmlOut = templite(htmlSrc, { apiUrl })
          writeFileAsync(join(outDir, 'index.html'), htmlOut)
        },
      },
      {
        name: 'rollup-plugin-chunks-json',
        async writeBundle(bundle) {
          const chunksJSON = Object.values(bundle)
            .filter(chunk => !chunk.isAsset)
            .map(chunk => `/${chunk.fileName}`)
            .concat(['/systemjs-entry'])
          await writeFileAsync(
            join(outDir, 'chunks.json'),
            JSON.stringify(chunksJSON),
          )
        },
      },
      {
        name: 'rollup-plugin-copy',
        async writeBundle() {
          await cpy('_redirects', outDir)
        },
      },
    ],
  },
]
