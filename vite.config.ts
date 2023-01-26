import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import linaria from '@linaria/vite'
import path from 'node:path'
import templite from 'templite'
import * as fs from 'fs/promises'
import { apiUrl } from './src/api/api-url'

const outDir = 'dist'
const chunksFile = path.join(outDir, 'chunks.json')

const htmlPlugin = (): import('vite').Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return templite(html, { apiUrl })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2733,
  },
  plugins: [
    linaria({
      include: ['**/*.{js,jsx,ts,tsx}'],
    }),
    preact(),
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
          async writeBundle(_, bundle) {
            const chunksJSON = Object.values(bundle)
              .filter((chunk) => chunk.type === 'chunk')
              .map((chunk) => `/${chunk.fileName}`)
            await fs.writeFile(chunksFile, JSON.stringify(chunksJSON))
          },
        },
      ],
    },
  },
})

// TODO: SW rollup config
