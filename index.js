'use strict';
var axios = require('axios');
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');
var createErrorClass = require('create-error-class');
var nodeStatusCodes = require('node-status-codes');
var objectAssign = require('object-assign');

var defaultConfig = {
  headers: {
    'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
  },
  params: {
    hl: 'en',
    gl: 'US'
  }
};

function run (identifier, userConfig) {
  return get(identifier, userConfig)
    .then(convert);
}

function get (identifier, userConfig) {
  return new Promise(function (resolve, reject) {
    var config = mergeConfig(userConfig);
    axios
      .get(buildDetailUrl(identifier), config)
      .then(function (value) {
        resolve(value);
      }).catch(function (err) {
        reject(new HTTPError(err.status));
      });
  });
}

function mergeConfig(userConfig) {
  userConfig = userConfig || {};
  var opts = objectAssign({}, defaultConfig, userConfig);
  var headerCandidate = [{}, defaultConfig.headers];
  if (userConfig.hasOwnProperty('headers')) {
    headerCandidate.push(userConfig.headers);
  }
  opts.headers = objectAssign.apply(null, headerCandidate);
  var paramsCandidate = [{}, defaultConfig.params];
  if (userConfig.hasOwnProperty('params')) {
    paramsCandidate.push(userConfig.params);
  }
  opts.params = objectAssign.apply(null, paramsCandidate);
  return opts;
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
    if (Object.keys(itemProps).length === 0) {
      reject(new InvalidFormatError('There is no meta property'));
      return;
    }
    if (!itemProps.hasOwnProperty('url') || !itemProps['url']) {
      reject(new InvalidFormatError('url in response is required'));
      return;
    }
    var splitUrl = itemProps.url.split('/');
    itemProps['id'] = splitUrl[splitUrl.length - 1];
    resolve(itemProps);
  });
}

var HTTPError = createErrorClass('HTTPError', function (statusCode) {
  this.statusCode = statusCode;
  this.statusMessage = nodeStatusCodes[this.statusCode];
  this.message = 'Response code ' + this.statusCode + ' (' + this.statusMessage + ')';
});

var InvalidFormatError = createErrorClass('InvalidFormatError', function (message) {
  this.message = message;
});

module.exports = run;
module.exports.get = get;
module.exports.convert = convert;
module.exports.HTTPError = HTTPError;
module.exports.InvalidFormatError = InvalidFormatError;
