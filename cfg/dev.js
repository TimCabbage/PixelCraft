const webpack = require('webpack');
const baseConfig = require('./base');
const defaults = require('./defaults');

const config = Object.assign({}, baseConfig, {
  entry: [
    `webpack-dev-server/client?${defaults.host}:${defaults.port}`,
    'webpack/hot/only-dev-server',
    './src/Client/index'
  ],
  cache: true,
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CONTEXT_PATH: JSON.stringify('/')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: defaults.getDefaultModules()
})

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [defaults.srcPath]
  )
})

module.exports = config
