import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// import linaria from 'vite-plugin-linaria'
import linaria from '@linaria/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    linaria({
      include: ['**/*.{js,jsx,ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript'],
        plugins: [
          [
            '@babel/transform-react-jsx',
            {
              runtime: 'automatic',
              importSource: 'preact',
              useBuiltIns: true,
            },
          ],
        ],
      },
    }),
    preact(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
})

// import linaria from '@linaria/vite';
// // import { nodeResolve } from '@rollup/plugin-node-resolve';
// // import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';

// // https://vitejs.dev/config/
// export default defineConfig(({ command }) => ({
//   plugins: [
//     // nodeResolve({
//     //   extensions: ['.jsx', '.js'],
//     // }),
//     linaria({
//       include: ['**/*.{js,jsx,ts,tsx}'],
//       babelOptions: {
//         // presets: ['@babel/preset-react'],
//       },
//     }),
//     // react({
//     //   jsxRuntime: 'classic',
//     // }),
//   ],
//   build: {
//     target: command === 'serve' ? 'modules' : 'es2015',
//   },
// }));
