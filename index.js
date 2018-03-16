'use strict';

module.exports = (object, options) => {
  options = Object.assign({
    multiArgsSuffix: 'Multi',
  }, options);
  const cloned = Object.assign({}, object);
  Object.keys(cloned)
    .filter(key => typeof cloned[key] === 'function')
    .forEach(key => {
      const original = cloned[key];

      cloned[key] = function() {
        const length = arguments.length
        const args = Array(length);
        const context = this;
        for (let index = 0; index < length; index++) {
          args[index] = arguments[index];
        }
        return new Promise((resolve, reject) => {
          args.push((error, result) => {
            error ? reject(error) : resolve(result);
          });
          original.apply(context, args)
        });
      };

      cloned[key + options.multiArgsSuffix] = function() {
        const context = this;
        const length = arguments.length
        const args = Array(length);
        for (let index = 0; index < length; index++) {
          args[index] = arguments[index];
        }
        return new Promise((resolve, reject) => {
          args.push(function(error) {
            if (error) return reject(error);
            const length = arguments.length
            const results = Array(length - 1);
            for (let index = 1; index < length; index++) {
              results[index - 1] = arguments[index];
            }
            resolve(results)
          });
          original.apply(context, args)
        });
      };

    });
  return cloned;
};
