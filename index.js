'use strict';

var HTTPError = require('./src/error').HTTPError;
var InvalidFormatError = require('./src/error').InvalidFormatError;
var convert = require('./src/convert');
var get = require('./src/get');
var defaultConfig = get.defaultConfig;

function run (identifier, userConfig) {
  return get(identifier, userConfig)
    .then(convert);
}

module.exports = run;
module.exports.get = get;
module.exports.convert = convert;
module.exports.HTTPError = HTTPError;
module.exports.InvalidFormatError = InvalidFormatError;
module.exports.defaultConfig = defaultConfig;
