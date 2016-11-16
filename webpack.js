import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import config from '^/webpack.config'
import open from 'open'

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at: ${config.host}:${config.port}`);
  console.log('Opening your system browser...');
  open(`${config.host}:${config.port}/`);
});
