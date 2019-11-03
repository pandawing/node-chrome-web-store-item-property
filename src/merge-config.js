var objectAssign = require('object-assign');

module.exports = function (url, defaultConfig, userConfig) {
  userConfig = userConfig || {};
  defaultConfig = defaultConfig || {};
  var opts = objectAssign({}, defaultConfig, userConfig);
  opts.url = url;
  var headerCandidate = [{}];
  if (Object.prototype.hasOwnProperty.call(defaultConfig, 'headers')) {
    headerCandidate.push(defaultConfig.headers);
  }
  if (Object.prototype.hasOwnProperty.call(userConfig, 'headers')) {
    headerCandidate.push(userConfig.headers);
  }
  opts.headers = objectAssign.apply(null, headerCandidate);
  var qsCandidate = [{}];
  if (Object.prototype.hasOwnProperty.call(defaultConfig, 'qs')) {
    qsCandidate.push(defaultConfig.qs);
  }
  if (Object.prototype.hasOwnProperty.call(userConfig, 'qs')) {
    qsCandidate.push(userConfig.qs);
  }
  opts.qs = objectAssign.apply(null, qsCandidate);
  return opts;
};
