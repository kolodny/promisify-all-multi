const promisifyAll = require('./');
const assert = require('assert');

describe('promisifyAll', () => {

  it("doesn't mutate the original object", () => {
    const object = {
      someMethod(callback) {
        callback(null);
      }
    };
    const promised = promisifyAll(object);
    assert.notEqual(object, promised);
    assert(!object.someMethodMulti);
  });

  describe('has a single argument callback mode that:', () => {

    it('handles success', () => {
      const object = {
        someMethod(arg, callback) {
          setTimeout(() => {
            callback(null, arg + '!');
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethod('test').then(arg => {
        assert.equal(arg, 'test!');
      });
    });

    it('handles errors', () => {
      const myError = new Error('MyError')
      const object = {
        someMethod(arg, callback) {
          setTimeout(() => {
            callback(myError);
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethod('test')
        .then(
          () => assert.fail('Error not caught'),
          error => assert.equal(error, myError));
    });

    it('handles variable argument APIs', () => {
      const object = {
        someMethod() {
          const args = [].slice.call(arguments);
          const callback = args.pop();
          const callWith = args.map(s => s + '!');
          setTimeout(() => {
            callback(null, callWith);
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethod('a', 'b', 'c').then(results => {
        assert.deepEqual(results, ['a!', 'b!', 'c!']);
      });
    });

  });

  describe('has a multiple argument callback mode that:', () => {

    it('handles success', () => {
      const object = {
        someMethod(arg1, arg2, callback) {
          setTimeout(() => {
            callback(null, arg1 + '!', arg2 + '@');
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethodMulti('foo', 'bar').then((results) => {
        assert.equal(results[0], 'foo!');
        assert.equal(results[1], 'bar@');
      });
    });

    it('handles errors', () => {
      const myError = new Error('MyError')
      const object = {
        someMethod(arg, callback) {
          setTimeout(() => {
            callback(myError);
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethodMulti('test')
        .then(
          () => assert.fail('Error not caught'),
          error => assert.equal(error, myError));
    });

    it('handles variable argument APIs', () => {
      const object = {
        someMethod() {
          const args = [].slice.call(arguments);
          const callback = args.pop();
          const callWith = args.map(s => s + '!');
          callWith.unshift(null);
          setTimeout(() => {
            callback.apply(null, callWith);
          }, 10);
        }
      };
      const promised = promisifyAll(object);
      return promised.someMethodMulti('a', 'b', 'c').then(results => {
        assert.deepEqual(results, ['a!', 'b!', 'c!']);
      });
    });

  });

  describe('options', () => {
    it('allows overriding the `multiArgsSuffix` suffix', () => {
      const object = {
        someMethod(callback) {
          callback(null);
        }
      };
      const promised = promisifyAll(object, {
        multiArgsSuffix: 'Advanced',
      });
      assert.equal(typeof promised.someMethodAdvanced, 'function');
    })
  });

});
