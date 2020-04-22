module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true, bugfixes: true, debug: true }],
  ],
  plugins: [
    process.env.NODE_ENV === 'production' &&
      './babel-plugin-rename-toplevel-import-export',
  ].filter(Boolean),
}
