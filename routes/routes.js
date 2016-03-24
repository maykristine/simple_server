'use strict';
var routes = exports;
var console = process.console;
var endpoint = require('../lib/endpoint.js'),
example = require('./example.js');


routes.setupStableEndpoints = function(app, db, microservice) {
  switch(microservice) {
    default:
      console.log('Running Main Server');
      app.post('/sample/', endpoint.post("Sample Endpoint", example, db));
      break;
  }
}
