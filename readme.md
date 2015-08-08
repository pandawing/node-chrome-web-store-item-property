# chrome-web-store-item-property

[![NPM version][npm-image]][npm-url] [![Travis-CI Status][travis-image]][travis-url] [![Appveyor Status][appveyor-image]][appveyor-url] [![Daviddm Status][daviddm-image]][daviddm-url]

> Gather meta information from chrome web store.

For example: version, count of downloads and rating.

See [chrome-web-store-item-property-cli](https://github.com/pandawing/node-chrome-web-store-item-property-cli) for the command-line version.


## Install

```
$ npm install --save chrome-web-store-item-property
```


## Usage

```js
var chromeWebStoreItemProperty = require('chrome-web-store-item-property');
// or
<script src="build/chrome-web-store-item-property.js"></script>

chromeWebStoreItemProperty('nimelepbpejjlbmoobocpfnjhihnpked')
  .then(function (value) {
    console.log(value);
    // =>
    //{
    //  name: 'Do Not Merge WIP for GitHub',
    //  url: 'https://chrome.google.com/webstore/detail/do-not-merge-wip-for-gith/nimelepbpejjlbmoobocpfnjhihnpked',
    //  image: 'https://ssl.gstatic.com/chrome/webstore/images/thumb.png',
    //  version: '1.0.6',
    //  price: '$0',
    //  priceCurrency: 'USD',
    //  interactionCount: {
    //    UserDownloads: 418
    //  },
    //  operatingSystems: 'Chrome',
    //  ratingValue: 4.5,
    //  ratingCount: 2,
    //  id: 'nimelepbpejjlbmoobocpfnjhihnpked'
    //};
  });
```



## API

### chromeWebStoreItemProperty(identifier[, config]) -> Promise

#### identifier

*Required*  
Type: `string`

ID for Chrome Web Store.


#### config

Pass [request's available options](https://github.com/request/request#requestoptions-callback)

```js
var defaultConfig = {
  headers: {
    'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
  },
  qs: {
    hl: 'en',
    gl: 'US'
  }
};
```


### chromeWebStoreItemProperty.get(identifier[, config]) -> Promise


#### identifier

*Required*  
Type: `string`

ID for Chrome Web Store.


#### config

Pass [request's available options](https://github.com/request/request#requestoptions-callback)

```js
var defaultConfig = {
  headers: {
    'User-Agent': 'https://github.com/pandawing/node-chrome-web-store-item-property'
  },
  qs: {
    hl: 'en',
    gl: 'US'
  }
};
```

### chromeWebStoreItemProperty.convert(detailHtml) -> Promise


## Errors

### chromeWebStoreItemProperty.HTTPError

### chromeWebStoreItemProperty.InvalidFormatError


## Changelog

[changelog.md](./changelog.md).


## License

MIT © [sanemat](http://sane.jp)


[travis-url]: https://travis-ci.org/pandawing/node-chrome-web-store-item-property
[travis-image]: https://img.shields.io/travis/pandawing/node-chrome-web-store-item-property/master.svg?style=flat-square&label=travis
[appveyor-url]: https://ci.appveyor.com/project/sanemat/node-chrome-web-store-item-property/branch/master
[appveyor-image]: https://img.shields.io/appveyor/ci/sanemat/node-chrome-web-store-item-property/master.svg?style=flat-square&label=appveyor
[npm-url]: https://npmjs.org/package/chrome-web-store-item-property
[npm-image]: https://img.shields.io/npm/v/chrome-web-store-item-property.svg?style=flat-square
[daviddm-url]: https://david-dm.org/pandawing/node-chrome-web-store-item-property
[daviddm-image]: https://img.shields.io/david/pandawing/node-chrome-web-store-item-property.svg?style=flat-square
