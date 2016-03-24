'use strict';
var util = exports;
var console = process.console;
var objectPath = require('object-path'),
_ = require('lodash'),
validation = require('./validation.js'),
uuid = require('node-uuid');

util.getOrElse = function(desired, dflt) {
  if (!desired) {
    return dflt;
  } else {
    return desired;
  }
};

util.optParams = function(target, body, paths) {
  for(var i in paths) {
    var path = paths[i];
    var result = objectPath.get(body, path, undefined);
    if(result !== undefined) {
      objectPath.set(target, path, result);
    }
  }
  return target;
};