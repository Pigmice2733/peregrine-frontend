import { defineConfig } from 'vitest/config'
import path from 'node:path'
import preact from '@preact/preset-vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [preact()],
})
