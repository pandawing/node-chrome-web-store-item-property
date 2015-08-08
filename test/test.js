'use strict';
var assert = require('power-assert');
var chromeWebStoreItemProperty = require('../');
var nock = require('nock');
var path = require('path');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;
var shouldRejected = require('promise-test-helper').shouldRejected;

describe('#get', function () {
  var identifier = 'nimelepbpejjlbmoobocpfnjhihnpked';
  context('resource exists', function () {
    it('should return fetched data', function () {
      nock('https://chrome.google.com')
        .get('/webstore/detail/' + identifier + '?hl=en&gl=US')
        .replyWithFile(200, path.join(__dirname, 'fixtures', identifier));
      return shouldFulfilled(
        chromeWebStoreItemProperty
          .get(identifier)
      ).then(function (value) {
          assert(value);
        });
    });
  });
  context('resource does not exist', function () {
    it('should return error', function () {
      nock('https://chrome.google.com')
        .get('/webstore/detail/' + identifier + '?hl=en&gl=US')
        .reply(404);
      return shouldRejected(
        chromeWebStoreItemProperty
          .get(identifier)
      ).catch(function (err) {
        assert(err instanceof chromeWebStoreItemProperty.HTTPError);
      });
    });
  });
});
