var objectAssign = require('object-assign');

module.exports = function (url, defaultConfig, userConfig) {
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
};
