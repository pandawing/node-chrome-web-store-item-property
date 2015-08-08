'use strict';
var assert = require('power-assert');
var path = require('path');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;
var shouldRejected = require('promise-test-helper').shouldRejected;
var fs = require('fs');

var convert = require('../src/convert');
var InvalidFormatError = require('../src/error').InvalidFormatError;

describe('convert', function () {
  context('meta data exists', function () {
    var html = fs.readFileSync(path.join(__dirname, 'fixtures', 'nimelepbpejjlbmoobocpfnjhihnpked'), 'utf8');
    var expected = {
      name: 'Do Not Merge WIP for GitHub',
      url: 'https://chrome.google.com/webstore/detail/do-not-merge-wip-for-gith/nimelepbpejjlbmoobocpfnjhihnpked',
      image: 'https://ssl.gstatic.com/chrome/webstore/images/thumb.png',
      version: '1.0.6',
      price: '$0',
      priceCurrency: 'USD',
      interactionCount: {
        UserDownloads: 418
      },
      operatingSystems: 'Chrome',
      ratingValue: 4.5,
      ratingCount: 2,
      id: 'nimelepbpejjlbmoobocpfnjhihnpked'
    };
    it('should return meta itemprop', function () {
      return shouldFulfilled(
        convert(html)
      ).then(function (value) {
          assert.deepEqual(value, expected);
          assert.strictEqual(value.ratingCount, expected.ratingCount);
          assert.strictEqual(value.ratingValue, expected.ratingValue);
          assert.strictEqual(value.interactionCount.UserDownloads, expected.interactionCount.UserDownloads);
        }).catch(function (err) {
          throw err;
        });
    });
  });
  context('meta data does not exist', function () {
    var html = '<html><body><meta charset="utf-8"></body></html>';
    it('should return error', function () {
      return shouldRejected(
        convert(html)
      ).catch(function (err) {
          assert(err instanceof InvalidFormatError);
        });
    });
  });
});
