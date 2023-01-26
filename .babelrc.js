// Most of the plugins in this babel config are redundant with vite built-in features,
// but are needed to run the jest tests
module.exports = {
  presets: [
    '@babel/preset-typescript',
    'babel-preset-vite',
    ['@linaria', { displayName: true }],
  ],
  plugins: [
    [
      '@babel/transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'preact',
        useBuiltIns: true, // object.assign instead of _extends
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '^src/(.*)': './src/\\1',
        },
      },
    ],
  ],
}
