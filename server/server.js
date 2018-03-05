// require('dotenv').config();
var express = require('express');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');

var isProduction = process.env.NODE_ENV === 'production';
var host = process.env.APP_HOST || 'localhost';
var port = (process.env.APP_PORT) ? process.env.APP_PORT : 8080;
var proxyPort = (process.env.APP_PORT)?parseInt(process.env.APP_PORT)+1:3001;
var publicPath = path.resolve(__dirname, '..', 'public');

if (!isProduction) {
  var httpProxy = require('http-proxy');
  var proxy = httpProxy.createProxyServer();
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server
  app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
    proxy.web(req, res, {
      target: 'http://' + host + ':' + proxyPort
    });
  });

  // It is important to catch any errors from the proxy or the
  // server will crash. An example of this is connecting to the
  // server when webpack is bundling
  proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
  });
}

app.use(express.static(publicPath));

var settings = {
  CG_URL: process.env.CG_URL,
  CG_CLIENT_ID: process.env.CG_CLIENT_ID,
  CG_CLIENT_SECRET: process.env.CG_CLIENT_SECRET,
  APP_URL: process.env.APP_URL,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE
};
app.get('/*', function(req, res) {
  res.render(path.join(publicPath, 'index.ejs'), {settings: settings});
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
