'use strict';

var throng = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 1;
var argv = require('minimist')(process.argv);
var microservice = argv.microservice || process.env.MICROSERVICE || undefined;


function start() {  // TODO Split this function up
  var express = require('express');
  var app = express(),
  helmet = require('helmet');
  app.use(helmet());
  var scribe = require('scribe-js')(); //Doesn't need to be imported in sub-modules. As long as requires is declared afterward.
  var console = process.console; //This line needs to be in files that want to use console.
  app.use(scribe.express.logger()); //Logging
  if(argv.scribe || process.env.LOGS) { //
    app.use('/logs', scribe.webPanel()); //Initiate location to view logs.
  }
  bodyParser = require('body-parser'),
  util = require('./lib/util.js');

  Date.now = function() { return new Date().getTime(); }

  app.set('port', (process.env.PORT || 5000));

  app.use(bodyParser.json({inflate: false}));
  var server = app.listen(app.get('port'), function() {
    console.info("Node app is running at localhost:" + app.get('port'));
  });

  var routes = require('./routes/routes.js'); //Endpoint declarations
  routes.setupStableEndpoints(app, db, microservice);

  process.on('SIGTERM', function () {
      console.tag("System").log('Shutting down server due to SIGTERM');
      server.close(function() {
        console.tag("System").log("Shut down server due to SIGTERM");
      });
      process.exit();
  });
  
  var schedule = require('node-schedule');
  schedule.scheduleJob('*/15 * * * *', function(){
  });

}

throng(start, {
  workers: WORKERS,
  lifetime: Infinity
});
