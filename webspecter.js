var nodify = 'nodify/nodify.js';
phantom.injectJs(nodify);

var assert, should, feature, browser, $, wait;

nodify.run(function() {
  require('./patches');
  var utils = require('./utils');
  var Engine = require('./engine').Engine;

  var path = utils.getPath(phantom.args[0]);
  
  var engine = new Engine(path);
  engine.run();
});

