'use strict';
var assert = require('power-assert');
var chromeWebstoreItemProperty = require('./');

it('should ', function () {
  assert.strictEqual(chromeWebstoreItemProperty('unicorns'), 'unicorns & rainbows');
});
it('should not ', function () {
  assert.strictEqual(chromeWebstoreItemProperty('unicorns'), 'unicorns & wrong');
});
