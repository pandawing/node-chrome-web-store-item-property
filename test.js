'use strict';
var assert = require('power-assert');
var chromeWebStoreItemProperty = require('./');
var nock = require('nock');
var path = require('path');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;
var shouldRejected = require('promise-test-helper').shouldRejected;
var fs = require('fs');

describe('#fetch', function () {
  var identifier = 'nimelepbpejjlbmoobocpfnjhihnpked';
  context('resource exists', function () {
    it('should return fetched data', function () {
      nock('https://chrome.google.com')
        .get('/webstore/detail/' + identifier)
        .replyWithFile(200, path.join(__dirname, 'fixtures', identifier));
      return shouldFulfilled(
        chromeWebStoreItemProperty
          .fetch(identifier)
      ).then(function (value) {
          assert(value);
        });
    });
  });
  context('resource does not exist', function () {
    it('should return error', function () {
      nock('https://chrome.google.com')
        .get('/webstore/detail/' + identifier)
        .reply(404);
      return shouldRejected(
        chromeWebStoreItemProperty
          .fetch(identifier)
      ).catch(function (err) {
        assert(err instanceof chromeWebStoreItemProperty.HTTPError);
      });
    });
  });
});

describe('#convert', function () {
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
        UserDownloads: '418'
      },
      operatingSystems: 'Chrome',
      ratingValue: '4.5',
      ratingCount: '2',
      id: 'nimelepbpejjlbmoobocpfnjhihnpked'
    };
    it('should return meta itemprop', function () {
      return shouldFulfilled(
        chromeWebStoreItemProperty
          .convert(html)
      ).then(function (value) {
          assert.deepEqual(value, expected);
        }).catch(function (err) {
          throw err;
        });
    });
  });
});
