const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssConfig = require('./postcss.config')

module.exports = {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: ['babel-loader', 'linaria-preact/loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              getLocalIdent: (context, localIdentName, localName) =>
                postcssConfig.plugins['postcss-modules'].generateScopedName(
                  localName,
                  context.resourcePath,
                ),
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: Object.entries(postcssConfig.plugins).reduce(
                (plugins, [key, opts]) =>
                  key === 'postcss-modules'
                    ? plugins
                    : plugins.concat(require(key)(opts)),
                [],
              ),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ],
  devServer: { historyApiFallback: true },
}
