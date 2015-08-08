'use strict';
var InvalidFormatError = require('./error').InvalidFormatError;
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');

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

module.exports = convert;
