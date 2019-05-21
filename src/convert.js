'use strict';
var InvalidFormatError = require('./error').InvalidFormatError;
var Promise = Promise || require('es6-promise').Promise;
var cheerio = require('cheerio');
var includes = require('array-includes');
var parseFloatWithComma = require('./parse-float-with-comma');
var keysStringToFloat = [
  'ratingCount',
  'ratingValue',
  'UserDownloads'
];

function convert(detailHtml) {
  return new Promise(function (resolve, reject) {
    var $ = cheerio.load(detailHtml);
    var itemProps = {};
    var elementItemProp;
    $('meta[itemprop]').each(function (index, element) {
      // Split content like <meta itemprop="interactionCount" content="UserDownloads:418" />
      if ($(element).attr('itemprop') === 'interactionCount' &&
        $(element).attr('content').indexOf(':') !== -1) {
        var keyValue = $(element).attr('content').split(':', 2);
        elementItemProp = $(element).attr('itemprop');
        itemProps[elementItemProp] = itemProps[elementItemProp] || {};
        if (includes(keysStringToFloat, keyValue[0])) {
          itemProps[elementItemProp][keyValue[0]] = parseFloatWithComma(keyValue[1]);
        } else {
          itemProps[elementItemProp][keyValue[0]] = keyValue[1];
        }
      } else {
        elementItemProp = $(element).attr('itemprop');
        if (includes(keysStringToFloat, elementItemProp)) {
          itemProps[elementItemProp] = parseFloatWithComma($(element).attr('content'));
        } else {
          itemProps[elementItemProp] = $(element).attr('content');
        }
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
