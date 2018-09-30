module.exports = {
  presets: [
    ['@babel/preset-typescript', { jsxPragma: 'h' }],
    [
      '@babel/preset-env',
      {
        loose: true,
        spec: false,
        exclude: ['transform-regenerator'],
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/transform-react-jsx', { pragma: 'h' }],
    'babel-plugin-transform-inline-environment-variables',
  ],
}
