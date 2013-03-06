var utils = require('./utils');
var environment = require('./environment');
var FeatureManager = require('./feature').FeatureManager;

var mocha = require('mocha');
var ReporterBase = require('mocha/lib/reporters/base');
var Reporter;


var Engine = exports.Engine = function Engine(options) {
  this.options = options;
  this.rootSuite = new mocha.Suite('', new mocha.Context);
  this.rootSuite.timeout(options.timeout || 10000);
  ReporterBase.slow = 1000;
  this.ui = mocha.interfaces['bdd'];
  this.ui(this.rootSuite);
  this.featureManager = new FeatureManager(this.rootSuite);

  global.assert = require('chai').assert;
  global.should = require('chai').should();
  global.expect = require('chai').expect;
  global.wait = require('./keywords/wait');
  global.parallelize = require('./keywords/parallelize');
  global.feature = require('./keywords/feature')(this);
  
//   This code add settings defined during running webspecter to global.settings
  global.settings = {};
  if (options.globals){
  	var global_settings_list = options.globals.split(';;'),
  		g_counter, key_val; 
  	for (g_counter in global_settings_list){
  		key_val = global_settings_list[g_counter].split('=');
  		if (key_val.length === 2){
  			global.settings[key_val[0]] = key_val[1]; 	
  		}
  	} 
  }
// end of setup settings	

  environment.load(utils.findEnvFile(options.path));
  environment.config.console = options.console;
  Reporter = require('mocha/lib/reporters/' + (options.reporter || environment.config.reporter || 'spec'));
};

Engine.prototype.run = function() {
  var files = utils.findFiles(this.options.path);

  for (var i=0; i<files.length; ++i) {
    this.rootSuite.emit('pre-require', global, this.file);
    this.file = files[i];
    this.rootSuite.emit('require', require(this.file), this.file);
    this.rootSuite.emit('post-require', global, this.file);
  }

  this.featureManager.loadFeatures(this.options.feature);

  var runner = new mocha.Runner(this.rootSuite);
  runner.on('test', function(test) {
    // a hack to show the test body as a stack trace on errors
    test.fn._isTest = true;
    global.feature.currentTest = test;
  });
  var reporter = new Reporter(runner);

  runner.run(process.exit);
};

