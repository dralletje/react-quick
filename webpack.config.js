var fs = require('fs')
var path = require('path')

var resolve = require('resolve')
var webpack = require('webpack')

var NODE_MODULES_RE = /node_modules/
var ENTRY_RE = /react-heatpack[\\/]entry.js$/

/**
 * Find the node_modules directory which will be resolved from a given dir.
 */
function findNodeModules(cwd) {
  var parts = cwd.split(path.sep)
  while (parts.length > 0) {
    var target = path.join(parts.join(path.sep), 'node_modules')
    if (fs.existsSync(target)) {
      return target
    }
    parts.pop()
  }
}

var reactPath
var reactDOMPath
try {
  reactPath = resolve.sync('react', {basedir: process.cwd()})
  reactDOMPath = resolve.sync('react-dom', {basedir: process.cwd()})
}
catch (e) {
  reactPath = require.resolve('react')
  reactDOMPath = require.resolve('react-dom')
}

/**
 * We need to special-case exclusion to allow the heatpack entry module to be
 * processed by loaders, as it will be under global node_modules.
 */
function excludeJS(absPath) {
  if (ENTRY_RE.test(absPath)) {
    return false
  }
  return NODE_MODULES_RE.test(absPath)
}

module.exports = function config(options) {
  return {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      require.resolve('react-hot-loader/patch'),
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      options.entry,
    ],
    output: {
      path: __dirname + '/build',
      filename: 'bundle.js',
      publicPath: '/',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
    ],
    resolve: {
      alias: {
        'babel-runtime': path.join(findNodeModules(__dirname), 'babel-runtime'),
        'react-heatpack-react-alias': reactPath,
        'react-heatpack-react-dom-alias': reactDOMPath,
        'react-heatpack-script-alias': options.script
      },
      extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.json'],
      root: process.cwd(),
      fallback: [findNodeModules(__dirname)],
    },
    module: {
      loaders: [
        {
          test: '',
          loader: path.join(__dirname, '/backup-file-loader.js?hash=sha512&digest=hex&name=[hash].[ext]'),
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          exclude: excludeJS,
          query: {
            presets: [
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-react'),
              require.resolve('babel-preset-stage-0'),
            ],
            plugins: [
              require.resolve('react-hot-loader/babel'),
            ],
          }
        },
        {
          test: /\.json$/,
          loader: require.resolve('json-loader'),
        },
        {
          test: /\.css$/,
          loaders: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
          ],
        },
        {
          test: /\.(otf|svg|ttf|woff|woff2|gif|png)(\?v=\d+\.\d+\.\d+)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10240,
          },
        },
      ],
    },
  }
}
