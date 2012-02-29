module.exports = function(count) {
  var n = 0, done, already = false;

  function callDone() {
    n = 0;
    already = false;
    done();
  }

  function parallel() {
    ++n;
    if (n === count) {
      if (done instanceof Function) callDone();
      else already = true;
    }
  }

  parallel.done = function(fn) {
    done = fn;
    if (already) callDone();
  };

  return parallel;
};
