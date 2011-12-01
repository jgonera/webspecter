// some more interesting info in Error.stack for mocha
Error.captureStackTrace = function(error, constructorOpt) {
  var caller = constructorOpt.caller;
  while (caller && !caller._isTest) {
    var caller = caller.caller;
  }
  error.stack = error.toString() + '\nat ' + caller;
};

