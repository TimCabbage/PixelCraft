const defaults = require('./defaults')
const additionalPaths = [];

module.exports = {
  additionalPaths,
  port: defaults.port,
  host: defaults.host,
  debug: true,
  devtool: 'source-map',
  output: {
    path: `${defaults.distPath}`,
    filename: 'app.js',
    publicPath: defaults.publicPath
  },
  devServer: {
    contentBase: './src/Client/Public',
    historyApiFallback: true,
    hot: false,
    port: defaults.port,
    publicPath: defaults.publicPath,
    noInfo: false,
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],
    moduleDirectories: [
      /node_modules/
    ]
  },
  module: {},
  postcss: () => []
}
