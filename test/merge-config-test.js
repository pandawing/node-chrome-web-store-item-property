'use strict';
var assert = require('power-assert');
var mergeConfig = require('../src/merge-config');
var defaultConfig = require('../src/get').defaultConfig;

describe('merge-config', function () {
  it('should return merged config', function () {
    var url = 'http://example.com';
    var expected = {
      'url': 'http://example.com',
      'headers': {
        'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
      },
      'qs': {
        'gl': 'US',
        'hl': 'en'
      }
    };
    assert.deepEqual(mergeConfig(url, defaultConfig), expected);
  });

  it('should override by user config', function () {
    var url = 'http://example.com';
    var userConfig = {
      'headers': {
        'User-Agent': 'example'
      }
    };
    var expected = {
      'url': 'http://example.com',
      'headers': {
        'User-Agent': 'example'
      },
      'qs': {
        'gl': 'US',
        'hl': 'en'
      }
    };
    assert.deepEqual(mergeConfig(url, defaultConfig, userConfig), expected);
  });
  it('should add by user config', function () {
    var url = 'http://example.com';
    var userConfig = {
      'foo': {
        'bar': 'baz'
      }
    };
    var expected = {
      'url': 'http://example.com',
      'headers': {
        'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
      },
      'qs': {
        'gl': 'US',
        'hl': 'en'
      },
      'foo': {
        'bar': 'baz'
      }
    };
    assert.deepEqual(mergeConfig(url, defaultConfig, userConfig), expected);
  });
  it('should add inner headers by user config', function () {
    var url = 'http://example.com';
    var userConfig = {
      'headers': {
        'bar': 'baz'
      }
    };
    var expected = {
      'url': 'http://example.com',
      'headers': {
        'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property',
        'bar': 'baz'
      },
      'qs': {
        'gl': 'US',
        'hl': 'en'
      }
    };
    assert.deepEqual(mergeConfig(url, defaultConfig, userConfig), expected);
  });
});
