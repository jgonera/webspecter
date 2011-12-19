var utils = require('./utils');
var environment = require('./environment');
var FeatureManager = require('./feature').FeatureManager;
var Feature = require('./feature').Feature;  

var mocha = require('./mocha');
var ReporterBase = require('./mocha/lib/reporters/base');
var Reporter = require('./mocha/lib/reporters/spec');
var ui = require('./interface');


var Engine = exports.Engine = function Engine(options) {
  this.options = options;
  this.rootSuite = new mocha.Suite('');
  this.rootSuite.timeout(5000);
  ReporterBase.slow = 1000;
  //var ui = mocha.interfaces['bdd'];
  ui(this.rootSuite);
  this.featureManager = new FeatureManager(this.rootSuite);

  global.assert = require('assert');
  global.should = require('./should');
  global.feature = function(title, options, fn) {
    var suite = new mocha.Suite(title);
    ui(suite);
    this.featureManager.addFeature(new Feature(suite, options, fn));
  }.bind(this);
  
  environment.load(utils.findEnvFile(options.path));
  utils.extend(global, environment.helpers);
};

Engine.prototype.run = function() {
  var files = utils.findFiles(this.options.path);

  for (var i=0; i<files.length; ++i) {
    this.rootSuite.emit('pre-require', global);
    require(files[i]);
    this.rootSuite.emit('post-require', global);
  }
  
  this.featureManager.loadFeatures(this.options.feature);
  
  var runner = new mocha.Runner(this.rootSuite);
  runner.on('test', function(test) {
    // a hack to show the test body as a stack trace on errors
    test.fn._isTest = true;
    global.feature.currentTest = test;
  });
  var reporter = new Reporter(runner);
  
  this.rootSuite.emit('run');
  runner.run(process.exit);
};

