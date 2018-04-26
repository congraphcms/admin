const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);
const webpack = require('webpack');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

//export our webpack config
module.exports = merge(common, {
  devtool: 'eval',
  //entry to all our js files
  entry: {
    app: [ 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000' ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
