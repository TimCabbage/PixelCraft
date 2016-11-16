const webpack = require('webpack')
const baseConfig = require('./base')
const defaults = require('./defaults')
const JS_FILENAME = baseConfig.output.filename
const CONTEXT_PATH = ''

const config = Object.assign({}, baseConfig, {
  entry: [
    './src/Client/index'
  ],
  cache: false,
  debug: false,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        CONTEXT_PATH: JSON.stringify(CONTEXT_PATH)
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
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
