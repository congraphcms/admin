const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//export our webpack config
var config = merge(common, {
  mode: 'production',

  devtool: 'source-map',

  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        warnings: false,
        compress: {
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      }

    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
});
// console.log(config);
module.exports = config;
