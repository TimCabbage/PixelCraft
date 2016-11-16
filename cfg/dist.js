const webpack = require('webpack')
const fs = require('fs')
const baseConfig = require('./base')
const defaults = require('./defaults')
const JS_FILENAME = baseConfig.output.filename
const CONTEXT_PATH = ''
const BASE_URL = 'http://ix-inferred-preferences.s3-website-us-east-1.amazonaws.com'

// const CONTEXT_PATH = '/your/context/path/here/';
const CompressionPlugin = require('compression-webpack-plugin')

const config = Object.assign({}, baseConfig, {
  entry: `${defaults.srcPath}/index`,
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
    new webpack.NoErrorsPlugin(),
    new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240
    }),
    function () {
      this.plugin('done', (stats) => {
        const htmlPath = `${defaults.srcPath}/index.html`
        const htmlOutput = fs.readFileSync(
          htmlPath, 'utf8').replace(
            /assets\/\w*(\.)?app\.js/ig,
            `assets/${stats.hash}.${JS_FILENAME}`
        )
        fs.writeFile(htmlPath, htmlOutput)
      })
    }
  ],
  module: defaults.getDefaultModules()
})

config.output.filename = `[hash].${JS_FILENAME}`
config.output.publicPath = `${BASE_URL}${defaults.publicPath}`

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
