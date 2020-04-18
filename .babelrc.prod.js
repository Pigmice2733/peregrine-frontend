module.exports = {
  presets: [['@babel/preset-env', { loose: true, bugfixes: true }]],
  plugins: [
    process.env.NODE_ENV === 'production' &&
      './babel-plugin-remove-preact-debug',
    process.env.NODE_ENV === 'production' &&
      './babel-plugin-rename-toplevel-import-export',
  ].filter(Boolean),
}
