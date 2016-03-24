'use strict';
var uuid = require('node-uuid'),
validation = require('../lib/validation.js'),
_ = require('lodash'),
util = require('../lib/util.js'),
async = require('async');
var console = process.console;

module.exports = function(request, response, db, name) {
  var body = request.body;
  if (!validation.containsInput(request.headers, ['demo'], response, name, 'headers') ||
    !validation.containsInput(body, ['demo'], response, name)) {
    return;
  };

  async.waterfall(
    [
    // Your stuff here
    ],
    function(err, results) {
      if (err) {
        validation.serverError(err, response, name);
      } else if (!results.length) {
        validation.error('No results found', response, name);
      } else {
        validation.success({'status': 'success'}, response, name);
      }
    }
  );
}
