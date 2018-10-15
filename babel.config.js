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
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/transform-react-jsx', { pragma: 'h' }],
    'babel-plugin-transform-inline-environment-variables',
    // This is included in preset-env but we want to manually enable it even in
    // environments that natively support template literals because "" + "" is
    // usually less code
    ['@babel/plugin-transform-template-literals', { loose: true }],
  ],
}
