'use strict';
var request = require('request');
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');
var objectAssign = require('object-assign');
var isOk = require('is-ok');

var errors = require('./src/error');
var HTTPError = errors.HTTPError;
var InvalidFormatError = errors.InvalidFormatError;

var defaultConfig = {
  headers: {
    'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
  },
  qs: {
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
    var config = mergeConfig(buildDetailUrl(identifier), userConfig);
    request(config, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }
      if (!isOk(response)) {
        reject(new HTTPError(response.statusCode));
        return;
      }
      resolve(body);
    });
  });
}

function mergeConfig(url, userConfig) {
  userConfig = userConfig || {};
  var opts = objectAssign({}, defaultConfig, userConfig);
  opts.url = url;
  var headerCandidate = [{}, defaultConfig.headers];
  if (userConfig.hasOwnProperty('headers')) {
    headerCandidate.push(userConfig.headers);
  }
  opts.headers = objectAssign.apply(null, headerCandidate);
  var qsCandidate = [{}, defaultConfig.qs];
  if (userConfig.hasOwnProperty('qs')) {
    qsCandidate.push(userConfig.qs);
  }
  opts.qs = objectAssign.apply(null, qsCandidate);
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

module.exports = run;
module.exports.get = get;
module.exports.convert = convert;
module.exports.HTTPError = HTTPError;
module.exports.InvalidFormatError = InvalidFormatError;
