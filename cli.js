#!/usr/bin/env node
/*eslint no-console:0*/
'use strict';
var meow = require('meow');
var chromeWebstoreItemProperty = require('./');

var cli = meow({
  help: [
    'Usage',
    '  $ chrome-webstore-item-property [input]',
    '',
    'Examples',
    '  $ chrome-webstore-item-property',
    '  unicorns & rainbows',
    '',
    '  $ chrome-webstore-item-property ponies',
    '  ponies & rainbows',
    '',
    'Options',
    '  --foo  Lorem ipsum. Default: false'
  ]
});

console.log(chromeWebstoreItemProperty(cli.input[0] || 'unicorns'));
