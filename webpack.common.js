//require nodejs path
const path = require('path');

const webpack = require('webpack');

//require extract-text-webpack-plugin #https://github.com/webpack-contrib/extract-text-webpack-plugin
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const distPath = path.resolve(__dirname, 'public', 'dist');
const entryPath = path.resolve(__dirname, 'app', 'app.module.js');

require('dotenv').config();


// export our common webpack config
module.exports = {

	mode: 'development',

	target: 'web',

	//entry to all our js files
	entry: {
		app: [ entryPath ],
	},

	output: {
		// sourceMapFilename: "[name].js.map",
		path: distPath,
		filename: '[name].js',
		publicPath: '/dist/'
	},

	resolve: {
		alias: {
			plupload: path.resolve(__dirname, 'node_modules', 'plupload', 'js', 'plupload.full.min.js')
		}
	},

	module: {

		rules: [

			// app settings
			// {
			// 	test: /app\.settings\.js$/,
			// 	use: [
			// 		{
			// 			loader: 'imports-loader?this=>window'
			// 		}
			// 	]
			// },

			// plupload shit
			{
				test: /^plupload$/,
				use: [
					{
						loader: 'imports-loader?this=>window'
					},
					{
						loader: 'exports-loader?window.plupload'
					}
				]
			},

			// tinymce shit
			{
				test: require.resolve('tinymce/tinymce'),
				use: [
					{
						loader: 'imports-loader?this=>window'
					},
					{
						loader: 'exports-loader?window.tinymce'
					}
				]
			},
			{
				// tinymce[\\/](themes|plugins)[\\/]/, - POTENTIAL FIX FOR WINDOWS
				test: /tinymce\/(themes|plugins)\//,
				use: [
					{
						loader: 'imports-loader?this=>window'
					}
				]
			},
			{
				test: require.resolve('angular-ui-tinymce'),
				use: [
					{
						loader: 'imports-loader?this=>window'
					}
				]
			},

			//handle js compilation, we babel-loader with es2015 presets
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},

			// CSS and SCSS
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						// fallback: "style-loader"
					},
					'css-loader',
					{
						loader: 'postcss-loader', // Run post css actions
						options: {
							plugins: function () { // post css plugins, can be exported to postcss.config.js
								return [
									require('precss'),
									require('autoprefixer')
								];
							}
						}
					}
				],
			},
			//handle sass and use ExtractTextWebpackPlugin to extract the css
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						// fallback: "style-loader"
					},
					'css-loader',
					{
						loader: 'postcss-loader', // Run post css actions
						options: {
							plugins: function () { // post css plugins, can be exported to postcss.config.js
								return [
									require('precss'),
									require('autoprefixer')
								];
							}
						}
					},
					'sass-loader'
				],
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: false,
						minimize: true
					}
				}
			}

		]
	},
	plugins: [
		new CopyWebpackPlugin(
			[
				{
					context: './node_modules/tinymce/', // Copy all TinyMCE related files
					from: '**/*',
					// debug: 'debug'
				}
			],
			{
				ignore: [
					// Doesn't copy any files with a txt extension    
					'*.json', '*.txt', '*.md'
				]
			}
		),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'css/app.css',
			chunkFilename: '[id].css',
		})
	]
};
