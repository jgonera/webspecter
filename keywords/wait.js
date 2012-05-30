var extend = require('../utils').extend;

var until = exports.until = exports['for'] = function(conditionFn, options, fn) {
  if (options instanceof Function) {
    fn = options;
    options = { 'for': 5000 };
  }
  extend(options, {
    'for': 5000,
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

var while_ = exports['while'] = function(conditionFn, fn) {
  if (!conditionFn()) {
    fn();
  } else {
    setTimeout(function() { while_(conditionFn, fn); }, 0);
  }
};

