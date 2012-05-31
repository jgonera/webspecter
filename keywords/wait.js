var extend = require('../utils').extend;

var until = exports.until = exports['for'] = function(conditionFn, options, fn) {
  if (options instanceof Function) {
    fn = options;
    options = {};
  }
  extend(options, {
    'for': 1000,
    message: conditionFn.message || conditionFn.toString()
  });

  if (conditionFn()) {
    clearTimeout(options.timeoutId);
    fn();
  } else {
    if (!options.timeoutId) {
      options.timeoutId = setTimeout(function() {
        throw new Error("Timeout waiting until: " + options.message);
      }, options['for']);
    }
    setTimeout(function() { until(conditionFn, options, fn); }, 0);
  }
};

exports['while'] = function(conditionFn, options, fn) {
  function negatedConditionFn() { return !conditionFn(); }
  until(negatedConditionFn, options, fn);
};

