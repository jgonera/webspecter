var utils = require('./utils');
var environment = require('./environment');
var FeatureManager = require('./feature').FeatureManager;
var Feature = require('./feature').Feature;  

var mocha = require('./mocha');
var Reporter = require('./mocha/lib/reporters/spec');

var Engine = exports.Engine = function Engine(path) {
  this.path = path;
  this.rootSuite = new mocha.Suite('');
  var ui = mocha.interfaces['bdd'];
  ui(this.rootSuite);
  this.featureManager = new FeatureManager(this.rootSuite);

  global.assert = require('assert');
  global.should = require('./should');
  global.feature = function(title, options, fn) {
    var suite = new mocha.Suite(title);
    ui(suite);
    this.featureManager.addFeature(new Feature(suite, options, fn));
  }.bind(this);

  environment.load(utils.findEnvFile(path));
  utils.extend(global, environment.global);
};

Engine.prototype.run = function() {
  var files = utils.findFiles(this.path);

  for (var i=0; i<files.length; ++i) {
    this.rootSuite.emit('pre-require', global);
    require(files[i]);
    this.rootSuite.emit('post-require', global);
  }

  var runner = new mocha.Runner(this.rootSuite);
  // a hack to show the test body as a stack trace on errors
  runner.on('test', function(test) {
    test.fn._isTest = true;
    global.feature.currentTestTitle = test.title
    global.feature.currentTestFullTitle = test.fullTitle();
  });
  var reporter = new Reporter(runner);
  
  this.featureManager.loadFeatures();
  this.rootSuite.emit('run');
  runner.run(process.exit);
};

