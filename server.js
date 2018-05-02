require('dotenv').config();
const express = require('express');
const path = require('path');
const cons = require('consolidate');

var app = express();

app.engine('html', cons.handlebars);

// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


var isProduction = process.env.NODE_ENV === 'production';
var host = process.env.APP_HOST || 'localhost';
var port = (process.env.APP_PORT) ? process.env.APP_PORT : 8080;
var proxyPort = (process.env.APP_PORT) ? process.env.APP_PORT + 1 : 3001;
var publicPath = path.resolve(__dirname, 'public');


app.use(express.static(publicPath));
console.log('is production: ', isProduction);
if (!isProduction) {
    const Webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('./webpack.config.js');
    // var httpProxy = require('http-proxy');
    // var proxy = httpProxy.createProxyServer();
    // // Any requests to localhost:3000/assets is proxied
    // // to webpack-dev-server
    // app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
    //     proxy.web(req, res, {
    //         target: 'http://' + host + ':' + proxyPort
    //     });
    // });

    // // It is important to catch any errors from the proxy or the
    // // server will crash. An example of this is connecting to the
    // // server when webpack is bundling
    // proxy.on('error', function (e) {
    //     console.log('Could not connect to proxy, please try again...');
    // });

    // First we fire up Webpack an pass in the configuration we
    // created
    var bundleStart = null;
    var compiler = Webpack(webpackConfig);

    // We give notice in the terminal when it starts bundling and
    // set the time it started
    compiler.plugin('compile', function () {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', function () {
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    app.use(webpackDevMiddleware(compiler, {
        hot: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 2 * 1000,
    }));
}



var settings = {
    APP_URL: host + ':' + port,
    CG_URL: process.env.CG_URL,
    CG_CLIENT_ID: process.env.CG_CLIENT_ID,
    CG_CLIENT_SECRET: process.env.CG_CLIENT_SECRET,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    GMAP_KEY: process.env.GMAP_KEY
};

app.get('/*', function (req, res) {
    res.render('index', { settings: settings, settingsJSON: JSON.stringify(settings) });
});

app.listen(port, function () {
    console.log('Server running on port ' + port);
});
