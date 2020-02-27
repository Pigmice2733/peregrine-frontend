import linaria from 'linaria-preact/rollup'
import node from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import netlifyPush, { printPush } from 'rollup-plugin-netlify-push'
import parseRoutes from 'rollup-plugin-netlify-push/parse-routes'
import { apiUrl } from './src/api/api-url.ts'
import crypto from 'crypto'
import { promisify } from 'util'
import { writeFile, readFile } from 'fs'
import { join } from 'path'
import cpy from 'cpy'
import templite from 'templite'
import sharp from 'sharp'
import mkdirplz from 'mkdirplz'
const postcssPlugins = require('./postcss.config').plugins
require('dotenv').config()
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
const chunksFile = join(outDir, 'chunks.json')

const babelOptions = { extensions, babelrc: false, ...babelConfig }

mkdirplz(outDir)

export default [
  {
    input: './src/index.tsx',
    output: {
      dir: 'dist',
      format: 'esm',
      preferConst: true,
      sourcemap: false,
      chunkFileNames: '[hash].js',
    },
    experimentalOptimizeChunks: true,
    chunkGroupingSize: 50000,
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
        resolveFrom: './src/routes.ts',
        everyRouteHeaders: [printPush({ path: '/style.css', as: 'style' })],
        everyRouteModules: ['./index.tsx'],
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
          await writeFileAsync(chunksFile, JSON.stringify(chunksJSON))
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
  {
    input: './src/sw.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      {
        // Regenerate the SW whenever the main bundle changes
        name: 'chunks',
        resolveId(source) {
          if (source === 'chunks') return chunksFile
          return null
        },
        async load(source) {
          if (source !== chunksFile) return null
          const chunks = await readFileAsync(chunksFile, 'utf8')
          const chunksHash = crypto
            .createHash('md5')
            .update(chunks)
            .digest('hex')
            .slice(0, 10)

          return `
            const chunks = ${chunks}
            export default chunks
            export const chunksHash = ${JSON.stringify(chunksHash)}
          `
        },
      },
      node(rollupNodeOptions),
      babel(babelOptions),
      terser(terserOptions(prod)),
      {
        name: 'write-manifest',
        async writeBundle() {
          const manifestSrc = await readFileAsync('./src/manifest.json', 'utf8')
          await writeFileAsync(
            join(outDir, 'manifest.json'),
            JSON.stringify(JSON.parse(manifestSrc)),
          )
        },
      },
      {
        name: 'write-icons',
        async writeBundle() {
          const iconSrc = await readFileAsync('./src/logo.png')
          const iconDir = join(outDir, 'icons')
          await mkdirplz(iconDir)
          const background = 'transparent'
          const appleBg = '#800080'
          const appleWidth = 180
          const applePad = Math.round(0.07 * appleWidth)
          await Promise.all([
            ...[512, 192, 180, 32, 16].map(
              async width =>
                writeFileAsync(
                  join(iconDir, `${width}.png`),
                  await sharp(iconSrc)
                    .resize(width, width, { fit: 'contain', background })
                    .png()
                    .toBuffer(),
                ),
              writeFileAsync(
                join(iconDir, 'apple.png'),
                await sharp(iconSrc)
                  .resize(appleWidth - applePad * 2, 180 - applePad * 2, {
                    fit: 'contain',
                    background: appleBg,
                  })
                  .extend({
                    top: applePad,
                    bottom: applePad,
                    right: applePad,
                    left: applePad,
                    background: appleBg,
                  })
                  .flatten({ background: appleBg })
                  .png()
                  .toBuffer(),
              ),
            ),
          ])
        },
      },
    ],
  },
]
