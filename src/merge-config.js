var objectAssign = require('object-assign');

module.exports = function (url, defaultConfig, userConfig) {
  userConfig = userConfig || {};
  defaultConfig = defaultConfig || {};
  var opts = objectAssign({}, defaultConfig, userConfig);
  opts.url = url;
  var headerCandidate = [{}];
  if (defaultConfig.hasOwnProperty('headers')) {
    headerCandidate.push(defaultConfig.headers);
  }
  if (userConfig.hasOwnProperty('headers')) {
    headerCandidate.push(userConfig.headers);
  }
  opts.headers = objectAssign.apply(null, headerCandidate);
  var qsCandidate = [{}];
  if (defaultConfig.hasOwnProperty('qs')) {
    qsCandidate.push(defaultConfig.qs);
  }
  if (userConfig.hasOwnProperty('qs')) {
    qsCandidate.push(userConfig.qs);
  }
  opts.qs = objectAssign.apply(null, qsCandidate);
  return opts;
};
