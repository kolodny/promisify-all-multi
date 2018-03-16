promisify-all-multi
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

promisify-all with multiArgs always on the `object.someMethodMulti` property

Setup via NPM
```sh
npm install promisify-all-multi --save
```


### Usage
```js
import promisify from 'promisify-all-multi';
const object = {
  method(arg1, arg2, callback) {
    callback(
      null,
      arg1 + '!',
      arg2 + '@'
    );
  }
}
const promised = promisify(object);

promised.method('foo', 'bar')
  .then(results => console.log(results)) // 'foo!'

promised.methodMulti('foo', 'bar')
  .then(results => console.log(results)) // ['foo!', 'bar@']

// Using es6 destructuring:
promised.methodMulti('foo', 'bar')
  .then(([foo, bar]) => console.log({ foo, bar })) // {foo: 'foo!', bar: 'bar@'}
```

[npm-image]: https://img.shields.io/npm/v/promisify-all-multi.svg?style=flat-square
[npm-url]: https://npmjs.org/package/promisify-all-multi
[travis-image]: https://img.shields.io/travis/kolodny/promisify-all-multi.svg?style=flat-square
[travis-url]: https://travis-ci.org/kolodny/promisify-all-multi
[coveralls-image]: https://img.shields.io/coveralls/kolodny/promisify-all-multi.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/kolodny/promisify-all-multi
[downloads-image]: http://img.shields.io/npm/dm/promisify-all-multi.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/promisify-all-multi
