'use strict';
var endpoint = exports;
var console = process.console;
var uuid = require('node-uuid'),
_ = require('lodash'),
validation = require('./validation.js');

endpoint.post = function(callName, logic, db) {
  //A helper function that handles logging and checking the payload is valid.
  // LOGIC is a function that takes body, response, and db as arguments.
  return function(request, response, next) {
    var name = [callName, uuid.v1().toString()].join(", ");
    console.tag(name).log('------------' + callName + '------------');
    if (!request.body) {
      validation.error('Invalid JSON payload', response, name);
      return;
    }
    if (_.isEmpty(request.body)) {
      validation.error('Empty JSON payload, you may be missing application/json in headers', response, name);
      return;
    }
    try { //body-parser never calls the 'end' function.
      logic(request, response, db, name);
    } catch (e) {
      validation.serverError('A request failed to process with reason ' + e.toString(), response, name);
    }
  };
}

endpoint.get = function(callName, logic, db) {
  return function(request, response, next) {
    var name = [callName, uuid.v1().toString()].join(", ");
    console.tag(name).log('------------' + callName + '------------');
    var returned = false;

    request.on('data', function(data) {
       returned = true;
       validation.serverError('Invalid body payload on get', response, name);
    });

    request.on('end', function() {
      if(!returned) { //Check needs to be here to ensure data gets evaluated first.
        try {
          logic(request, response, db, name);
        } catch (e) {
          validation.serverError('A request failed to process with reason ' + e.toString(), response, name);
        }
      }
    });
  }
}
