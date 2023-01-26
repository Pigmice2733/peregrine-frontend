import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// import linaria from 'vite-plugin-linaria'
import linaria from '@linaria/vite'
import path from 'node:path'

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
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
})
