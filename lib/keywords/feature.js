var Feature = require('../feature').Feature;
var mocha = require('mocha');

module.exports = function(engine) {
  return function(title, options, fn) {
    if (!fn) {
      fn = options;
      options = {};
    }
    var suite = new mocha.Suite(title, engine.rootSuite.ctx);
    engine.ui(suite);
    options.__file = engine.file;
    engine.featureManager.addFeature(new Feature(suite, options, fn));
  };
};
