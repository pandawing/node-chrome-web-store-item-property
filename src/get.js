var request = require('request');
var Promise = Promise || require('es6-promise').Promise;
var objectAssign = require('object-assign');
var isOk = require('is-ok');

var HTTPError = require('./error').HTTPError;
var buildDetailUrl = require('./build-detail-url');
var defaultConfig = {
  headers: {
    'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
  },
  qs: {
    hl: 'en',
    gl: 'US'
  }
};

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

module.exports = get;
module.exports.defaultConfig = defaultConfig;
