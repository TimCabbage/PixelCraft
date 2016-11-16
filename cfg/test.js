const webpack = require('webpack')
const baseConfig = require('./base')
const defaults = require('./defaults')

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-instrumenter-loader',
        include: [
          defaults.srcPath
        ]
      }
    ],
    loaders: [
      {
        test: /sabre-spark/,
        loader: 'imports?define=>false'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: [].concat(
          baseConfig.additionalPaths,
          [
            defaults.srcPath,
            defaults.testPath
          ]
        )
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /sinon\.js$/,
        loader: 'imports?define=>false,require=>false'
      }
    ]
  },
  resolve: baseConfig.resolve,
  externals: {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CONTEXT_PATH: JSON.stringify('/')
      }
    })
  ]
}
