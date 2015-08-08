'use strict';
var createErrorClass = require('create-error-class');
var nodeStatusCodes = require('node-status-codes');

module.exports.HTTPError = createErrorClass('HTTPError', function (statusCode) {
  this.statusCode = statusCode;
  this.statusMessage = nodeStatusCodes[this.statusCode];
  this.message = 'Response code ' + this.statusCode + ' (' + this.statusMessage + ')';
});

module.exports.InvalidFormatError = createErrorClass('InvalidFormatError', function (message) {
  this.message = message;
});
