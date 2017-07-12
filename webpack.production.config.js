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

const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

var config = {

  // We change to normal source mapping
  devtool: 'source-map',
  // entry: entryPath,
  entry: {
    'app': entryPath
  },
  output: {

    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the assetsPath
    // as that points to where the files will eventually be bundled
    // in production
    path: assetsPath,
    filename: '[name].js',

    // Everything related to Webpack should go through a assets path,
    // localhost:3000/assets. That makes proxying easier to handle
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      plupload: path.resolve(__dirname, 'node_modules', 'plupload', 'js', 'plupload.full.min.js')
    }
  },
  module: {
    loaders: [
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
      },
      // plupload shit
      {
        test: /^plupload$/,
        loaders: [
          'imports?this=>window',
          'exports?window.plupload'
        ]
      },
      // tinymce
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

    ]
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'CG_URL': JSON.stringify(process.env.CG_URL),
        'APP_URL': JSON.stringify(process.env.APP_URL),
        'DEFAULT_LOCALE': JSON.stringify(process.env.DEFAULT_LOCALE)
      }
    })
    // new ExtractTextPlugin("styles.css"),
    // new Webpack.optimize.UglifyJsPlugin({ minimize: true }),
    // new StatsPlugin(path.join(__dirname, 'stats.json'), { chunkModules: true })
  ]
};

module.exports = config;
