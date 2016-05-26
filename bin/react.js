#!/usr/bin/env node

'use strict'

let path = require('path')
let parseArgs = require('minimist')
let dedent = require('dedent-js')

let debug = require('../debug')
let pkg = require('../package.json')
let createWebpackConfig = require('../webpack.config')
let server = require('../server')

let args = parseArgs(process.argv.slice(2), {
  alias: {
    f: 'force',
    h: 'help',
    i: 'info',
    p: 'port',
    v: 'version'
  },
  boolean: [
    'force', 'help', 'info', 'version',
    'cold',
  ],
  default: {
    port: 3000
  }
})

let command = args._[0] || 'help'
if (args.help) {
  command = 'help'
}
if (args.version) {
  command = 'version'
}

switch (command) {
case 'version':
  console.log('v' + pkg.version)
  process.exit(0)

case 'run':
  let options = {
    entry: require.resolve('../entry'),
    noInfo: !args.info,
    port: args.port,
    script: path.resolve(args._[1]),
    hot: !args.cold,
  }
  debug('options', options)

  let webpackConfig = createWebpackConfig(options)
  server(webpackConfig, options)
  break;

case 'help':
default:
  console.log(dedent`
    Usage: react run [options] script.js

    Options:
      -f, --force   force heatpack to use the given script as the entry module
      -i  --info    show webpack module info
      -p, --port    port to run the webpack dev server on [default: 3000]
      -v, --version print heatpack's version
      --cold        Disable hot reloading, don't know why you would do though
  `)
  process.exit(0)
}
