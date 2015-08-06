'use strict';
var axios = require('axios');
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');
var createErrorClass = require('create-error-class');
var nodeStatusCodes = require('node-status-codes');

function fetch (identifier) {
  return new Promise(function (resolve, reject) {
    axios
      .get(buildDetailUrl(identifier))
      .then(function (value) {
        resolve(value);
      }).catch(function (err) {
        reject(new HTTPError(err.status));
      });
  });
}

function buildDetailUrl(identifier) {
  return 'https://chrome.google.com/webstore/detail/' + identifier;
}

function convert(detailHtml) {
  return new Promise(function (resolve) {
    var $ = cheerio.load(detailHtml);
    $;
    resolve({meta: true});
  });
}

var HTTPError = createErrorClass('HTTPError', function (statusCode) {
  this.statusCode = statusCode;
  this.statusMessage = nodeStatusCodes[this.statusCode];
  this.message = 'Response code ' + this.statusCode + ' (' + this.statusMessage + ')';
});


module.exports.fetch = fetch;
module.exports.convert = convert;
module.exports.HTTPError = HTTPError;
