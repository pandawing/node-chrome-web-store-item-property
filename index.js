'use strict';
var axios = require('axios');
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');

function fetch (identifier) {
  return new Promise(function (resolve, reject) {
    axios
      .get(buildDetailUrl(identifier))
      .then(function (value) {
        resolve(value);
      }).catch(function (err) {
        reject(err);
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

module.exports.fetch = fetch;
module.exports.convert = convert;
