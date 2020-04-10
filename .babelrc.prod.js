module.exports = {
  presets: [['@babel/preset-modules', { loose: true }]],
  plugins: [
    process.env.NODE_ENV === 'production' &&
      './babel-plugin-remove-preact-debug',
  ].filter(Boolean),
}
