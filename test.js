'use strict';
var assert = require('power-assert');
var chromeWebstoreItemProperty = require('./');
var nock = require('nock');
var path = require('path');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;

describe('#fetch', function () {
  var identifier = 'nimelepbpejjlbmoobocpfnjhihnpked';
  context('resource exists', function () {
    it('should return fetched data', function () {
      nock('https://chrome.google.com')
        .get('/webstore/detail/' + identifier)
        .replyWithFile(200, path.join(__dirname, identifier));
      return shouldFulfilled(
        chromeWebstoreItemProperty
          .fetch(identifier)
      ).then(function (value) {
          assert(value);
        });
    });
  });
});
