var until = exports.until = exports['for'] = function(conditionFn, fn) {
  if (conditionFn()) {
    fn();
  } else {
    setTimeout(function() { until(conditionFn, fn); }, 0);
  }
};

var while_ = exports['while'] = function(conditionFn, fn) {
  if (!conditionFn()) {
    fn();
  } else {
    setTimeout(function() { while_(conditionFn, fn); }, 0);
  }
};

