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
  return new Promise(function (resolve, reject) {
    var $ = cheerio.load(detailHtml);
    var itemProps = {};
    $('meta[itemprop]').each(function (index, element) {
      // Split content like <meta itemprop="interactionCount" content="UserDownloads:418" />
      if ($(element).attr('itemprop') === 'interactionCount' &&
        $(element).attr('content').indexOf(':') !== -1) {
        var keyValue = $(element).attr('content').split(':', 2);
        itemProps[$(element).attr('itemprop')] = itemProps[$(element).attr('itemprop')] || {};
        itemProps[$(element).attr('itemprop')][keyValue[0]] = keyValue[1];
      } else {
        itemProps[$(element).attr('itemprop')] = $(element).attr('content');
      }
    });
    var splitUrl = itemProps.url.split('/');
    itemProps['id'] = splitUrl[splitUrl.length - 1];
    if (Object.keys(itemProps).length === 0) {
      reject(new MetaPropertyError());
      return;
    }
    resolve(itemProps);
  });
}

var HTTPError = createErrorClass('HTTPError', function (statusCode) {
  this.statusCode = statusCode;
  this.statusMessage = nodeStatusCodes[this.statusCode];
  this.message = 'Response code ' + this.statusCode + ' (' + this.statusMessage + ')';
});

var MetaPropertyError = createErrorClass('MetaPropertyError', function () {
  this.message = 'There is no meta property';
});


module.exports.fetch = fetch;
module.exports.convert = convert;
module.exports.HTTPError = HTTPError;
module.exports.MetaPropertyError = MetaPropertyError;
