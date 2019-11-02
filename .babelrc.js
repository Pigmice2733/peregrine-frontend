module.exports = {
  presets: [
    ['linaria-preact/babel', { evaluate: true }],
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
    ['const-enum', { transform: 'constObject' }], // for TS const enum which babel ts doesn't support natively. See https://github.com/babel/babel/issues/8741
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/transform-react-jsx',
      {
        pragma: 'h',
        useBuiltIns: true, // object.assign instead of _extends
      },
    ],
    '@babel/plugin-proposal-numeric-separator',
    'babel-plugin-transform-inline-environment-variables',
    // This is included in preset-env but we want to manually enable it even in
    // environments that natively support template literals because "" + "" is
    // usually less code
    ['@babel/plugin-transform-template-literals', { loose: true }],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '^@/(.*)': './src/\\1',
        },
      },
    ],
    'babel-plugin-minify-dead-code-elimination',
  ],
}
