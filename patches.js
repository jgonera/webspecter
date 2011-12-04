// some more interesting info in Error.stack for mocha
Error.captureStackTrace = function(error, constructorOpt) {
  var caller = constructorOpt.caller;
  while (caller && !caller._isTest && caller.toString().indexOf('done(') === -1) {
    var caller = caller.caller;
  }
  error.stack = error.toString() + '\nat ' + caller;
};

