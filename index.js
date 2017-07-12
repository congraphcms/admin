require('dotenv').config();
var nodemon = require('nodemon');
var path = require('path');

var isProduction = process.env.NODE_ENV === 'production';

// We only want to run the workflow when not in production
if (!isProduction) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment.
  var bundle = require('./bundler.js');
  bundle();

}

nodemon({
  execMap: {
    js: 'node'
  },
  script: path.join(__dirname, 'server/server'),
  ignore: [],
  watch: !isProduction ? ['server/*'] : false,
  ext: 'js'
}).on('restart', function() {
  console.log('Backend restarted!');
}).once('exit', function () {
  console.log('Exiting the process');
  process.exit();
});
