/*!
 * The Application module is responsible for attaching other modules to an Loopback application.
 */
var loopback = require('loopback');
var config = require('./config');
var app = loopback();
var transports = config.transports || [];
var started = new Date();
var path = require('path');

/**
 * If we've defined transports for remoting, attach those to the Application.
 */
transports.forEach(function (name) {
  var fn = loopback[name];

  if (typeof fn === 'function') {
    app.use(fn.call(loopback));
  } else {
    console.error('Invalid transport: %s', name);
  }
});

/**
 * Start the server.
 */
var server = app.listen(config.port || 3000, function (err) {
  if (err) {
    console.error('Failed to start server-node-loopback.');
    console.error(err.stack || err.message || err);
    process.exit(1);
  }

  var info = server.address();
  var base = 'http://' + info.address + ':' + info.port;

  console.log('server-node-loopback running at %s.', base);
  console.log('To see the available routes, open %s/routes', base);
});

/**
 * Provide a basic status report as `GET /`.
 */
app.get('/serverstatus', function getStatus(req, res, next) {
  res.send({
    started: started,
    uptime: (Date.now() - Number(started)) / 1000
  });
});

// Add static files
app.use(loopback.static(path.join(__dirname, 'public')));


/*!
 * Export `app` for use in other modules.
 */
module.exports = app;
