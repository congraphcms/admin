const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//export our webpack config
module.exports = merge(common, {

  devtool: 'source-map',

  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
});
