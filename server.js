'use strict';

let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let path = require('path')


module.exports = function server(config, options) {
  new WebpackDevServer(webpack(config), {
    contentBase: path.join(__dirname, 'build'),
    publicPath: config.output.publicPath,
    hot: options.hot,
    historyApiFallback: true,
  }).listen(3000, 'localhost', function (err, result) {
    if (err) {
      return console.log(err);
    }

    console.log('Listening at http://localhost:3000/');
  });
}
