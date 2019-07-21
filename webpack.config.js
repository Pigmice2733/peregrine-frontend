const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssConfig = require('./postcss.config')
const WebpackBar = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin

const webpack = require('webpack')

module.exports = {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader', options: { cacheDirectory: true } },
          'linaria-preact/loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /src/,
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: true },
          },
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
    new HtmlWebpackPlugin({
      meta: { viewport: 'width=device-width, initial-scale=1.0' },
    }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.HotModuleReplacementPlugin({}),
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    overlay: true,
    quiet: true,
    host: '0.0.0.0',
    port: 2733,
  },
}
