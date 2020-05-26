module.exports = {
  presets: [['@babel/preset-env', { loose: true, bugfixes: true }]],
  plugins: [
    // Buggy right now so not being used
    //   process.env.NODE_ENV === 'production' &&
    //     './babel-plugin-rename-toplevel-import-export',
  ].filter(Boolean),
}
