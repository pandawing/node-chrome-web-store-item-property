'use strict';
var InvalidFormatError = require('./error').InvalidFormatError;
var Promise = Promise || require('es6-promise').Promise;
var htmlparser2 = require('htmlparser2');
var DomHandler = htmlparser2.DomHandler;
var Parser = htmlparser2.Parser;
var DomUtils = htmlparser2.DomUtils;
var includes = require('array-includes');
var parseFloatWithComma = require('./parse-float-with-comma');
var keysStringToFloat = [
  'ratingCount',
  'ratingValue',
  'UserDownloads'
];

function convert(detailHtml) {
  return new Promise(function (resolve, reject) {
    var itemProps = {};
    var elementItemProp;
    var options = {};
    var handler = new DomHandler(null, options);
    new Parser(handler, options).end(detailHtml);
    DomUtils.getElementsByTagName('meta', handler.dom, true).forEach(function(el) {
      if (!DomUtils.hasAttrib(el, 'itemprop')) {
        return;
      }
      // Split content like <meta itemprop="interactionCount" content="UserDownloads:418" />
      if (DomUtils.getAttributeValue(el, 'itemprop') === 'interactionCount' &&
        DomUtils.getAttributeValue(el, 'content').indexOf(':') !== -1) {
        var keyValue = DomUtils.getAttributeValue(el, 'content').split(':', 2);
        elementItemProp = DomUtils.getAttributeValue(el, 'itemprop');
        itemProps[elementItemProp] = itemProps[elementItemProp] || {};
        if (includes(keysStringToFloat, keyValue[0])) {
          itemProps[elementItemProp][keyValue[0]] = parseFloatWithComma(keyValue[1]);
        } else {
          itemProps[elementItemProp][keyValue[0]] = keyValue[1];
        }
      } else {
        elementItemProp = DomUtils.getAttributeValue(el, 'itemprop');
        if (includes(keysStringToFloat, elementItemProp)) {
          itemProps[elementItemProp] = parseFloatWithComma(DomUtils.getAttributeValue(el, 'content'));
        } else {
          itemProps[elementItemProp] = DomUtils.getAttributeValue(el, 'content');
        }
      }
    });
    if (Object.keys(itemProps).length === 0) {
      reject(new InvalidFormatError('There is no meta property'));
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(itemProps, 'url') || !itemProps['url']) {
      reject(new InvalidFormatError('url in response is required'));
      return;
    }
    var splitUrl = itemProps.url.split('/');
    itemProps['id'] = splitUrl[splitUrl.length - 1];
    resolve(itemProps);
  });
}

module.exports = convert;
