'use strict';

const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');

module.exports = {
  entry: { main: paths.mainIndexJs },
  output: {
    path: paths.mainBuild,
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ],
  },
  node: {
    __dirname: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  target: 'electron-main',
};
