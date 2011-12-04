var nodify = 'nodify/nodify.js';
phantom.injectJs(nodify);

var assert, should, feature, browser, $;

nodify.run(function() {
  assert = require('assert');
  should = require('./should');  

  var mocha = require('./mocha');
  var Reporter = require('./mocha/lib/reporters/spec');
  
  var rootSuite = new mocha.Suite('');
  var ui = mocha.interfaces['bdd'];
  if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
  ui(rootSuite);
  rootSuite.emit('pre-require', global);
  
  require('./patches');
  var utils = require('./utils');
  var FeatureManager = require('./feature').FeatureManager;
  var Feature = require('./feature').Feature;  
  
  var featureManager = new FeatureManager(rootSuite);
  feature = function(title, options, fn) {
    var suite = new mocha.Suite(title);
    ui(suite);
    featureManager.addFeature(new Feature(suite, options, fn));
  };

  var path = phantom.args[0] || './test';
  if (path[0] !== '/' && path[0] !== '.') path = './' + path;

  var files = utils.getFiles(path);
    
  for (var i=0; i<files.length; ++i) {
    rootSuite.emit('pre-require', global);
    require(files[i]);
    rootSuite.emit('post-require', global);
  }
  
  featureManager.loadFeatures();

  rootSuite.emit('run');
  var runner = new mocha.Runner(rootSuite);
  
  // a hack to show the test body as a stack trace on errors
  runner.on('test', function(test) {
    test.fn._isTest = true;
  });

  var reporter = new Reporter(runner);
  runner.run();
});

