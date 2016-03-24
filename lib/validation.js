'use strict';
var validation = exports;
var console = process.console;
var objectPath = require('object-path'),
_ = require('lodash');

validation.serverError = function(err, response, name, statusCode) {
  statusCode = statusCode || 500;
  try {
    console.tag(name).error(err.toString());
    response.status(statusCode).json({
      'status': 'failure', 'reason': 'Internal Server Error', 'debug': name});
      //'status': 'failure', 'reason': + err.toString()}) // Disabled for security reasons, enable in future if API made public.
  } catch (e) {
    console.tag(name).error('Severe internal error occured! ', e.toString());
  };
}

validation.error = function(err, response , name, statusCode) {
  statusCode = statusCode || 400;
  try { //We wrap in a try block since if this is called in a callback, endpoint's try won't catch it if response fails. We don't want to kill the server.
    console.tag(name).error('.', err.toString());
    response.status(statusCode).json({
      'status': 'failure', 'reason': err.toString(), 'debug': name });
  } catch (e) {
    console.tag(name).error('Severe internal error occured!', e.toString());
  }
}

validation.success = function(body, response, name, statusCode) {
  statusCode = statusCode || 200;
  try { //We wrap in a try block since if this is called in a callback, endpoint's try won't catch it if response fails. We don't want to kill the server.
    console.tag(name).info('Request succeeded.', JSON.stringify(body));
    body.debug = name;
    response.status(statusCode).json(body);
  } catch (e) {
    console.tag(name).error('Severe internal error occured!', e.toString());
  }
}

validation.containsInput = function(data, paths, response, name, reqType) {
  reqType = reqType || 'JSON'
  //Utility function that handles logging and response.
  try {
    for(var i in paths) {
      var path = paths[i];
      var contains = objectPath.has(data, path);
      if (contains) {
        return contains;
      }
    }
    validation.error("Request " + reqType + " did not contain one of the required fields: " + JSON.stringify(paths) + " Quitting.", response, name);
    return contains;
  } catch (e) {
    validation.serverError(
      'A server error occured while attempting to validate input payload.', // + e.toString(),
      response, name);
    return undefined;
  };
}