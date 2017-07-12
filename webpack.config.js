var Webpack = require('webpack');
// var StatsPlugin = require('stats-webpack-plugin');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var autoprefixer = require('autoprefixer-core');
// var csswring = require('csswring');
var path = require('path');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var assetsPath = path.resolve(__dirname, 'public', 'assets');
var entryPath = path.resolve(__dirname, 'app', 'app.module.js');
var host = process.env.APP_HOST || 'localhost';

require('dotenv').config();

const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

var config = {

  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  entry: {
    'app': [

      // For hot style updates
      'webpack/hot/dev-server',

      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client?http://' + host + ':3001',

      // Our application
      entryPath,
    ]
    // 'vendor': [
    //   // path.resolve(__dirname, 'node_modules', 'plupload', 'js', 'plupload.full.min.js')
    // ]
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  output: {
    path: assetsPath,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      plupload: path.resolve(__dirname, 'node_modules', 'plupload', 'js', 'plupload.full.min.js')
    }
  },
  module: {
    loaders: [
      // app settings
      {
        test: /app\.settings\.js$/,
        loaders: [
          'imports?this=>window'
        ]
      },
      // plupload shit
      {
        test: /^plupload$/,
        loaders: [
          'imports?this=>window',
          'exports?window.plupload'
        ]
      },
      // tinymce shit
      {
        test: require.resolve('tinymce/tinymce'),
        loaders: [
          'imports?this=>window',
          'exports?window.tinymce'
        ]
      },
      {
        //     /tinymce[\\/](themes|plugins)[\\/]/, - POTENTIAL FIX FOR WINDOWS
        test: /tinymce\/(themes|plugins)\//,
        loaders: [
          'imports?this=>window'
        ]
      },
      {
        test: require.resolve('angular-ui-tinymce'),
        loaders: [
          'imports?this=>window'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },

  plugins: [
    // We have to manually add the Hot Replacement plugin when running
    // from Node
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        'CG_URL': JSON.stringify(process.env.CG_URL),
        'APP_URL': JSON.stringify(process.env.APP_URL),
        'DEFAULT_LOCALE': JSON.stringify(process.env.DEFAULT_LOCALE)
      }
    })
  ]
};

module.exports = config;
