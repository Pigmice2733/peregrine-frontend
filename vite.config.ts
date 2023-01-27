import * as vite from 'vite'
import preact from '@preact/preset-vite'
import linaria from '@linaria/vite'
import path from 'node:path'
import templite from 'templite'
import * as fs from 'fs/promises'
import { apiUrl } from './src/api/api-url'
import crypto from 'crypto'
import sharp from 'sharp'

const outDir = 'dist'

const htmlPlugin = (): import('vite').Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return templite(html, { apiUrl })
    },
  }
}

const writeIconsPlugin = () => ({
  name: 'write-icons',
  async writeBundle() {
    const iconSrc = await fs.readFile('./src/logo.png')
    const iconDir = path.join(outDir, 'icons')
    await fs.mkdir(iconDir, { recursive: true })
    const background = 'transparent'
    const appleBg = '#800080'
    const appleWidth = 180
    const applePad = Math.round(0.07 * appleWidth)
    await Promise.all([
      ...[512, 192, 180, 32, 16].map((width) =>
        sharp(iconSrc)
          .resize(width, width, { fit: 'contain', background })
          .png()
          .toFile(path.join(iconDir, `${width}.png`)),
      ),
      sharp(iconSrc)
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
        .toFile(path.join(iconDir, 'apple.png')),
    ])
  },
})

const writeManifestPlugin = () => ({
  name: 'write-manifest',
  async writeBundle() {
    const manifestSrc = await fs.readFile('./src/manifest.json', 'utf8')
    await fs.writeFile(
      path.join(outDir, 'manifest.json'),
      JSON.stringify(JSON.parse(manifestSrc)),
    )
  },
})

let chunks: string[] | undefined

// Separate rollup config for compiling the service worker
// (only during build, not during dev)
const rollupSWConfig: import('rollup').RollupOptions = {
  plugins: [
    {
      // Ensure the service worker is regenerated whenever the main bundle changes
      // The service worker includes an array of the files (with their hashes) to cache
      name: 'chunks',
      resolveId(source) {
        if (source === 'chunks') return '\0chunks'
        return null
      },
      load(source) {
        const chunksString = JSON.stringify(chunks)
        if (source !== '\0chunks') return null
        const chunksHash = crypto
          .createHash('sha256')
          .update(chunksString)
          .digest('hex')
          .slice(0, 10)

        return `
            const chunks = ${chunksString}
            export default chunks
            export const chunksHash = ${JSON.stringify(chunksHash)}
          `
      },
    },
  ],
}

// https://vitejs.dev/config/
export default vite.defineConfig({
  server: {
    port: 2733,
  },
  plugins: [
    preact(),
    linaria({
      include: ['**/*.{js,jsx,ts,tsx}'],
    }),
    htmlPlugin(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 5_000,
      },
      preserveEntrySignatures: false,
      treeshake: {
        preset: 'recommended',
      },
      plugins: [
        {
          name: 'rollup-plugin-chunks-json',
          writeBundle(_, bundle) {
            const chunksJSON = Object.values(bundle)
              .filter(
                (chunk) =>
                  chunk.type === 'chunk' || chunk.fileName.endsWith('.css'),
              )
              .map((chunk) => `/${chunk.fileName}`)
              .sort()
            chunks = chunksJSON
          },
        },
        {
          name: 'compile-sw',
          async writeBundle() {
            await vite.build({
              configFile: false,
              build: {
                emptyOutDir: false,
                lib: {
                  entry: 'src/sw.ts',
                  fileName: () => 'sw.js',
                  name: 'sw',
                  formats: ['iife'],
                },
                rollupOptions: rollupSWConfig,
              },
            })
          },
        },
        writeManifestPlugin(),
        writeIconsPlugin(),
      ],
    },
  },
})
